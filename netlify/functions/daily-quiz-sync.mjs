import { getStore } from "@netlify/blobs";
import { isAuthorized } from "./_helpers/auth";

const DB_KEY = "quiz-db.json";
const LIMIT_PER_RUN = 20;     
const MAX_PER_TECH = 250;

const TECHS = [
  { key: "react", category: "React" },
  { key: "next", category: "Next.js" },
  { key: "vue",  category: "VueJS" },
  { key: "html", category: "HTML" },
  { key: "js",  tags: ["JavaScript"] },
  { key: "php", tags: ["PHP"] },
  { key: "laravel", category: "Laravel" },
  { key: "wordpress", category: "WordPress" },
];


// ---------------- DRY RUN ----------------
function isDryRun(request) {
  const url = new URL(request.url);
  return (
    url.searchParams.get("dryRun") === "true" ||
    url.searchParams.get("dryrun") === "true" ||
    process.env.QUIZ_DRY_RUN === "true"
  );
}

// ---------------- DB ----------------
function createEmptyDb() {
  const indexByTech = {};
  const lockedTech = {};

  for (const t of TECHS) {
    indexByTech[t.key] = [];
    lockedTech[t.key] = false;
  }

  return {
    version: 1,
    questionsById: {}, 
    indexByTech, 
    lockedTech, 
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: null,
      runs: 0,
    },
  };
}

function ensureDbShape(db) {
  const base = createEmptyDb();
  const safe = db && typeof db === "object" ? db : base;

  safe.version ??= base.version;
  safe.questionsById ??= {};
  safe.indexByTech ??= {};
  safe.lockedTech ??= {};
  safe.meta ??= base.meta;

  for (const t of TECHS) {
    if (!Array.isArray(safe.indexByTech[t.key])) safe.indexByTech[t.key] = [];
    if (typeof safe.lockedTech[t.key] !== "boolean") safe.lockedTech[t.key] = false;
  }

  return safe;
}

function normalizeId(id) {
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

function isLocked(db, techKey) {
  return db.lockedTech[techKey] || (db.indexByTech[techKey]?.length ?? 0) >= MAX_PER_TECH;
}

// ---------------- QuizAPI fetch ----------------
async function fetchQuestions({ apiKey, category, tags }) {
  const url = new URL(process.env.QUIZ_API_URL);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("limit", String(LIMIT_PER_RUN));
  url.searchParams.set("single_answer_only", "true");

  if (category) url.searchParams.set("category", category);
  if (tags && tags.length) url.searchParams.set("tags", tags.join(","));

  const r = await fetch(url.toString());
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`QuizAPI ${r.status}: ${text.slice(0, 200)}`);
  }

  const data = await r.json();
  return Array.isArray(data) ? data : [];
}

// ---------------- DryRun fake questions ----------------
function makeFakeQuestions(techKey, count = 3) {
  const base = Math.abs(
    Array.from(techKey).reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  );

  return Array.from({ length: count }).map((_, i) => {
    const id = 900000 + base * 100 + i;
    return {
      id,
      question: `[DRY-RUN] Sample question for ${techKey} #${i + 1}`,
      description: null,
      answers: {
        answer_a: "Option A",
        answer_b: "Option B",
        answer_c: "Option C",
        answer_d: "Option D",
        answer_e: null,
        answer_f: null,
      },
      multiple_correct_answers: "false",
      correct_answers: {
        answer_a_correct: "true",
        answer_b_correct: "false",
        answer_c_correct: "false",
        answer_d_correct: "false",
        answer_e_correct: "false",
        answer_f_correct: "false",
      },
      explanation: "Dry-run sample explanation.",
      difficulty: "Easy",
      category: "DryRun",
      tags: [techKey],
    };
  });
}

// ---------------- handler ----------------
export default async (request) => {
  const dryRun = isDryRun(request);

  if (!isAuthorized(request, process.env.DEV_READ_TOKEN?.trim())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const apiKey = process.env.QUIZAPI_KEY;
  if (!apiKey && !dryRun) {
    return new Response("Missing QUIZAPI_KEY", { status: 500 });
  }

  const store = getStore("quiz-cache-v1");

  const existing = await store.get(DB_KEY, { type: "json" });
  const db = ensureDbShape(existing);

  const report = {
    dryRun,
    updatedAt: new Date().toISOString(),
    perTech: {},
    totals: {
      questionsBefore: Object.keys(db.questionsById).length,
      questionsAfter: 0,
      quizApiCalls: 0,
      skippedLocked: 0,
    },
  };

  const techIdSets = {};
  for (const t of TECHS) {
    techIdSets[t.key] = new Set(db.indexByTech[t.key].map(Number));
  }

  for (const tech of TECHS) {
    const key = tech.key;
    const before = db.indexByTech[key].length;

    if (isLocked(db, key)) {
      db.lockedTech[key] = true;
      report.totals.skippedLocked += 1;
      report.perTech[key] = { skipped: true, reason: "locked", before, after: before };
      continue;
    }

    try {
      const remaining = MAX_PER_TECH - before;
      if (remaining <= 0) {
        db.lockedTech[key] = true;
        report.totals.skippedLocked += 1;
        report.perTech[key] = { skipped: true, reason: "already-full", before, after: before };
        continue;
      }

      let fresh = [];
      if (dryRun) {
        fresh = makeFakeQuestions(key, 3);
      } else {
        report.totals.quizApiCalls += 1;
        fresh = await fetchQuestions({
          apiKey,
          category: tech.category, 
          tags: tech.tags,
        });
      }

      let addedIds = 0;
      let storedNewQuestions = 0;

      for (const q of fresh) {
        const id = normalizeId(q?.id);
        if (!id) continue;

        const mca = q?.multiple_correct_answers;
        if (mca === true || mca === "true") continue;

        // questionsById
        const idKey = String(id);
        if (!db.questionsById[idKey]) {
          db.questionsById[idKey] = q;
          storedNewQuestions += 1;
        }

        // indexByTech
        if (db.indexByTech[key].length < MAX_PER_TECH && !techIdSets[key].has(id)) {
          db.indexByTech[key].unshift(id);
          techIdSets[key].add(id);
          addedIds += 1;
        }

        if (db.indexByTech[key].length >= MAX_PER_TECH) break;
      }

      if (db.indexByTech[key].length >= MAX_PER_TECH) db.lockedTech[key] = true;

      report.perTech[key] = {
        skipped: false,
        before,
        fetched: fresh.length,
        storedNewQuestions,
        addedIds,
        after: db.indexByTech[key].length,
        locked: db.lockedTech[key],
        source: dryRun ? "dry-run" : "quizapi",
      };
    } catch (e) {
      report.perTech[key] = { skipped: false, before, error: String(e?.message || e) };
    }
  }

  report.totals.questionsAfter = Object.keys(db.questionsById).length;

  if (!dryRun) {
    db.meta.runs = (db.meta.runs || 0) + 1;
    db.meta.updatedAt = report.updatedAt;
    await store.setJSON(DB_KEY, db);
  }

  return new Response(JSON.stringify({ ok: true, report }, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
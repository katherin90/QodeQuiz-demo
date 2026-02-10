import { getStore } from "@netlify/blobs";

const DB_KEY = "quiz-db.json";
const LIMIT_PER_RUN = 20;     
const MAX_PER_TECH = 300;

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

// -------- AUTH (token) --------
function isAuthorized(request) {
  const tokenFromHeader = request.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");

  const tokenFromQuery = new URL(request.url).searchParams.get("token");
  const provided = tokenFromHeader || tokenFromQuery;

  return Boolean(provided && provided === process.env.QUIZ_SYNC_TOKEN);
}

// -------- DB helpers --------
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
    meta: { createdAt: new Date().toISOString(), updatedAt: null, runs: 0 },
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

// -------- QuizAPI fetch --------
async function fetchQuestions({ apiKey, category, tags }) {
  const url = new URL(process.env.QUIZ_API_URL);
  const dryRun = url.searchParams.get("dryRun") === "true";
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

// -------- handler --------
export default async (request) => {
  if (!isAuthorized(request)) return new Response("Unauthorized", { status: 401 });

  const apiKey = process.env.QUIZAPI_KEY;
  if (!apiKey) return new Response("Missing QUIZAPI_KEY", { status: 500 });

  const store = getStore("quiz-cache-v1");

  const existing = await store.get(DB_KEY, { type: "json" });
  const db = ensureDbShape(existing);

  const report = { updatedAt: new Date().toISOString(), perTech: {} };

  const techIdSets = {};
  for (const t of TECHS) {
    techIdSets[t.key] = new Set(db.indexByTech[t.key].map(Number));
  }

  for (const tech of TECHS) {
    const key = tech.key;
    const before = db.indexByTech[key].length;

    if (isLocked(db, key)) {
      db.lockedTech[key] = true;
      report.perTech[key] = { skipped: true, reason: "locked", before, after: before };
      continue;
    }

    try {
    //   const fresh = await fetchQuestions({
    //     apiKey,
    //     category: tech.category, 
    //     tags: tech.tags,         
    //   });
    let fresh = [];

    if (dryRun) {
    // імітація відповіді QuizAPI
    fresh = [
        { id: 999001, multiple_correct_answers: "false" },
        { id: 999002, multiple_correct_answers: "false" }
    ];
    } else {
    fresh = await fetchQuestions({ apiKey, category, tags });
    }

      let addedIds = 0;

      for (const q of fresh) {
        const id = normalizeId(q?.id);
        if (!id) continue;

    
        const mca = q?.multiple_correct_answers;
        if (mca === true || mca === "true") continue;

        
        if (!db.questionsById[String(id)]) db.questionsById[String(id)] = q;

    
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
        addedIds,
        after: db.indexByTech[key].length,
        locked: db.lockedTech[key],
      };
    } catch (e) {
      report.perTech[key] = { skipped: false, before, error: String(e?.message || e) };
    }
  }

  db.meta.runs = (db.meta.runs || 0) + 1;
  db.meta.updatedAt = report.updatedAt;

  // await store.setJSON(DB_KEY, db);
  if (!dryRun) {
    await store.setJSON(DB_KEY, db);
  }

  return new Response(JSON.stringify({ ok: true, dryRun, report }, null, 2), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
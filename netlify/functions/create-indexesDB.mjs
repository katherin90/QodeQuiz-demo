import { getStore } from "@netlify/blobs";
import {isAuthorized} from './_helpers/auth'

const STORE = "quiz-cache-v1";
const SOURCE_KEY = "quiz-db.json";
const TARGET_KEY = "quiz-indexes.json";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function normalize(v) {
  return v ? String(v).trim() : "";
}

function pushNested(map, tech, diff, id) {
  if (!map[tech]) map[tech] = {};
  if (!map[tech][diff]) map[tech][diff] = [];
  map[tech][diff].push(id);
}

export default async (req) => {
 
  if (!isAuthorized(req, process.env.DEV_READ_TOKEN?.trim())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(req.url);
  const dryRun = url.searchParams.get("dryRun") === "true";

  const store = getStore(STORE);

  const db = await store.get(SOURCE_KEY, { type: "json" });
  if (!db) return json({ ok: false, message: "Source DB not found" }, 404);

  const { questionsById, indexByTech } = db;
  if (!questionsById || !indexByTech) {
    return json({ ok: false, message: "Invalid DB structure" }, 400);
  }

  //all ids
  const idsAll = Object.keys(questionsById).map(Number);

  //tech + difficulty index 
  const indexByTechAndDiff = {};

  for (const [tech, ids] of Object.entries(indexByTech)) {
    if (!Array.isArray(ids)) continue;

    for (const id of ids) {
      const q = questionsById[String(id)];
      if (!q) continue;

      const diff = normalize(q.difficulty);
      if (!diff) continue;

      pushNested(indexByTechAndDiff, tech, diff, id);
    }
  }

  // new blob
  const indexesOnly = {
    version: 1,
    idsAll,
    indexByTech,         
    indexByTechAndDiff,   
  };

  if (!dryRun) {
      await store.set(TARGET_KEY, JSON.stringify(indexesOnly), {
      contentType: "application/json",
    });
  }

  return json({ ok: true, dryRun, targetKey: TARGET_KEY });
};
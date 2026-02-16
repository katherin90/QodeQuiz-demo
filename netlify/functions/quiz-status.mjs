import { getStore } from "@netlify/blobs";
import { isAuthorized } from './_helpers/auth'

const DB_KEY = "quiz-db.json";

export default async (request) => {
  if (!isAuthorized(request, process.env.DEV_READ_TOKEN?.trim())) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (request.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const store = getStore("quiz-cache-v1");
  const db = await store.get(DB_KEY, { type: "json" });

  if (!db) {
    return new Response(
      JSON.stringify({ ok: false, error: "Database not found" }),
      { status: 404, headers: { "content-type": "application/json" } }
    );
  }

  const perTech = {};

  for (const tech of Object.keys(db.indexByTech || {})) {
    const count = db.indexByTech[tech]?.length ?? 0;
    const locked =
      db.lockedTech?.[tech] === true || count >= process.env.MAX_PER_TECH;

    perTech[tech] = {
      count,
      locked,
      remaining: Math.max(0, process.env.MAX_PER_TECH - count),
    };
  }

  return new Response(
    JSON.stringify(
      {
        ok: true,
        meta: db.meta ?? null,
        totalUniqueQuestions: Object.keys(db.questionsById || {}).length,
        perTech,
      },
      null,
      2
    ),
    { headers: { "content-type": "application/json; charset=utf-8" } }
  );
};
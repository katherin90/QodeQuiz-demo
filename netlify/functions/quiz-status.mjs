import { getStore } from "@netlify/blobs";

const DB_KEY = "quiz-db.json";
const MAX_PER_TECH = 300;

function getProvidedToken(request) {
  const auth = request.headers.get("authorization") || "";
  const headerToken = auth.replace(/^Bearer\s+/i, "").trim();
  const queryToken = new URL(request.url).searchParams.get("token")?.trim();
  return headerToken || queryToken || "";
}

export default async (request) => {
  const expectedToken = (process.env.DEV_READ_TOKEN || "").trim();
  const providedToken = getProvidedToken(request);

  if (!expectedToken || providedToken !== expectedToken) {
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
      db.lockedTech?.[tech] === true || count >= MAX_PER_TECH;

    perTech[tech] = {
      count,
      locked,
      remaining: Math.max(0, MAX_PER_TECH - count),
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
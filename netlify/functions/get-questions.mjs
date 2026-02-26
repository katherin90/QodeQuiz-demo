import { getStore } from "@netlify/blobs";
import { isAuthorized } from "./_helpers/auth";

const STORE = "quiz-cache-v1";
const KEY = "quiz-db.json";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export default async (req) => {
  if (!isAuthorized(req, process.env.DEV_READ_TOKEN)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const body = await req.json().catch(() => null);
  const idsRaw = Array.isArray(body?.ids) ? body.ids : [];

  const ids = idsRaw
    .map((x) => Number(x))
    .filter((n) => Number.isFinite(n))
    .slice(0, 10);

  const store = getStore(STORE);
  const db = await store.get(KEY, { type: "json" });
  const questionsById = db?.questionsById ?? {};

  const result = ids
    .map((id) => questionsById[String(id)])
    .filter(Boolean);

  return json(result);
};
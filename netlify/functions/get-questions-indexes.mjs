import { getStore } from "@netlify/blobs";
import { isAuthorized } from "./_helpers/auth";

const STORE = "quiz-cache-v1";
const KEY = "quiz-indexes.json";

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
    const store = getStore(STORE);
    const indexes = await store.get(KEY, { type: "json" });

    return new Response(JSON.stringify(indexes ?? {}), {
        status: 200,
        headers: {
        "content-type": "application/json; charset=utf-8",
        },
    });
}
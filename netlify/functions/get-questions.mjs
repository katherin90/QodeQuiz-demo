import { getStore } from "@netlify/blobs";

export default async (req) => {
  const token = req.headers.get("x-dev-token");
  const expected = process.env.DEV_READ_TOKEN;

  if (!expected || token !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  const store = getStore("quiz-cache");
  const json = await store.get("questions.json", { type: "text" });

  return new Response(
    json ?? JSON.stringify({ message: "No data yet" }),
    {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    }
  );
};
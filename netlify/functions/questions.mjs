import { getStore } from "@netlify/blobs";

export default async (req) => {
  const token = req.headers["x-dev-token"];
  if (!process.env.DEV_READ_TOKEN || token !== process.env.DEV_READ_TOKEN) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const store = getStore("quiz-cache");
  const json = await store.get("questions.json", { type: "text" });

  return {
    statusCode: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: json ?? JSON.stringify({ updatedAt: null, data: [] }),
  };
};
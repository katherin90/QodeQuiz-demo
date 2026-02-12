import { getStore } from "@netlify/blobs";
import { TECH_LIST } from '../../src/assets/data/constants';

const emptyIndexByTech = Object.fromEntries( TECH_LIST.map((t) => [t.key, []]));
const emptyLockedTech = Object.fromEntries( TECH_LIST.map((t) => [t.key, false]));

export default async (req) => {
  const token = req.headers?.["x-dev-token"];
  if (!process.env.DEV_READ_TOKEN || token !== process.env.DEV_READ_TOKEN) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const store = getStore("quiz-cache");
  const json = await store.get("questions.json", { type: "text" });

  return new Response(
    json ??
      JSON.stringify({
        version: 1,
        questionsById: {},
        indexByTech: emptyIndexByTech,
        lockedTech: emptyLockedTech,
        meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), runs: 0 },
      }),
    {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    }
  );
};
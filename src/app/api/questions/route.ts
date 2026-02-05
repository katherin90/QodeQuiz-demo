export async function GET() {
  const base = process.env.PROD_SITE_URL; // https://твій-сайт.netlify.app
  const token = process.env.DEV_READ_TOKEN;

  if (!base || !token) {
    return new Response(
      JSON.stringify({ error: "Missing env vars" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const res = await fetch(`${base}/.netlify/functions/questions`, {
    headers: { "x-dev-token": token },
    cache: "no-store",
  });

  const text = await res.text();
  return new Response(text, {
    status: res.status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const idsRaw = Array.isArray(body?.ids) ? body.ids : [];
  const ids = idsRaw
    .map(Number)
    .filter(Number.isFinite)
    .slice(0, 10);

  const BASE = process.env.PROD_SITE_URL; 
  const TOKEN = process.env.DEV_READ_TOKEN;
  
  if (!BASE || !TOKEN) {
    return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
  }

  const upstream = await fetch(`${BASE}/.netlify/functions/get-questions`, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-dev-token": TOKEN,
    },
    body: JSON.stringify({ ids }),
    cache: "no-store",
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json(
      { message: "Upstream error", status: upstream.status, details: text },
      { status: 502 }
    );
  }

  const questions = await upstream.json();
  return NextResponse.json(questions, { status: 200 });
}
import { NextResponse } from "next/server";

export const revalidate = 60 * 60 * 24; 

export async function GET() {
  const BASE = process.env.PROD_SITE_URL;
  const TOKEN = process.env.DEV_READ_TOKEN;
  if (!BASE || !TOKEN) {
    return NextResponse.json({ message: "Server misconfigured" }, { status: 500 });
  }

  const upstream = await fetch(`${BASE}/.netlify/functions/get-indexes`, {
    headers: { "x-dev-token": TOKEN },
    next: { revalidate },
  });

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => "");
    return NextResponse.json({ message: "Upstream error", details: text }, { status: 502 });
  }

  const indexes = await upstream.json();
  return NextResponse.json(indexes);
}
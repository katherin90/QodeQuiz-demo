import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = { matcher: ["/(.*)"] };

function unauthorized() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });
}

export function middleware(req: NextRequest) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;
  if (!user || !pass) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
  const [u, p] = decoded.split(":");

  if (u !== user || p !== pass) return unauthorized();

  return NextResponse.next();
}
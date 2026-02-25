function getProvidedToken(request) {
  const auth = request.headers.get("authorization") || "";
  const headerToken = auth.replace(/^Bearer\s+/i, "").trim();

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token")?.trim();

  const devHeaderToken = (request.headers.get("x-dev-token") || "").trim();

  return headerToken || queryToken || devHeaderToken || "";
}

export function isAuthorized(request, expectedToken) {
  if (!expectedToken) return false;

  const provided = getProvidedToken(request);
  return provided === expectedToken;
}
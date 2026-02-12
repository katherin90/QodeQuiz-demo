function getProvidedToken(request) {
  const auth = request.headers.get("authorization") || "";
  const headerToken = auth.replace(/^Bearer\s+/i, "").trim();

  const url = new URL(request.url);
  const queryToken = url.searchParams.get("token")?.trim();

  return headerToken || queryToken || "";
}

export function isAuthorized(request, expectedToken) {
  if (!expectedToken) return false;

  const provided = getProvidedToken(request);
  return provided === expectedToken;
}
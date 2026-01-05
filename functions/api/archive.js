export async function onRequest(context) {
  const request = context.request;

  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const username = url.searchParams.get("username");

  if (!username) {
    return new Response("username is required", { status: 400 });
  }

  const targetUrl =
    `https://www.chess.com/callback/games/extended-archive?locale=en_US&page=1&location=all&username=${encodeURIComponent(username)}`;

  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Chrome 128.0.0.1",
      "Accept": "application/json"
    }
  });

  return new Response(res.body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/json",
      "Cache-Control": "no-store"
    }
  });
}


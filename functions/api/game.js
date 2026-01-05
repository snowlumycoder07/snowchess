export async function onRequest(context) {
  const request = context.request;

  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(request.url);
  const gameid = url.searchParams.get("gameid");
  
  

  if (!gameid) {
    return new Response("gameid is required", { status: 400 });
  }
  
  const isLive = url.searchParams.get("isLive") === "true" ? "live" : "daily";

  const targetUrl =
    `https://www.chess.com/callback/${encodeURIComponent(isLive)}/game/${encodeURIComponent(gameid)}`;

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



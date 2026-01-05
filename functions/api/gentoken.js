export async function onRequest(context) {
  const request = context.request;

  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = "https://www.chess.com/callback/auth/service/analysis";

    const params = new URLSearchParams({
      game_id: "143594173356",
      game_type: "live"
    });


  const res = await fetch( `${url}?${params.toString()}` , {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Encoding": "deflate, gzip",
      "accept-language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "authority": "www.chess.com",
      "Cookie": "CHESSCOM_REMEMBERME=Chess.WebBundle.Entity.User%3Ab25lc2hvdDgzOA~~%3A1796310105%3AW6r2vtRf9m8mdiNPdmUDKOzNxyRqJr4m9mWKnHpwrCA~At7a5nbaz8H4NuaKo0B_tVquxj2yGsWA-xaJW7FMJwU~"
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


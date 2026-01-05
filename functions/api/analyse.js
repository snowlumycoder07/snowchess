import { gentoken } from "./gentoken.js"

export async function onRequest(context) {
  const { request } = context
  
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 })
  }

  const { pgn }= await request.json()
  
  const toke= await gentoken()
  
  const data = await toke.json()   // parse JSON body
   const token = data.token 

  const wsUrl = "wss://analysis.chess.com/"

  const ws = new WebSocket(wsUrl)
  let payload;

  return new Promise((resolve, reject) => {
    ws.onopen = () => {
      payload = {"action":"gameAnalysis","game":{"pgn":pgn},"options":{"caps2":true,"depth":25,"engineType":"stockfish16 nnue","source":{"gameId":"","gameType":"live","url":"","token":token,"client":"web","userTimeZone":"Asia/Calcutta"},"strength":"Fast","tep":{"ceeDebug":true,"classificationv3":true,"nullMoveRepresentation":"--","basicVariationThemes":false,"speechv3":false,"userColor":"black","lang":"en_US","coachLocale":"en-US","coachTextId":"Generic_coach"}}}


      ws.send(JSON.stringify(payload))
    }

    ws.onmessage = (msg) => {
    
    if (msg.data.startsWith('{"action":"analyzeGame"')){
      
      resolve(
        new Response(msg.data+typeof(msg.data), {
          headers: { "Content-Type": "application/json" },
        })
      )
      ws.close()
    }
    }
    

    ws.onerror = (err) => {
      reject(new Response("WebSocket error", { status: 500 }))
    }
  })
}
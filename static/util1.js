
// import { Chess, SQUARES } from 'https://cdn.jsdelivr.net/npm/chess.js@1.0.0/dist/esm/chess.js';

import { Chess, SQUARES } from '/static/chess.js';


import { Chessground } from '/static/chessground.min.js';
    const chess = new Chess();
    
    //console.log(SQUARES);

    // Global cache for destinations
    let cachedDests = new Map();
    let historyIndex = 0;
    let history = [];
    let dhistoryIndex=0;
    let dhistory=[];
    let historyfen;
    // let movesList = [];

    // Compute destinations in the format Chessground expects: Map<fromSquare, string[]>
    // Use verbose:true so we can read the `to` field for each move.
    function computeDests(chess) {
      const dests = new Map();
      for (const s of SQUARES) {
        // verbose:true returns move objects with {from, to, flags, piece, ...}
        const moves = chess.moves({ square: s, verbose: true });
        if (moves.length) dests.set(s, moves.map(m => m.to));
      }
      cachedDests = dests;
      return dests;
    }

    function updateMovesList() {
      const movesContainer = document.getElementById('movesList');
      let html = '';
      for (let i = 0; i < history.length; i += 2) {
        html += `<div>${Math.floor(i/2) + 1}. ${history[i] || ''} ${history[i+1] || ''}</div>`;
      }
      movesContainer.innerHTML = html || '<p style="color: #999;">No moves yet</p>';
    //   document.getElementById('moveCount').textContent = movesList.length;
    }

    // Initial computation
    computeDests(chess);

    const cg = Chessground(document.getElementById('board'), {
      fen: chess.fen(),

      
      // turnColor: chess.turn() === 'w' ? 'white' : 'black',
      
      check: chess.inCheck(),
      // viewOnly: true,
      

      movable: {
        free: false,
        color: chess.turn() === 'w' ? 'white' : 'black',
        dests: cachedDests
      },
      events: {
        move: (from, to) => {
          // if(historyIndex != history.length - 1){
          //   return;
          // }


          const move = chess.move({ from, to, promotion: 'q' });
          // console.log(move);
          // window.move=move;
          // console.log(history[historyIndex]);
          

          if(historyIndex!= history.length && move.lan!=history[historyIndex].lan)
            {
            document.getElementById('board').classList.add('branched');
            
            // historyIndex++;
            dhistory[dhistoryIndex]=move;
            dhistoryIndex++;
          }

          // console.log(move);
          // if (!move) return;
          // movesList.push(move.san);
          // console.log(move.san);
          // history.splice(historyIndex + 1);
          else{
            history[historyIndex]=move;
            historyfen=chess._positions;
            historyIndex++;
            
          }
          
          
          computeDests(chess);
          updateMovesList();
          cg.set({
            fen: chess.fen(),
            // lastMove: [move.from,move.to],
            // turnColor: chess.turn() === 'w' ? 'white' : 'black',
      
            check: chess.inCheck(),
            movable: {
              free: false,
              color: chess.turn() === 'w' ? 'white' : 'black',
              dests: cachedDests,
              
            }
          });
        }
      }
    });
    window.cg=cg;
    window.historyl=history;
    window.historyIndex=historyIndex;

    // Button event listeners
    document.getElementById('backward').addEventListener('click', () => {
      if (historyIndex > 0) {
        let last;
        let custom;
        // console.log(historyIndex);
        if(dhistoryIndex>0){
          chess.undo();
          --dhistoryIndex== 0 ? document.getElementById('board').classList.remove('branched') :null;
         last = dhistoryIndex > 0 ? [dhistory[dhistoryIndex - 1].from, dhistory[dhistoryIndex - 1].to] : null;
          // console.log("last is",last , dhistoryIndex);
        }
        else{
          
          historyIndex--;
          updateclock(historyIndex);
          try{
          chess.load(historyfen[historyIndex]);

          
          const posi=analysisdata.positions[historyIndex];
          const classificationtype=posi.classificationName;
          feedbacktextupdate(classificationtype, Object.values(analysisdata.positions[historyIndex].playedMove.speech)[cg.state.orientation=="white"?(historyIndex%2==0?0:1):(historyIndex%2!=0?0:1)], analysisdata.positions[historyIndex].playedMove.score);
          
          if(posi.playedMove.moveLan!=posi.suggestedMove.moveLan){

            document.getElementById("bestmovebtn").classList.remove("hidden");

          }
          else{
            document.getElementById("bestmovebtn").classList.add("hidden");
          }


          last =historyIndex > 0 ? [history[historyIndex - 1].from, history[historyIndex - 1].to] : null;
          custom = last ? new Map([[last[1], [`${classificationtype} customsq`]]]) : new Map();
          }catch(e){
            console.log(e);
          }
           
          


          // console.log("last is",last);
        }
        // chess.load(history[historyIndex]);
        
        // console.log(history[historyIndex]);
        
        
        computeDests(chess);
        cg.set({
          fen: chess.fen(),
          lastMove: last,
          turnColor: chess.turn() === 'w' ? 'white' : 'black',
          check: chess.inCheck(),
          movable: {
            free: false,
            color: chess.turn() === 'w' ? 'white' : 'black',
            dests: cachedDests
          },
          highlight: {
              lastMove: true,
              custom
            }
        });
        // lastMove.appendChild(icon);
        
      }
    });
    window.historyl=history;
    window.historyIndex=historyIndex;

    document.getElementById('forward').addEventListener('click', () => {
      if (historyIndex < history.length) {
        // historyIndex++;
        // console.log(history);
        let last;
        let custom;
        if(dhistoryIndex!=0){
          if (dhistoryIndex==dhistory.length){
            console.log(dhistory.length,dhistory);
            return;
          }
          chess.move(dhistory[dhistoryIndex]);
          last= [dhistory[dhistoryIndex].from , dhistory[dhistoryIndex].to];
          dhistoryIndex++;
          // return;
        }
        
        

        else{
          // chess.move(history[historyIndex]);
          chess.load(historyfen[historyIndex+1]);
        last= [history[historyIndex].from , history[historyIndex].to];
          try{
        const posi=analysisdata.positions[historyIndex+1];

        const classificationtype=posi.classificationName;

        // console.log("position is",posi);

        if(posi.playedMove.moveLan!=posi.suggestedMove.moveLan){
          document.getElementById("bestmovebtn").classList.remove("hidden");
        }
        else{
          document.getElementById("bestmovebtn").classList.add("hidden");
        }

        custom = last ? new Map([[last[1], [`${classificationtype} customsq`]]]) : new Map();

        // console.log("history index before is",historyIndex);
  feedbacktextupdate(classificationtype, Object.values(analysisdata.positions[historyIndex+1].playedMove.speech)[cg.state.orientation=="white"?(historyIndex+1)%2==0?0:1:(historyIndex+1)%2!=0?0:1], analysisdata.positions[historyIndex+1].playedMove.score);
          }catch(e){
            console.log(e);
          }
        historyIndex++;
        updateclock(historyIndex);
        }

        

        // chess.load(history[historyIndex]);
        computeDests(chess);
        cg.set({
          fen: chess.fen(),

          lastMove: last,
          
          turnColor: chess.turn() === 'w' ? 'white' : 'black',
          check: chess.inCheck(),
          movable: {
            free: false,
            color: chess.turn() === 'w' ? 'white' : 'black',
            dests: cachedDests
          },
          highlight: {
              lastMove: true,
              custom
            }
        });
        
      }

      
    });

    cg.setShapes([
      { orig: 'e2', dest: 'e4', brush: 'paleBlue', modifiers: { lineWidth: 15 } }
    ]);
    window.cg=cg;



     document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and content
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tab).classList.add('active');
      });
    });

    // Update analysis data (replace with your actual data)
    function updateAnalysisData(data) {
      document.getElementById('accuracyValue').textContent = data.accuracy + '%';
      document.getElementById('brilliantCount').textContent = data.brilliant;
      document.getElementById('goodCount').textContent = data.good;
      document.getElementById('inaccuracyCount').textContent = data.inaccuracy;
      document.getElementById('mistakeCount').textContent = data.mistake;
      document.getElementById('blunderCount').textContent = data.blunder;
    }

    // Update move comment and best move info
    function updateMoveAnalysis(moveData) {
      // moveData structure: { notation: 'e4', bestMove: 'e4', isBest: true, comment: 'text', moveNumber: 1, color: 'White' }
      document.getElementById('currentMoveNotation').textContent = moveData.notation;
      document.getElementById('bestMoveNotation').textContent = moveData.bestMove;
      document.getElementById('moveCommentText').textContent = moveData.comment;
      
      const bestMoveIndicator = document.querySelector('.best-move-indicator');
      if (moveData.isBest) {
        bestMoveIndicator.classList.add('is-best');
        bestMoveIndicator.querySelector('.best-move-label').textContent = '✓ Best Move';
      } else {
        bestMoveIndicator.classList.remove('is-best');
        bestMoveIndicator.querySelector('.best-move-label').textContent = '⚡ Best Move';
      }
    }


     function disableSkeletonLoadingCSS() {
  const link = document.getElementById('skeleton-loading-css');
  if (link) {
    link.disabled = true; // Disable the stylesheet
  }
}

// Function to enable the skeleton loading CSS file
     function enableSkeletonLoadingCSS() {
  const link = document.getElementById('skeleton-loading-css');
  if (link) {
    link.disabled = false; // Enable the stylesheet
  }
}
window.disableSkeletonLoadingCSS = disableSkeletonLoadingCSS;
window.enableSkeletonLoadingCSS = enableSkeletonLoadingCSS;




function loadPGN(pgn) {
  // chess.reset(); 
  const success= chess.loadPgn(pgn); // Load the PGN into the chess object
  // chess.reset();
  console.log(success);
  if (true) {
    // Update the Chessground board and other UI elements
    computeDests(chess);
    history=chess.history({verbose: true});
    historyfen=chess._positions;
    // console.log(history.at(-1));

    cg.set({
      fen: chess.fen(),
      lastMove: [history.at(-1).from , history.at(-1).to],
      turnColor: chess.turn() === 'w' ? 'white' : 'black',
      check: chess.inCheck(),
      movable: {
        free: false,
        color: chess.turn() === 'w' ? 'white' : 'black',
        dests: cachedDests
      }
    });
    
    historyIndex=history.length;
    // movesList.length = 0; // Clear the moves list
    // movesList.push(...chess.history()); // Populate movesList with the moves from the PGN
    // updateMovesList(); // Update the moves list in the UI
  } else {
    console.error('Invalid PGN');
  }
}
// window.loadPGN = loadPGN;
window.chess=chess;

let analysisdata;

function analysisrender(pgnInput){

  if(timestamps.length!=0){
    document.getElementsByClassName("clock")[0].classList.remove("hidden");
    document.getElementsByClassName("clock")[2].classList.remove("hidden");
    
  
  }
  else{
     document.getElementsByClassName("clock")[0].classList.add("hidden");
    document.getElementsByClassName("clock")[2].classList.add("hidden");
    
  }

  enableSkeletonLoadingCSS();
  // console.log(pgnInput);

  loadPGN(pgnInput);
  document.querySelector('.tab-btn[data-tab="analysis"]').click(); // Switch to the analysis tab
  document.getElementsByClassName("pl1")[0].textContent=chess.header().White;
  document.getElementsByClassName("pl2")[0].textContent=chess.header().Black;
  document.getElementById("whitePlayer").innerHTML=chess.header().White;
  document.getElementById("blackPlayer").innerHTML=chess.header().Black;
  document.getElementById("whiteRating").innerHTML="(" + chess.header().WhiteElo + ")";
  document.getElementById("blackRating").innerHTML="(" + chess.header().BlackElo + ")";

  // document.getElementById("gameDate").innerHTML=chess.header().Date;
  const fallback="/static/img/noavatar.gif";
  document.getElementsByClassName("white-avt")[0].innerHTML=`<img src="${fallback}" style="overflow: hidden;" >`;
  // let blackimg=data.players.top.color==="black" ? data.players.top.avatarUrl : data.players.bottom.avatarUrl;
  document.getElementsByClassName("black-avt")[0].innerHTML=`<img src="${fallback}  " style="overflow: hidden;" >`;






document.querySelector('.tab-btn[data-tab="analysis"]').classList.remove('hidden');


  fetch('/api/analyse', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pgn: pgnInput })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    
    // console.log(data.positions[0].classificationName);
    // console.log("history index is",historyIndex , data.positions.);
    // document.getElementById('move-feedback-text').textContent = data.positions[historyIndex+1].classificationName;

    // window.analysisData=data.positions;
    analysisdata=data.data;
    analysisdata.positions[0].playedMove={speech:{personal: null}};
    window.analysisdata=analysisdata;

  // feedbacktextupdate(analysisdata.positions[historyIndex].classificationName, analysisdata.positions[historyIndex].playedMove.speech.personal);



    document.getElementById('player1Accuracy').textContent = data.CAPS.white.all;
    document.getElementById('player2Accuracy').textContent = data.CAPS.black.all;

    document.getElementById('brilliantCountPlayer1').textContent = data.tallies.white.brilliant;
    document.getElementById('brilliantCountPlayer2').textContent = data.tallies.black.brilliant;

    document.getElementById('greatCountPlayer1').textContent = data.tallies.white.greatFind;
    document.getElementById('greatCountPlayer2').textContent = data.tallies.black.greatFind;

    document.getElementById('bestCountPlayer1').textContent = data.tallies.white.best;
    document.getElementById('bestCountPlayer2').textContent = data.tallies.black.best;

    document.getElementById('excellentCountPlayer1').textContent = data.tallies.white.excellent;
    document.getElementById('excellentCountPlayer2').textContent = data.tallies.black.excellent;

    document.getElementById('goodCountPlayer1').textContent = data.tallies.white.good;
    document.getElementById('goodCountPlayer2').textContent = data.tallies.black.good;

    document.getElementById('bookCountPlayer1').textContent = data.tallies.white.book;
    document.getElementById('bookCountPlayer2').textContent = data.tallies.black.book;

    document.getElementById('inaccuracyCountPlayer1').textContent = data.tallies.white.inaccuracy;
    document.getElementById('inaccuracyCountPlayer2').textContent = data.tallies.black.inaccuracy;
    
    document.getElementById('mistakeCountPlayer1').textContent = data.tallies.white.mistake;
    document.getElementById('mistakeCountPlayer2').textContent = data.tallies.black.mistake;

    document.getElementById('missCountPlayer1').textContent = data.tallies.white.miss;
    document.getElementById('missCountPlayer2').textContent = data.tallies.black.miss;
    
    document.getElementById('blunderCountPlayer1').textContent = data.tallies.white.blunder;
    document.getElementById('blunderCountPlayer2').textContent = data.tallies.black.blunder;

    document.getElementById('gameRatingPlayer1').textContent = data.reportCard.white.effectiveElo;
    document.getElementById('gameRatingPlayer2').textContent = data.reportCard.black.effectiveElo;
    


    disableSkeletonLoadingCSS();
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });



}

// window.movesList=movesList;

document.getElementById('loadPgnButton').addEventListener('click', () => {
  const pgnInput = document.getElementById('pgnInput').value; // Assuming there's an input field with id 'pgnInput'
  timestamps=[];
  analysisrender(pgnInput);





  
});




// Function to render game-item elements
function renderGameItems(games) {
  const searchResultContainer = document.querySelector('.search-result');
  searchResultContainer.innerHTML = ''; // Clear existing content
  const gameItemstart = document.createElement('div');
    gameItemstart.classList.add('game-item');
    gameItemstart.innerHTML = `
      <div class="labelpname p-names">Players</div>
      <div class="p-names" style="color:#d2d2d2;">Results</div>
      <div class="p-names">Moves</div>
      <div class="p-names">Date</div>



    `;
    searchResultContainer.appendChild(gameItemstart);



  
    

    

  games.forEach(game => {
    const gameItem = document.createElement('div');
    gameItem.classList.add('game-item');
    gameItem.dataset.gameId = game.id; // Adds data-game-id="game.id" to the div
    gameItem.dataset.isLive = game.isLive ? 'true' : 'false'; 
    // console.log("valeu",value, game.user1.username, game.user1Result);

    gameItem.innerHTML = `
      <div class="p-names">
        <div class="pname-start">${game.user1.username}</div>
        <div class="pname-start">${game.user2.username}</div>
      </div>
      <div class="p-names">
        <div>(${game.user1Rating})</div>
        <div>(${game.user2Rating})</div>
      </div>
      <div class="p-names" >
        <div>${game.user1Result}</div>
        <div>${game.user2Result}</div>
      </div>

      <div class="p-names box" style="background-color: ${game.user1Result==0.5 ? "gray" : value === game.user1.username.toLowerCase() ? (game.user1Result == 1 ? 'green' : '#ff0000bd') : (game.user2Result == 1 ? 'green' : '#ff0000bd')}">
        <div style=""></div>
      </div>

      <div class="p-names">
        <div>${game.moves}</div>
      </div>
      <div class="p-names">
        <div>${game.gameEndTime}</div>
      </div>
        `;

    searchResultContainer.appendChild(gameItem);
    
  });
}


let value="";
document.getElementById('search-btn').addEventListener('click', () => {

  value=document.getElementById('idInput').value;
  console.log(value);
  fetch(`/api/archive?username=${value}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      return res.json();
    })
    .then(data => {
      // console.log(data.data);
      renderGameItems(data.data);



    })
    .catch(error => console.error('Error:', error));

});

let timestamps=[];
let basetime;

// Parent container for game items
const searchResultContainer = document.querySelector('.search-result');
// let decmov=[];

// Event delegation: Add a single click listener to the parent container
searchResultContainer.addEventListener('click', (event) => {
  // Check if the clicked element is a game-item or inside one
  const gameItem = event.target.closest('.game-item');
  if (!gameItem) return; // Exit if the click is outside a game-item

  // Extract game data from the clicked item (e.g., using data attributes)
  const gameId = gameItem.dataset.gameId; // Assuming you add data-game-id to each game-item
  const isLive = gameItem.dataset.isLive;
  // const gameFen = gameItem.dataset.fen;   // Assuming you add data-fen to each game-item

  console.log(`Game clicked: ${gameId} ${isLive}`);
  // console.log(gameFen);

  // Fetch game details
  fetch(`/api/game?gameid=${gameId}&isLive=${isLive}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // console.log(data.game.moveList); 

      // console.log(decodeTCN(data.game.moveList));
      // window.gameData=decodeTCN(data.game.moveList);
      // decmov=decodeTCN(data.game.moveList);
      // window.decmove= decmov;
      // window.datagame=data;
      timestamps=[];
      timestamps=data.game.moveTimestamps.split(',');
      basetime=data.game.baseTime1;
      // console.log(timestamps);

      let pgn=generatePgn(decodeTCN(data.game.moveList), data.game.pgnHeaders);
      // console.log(pgn);
      analysisrender(pgn);
      let whiteimg=data.players.bottom.color==="white" ? data.players.bottom.avatarUrl : data.players.top.avatarUrl;
      console.log("img is",whiteimg);
      const fallback="/static/img/noavatar.gif";
      document.getElementsByClassName("white-avt")[0].innerHTML=`<img src="${whiteimg}" style="overflow: hidden;" onerror="this.onerror=null;this.src='${fallback}'"; >`;
      let blackimg=data.players.top.color==="black" ? data.players.top.avatarUrl : data.players.bottom.avatarUrl;
      document.getElementsByClassName("black-avt")[0].innerHTML=`<img src="${blackimg}  " style="overflow: hidden;" onerror="this.onerror=null;this.src='${fallback}'"; >`;
      
      // console.log("timestamps are",timestamps);

      if(timestamps.length%2==0){
      document.getElementById("black-clock").innerHTML=Math.trunc(timestamps.at(-1)/600) + ":" + (timestamps.at(-1)/10%60<10?"0":"")+ (timestamps.at(-1)/600<1 && timestamps.at(-1)/10%60<20?(timestamps.at(-1)/10%60).toFixed(1):Math.floor(timestamps.at(-1)/10%60));
      document.getElementById("white-clock").innerHTML=Math.trunc(timestamps.at(-2)/600) + ":" + (timestamps.at(-2)/10%60<10?"0":"") + (timestamps.at(-2)/600<1 && timestamps.at(-2)/10%60<20?(timestamps.at(-2)/10%60).toFixed(1):Math.floor(timestamps.at(-2)/10%60));
      }
      else{
      
      document.getElementById("white-clock").innerHTML=Math.trunc(timestamps.at(-1)/600) + ":" + (timestamps.at(-1)/10%60<10?"0":"")+ (timestamps.at(-1)/600<1 && timestamps.at(-1)/10%60<20?(timestamps.at(-1)/10%60).toFixed(1):Math.floor(timestamps.at(-1)/10%60));
      document.getElementById("black-clock").innerHTML=Math.trunc(timestamps.at(-2)/600) + ":" + (timestamps.at(-2)/10%60<10?"0":"") + (timestamps.at(-2)/600<1 && timestamps.at(-2)/10%60<20?(timestamps.at(-2)/10%60).toFixed(1):Math.floor(timestamps.at(-2)/10%60));
      
      
      }
      // console.log(data.game.);
      // console.log(data.game.pgnHeaders);
      // console.log(data.game.moveList);
      // console.log(data.game.moveList);
      // console.log(data.game.moveList);
      // console.log(data.game.moveList);
      // Add your logic here, for example, navigating to a game details page
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
});





function decodeTCN(n) {
    const tcnChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?{~}(^)[_]@#$,./&-*++=";
    const pieceChars = "qnrbkp";
    const result = [];

    for (let i = 0; i < n.length; i += 2) {
        let move = {
            from: null,
            to: null,
            drop: null,
            promotion: null
        };

        let o = tcnChars.indexOf(n[i]);
        let s = tcnChars.indexOf(n[i + 1]);

        // Promotion decoding
        if (s > 63) {
            move.promotion = pieceChars[Math.floor((s - 64) / 3)];
            s = o + (o < 16 ? -8 : 8) + ((s - 1) % 3) - 1;
        }

        // Drops
        if (o > 75) {
            move.drop = pieceChars[o - 79];
        } else {
            move.from = tcnChars[o % 8] + (Math.floor(o / 8) + 1);
        }

        // Destination square
        move.to = tcnChars[s % 8] + (Math.floor(s / 8) + 1);

        result.push(move);
    }

    return result;
}

// Equivalent of Python piece_map
const pieceMap = {
    p: "PAWN",
    n: "KNIGHT",
    b: "BISHOP",
    r: "ROOK",
    q: "QUEEN",
    k: "KING"
};


function generatePgn(uciMoves, headers) {
  // const chess = new Chess();
  chess.reset();

  // Apply headers (stored separately)
  let headerLines = [];
  for (const key in headers) {
    headerLines.push(`[${key} "${headers[key]}"]`);
  }

  for (const m of uciMoves) {
    let uci = m.from + m.to;

    // Promotion
    if (m.promotion) {
      uci += pieceMap[m.promotion].toLowerCase();
    }

    // Crazyhouse drop: e.g. "N@e4"
    if (m.drop) {
      uci = `${m.drop}@${m.to}`;
    }

    const result = chess.move({ from: m.from, to: m.to, promotion: m.promotion });
    // console.log(result);
    if (!result) {
      throw new Error("Illegal move: " + JSON.stringify(m));
    }
  }

  // Generate final PGN string
  const pgnMoves = chess.pgn({ newline: "\n" });
  // console.log(headerLines.join("\n") + pgnMoves.split("\n\n"));

  return headerLines.join("\n") + "\n\n" + pgnMoves.split("\n\n");
}


document.getElementById('startBtn').addEventListener('click', () => {
  chess.reset();
  historyIndex=0;
  dhistoryIndex= 0;
  document.getElementById('board').classList.remove('branched');
        
  // chess.load(historyfen[0]);
  updateclock(0);
  try {
  feedbacktextupdate(analysisdata.positions[historyIndex].classificationName, Object.values(analysisdata.positions[historyIndex].playedMove.speech)[cg.state.orientation=="white"?(historyIndex%2==0?0:1):(historyIndex%2!=0?0:1)], analysisdata.positions[historyIndex].playedMove.score);
  }catch(e){
    console.log(e);
  }
  cg.set({
    animation: {enabled:false},
    fen: chess.fen(),
    lastMove: null,
    check: chess.inCheck(),
    turnColor: chess.turn() === 'w' ? 'white' : 'black',
    highlight: {
              lastMove: true,
              custom: new Map()
            }
  });
  cg.set({
    animation: {enabled:true}
  });
    
  

});


document.getElementById('endBtn').addEventListener('click', () => {
  let custom;
  let last;
  if(dhistoryIndex!=0){

    return;
  }

  

  historyIndex=history.length;
  chess.load(historyfen[historyIndex]);

  updateclock(historyIndex-1);

  try {

    const classificationtype=analysisdata.positions[historyIndex].classificationName;
    feedbacktextupdate(classificationtype, Object.values(analysisdata.positions.at(-1).playedMove.speech)[cg.state.orientation=="white"?(historyIndex%2==0?0:1):(historyIndex%2!=0?0:1)], analysisdata.positions[historyIndex].playedMove.score);
    last =historyIndex > 0 ? [history[historyIndex - 1].from, history[historyIndex - 1].to] : null;
    custom = last ? new Map([[last[1], [`${classificationtype} customsq`]]]) : new Map();
                


  }catch(e){
    console.log(e);
  }

  cg.set({
    animation: {enabled:false},
    fen: chess.fen(),
    lastMove: last,
    check: chess.inCheck(),
    turnColor: chess.turn() === 'w' ? 'white' : 'black',
    highlight: {
              lastMove: true,
              custom
            }
  });
  cg.set({
    animation: {enabled:true}
  });
  


});



document.getElementById('startReviewButton').addEventListener('click', () => {

  // console.log("review started");
  
  document.getElementsByClassName("page0")[0].classList.toggle("hidden");
  document.getElementsByClassName("page1")[0].classList.toggle("hidden");


});



document.getElementById('backToReviewBtn').addEventListener('click', () => {

  // console.log("review started");
  
  document.getElementsByClassName("page0")[0].classList.toggle("hidden");
  document.getElementsByClassName("page1")[0].classList.toggle("hidden");


});





function createIcon(name) {
  const svgNS = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.classList.add("move-icon", name);

  const use = document.createElementNS(svgNS, "use");
  use.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "href",
    `#icon-${name}`
  );

  svg.appendChild(use);
  return svg;
}

const feedback = document.getElementById("move-feedback-text");
const feedbackicon = document.getElementById("move-feedback-icon");
const feedbackeval= document.getElementById("move-feedback-evaluation");
const el = document.getElementById("move-feedback-evaluation");
// window.lastMove=lastMove;
window.createIcon=createIcon;
// const lastMove=document.getElementsByClassName("last-move")[0];

function feedbacktextupdate(classification, textvalue , evaluation) {
  feedback.innerHTML = ""; // clear previous
  feedbackicon.innerHTML = ""; // clear previous
  


  const icon = createIcon(classification);

  const safeText =
    textvalue == null || textvalue === "" ? "" : ` ${textvalue}`;

  const text = document.createTextNode(safeText);


  // setTimeout(() => {
  //   const lastMoveElement = document.getElementsByClassName("last-move")[0];
  //   if (lastMoveElement) {
  //     lastMoveElement.innerHTML = ""; // Clear previous
  //     lastMoveElement.appendChild(icon);
  //   } else {
  //     console.warn("Element with class 'last-move' not found");
  //   }
  // }, 1000);

  
  
  feedbackicon.appendChild(icon);
  
  feedback.appendChild(text);
  feedbackeval.innerHTML = evaluation? evaluation : "";

  const value = parseFloat(evaluation);
  if (value < 0) {
    el.classList.add("negative");
  } else {
    el.classList.remove("negative");
  }


  // const lastMoveElement = document.getElementsByClassName("last-move")[0];
  // if (lastMoveElement) {
  //   lastMoveElement.innerHTML = ""; // Clear previous
  //   lastMoveElement.appendChild(icon.cloneNode(true));
  // } else {
  //   console.warn("Element with class 'last-move' not found");
  // }


}



function loadAllSymbolsAsDataUris() {
  // Find all symbol elements in the document
  const symbols = document.querySelectorAll('symbol[id]');
  
  symbols.forEach(symbol => {
    const symbolId = symbol.id;
    const viewBox = symbol.getAttribute('viewBox');
    
    // Create SVG string from symbol content
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${symbol.innerHTML}</svg>`;
    
    // Convert to data URI
    const dataUri = `url('data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, '%27')}')`;
    
    // Set as CSS custom property with the symbol's id
    // Converts "icon-mistake" to "--icon-mistake"
    document.documentElement.style.setProperty(`--${symbolId}`, dataUri);
    
    console.log(`Loaded: --${symbolId}`);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAllSymbolsAsDataUris);
} else {
  loadAllSymbolsAsDataUris();
}


function updateclock(index){
  let ts,ts1;
  
  if(index<2){
    ts=timestamps[0]

    document.getElementById("black-clock").innerHTML=Math.trunc(basetime/600)+ ":00";
    document.getElementById("white-clock").innerHTML=Math.trunc(basetime/600)+ ":00";
    if(index==1){
    document.getElementById("white-clock").innerHTML=Math.trunc(ts/600) + ":" + (ts/10%60<10?"0":"")+ (ts/600==0?(ts/10%60).toFixed(1):Math.floor(ts/10%60)) ;
    }

  }
  else if(index%2==0){
    
      ts=timestamps[index-1];
      ts1=timestamps[index-2];
      
      console.log("even", index,ts1,ts);
 

      document.getElementById("white-clock").innerHTML=Math.trunc(ts1/600) + ":" + (ts1/10%60<10?"0":"")+ (ts1/600<1 && ts1/10%60<20?(ts1/10%60).toFixed(1):Math.floor(ts1/10%60)) ;
      document.getElementById("black-clock").innerHTML=Math.trunc(ts/600) + ":" + (ts/10%60<10?"0":"") + (ts/600<1 && ts/10%60<20 ?(ts/10%60).toFixed(1):Math.floor(ts/10%60));
      
  }
  else{

      ts=timestamps[index-1];
      ts1=timestamps[index-2];
      // console.log("odd", index,timestamps);

      document.getElementById("white-clock").innerHTML=Math.trunc(ts/600) + ":" + (ts/10%60<10?"0":"")+ (ts/600<1 && ts/10%60<20?(ts/10%60).toFixed(1):Math.floor(ts/10%60));
      document.getElementById("black-clock").innerHTML=Math.trunc(ts1/600) + ":" + (ts1/10%60<10?"0":"") + (ts1/600<1 && ts1/10%60<20?(ts1/10%60).toFixed(1):Math.floor(ts1/10%60)) ;
  }



}

function flipboard(){

cg.set({
    orientation: cg.state.orientation === 'white' ? 'black' : 'white'
  });


const top=document.querySelector('div.player-bar.top').innerHTML;
const bottom=document.querySelectorAll('div.player-bar')[1].innerHTML;

document.querySelector('div.player-bar.top').innerHTML=bottom;
document.querySelectorAll('div.player-bar')[1].innerHTML=top;






}

document.getElementById('flip-btn').addEventListener('click', () => {
  flipboard();
});

document.getElementById('bestmovebtn').addEventListener('click', () => {
  const dat=analysisdata.positions[historyIndex].suggestedMove;
  feedbacktextupdate("best",dat.moveLan+" "+dat.speech.personal, dat.score);
  dhistoryIndex++;
  dhistory.push(dat.moveLan.slice(2,4));
  chess.load(historyfen[historyIndex-1]);
  chess.move(dat.moveLan);
  cg.set({    
    fen: chess.fen(),
    lastMove: [dat.moveLan.slice(0,2), dat.moveLan.slice(2,4)],
    turnColor: chess.turn() === 'w' ? 'white' : 'black',
    check: chess.inCheck(),
    movable: {
      free: false,
      color: chess.turn() === 'w' ? 'white' : 'black',
      dests: cachedDests
    },
    highlight: {
        lastMove: true,
        custom: new Map([[dat.moveLan.slice(2,4), [`best customsq`]]])
      }
  });
  document.getElementById("bestmovebtn").classList.add("hidden");
  historyIndex--;

});

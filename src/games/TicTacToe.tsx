import { useState } from "react";

type Props = { onBack: () => void };
type Board = (string | null)[];

const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function checarVencedor(b: Board) {
  for (const [a,c,d] of WINS) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}

export default function TicTacToe({ onBack }: Props) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [vez, setVez] = useState("X");
  const vencedor = checarVencedor(board);
  const empate = !vencedor && board.every(Boolean);

  function clicar(i: number) {
    if (board[i] || vencedor) return;
    const novo = [...board];
    novo[i] = vez;
    setBoard(novo);
    setVez(vez === "X" ? "O" : "X");
  }

  function reiniciar() { setBoard(Array(9).fill(null)); setVez("X"); }

  return (
    <>
      <style>{`
        .game-screen { width:100%; height:100dvh; display:flex; flex-direction:column; background:#111b21; }
        .game-header { display:flex; align-items:center; gap:16px; padding:14px 16px; background:#202c33; }
        .back-btn { background:none; border:none; color:#00a884; font-size:22px; cursor:pointer; }
        .game-title { color:#e9edef; font-size:18px; font-weight:700; }
        .game-body { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; padding:16px; }
        .status { color:#e9edef; font-size:18px; font-weight:600; }
        .ttt-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; width:240px; }
        .ttt-cell { width:72px; height:72px; background:#202c33; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:32px; font-weight:700; cursor:pointer; border:none; color:#e9edef; transition:background 0.15s; }
        .ttt-cell:hover:not(:disabled) { background:#2a3942; }
        .ttt-cell.X { color:#00a884; }
        .ttt-cell.O { color:#ef4444; }
        .restart-btn { background:#00a884; border:none; color:#fff; padding:12px 32px; border-radius:24px; font-size:16px; cursor:pointer; }
        .player-labels { display:flex; gap:40px; }
        .player-label { text-align:center; }
        .player-name { font-size:13px; color:#8696a0; }
        .player-sym { font-size:28px; font-weight:700; }
        .player-sym.X { color:#00a884; }
        .player-sym.O { color:#ef4444; }
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">⭕ Jogo da Velha</span>
        </div>
        <div className="game-body">
          <div className="player-labels">
            <div className="player-label"><div className="player-name">Jogador 1</div><div className="player-sym X">X</div></div>
            <div className="player-label"><div className="player-name">Jogador 2</div><div className="player-sym O">O</div></div>
          </div>
          <div className="status">
            {vencedor ? `🏆 ${vencedor} venceu!` : empate ? "😅 Empate!" : `Vez de ${vez}`}
          </div>
          <div className="ttt-grid">
            {board.map((val, i) => (
              <button key={i} className={`ttt-cell ${val || ""}`} onClick={() => clicar(i)} disabled={!!vencedor || !!val}>
                {val}
              </button>
            ))}
          </div>
          {(vencedor || empate) && <button className="restart-btn" onClick={reiniciar}>Jogar de novo</button>}
        </div>
      </div>
    </>
  );
}
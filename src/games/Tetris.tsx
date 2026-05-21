import { useEffect, useRef, useState, useCallback } from "react";

type Props = { onBack: () => void };

const COLS = 10; const ROWS = 20; const BLOCK = 28;
const PIECES = [
  { shape: [[1,1,1,1]], color: "#00ffe1" },
  { shape: [[1,1],[1,1]], color: "#ffd700" },
  { shape: [[0,1,0],[1,1,1]], color: "#a855f7" },
  { shape: [[1,0],[1,0],[1,1]], color: "#f97316" },
  { shape: [[0,1],[0,1],[1,1]], color: "#3b82f6" },
  { shape: [[1,1,0],[0,1,1]], color: "#ef4444" },
  { shape: [[0,1,1],[1,1,0]], color: "#00a884" },
];

function peca() { const p = PIECES[Math.floor(Math.random() * PIECES.length)]; return { shape: p.shape, color: p.color, x: 4, y: 0 }; }
function board() { return Array.from({ length: ROWS }, () => Array(COLS).fill("")); }

export default function Tetris({ onBack }: Props) {
  const [grid, setGrid] = useState<string[][]>(board());
  const [piece, setPiece] = useState(peca());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [rodando, setRodando] = useState(false);
  const pieceRef = useRef(piece);
  const gridRef = useRef(grid);
  pieceRef.current = piece; gridRef.current = grid;

  function colide(p: typeof piece, g: string[][], dx = 0, dy = 0) {
    return p.shape.some((row, r) => row.some((v, c) => {
      if (!v) return false;
      const nx = p.x + c + dx; const ny = p.y + r + dy;
      return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && g[ny][nx]);
    }));
  }

  function fundir(p: typeof piece, g: string[][]) {
    const nova = g.map(r => [...r]);
    p.shape.forEach((row, r) => row.forEach((v, c) => { if (v && p.y + r >= 0) nova[p.y + r][p.x + c] = p.color; }));
    const filtrado = nova.filter(r => !r.every(Boolean));
    const linhas = ROWS - filtrado.length;
    setScore(s => s + linhas * 100);
    return [...Array.from({ length: linhas }, () => Array(COLS).fill("")), ...filtrado];
  }

  const descer = useCallback(() => {
    const p = pieceRef.current; const g = gridRef.current;
    if (colide(p, g, 0, 1)) {
      if (p.y <= 0) { setGameOver(true); setRodando(false); return; }
      const novoGrid = fundir(p, g);
      setGrid(novoGrid);
      setPiece(peca());
    } else setPiece(prev => ({ ...prev, y: prev.y + 1 }));
  }, []);

  useEffect(() => {
    if (!rodando) return;
    const t = setInterval(descer, 500);
    return () => clearInterval(t);
  }, [rodando, descer]);

  function mover(dx: number) {
    if (!colide(pieceRef.current, gridRef.current, dx, 0)) setPiece(p => ({ ...p, x: p.x + dx }));
  }

  function rotacionar() {
    const r = piece.shape[0].map((_, i) => piece.shape.map(row => row[i]).reverse());
    const np = { ...piece, shape: r };
    if (!colide(np, grid)) setPiece(np);
  }

  function reiniciar() { setGrid(board()); setPiece(peca()); setScore(0); setGameOver(false); setRodando(true); }

  const display = grid.map(r => [...r]);
  piece.shape.forEach((row, r) => row.forEach((v, c) => { if (v && piece.y + r >= 0 && piece.y + r < ROWS) display[piece.y + r][piece.x + c] = piece.color; }));

  return (
    <>
      <style>{`
        .game-screen { width:100%; height:100dvh; display:flex; flex-direction:column; background:#111b21; }
        .game-header { display:flex; align-items:center; gap:16px; padding:14px 16px; background:#202c33; }
        .back-btn { background:none; border:none; color:#00a884; font-size:22px; cursor:pointer; }
        .game-title { color:#e9edef; font-size:18px; font-weight:700; flex:1; }
        .game-score-txt { color:#00a884; font-weight:700; }
        .game-body { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:8px; }
        .tetris-board { display:grid; grid-template-columns:repeat(10,${BLOCK}px); gap:1px; background:#1f2c34; border:2px solid #1f2c34; border-radius:4px; position:relative; }
        .tetris-cell { width:${BLOCK}px; height:${BLOCK}px; border-radius:2px; }
        .tetris-controls { display:flex; gap:8px; }
        .t-btn { background:#202c33; border:2px solid #1f2c34; color:#e9edef; font-size:20px; width:52px; height:52px; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .t-btn:active { background:#2a3942; }
        .overlay { position:absolute; inset:0; background:#000000aa; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; border-radius:2px; }
        .overlay-text { color:#e9edef; font-size:18px; font-weight:700; }
        .restart-btn { background:#00a884; border:none; color:#fff; padding:10px 24px; border-radius:24px; font-size:15px; cursor:pointer; }
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">🟦 Tetris</span>
          <span className="game-score-txt">{score} pts</span>
        </div>
        <div className="game-body">
          <div className="tetris-board">
            {display.map((row, r) => row.map((color, c) => (
              <div key={`${r}-${c}`} className="tetris-cell" style={{ background: color || "#0b141a" }} />
            )))}
            {(!rodando || gameOver) && (
              <div className="overlay">
                <div className="overlay-text">{gameOver ? `💀 Game Over! ${score} pts` : "🟦 Tetris"}</div>
                <button className="restart-btn" onClick={reiniciar}>{gameOver ? "Jogar de novo" : "Iniciar"}</button>
              </div>
            )}
          </div>
          <div className="tetris-controls">
            <button className="t-btn" onClick={() => mover(-1)}>←</button>
            <button className="t-btn" onClick={rotacionar}>↻</button>
            <button className="t-btn" onClick={descer}>↓</button>
            <button className="t-btn" onClick={() => mover(1)}>→</button>
          </div>
        </div>
      </div>
    </>
  );
}
import { useEffect, useRef, useState, useCallback } from "react";
type Props = { onBack: () => void };

const COLS = 10; const ROWS = 20;
const PIECES = [
  { shape: [[1,1,1,1]],           color: "#00f5ff", name: "I" },
  { shape: [[1,1],[1,1]],         color: "#ffe600", name: "O" },
  { shape: [[0,1,0],[1,1,1]],     color: "#c724f0", name: "T" },
  { shape: [[1,0],[1,0],[1,1]],   color: "#ff8c00", name: "L" },
  { shape: [[0,1],[0,1],[1,1]],   color: "#1e90ff", name: "J" },
  { shape: [[1,1,0],[0,1,1]],     color: "#ff2d55", name: "S" },
  { shape: [[0,1,1],[1,1,0]],     color: "#00e676", name: "Z" },
];

type Piece = { shape: number[][]; color: string; name: string; x: number; y: number };

function novaPeca(): Piece {
  const p = PIECES[Math.floor(Math.random() * PIECES.length)];
  return { ...p, shape: p.shape.map(r => [...r]), x: Math.floor((COLS - p.shape[0].length) / 2), y: 0 };
}
function novoBoard() { return Array.from({ length: ROWS }, () => Array(COLS).fill("")); }

export default function Tetris({ onBack }: Props) {
  const [grid, setGrid]       = useState<string[][]>(novoBoard);
  const [piece, setPiece]     = useState<Piece>(novaPeca);
  const [next, setNext]       = useState<Piece>(novaPeca);
  const [score, setScore]     = useState(0);
  const [lines, setLines]     = useState(0);
  const [level, setLevel]     = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [rodando, setRodando]  = useState(false);
  const [clearing, setClearing] = useState<number[]>([]);

  const pieceRef = useRef(piece);
  const gridRef  = useRef(grid);
  const nextRef  = useRef(next);
  pieceRef.current = piece;
  gridRef.current  = grid;
  nextRef.current  = next;

  function colide(p: Piece, g: string[][], dx = 0, dy = 0, shape = p.shape) {
    return shape.some((row, r) => row.some((v, c) => {
      if (!v) return false;
      const nx = p.x + c + dx, ny = p.y + r + dy;
      return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && !!g[ny]?.[nx]);
    }));
  }

  function fundir(p: Piece, g: string[][]) {
    const nova = g.map(r => [...r]);
    p.shape.forEach((row, r) => row.forEach((v, c) => {
      if (v && p.y + r >= 0) nova[p.y + r][p.x + c] = p.color;
    }));
    const cheias = nova.reduce<number[]>((acc, row, i) => { if (row.every(Boolean)) acc.push(i); return acc; }, []);
    if (cheias.length) {
      setClearing(cheias);
      setTimeout(() => {
        setClearing([]);
        const filtrado = nova.filter((_, i) => !cheias.includes(i));
        const pts = [0, 100, 300, 500, 800][cheias.length] * level;
        setScore(s => s + pts);
        setLines(l => { const nl = l + cheias.length; setLevel(Math.floor(nl / 10) + 1); return nl; });
        setGrid([...Array.from({ length: cheias.length }, () => Array(COLS).fill("")), ...filtrado]);
      }, 200);
    } else {
      setGrid(nova);
    }
    return cheias;
  }

  const descer = useCallback(() => {
    const p = pieceRef.current, g = gridRef.current;
    if (colide(p, g, 0, 1)) {
      if (p.y <= 0) { setGameOver(true); setRodando(false); return; }
      fundir(p, g);
      setPiece({ ...nextRef.current });
      setNext(novaPeca());
    } else {
      setPiece(prev => ({ ...prev, y: prev.y + 1 }));
    }
  }, [level]);

  const speed = Math.max(100, 500 - (level - 1) * 40);

  useEffect(() => {
    if (!rodando) return;
    const t = setInterval(descer, speed);
    return () => clearInterval(t);
  }, [rodando, descer, speed]);

  function mover(dx: number) {
    if (!rodando) return;
    if (!colide(pieceRef.current, gridRef.current, dx)) setPiece(p => ({ ...p, x: p.x + dx }));
  }

  function rotacionar() {
    if (!rodando) return;
    const p = pieceRef.current;
    const rot = p.shape[0].map((_, i) => p.shape.map(r => r[i]).reverse());
    let dx = 0;
    if (!colide(p, gridRef.current, 0, 0, rot)) dx = 0;
    else if (!colide(p, gridRef.current, 1, 0, rot)) dx = 1;
    else if (!colide(p, gridRef.current, -1, 0, rot)) dx = -1;
    else return;
    setPiece(prev => ({ ...prev, shape: rot, x: prev.x + dx }));
  }

  function hardDrop() {
    if (!rodando) return;
    let p = { ...pieceRef.current };
    while (!colide(p, gridRef.current, 0, 1)) p = { ...p, y: p.y + 1 };
    setPiece(p);
    setTimeout(descer, 0);
  }

  function reiniciar() {
    const p = novaPeca();
    setGrid(novoBoard()); setPiece(p); setNext(novaPeca());
    setScore(0); setLines(0); setLevel(1);
    setGameOver(false); setRodando(true);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); mover(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); mover(1); }
      if (e.key === "ArrowDown")  { e.preventDefault(); descer(); }
      if (e.key === "ArrowUp")    { e.preventDefault(); rotacionar(); }
      if (e.key === " ")          { e.preventDefault(); hardDrop(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rodando]);

  // ghost piece
  function ghostY() {
    let p = { ...pieceRef.current };
    while (!colide(p, grid, 0, 1)) p = { ...p, y: p.y + 1 };
    return p.y;
  }

  const display = grid.map(r => [...r]);
  const gy = ghostY();
  piece.shape.forEach((row, r) => row.forEach((v, c) => {
    if (!v) return;
    const gr = gy + r, gc = piece.x + c;
    if (gr >= 0 && gr < ROWS && gc >= 0 && gc < COLS && !display[gr][gc])
      display[gr][gc] = "ghost:" + piece.color;
  }));
  piece.shape.forEach((row, r) => row.forEach((v, c) => {
    if (v && piece.y + r >= 0 && piece.y + r < ROWS)
      display[piece.y + r][piece.x + c] = piece.color;
  }));

  // Next piece preview
  const nextGrid = Array.from({ length: 4 }, () => Array(4).fill(""));
  const offX = Math.floor((4 - next.shape[0].length) / 2);
  const offY = Math.floor((4 - next.shape.length) / 2);
  next.shape.forEach((row, r) => row.forEach((v, c) => {
    if (v) nextGrid[r + offY][c + offX] = next.color;
  }));

  const BLOCK = `clamp(20px, ${Math.floor(100 / COLS)}vw, 28px)`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;700&display=swap');

        .tet-root {
          position: fixed; inset: 0;
          width: 100vw; height: 100dvh;
          display: flex; flex-direction: column;
          background: #0a0a12;
          font-family: 'Rajdhani', sans-serif;
          overflow: hidden;
          -webkit-text-size-adjust: 100%;
        }

        /* SCANLINES overlay */
        .tet-root::before {
          content: '';
          position: fixed; inset: 0; z-index: 999; pointer-events: none;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.08) 2px, rgba(0,0,0,.08) 4px);
        }

        /* ── HEADER ── */
        .tet-header {
          display: flex; align-items: center; gap: 10px;
          padding: 0 8px 0 4px;
          background: #0d0d1a;
          height: 52px; min-height: 52px; flex-shrink: 0;
          border-bottom: 1px solid #1a1a3a;
        }
        .tet-back {
          background: none; border: none; color: #555580;
          cursor: pointer; padding: 10px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: color .15s; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .tet-back:hover { color: #aaa; }

        .tet-title {
          font-family: 'Orbitron', monospace;
          color: #e9edef; font-size: 16px; font-weight: 900;
          flex: 1; letter-spacing: 2px;
          text-shadow: 0 0 20px rgba(200,100,255,.6);
        }

        .tet-hud { display: flex; gap: 6px; flex-shrink: 0; }
        .tet-stat {
          background: #0d0d1a;
          border: 1px solid #1a1a3a;
          border-radius: 6px; padding: 3px 10px;
          text-align: center; min-width: 52px;
        }
        .tet-stat-lbl { color: #444466; font-size: 8px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; }
        .tet-stat-val { color: #e9edef; font-size: 15px; font-weight: 700; font-family: 'Orbitron', monospace; line-height: 1.2; }

        /* ── BODY ── */
        .tet-body {
          flex: 1; display: flex;
          align-items: center; justify-content: center;
          gap: 10px; padding: 8px;
          background: radial-gradient(ellipse at 50% 20%, #110025 0%, #0a0a12 70%);
          overflow: hidden;
        }

        /* ── BOARD ── */
        .tet-board-col { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .tet-board-wrap {
          position: relative;
          border: 1px solid #1a1a3a;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(150,50,255,.2), inset 0 0 20px rgba(0,0,0,.5);
        }
        .tet-board {
          display: grid;
          grid-template-columns: repeat(${COLS}, ${BLOCK});
          gap: 1px;
          background: #050508;
          padding: 1px;
        }
        .tet-cell {
          width: ${BLOCK}; height: ${BLOCK};
          border-radius: 2px;
          transition: background .05s;
          position: relative;
        }
        .tet-cell.filled::after {
          content: '';
          position: absolute; inset: 1px;
          border-radius: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,.25) 0%, transparent 60%);
        }
        .tet-cell.ghost { opacity: .22; }
        .tet-cell.clearing { animation: lineClear .2s ease; }
        @keyframes lineClear {
          0%   { background: #fff !important; }
          100% { background: transparent; }
        }

        /* ── SIDE PANEL ── */
        .tet-side {
          display: flex; flex-direction: column; gap: 10px;
          align-self: flex-start; margin-top: 4px;
        }
        .tet-panel {
          background: #0d0d1a;
          border: 1px solid #1a1a3a;
          border-radius: 8px; padding: 8px 10px;
          min-width: 72px;
        }
        .tet-panel-lbl {
          color: #444466; font-size: 9px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          margin-bottom: 6px;
        }
        .tet-next-grid {
          display: grid; grid-template-columns: repeat(4, 14px);
          gap: 2px;
        }
        .tet-next-cell {
          width: 14px; height: 14px; border-radius: 2px;
        }

        /* ── CONTROLS ── */
        .tet-controls {
          display: flex; flex-direction: column; gap: 6px; align-items: center;
        }
        .tet-ctrl-row { display: flex; gap: 6px; }
        .tet-btn {
          background: #0d0d1a;
          border: 1px solid #1a1a3a;
          color: #8888aa;
          border-radius: 8px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          width: 46px; height: 46px;
          transition: background .1s, color .1s, transform .08s;
          -webkit-tap-highlight-color: transparent;
          font-family: inherit;
        }
        .tet-btn:hover  { background: #1a1a3a; color: #e9edef; }
        .tet-btn:active { transform: scale(0.88); background: #151530; }
        .tet-btn.wide   { width: 100px; font-size: 12px; font-weight: 700; letter-spacing: 1px; color: #c724f0; border-color: #c724f033; }
        .tet-btn.start  { background: #c724f022; color: #c724f0; border-color: #c724f044; font-size: 12px; font-weight: 700; letter-spacing: 1px; }

        /* ── OVERLAY ── */
        .tet-overlay {
          position: absolute; inset: 0;
          background: rgba(5,5,8,.9);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 14px;
          backdrop-filter: blur(6px);
          animation: fadeIn .3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .tet-overlay-title {
          font-family: 'Orbitron', monospace;
          color: #e9edef; font-size: 18px; font-weight: 900;
          text-shadow: 0 0 20px rgba(200,100,255,.8);
          text-align: center; padding: 0 12px;
        }
        .tet-overlay-sub { color: #666688; font-size: 13px; }
        .tet-start-btn {
          background: linear-gradient(135deg, #c724f0, #7b2ff7);
          border: none; color: #fff;
          padding: 11px 28px; border-radius: 24px;
          font-size: 14px; font-weight: 700; letter-spacing: 1px;
          cursor: pointer; font-family: 'Rajdhani', sans-serif;
          box-shadow: 0 4px 20px rgba(200,50,250,.5);
          transition: transform .12s;
        }
        .tet-start-btn:hover  { transform: scale(1.05); }
        .tet-start-btn:active { transform: scale(0.95); }

        .tet-hint { color: #333355; font-size: 10px; text-align: center; letter-spacing: .5px; }

        /* Responsive: hide side panel on very small screens */
        @media (max-width: 340px) {
          .tet-side { display: none; }
          .tet-btn { width: 40px; height: 40px; font-size: 14px; }
          .tet-btn.wide { width: 88px; }
        }
      `}</style>

      <div className="tet-root">
        {/* HEADER */}
        <header className="tet-header">
          <button className="tet-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <span className="tet-title">TETRIS</span>
          <div className="tet-hud">
            <div className="tet-stat">
              <div className="tet-stat-lbl">SCORE</div>
              <div className="tet-stat-val">{score}</div>
            </div>
            <div className="tet-stat">
              <div className="tet-stat-lbl">LVL</div>
              <div className="tet-stat-val">{level}</div>
            </div>
            <div className="tet-stat">
              <div className="tet-stat-lbl">LINES</div>
              <div className="tet-stat-val">{lines}</div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="tet-body">
          <div className="tet-board-col">
            {/* BOARD */}
            <div className="tet-board-wrap">
              <div className="tet-board">
                {display.map((row, r) => row.map((cell, c) => {
                  const isGhost = cell.startsWith("ghost:");
                  const color   = isGhost ? cell.slice(6) : cell;
                  const isClear = clearing.includes(r);
                  return (
                    <div key={`${r}-${c}`}
                      className={`tet-cell${color ? (isGhost ? " ghost" : " filled") : ""}${isClear ? " clearing" : ""}`}
                      style={{ background: color ? color : "#090912" }}
                    />
                  );
                }))}
              </div>

              {(!rodando || gameOver) && (
                <div className="tet-overlay">
                  <div className="tet-overlay-title">
                    {gameOver ? `GAME OVER` : "TETRIS"}
                  </div>
                  {gameOver && <div className="tet-overlay-sub">{score} pontos · {lines} linhas</div>}
                  <button className="tet-start-btn" onClick={reiniciar}>
                    {gameOver ? "JOGAR NOVAMENTE" : "INICIAR"}
                  </button>
                </div>
              )}
            </div>

            {/* CONTROLS */}
            <div className="tet-controls">
              <div className="tet-ctrl-row">
                <button className="tet-btn" onClick={() => mover(-1)}>◀</button>
                <button className="tet-btn" onClick={rotacionar}>↻</button>
                <button className="tet-btn" onClick={descer}>▼</button>
                <button className="tet-btn" onClick={() => mover(1)}>▶</button>
              </div>
              <div className="tet-ctrl-row">
                <button className="tet-btn wide" onClick={hardDrop}>DROP</button>
              </div>
            </div>

            <div className="tet-hint">Setas · Espaço = drop · ↑ = rotacionar</div>
          </div>

          {/* SIDE PANEL */}
          <div className="tet-side">
            <div className="tet-panel">
              <div className="tet-panel-lbl">NEXT</div>
              <div className="tet-next-grid">
                {nextGrid.flat().map((c, i) => (
                  <div key={i} className="tet-next-cell"
                    style={{ background: c || "transparent", boxShadow: c ? `0 0 6px ${c}66` : "none" }} />
                ))}
              </div>
            </div>
            {rodando && (
              <button className="tet-btn start" onClick={() => setRodando(false)} style={{width:"100%",height:36}}>
                PAUSE
              </button>
            )}
            {!rodando && !gameOver && score > 0 && (
              <button className="tet-btn start" onClick={() => setRodando(true)} style={{width:"100%",height:36}}>
                RESUME
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
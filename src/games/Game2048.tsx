import { useState, useEffect } from "react";
type Props = { onBack: () => void };
type Grid = number[][];

function novoGrid(): Grid { return Array.from({ length: 4 }, () => Array(4).fill(0)); }
function addRandom(g: Grid) {
  const vazios: [number,number][] = [];
  g.forEach((r,i) => r.forEach((v,j) => { if (!v) vazios.push([i,j]); }));
  if (!vazios.length) return;
  const [r,c] = vazios[Math.floor(Math.random()*vazios.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
}
function iniciarGrid() { const g = novoGrid(); addRandom(g); addRandom(g); return g; }

function moverEsq(g: Grid): [Grid, number] {
  let score = 0;
  const novo = g.map(row => {
    const f = row.filter(Boolean);
    for (let i = 0; i < f.length - 1; i++) {
      if (f[i] === f[i+1]) { f[i] *= 2; score += f[i]; f[i+1] = 0; }
    }
    const m = f.filter(Boolean);
    while (m.length < 4) m.push(0);
    return m;
  });
  return [novo, score];
}
function rotCW(g: Grid): Grid  { return g[0].map((_,i) => g.map(r => r[i]).reverse()); }
function rotCCW(g: Grid): Grid { return g[0].map((_,i) => g.map(r => r[r.length-1-i])); }
function mover(g: Grid, dir: string): [Grid, number] {
  if (dir === "left")  return moverEsq(g);
  if (dir === "right") { const [n,s] = moverEsq(g.map(r=>[...r].reverse())); return [n.map(r=>[...r].reverse()), s]; }
  if (dir === "up")    { const [n,s] = moverEsq(rotCW(g));  return [rotCCW(n), s]; }
  const [n,s] = moverEsq(rotCCW(g)); return [rotCW(n), s];
}

const TILE: Record<number, { bg: string; fg: string; size: string }> = {
  0:    { bg: "rgba(255,255,255,.04)", fg: "transparent",  size: "1.4rem" },
  2:    { bg: "#eee4da",  fg: "#776e65", size: "1.6rem" },
  4:    { bg: "#ede0c8",  fg: "#776e65", size: "1.6rem" },
  8:    { bg: "#f2b179",  fg: "#fff",    size: "1.6rem" },
  16:   { bg: "#f59563",  fg: "#fff",    size: "1.4rem" },
  32:   { bg: "#f67c5f",  fg: "#fff",    size: "1.4rem" },
  64:   { bg: "#f65e3b",  fg: "#fff",    size: "1.4rem" },
  128:  { bg: "#edcf72",  fg: "#fff",    size: "1.2rem" },
  256:  { bg: "#edcc61",  fg: "#fff",    size: "1.2rem" },
  512:  { bg: "#edc850",  fg: "#fff",    size: "1.2rem" },
  1024: { bg: "#edc53f",  fg: "#fff",    size: "1rem"   },
  2048: { bg: "#edc22e",  fg: "#fff",    size: "1rem"   },
};
function tileStyle(v: number) {
  return TILE[v] ?? { bg: "#3c3a32", fg: "#fff", size: ".9rem" };
}

export default function Game2048({ onBack }: Props) {
  const [grid, setGrid]     = useState<Grid>(iniciarGrid);
  const [score, setScore]   = useState(0);
  const [best, setBest]     = useState(() => Number(localStorage.getItem("2048best") || 0));
  const [ganhou, setGanhou] = useState(false);
  const [perdeu, setPerdeu] = useState(false);
  const [start, setStart]   = useState<[number,number]|null>(null);
  const [bump, setBump]     = useState<number|null>(null); // célula que acabou de se fundir

  function addScore(pts: number) {
    setScore(s => {
      const ns = s + pts;
      setBest(b => { const nb = Math.max(b, ns); localStorage.setItem("2048best", String(nb)); return nb; });
      return ns;
    });
  }

  function jogar(dir: string) {
    if (ganhou || perdeu) return;
    setGrid(prev => {
      const [novo, pts] = mover(prev, dir);
      const mudou = JSON.stringify(novo) !== JSON.stringify(prev);
      if (!mudou) return prev;
      addRandom(novo);
      if (pts) { addScore(pts); setBump(Date.now()); }
      if (novo.flat().includes(2048)) setGanhou(true);
      // verifica derrota
      const semMov = ["left","right","up","down"].every(d => {
        const [n] = mover(novo, d);
        return JSON.stringify(n) === JSON.stringify(novo);
      });
      if (semMov) setPerdeu(true);
      return novo;
    });
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const m: Record<string,string> = { ArrowLeft:"left", ArrowRight:"right", ArrowUp:"up", ArrowDown:"down" };
      if (m[e.key]) { e.preventDefault(); jogar(m[e.key]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ganhou, perdeu]);

  function reiniciar() { setGrid(iniciarGrid()); setScore(0); setGanhou(false); setPerdeu(false); }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&display=swap');

        .g48-root {
          position: fixed; inset: 0;
          width: 100vw; height: 100dvh;
          display: flex; flex-direction: column;
          background: #1a1a2e;
          font-family: 'Nunito', sans-serif;
          overflow: hidden;
          -webkit-text-size-adjust: 100%;
        }

        /* ── HEADER ── */
        .g48-header {
          display: flex; align-items: center; gap: 10px;
          padding: 0 8px 0 4px;
          background: #16213e;
          height: 58px; min-height: 58px; flex-shrink: 0;
          box-shadow: 0 1px 0 rgba(0,0,0,.4);
        }
        .g48-back {
          background: none; border: none; color: #aebac1;
          cursor: pointer; padding: 10px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: background .15s; flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .g48-back:hover  { background: rgba(255,255,255,.08); }
        .g48-back:active { background: rgba(255,255,255,.14); }
        .g48-h-title { color: #e9edef; font-size: 20px; font-weight: 900; flex: 1; letter-spacing: -0.5px; }

        .g48-scores { display: flex; gap: 8px; flex-shrink: 0; }
        .g48-score-box {
          background: #0f3460;
          border-radius: 10px; padding: 4px 12px;
          text-align: center; min-width: 64px;
        }
        .g48-score-lbl { color: #8696a0; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
        .g48-score-val { color: #e9edef; font-size: 16px; font-weight: 900; line-height: 1.2; }
        .g48-score-val.bump { animation: scoreBump .3s ease; }
        @keyframes scoreBump {
          0%   { transform: scale(1);   }
          50%  { transform: scale(1.3); color: #f2b179; }
          100% { transform: scale(1);   }
        }

        /* ── BODY ── */
        .g48-body {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; padding: 12px;
          background: radial-gradient(ellipse at 50% 0%, #0f3460 0%, #1a1a2e 70%);
        }

        /* ── GRID ── */
        .g48-board-wrap { position: relative; }
        .g48-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(6px, 2vw, 10px);
          background: #0d1b2e;
          padding: clamp(6px, 2vw, 10px);
          border-radius: 14px;
          width: min(88vw, 360px);
          box-shadow: 0 8px 32px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05);
        }
        .g48-cell {
          aspect-ratio: 1;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 900; line-height: 1;
          transition: background .1s, transform .08s;
          box-shadow: 0 2px 8px rgba(0,0,0,.3);
          user-select: none;
        }
        .g48-cell.new  { animation: cellPop .15s ease; }
        .g48-cell.merge { animation: cellMerge .2s ease; }
        @keyframes cellPop   { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes cellMerge { 0% { transform: scale(1); } 50% { transform: scale(1.18); } 100% { transform: scale(1); } }

        /* ── OVERLAY ── */
        .g48-overlay {
          position: absolute; inset: 0; border-radius: 14px;
          background: rgba(10,15,30,.88);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 14px;
          backdrop-filter: blur(4px);
          animation: fadeIn .25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .g48-overlay-icon { font-size: 44px; line-height: 1; }
        .g48-overlay-msg  { color: #e9edef; font-size: 20px; font-weight: 900; text-align: center; }
        .g48-overlay-sub  { color: #8696a0; font-size: 13px; }
        .g48-play-btn {
          background: linear-gradient(135deg, #f2b179, #f65e3b);
          border: none; color: #fff;
          padding: 11px 32px; border-radius: 28px;
          font-size: 15px; font-weight: 800;
          cursor: pointer; font-family: inherit;
          box-shadow: 0 4px 16px rgba(242,95,59,.45);
          transition: transform .12s, box-shadow .12s;
        }
        .g48-play-btn:hover  { transform: scale(1.04); }
        .g48-play-btn:active { transform: scale(0.96); }

        /* ── CONTROLS ── */
        .g48-ctrl-row {
          display: flex; gap: 8px;
        }
        .g48-ctrl-col {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
        }
        .g48-dpad {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 6px;
          width: min(88vw, 200px);
        }
        .g48-btn {
          background: #16213e;
          border: 1.5px solid #0f3460;
          color: #aebac1;
          border-radius: 10px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; aspect-ratio: 1;
          transition: background .12s, transform .1s;
          -webkit-tap-highlight-color: transparent;
        }
        .g48-btn:hover  { background: #0f3460; color: #e9edef; }
        .g48-btn:active { transform: scale(0.9); background: #0d2744; }
        .g48-btn.center {
          background: #0f3460; border-color: #1e5090;
          color: #f2b179; font-size: 13px; font-weight: 800;
          cursor: pointer;
        }
        .g48-btn.empty { visibility: hidden; cursor: default; }

        .g48-hint { color: #374a5a; font-size: 11px; text-align: center; letter-spacing: .3px; }
      `}</style>

      <div className="g48-root">
        {/* HEADER */}
        <header className="g48-header">
          <button className="g48-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <span className="g48-h-title">🔢 2048</span>
          <div className="g48-scores">
            <div className="g48-score-box">
              <div className="g48-score-lbl">SCORE</div>
              <div className={`g48-score-val${bump ? " bump" : ""}`} key={bump}>{score}</div>
            </div>
            <div className="g48-score-box">
              <div className="g48-score-lbl">BEST</div>
              <div className="g48-score-val">{best}</div>
            </div>
          </div>
        </header>

        {/* BODY */}
        <div
          className="g48-body"
          onTouchStart={e => setStart([e.touches[0].clientX, e.touches[0].clientY])}
          onTouchEnd={e => {
            if (!start) return;
            const dx = e.changedTouches[0].clientX - start[0];
            const dy = e.changedTouches[0].clientY - start[1];
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
            if (Math.abs(dx) > Math.abs(dy)) jogar(dx > 0 ? "right" : "left");
            else jogar(dy > 0 ? "down" : "up");
            setStart(null);
          }}
        >
          {/* BOARD */}
          <div className="g48-board-wrap">
            <div className="g48-board">
              {grid.flat().map((v, i) => {
                const { bg, fg, size } = tileStyle(v);
                return (
                  <div key={i} className="g48-cell" style={{
                    background: bg, color: fg, fontSize: size,
                  }}>
                    {v || ""}
                  </div>
                );
              })}
            </div>

            {(ganhou || perdeu) && (
              <div className="g48-overlay">
                <div className="g48-overlay-icon">{ganhou ? "🏆" : "💀"}</div>
                <div className="g48-overlay-msg">{ganhou ? "Você chegou no 2048!" : "Game Over!"}</div>
                <div className="g48-overlay-sub">{score} pontos</div>
                <button className="g48-play-btn" onClick={reiniciar}>Jogar de novo</button>
              </div>
            )}
          </div>

          {/* D-PAD */}
          <div className="g48-dpad">
            <div className="g48-btn empty" />
            <button className="g48-btn" onClick={() => jogar("up")}>▲</button>
            <div className="g48-btn empty" />
            <button className="g48-btn" onClick={() => jogar("left")}>◀</button>
            <button className="g48-btn center" onClick={reiniciar}>↺</button>
            <button className="g48-btn" onClick={() => jogar("right")}>▶</button>
            <div className="g48-btn empty" />
            <button className="g48-btn" onClick={() => jogar("down")}>▼</button>
            <div className="g48-btn empty" />
          </div>

          <div className="g48-hint">Arraste ou use as setas · Junte iguais para chegar em 2048</div>
        </div>
      </div>
    </>
  );
}
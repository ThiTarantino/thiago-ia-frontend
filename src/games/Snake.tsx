import { useState, useEffect, useCallback, useRef } from "react";

type Props = { onBack: () => void };
type Pos = { x: number; y: number };

const COLS = 20; const ROWS = 20; const SPEED = 150;

function novaCobrinha(): Pos[] { return [{ x: 10, y: 10 }]; }
function novaComida(): Pos { return { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }

export default function Snake({ onBack }: Props) {
  const [snake, setSnake] = useState<Pos[]>(novaCobrinha());
  const [comida, setComida] = useState<Pos>(novaComida());
  const [dir, setDir] = useState<Pos>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [rodando, setRodando] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  const mover = useCallback(() => {
    setSnake(prev => {
      const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || prev.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true); setRodando(false); return prev;
      }
      const nova = [head, ...prev];
      if (head.x === comida.x && head.y === comida.y) {
        setComida(novaComida()); setScore(s => s + 1);
      } else nova.pop();
      return nova;
    });
  }, [comida]);

  useEffect(() => {
    if (!rodando) return;
    const t = setInterval(mover, SPEED);
    return () => clearInterval(t);
  }, [rodando, mover]);

  function reiniciar() { setSnake(novaCobrinha()); setComida(novaComida()); setDir({ x: 1, y: 0 }); setGameOver(false); setScore(0); setRodando(true); }

  const tamanho = Math.min(window.innerWidth, 400);
  const celula = tamanho / COLS;

  return (
    <>
      <style>{`
        .game-screen { width:100%; height:100dvh; display:flex; flex-direction:column; background:#111b21; }
        .game-header { display:flex; align-items:center; gap:16px; padding:14px 16px; background:#202c33; }
        .back-btn { background:none; border:none; color:#00a884; font-size:22px; cursor:pointer; }
        .game-title { color:#e9edef; font-size:18px; font-weight:700; flex:1; }
        .game-score { color:#00a884; font-weight:700; font-size:16px; }
        .game-body { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:8px; }
        .snake-canvas { background:#0b141a; border:2px solid #1f2c34; border-radius:8px; position:relative; overflow:hidden; }
        .snake-cell { position:absolute; border-radius:3px; }
        .controls { display:grid; grid-template-columns:repeat(3,52px); grid-template-rows:repeat(2,52px); gap:6px; }
        .ctrl-btn { background:#202c33; border:none; color:#e9edef; font-size:22px; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .ctrl-btn:active { background:#2a3942; }
        .overlay-msg { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; background:#000000aa; border-radius:6px; }
        .overlay-text { color:#e9edef; font-size:20px; font-weight:700; }
        .restart-btn { background:#00a884; border:none; color:#fff; padding:10px 28px; border-radius:24px; font-size:15px; cursor:pointer; }
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">🐍 Snake</span>
          <span className="game-score">Score: {score}</span>
        </div>
        <div className="game-body">
          <div className="snake-canvas" style={{ width: tamanho, height: tamanho }}>
            {snake.map((s, i) => (
              <div key={i} className="snake-cell" style={{ left: s.x * celula, top: s.y * celula, width: celula - 1, height: celula - 1, background: i === 0 ? "#00a884" : "#005c4b" }} />
            ))}
            <div className="snake-cell" style={{ left: comida.x * celula, top: comida.y * celula, width: celula - 1, height: celula - 1, background: "#ef4444", borderRadius: "50%" }} />
            {(!rodando || gameOver) && (
              <div className="overlay-msg">
                <div className="overlay-text">{gameOver ? `💀 Game Over! Score: ${score}` : "🐍 Snake"}</div>
                <button className="restart-btn" onClick={reiniciar}>{gameOver ? "Jogar de novo" : "Iniciar"}</button>
              </div>
            )}
          </div>
          <div className="controls">
            <div />
            <button className="ctrl-btn" style={{ gridColumn: 2 }} onClick={() => { if (dirRef.current.y !== 1) setDir({ x: 0, y: -1 }); }}>↑</button>
            <div />
            <button className="ctrl-btn" onClick={() => { if (dirRef.current.x !== 1) setDir({ x: -1, y: 0 }); }}>←</button>
            <button className="ctrl-btn" onClick={() => { if (dirRef.current.y !== -1) setDir({ x: 0, y: 1 }); }}>↓</button>
            <button className="ctrl-btn" onClick={() => { if (dirRef.current.x !== -1) setDir({ x: 1, y: 0 }); }}>→</button>
          </div>
        </div>
      </div>
    </>
  );
}
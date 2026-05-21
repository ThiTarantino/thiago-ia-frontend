import { useEffect, useRef, useState } from "react";

type Props = { onBack: () => void };

export default function Pong({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ p1: 150, p2: 150, bx: 200, by: 200, vx: 3, vy: 3, s1: 0, s2: 0 });
  const keys = useRef<Record<string, boolean>>({});
  const [scores, setScores] = useState({ s1: 0, s2: 0 });
  const [rodando, setRodando] = useState(false);
  const rafRef = useRef<number>(0);

  const W = 400; const H = 400; const PAD = 60; const BALL = 10; const SPEED = 4;

  function iniciar() {
    const s = state.current;
    s.p1 = 150; s.p2 = 150; s.bx = W / 2; s.by = H / 2;
    s.vx = SPEED * (Math.random() > 0.5 ? 1 : -1);
    s.vy = SPEED * (Math.random() > 0.5 ? 1 : -1);
    s.s1 = 0; s.s2 = 0;
    setScores({ s1: 0, s2: 0 });
    setRodando(true);
  }

  useEffect(() => {
    if (!rodando) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function loop() {
      const s = state.current;
      if (keys.current["w"] || keys.current["W"]) s.p1 = Math.max(0, s.p1 - 5);
      if (keys.current["s"] || keys.current["S"]) s.p1 = Math.min(H - PAD, s.p1 + 5);
      if (keys.current["ArrowUp"]) s.p2 = Math.max(0, s.p2 - 5);
      if (keys.current["ArrowDown"]) s.p2 = Math.min(H - PAD, s.p2 + 5);

      s.bx += s.vx; s.by += s.vy;
      if (s.by <= 0 || s.by >= H) s.vy *= -1;
      if (s.bx <= 20 && s.by >= s.p1 && s.by <= s.p1 + PAD) s.vx = Math.abs(s.vx);
      if (s.bx >= W - 20 && s.by >= s.p2 && s.by <= s.p2 + PAD) s.vx = -Math.abs(s.vx);

      if (s.bx < 0) { s.s2++; setScores({ s1: s.s1, s2: s.s2 }); s.bx = W / 2; s.by = H / 2; s.vx = SPEED; }
      if (s.bx > W) { s.s1++; setScores({ s1: s.s1, s2: s.s2 }); s.bx = W / 2; s.by = H / 2; s.vx = -SPEED; }

      ctx.fillStyle = "#0b141a"; ctx.fillRect(0, 0, W, H);
      ctx.setLineDash([10, 10]); ctx.strokeStyle = "#1f2c34"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#00a884"; ctx.fillRect(10, s.p1, 10, PAD);
      ctx.fillStyle = "#ef4444"; ctx.fillRect(W - 20, s.p2, 10, PAD);
      ctx.fillStyle = "#e9edef"; ctx.beginPath(); ctx.arc(s.bx, s.by, BALL, 0, Math.PI * 2); ctx.fill();

      rafRef.current = requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => { keys.current[e.key] = e.type === "keydown"; e.preventDefault(); };
    window.addEventListener("keydown", onKey); window.addEventListener("keyup", onKey);
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); };
  }, [rodando]);

  const w = Math.min(window.innerWidth - 32, W);

  return (
    <>
      <style>{`
        .game-screen { width:100%; height:100dvh; display:flex; flex-direction:column; background:#111b21; }
        .game-header { display:flex; align-items:center; gap:16px; padding:14px 16px; background:#202c33; }
        .back-btn { background:none; border:none; color:#00a884; font-size:22px; cursor:pointer; }
        .game-title { color:#e9edef; font-size:18px; font-weight:700; flex:1; }
        .game-body { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:16px; }
        .pong-scores { display:flex; gap:60px; }
        .pong-score { text-align:center; }
        .pong-score-num { font-size:36px; font-weight:700; }
        .pong-score-name { font-size:12px; color:#8696a0; }
        .pong-hint { color:#8696a0; font-size:12px; text-align:center; }
        .restart-btn { background:#00a884; border:none; color:#fff; padding:12px 32px; border-radius:24px; font-size:16px; cursor:pointer; }
        .pong-btns { display:flex; gap:24px; margin-top:8px; }
        .pong-pad-btn { background:#202c33; border:2px solid #1f2c34; color:#e9edef; font-size:20px; padding:12px 20px; border-radius:10px; cursor:pointer; }
        .pong-pad-btn:active { background:#2a3942; }
        .pong-controls { display:flex; justify-content:space-between; width:100%; max-width:400px; }
        .pong-ctrl-group { display:flex; flex-direction:column; gap:8px; align-items:center; }
        .pong-ctrl-label { font-size:11px; color:#8696a0; }
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">🏓 Pong</span>
        </div>
        <div className="game-body">
          <div className="pong-scores">
            <div className="pong-score"><div className="pong-score-num" style={{ color: "#00a884" }}>{scores.s1}</div><div className="pong-score-name">J1 (W/S)</div></div>
            <div className="pong-score"><div className="pong-score-num" style={{ color: "#ef4444" }}>{scores.s2}</div><div className="pong-score-name">J2 (↑/↓)</div></div>
          </div>
          <canvas ref={canvasRef} width={W} height={H} style={{ width: w, height: w, borderRadius: 8, border: "2px solid #1f2c34" }} />
          {!rodando && <button className="restart-btn" onClick={iniciar}>Iniciar</button>}
          <div className="pong-hint">No celular: J1 usa W/S · J2 usa ↑/↓</div>
        </div>
      </div>
    </>
  );
}
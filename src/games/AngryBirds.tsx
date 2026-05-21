import { useRef, useEffect, useState } from "react";

type Props = { onBack: () => void };

export default function AngryBirds({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [msg, setMsg] = useState("");
  const state = useRef({ bird: { x: 80, y: 300, vx: 0, vy: 0, ativo: false }, pigs: [{ x: 320, y: 320, r: 20 }, { x: 370, y: 290, r: 18 }], drag: false, sx: 80, sy: 300, score: 0 });
  const rafRef = useRef(0);
  const W = 400; const H = 400;

  function iniciar() {
    const s = state.current;
    s.bird = { x: 80, y: 300, vx: 0, vy: 0, ativo: false };
    s.pigs = [{ x: 320, y: 320, r: 20 }, { x: 370, y: 290, r: 18 }];
    s.score = 0;
    setScore(0); setMsg(""); setRodando(true);
  }

  useEffect(() => {
    if (!rodando) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function dist(a: { x: number; y: number }, b: { x: number; y: number }) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2); }

    function loop() {
      const s = state.current;
      ctx.fillStyle = "#0b141a"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#1f2c34"; ctx.fillRect(0, 360, W, 40);

      // Estilingue
      ctx.strokeStyle = "#8B4513"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(70, 320); ctx.lineTo(s.bird.x, s.bird.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(90, 320); ctx.lineTo(s.bird.x, s.bird.y); ctx.stroke();

      // Pássaro
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.arc(s.bird.x, s.bird.y, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.bird.x - 5, s.bird.y - 4, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(s.bird.x - 4, s.bird.y - 4, 2, 0, Math.PI * 2); ctx.fill();

      // Porcos
      s.pigs.forEach(p => {
        ctx.fillStyle = "#22c55e"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "14px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("🐷", p.x, p.y + 5);
      });

      if (s.bird.ativo) {
        s.bird.vy += 0.4;
        s.bird.x += s.bird.vx; s.bird.y += s.bird.vy;
        s.pigs = s.pigs.filter(p => {
          if (dist(s.bird, p) < p.r + 18) { s.score += 100; setScore(s.score); return false; }
          return true;
        });
        if (s.bird.y > 360 || s.bird.x > W) {
          if (s.pigs.length === 0) { setMsg("🎉 Você acertou todos!"); setRodando(false); }
          else { s.bird = { x: 80, y: 300, vx: 0, vy: 0, ativo: false }; }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    }

    function getPos(e: MouseEvent | TouchEvent) {
      const r = canvas.getBoundingClientRect();
      const scaleX = W / r.width; const scaleY = H / r.height;
      if ("touches" in e) return { x: (e.touches[0].clientX - r.left) * scaleX, y: (e.touches[0].clientY - r.top) * scaleY };
      return { x: (e.clientX - r.left) * scaleX, y: (e.clientY - r.top) * scaleY };
    }

    function onStart(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      const pos = getPos(e);
      const s = state.current;
      if (!s.bird.ativo && Math.abs(pos.x - s.bird.x) < 30 && Math.abs(pos.y - s.bird.y) < 30) s.drag = true;
    }
    function onMove(e: MouseEvent | TouchEvent) {
      e.preventDefault();
      const s = state.current;
      if (!s.drag) return;
      const pos = getPos(e);
      s.bird.x = Math.max(40, Math.min(120, pos.x));
      s.bird.y = Math.max(250, Math.min(350, pos.y));
    }
    function onEnd() {
      const s = state.current;
      if (!s.drag) return;
      s.drag = false;
      s.bird.vx = (s.sx - s.bird.x) * 0.18;
      s.bird.vy = (s.sy - s.bird.y) * 0.18;
      s.bird.ativo = true;
    }

    canvas.addEventListener("mousedown", onStart); canvas.addEventListener("mousemove", onMove); canvas.addEventListener("mouseup", onEnd);
    canvas.addEventListener("touchstart", onStart, { passive: false }); canvas.addEventListener("touchmove", onMove, { passive: false }); canvas.addEventListener("touchend", onEnd);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousedown", onStart); canvas.removeEventListener("mousemove", onMove); canvas.removeEventListener("mouseup", onEnd);
      canvas.removeEventListener("touchstart", onStart); canvas.removeEventListener("touchmove", onMove); canvas.removeEventListener("touchend", onEnd);
    };
  }, [rodando]);

  const w = Math.min(window.innerWidth - 32, W);

  return (
    <>
      <style>{`
        .game-screen { width:100%; height:100dvh; display:flex; flex-direction:column; background:#111b21; }
        .game-header { display:flex; align-items:center; gap:16px; padding:14px 16px; background:#202c33; }
        .back-btn { background:none; border:none; color:#00a884; font-size:22px; cursor:pointer; }
        .game-title { color:#e9edef; font-size:18px; font-weight:700; flex:1; }
        .game-score-txt { color:#00a884; font-weight:700; }
        .game-body { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:16px; }
        .birds-hint { color:#8696a0; font-size:13px; text-align:center; }
        .restart-btn { background:#00a884; border:none; color:#fff; padding:12px 32px; border-radius:24px; font-size:16px; cursor:pointer; }
        .win-msg { color:#00a884; font-size:20px; font-weight:700; }
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">🐦 Angry Birds</span>
          <span className="game-score-txt">{score} pts</span>
        </div>
        <div className="game-body">
          {msg ? <>
            <div className="win-msg">{msg}</div>
            <button className="restart-btn" onClick={iniciar}>Jogar de novo</button>
          </> : <>
            <canvas ref={canvasRef} width={W} height={H} style={{ width: w, height: w, borderRadius: 8, border: "2px solid #1f2c34", touchAction: "none" }} />
            <div className="birds-hint">Arraste o pássaro vermelho e solte para atirar!</div>
            {!rodando && <button className="restart-btn" onClick={iniciar}>Iniciar</button>}
          </>}
        </div>
      </div>
    </>
  );
}
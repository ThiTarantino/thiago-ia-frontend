import { useEffect, useRef, useState } from "react";

type Props = { onBack: () => void };

const W = 360; const H = 500; const PAD = 60; const BALL = 8; const SPEED = 4;
const BLOCK_ROWS = 4; const BLOCK_COLS = 8;

type Block = { x: number; y: number; w: number; h: number; ativo: boolean; player: number };

// Opção 2: Função corrigida para retornar uma lista simples (Block[])
function criarBlocos(player: number): Block[] {
  const blocos: Block[] = [];
  for (let r = 0; r < BLOCK_ROWS; r++) {
    for (let c = 0; c < BLOCK_COLS; c++) {
      blocos.push({
        x: c * (W / BLOCK_COLS) + 4,
        y: (player === 1 ? 20 : H - 80) + r * 22 * (player === 1 ? 1 : -1),
        w: W / BLOCK_COLS - 8,
        h: 16,
        ativo: true,
        player
      });
    }
  }
  return blocos;
}

export default function BlockBreaker({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Tipagem atualizada para aceitar arrays de uma dimensão (Block[])
  const state = useRef<{
    p1y: number; p2y: number;
    bx: number; by: number; vx: number; vy: number;
    blocks1: Block[]; blocks2: Block[];
    s1: number; s2: number; alive: boolean;
  }>({
    p1y: H - 20, p2y: 20,
    bx: W / 2, by: H / 2, vx: SPEED, vy: SPEED,
    blocks1: criarBlocos(1), blocks2: criarBlocos(2),
    s1: 0, s2: 0, alive: true
  });

  const keys = useRef<Record<string, boolean>>({});
  const rafRef = useRef(0);
  const [scores, setScores] = useState({ s1: 0, s2: 0 });
  const [rodando, setRodando] = useState(false);
  const [vencedor, setVencedor] = useState("");

  function iniciar() {
    state.current = { 
      p1y: W / 2 - PAD / 2, p2y: W / 2 - PAD / 2, 
      bx: W / 2, by: H / 2, vx: SPEED, vy: SPEED, 
      blocks1: criarBlocos(1), blocks2: criarBlocos(2), 
      s1: 0, s2: 0, alive: true 
    };
    setScores({ s1: 0, s2: 0 }); setVencedor(""); setRodando(true);
  }

  useEffect(() => {
    if (!rodando) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    function loop() {
      const s = state.current;
      if (!s.alive) return;

      if (keys.current["a"]) s.p1y = Math.max(0, s.p1y - 5);
      if (keys.current["d"]) s.p1y = Math.min(W - PAD, s.p1y + 5);
      if (keys.current["ArrowLeft"]) s.p2y = Math.max(0, s.p2y - 5);
      if (keys.current["ArrowRight"]) s.p2y = Math.min(W - PAD, s.p2y + 5);

      s.bx += s.vx; s.by += s.vy;
      if (s.bx < BALL || s.bx > W - BALL) s.vx *= -1;
      
      // raquete P1 (baixo)
      if (s.by > H - 25 && s.bx >= s.p1y && s.bx <= s.p1y + PAD) s.vy = -Math.abs(s.vy);
      // raquete P2 (cima)
      if (s.by < 25 && s.bx >= s.p2y && s.bx <= s.p2y + PAD) s.vy = Math.abs(s.vy);

      // blocos P1 - Agora o .forEach funciona perfeitamente!
      s.blocks1.forEach(b => {
        if (!b.ativo) return;
        if (s.bx > b.x && s.bx < b.x + b.w && s.by > b.y && s.by < b.y + b.h) {
          b.ativo = false; s.vy *= -1; s.s2++; setScores({ s1: s.s1, s2: s.s2 });
        }
      });
      
      // blocos P2
      s.blocks2.forEach(b => {
        if (!b.ativo) return;
        if (s.bx > b.x && s.bx < b.x + b.w && s.by > b.y && s.by < b.y + b.h) {
          b.ativo = false; s.vy *= -1; s.s1++; setScores({ s1: s.s1, s2: s.s2 });
        }
      });

      if (s.by < 0) { s.alive = false; setVencedor("Jogador 1"); setRodando(false); return; }
      if (s.by > H) { s.alive = false; setVencedor("Jogador 2"); setRodando(false); return; }
      if (!s.blocks1.some(b => b.ativo)) { s.alive = false; setVencedor("Jogador 2"); setRodando(false); return; }
      if (!s.blocks2.some(b => b.ativo)) { s.alive = false; setVencedor("Jogador 1"); setRodando(false); return; }

      ctx.fillStyle = "#0b141a"; ctx.fillRect(0, 0, W, H);
      
      // Desenho dos blocos
      [...s.blocks1, ...s.blocks2].forEach(b => {
        if (!b.ativo) return;
        ctx.fillStyle = b.player === 1 ? "#00a884" : "#ef4444";
        ctx.fillRect(b.x, b.y, b.w, b.h); ctx.fillStyle = "#0b141a"; ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
        ctx.fillStyle = b.player === 1 ? "#00a88488" : "#ef444488"; ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
      });
      
      // raquetes
      ctx.fillStyle = "#00a884"; ctx.fillRect(s.p1y, H - 18, PAD, 10);
      ctx.fillStyle = "#ef4444"; ctx.fillRect(s.p2y, 8, PAD, 10);
      // bola
      ctx.fillStyle = "#ffd700"; ctx.beginPath(); ctx.arc(s.bx, s.by, BALL, 0, Math.PI * 2); ctx.fill();
      // labels
      ctx.fillStyle = "#00a88488"; ctx.font = "11px sans-serif"; ctx.textAlign = "left"; ctx.fillText("J1: A/D", 4, H - 4);
      ctx.fillStyle = "#ef444488"; ctx.fillText("J2: ←/→", 4, 14);

      rafRef.current = requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => { keys.current[e.key] = e.type === "keydown"; if (["ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault(); };
    window.addEventListener("keydown", onKey); window.addEventListener("keyup", onKey);
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); };
  }, [rodando]);

  const w = Math.min(window.innerWidth - 32, W);
  return (
    <>
      <style>{`
        .game-screen{width:100%;height:100dvh;display:flex;flex-direction:column;background:#111b21}
        .game-header{display:flex;align-items:center;gap:16px;padding:14px 16px;background:#202c33}
        .back-btn{background:none;border:none;color:#00a884;font-size:22px;cursor:pointer}
        .game-title{color:#e9edef;font-size:18px;font-weight:700;flex:1}
        .game-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:8px}
        .scores{display:flex;gap:32px}
        .score-box{text-align:center}
        .score-name{color:#8696a0;font-size:12px}
        .score-num{font-size:24px;font-weight:800}
        .restart-btn{background:#00a884;border:none;color:#fff;padding:12px 32px;border-radius:24px;font-size:16px;cursor:pointer}
        .venc{font-size:22px;font-weight:700}
        .hint{color:#8696a0;font-size:11px;text-align:center}
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">🧱 Quebra Blocos</span>
        </div>
        <div className="game-body">
          <div className="scores">
            <div className="score-box"><div className="score-name">J1</div><div className="score-num" style={{ color: "#00a884" }}>{scores.s1}</div></div>
            <div className="score-box"><div className="score-name">J2</div><div className="score-num" style={{ color: "#ef4444" }}>{scores.s2}</div></div>
          </div>
          <canvas ref={canvasRef} width={W} height={H} style={{ width: w, height: w * H / W, borderRadius: 8, border: "2px solid #1f2c34" }} />
          {!rodando && (
            <>
              {vencedor && <div className="venc" style={{ color: "#00a884" }}>🏆 {vencedor} venceu!</div>}
              <button className="restart-btn" onClick={iniciar}>{vencedor ? "Jogar de novo" : "Iniciar"}</button>
              <div className="hint">J1: A/D (baixo) · J2: ←/→ (cima) · Destrua os blocos do adversário!</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
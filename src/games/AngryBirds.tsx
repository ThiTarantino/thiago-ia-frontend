import { useEffect, useRef, useState } from "react";
type Props = { onBack: () => void };

// ─── constants ───────────────────────────────────────────────────────────────
const W = 390;
const H = 580;
const BIRD_X = 85;
const GAP = 150;
const PIPE_W = 56;
const GRAVITY = 0.30;
const JUMP_V = -6.4;
const GROUND_H = 72;
const BIRD_R = 14; // collision radius

// ─── types ───────────────────────────────────────────────────────────────────
interface Pipe   { x: number; gapTop: number; passed: boolean }
interface Puff   { x: number; y: number; vx: number; vy: number; life: number; r: number; color: string }
interface Cloud  { x: number; y: number; w: number; spd: number }

// ─── pure draw helpers (no state) ────────────────────────────────────────────
function drawSky(ctx: CanvasRenderingContext2D, score: number) {
  // sky shifts from day blue → sunset → night as score grows
  const t = Math.min(score / 25, 1);
  const topR = Math.round(30  + t * 120);
  const topG = Math.round(100 - t * 60);
  const topB = Math.round(200 - t * 100);
  const botR = Math.round(80  + t * 100);
  const botG = Math.round(160 - t * 80);
  const botB = Math.round(220 - t * 80);
  const g = ctx.createLinearGradient(0, 0, 0, H - GROUND_H);
  g.addColorStop(0,   `rgb(${topR},${topG},${topB})`);
  g.addColorStop(1,   `rgb(${botR},${botG},${botB})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H - GROUND_H);
}

function drawClouds(ctx: CanvasRenderingContext2D, clouds: Cloud[]) {
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  for (const c of clouds) {
    const { x, y, w } = c;
    ctx.beginPath();
    ctx.arc(x,           y,       w * 0.30, 0, Math.PI * 2);
    ctx.arc(x + w * 0.3, y - w * 0.13, w * 0.24, 0, Math.PI * 2);
    ctx.arc(x + w * 0.6, y,       w * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPipes(ctx: CanvasRenderingContext2D, pipes: Pipe[]) {
  for (const p of pipes) {
    const { x, gapTop } = p;
    const topH  = gapTop;
    const botY  = gapTop + GAP;
    const botH  = H - GROUND_H - botY;
    const capH  = 18;

    // helper: one pipe segment
    function seg(px: number, py: number, pw: number, ph: number, capAtBottom: boolean) {
      if (ph <= 0) return;
      // body
      const bg = ctx.createLinearGradient(px, 0, px + pw, 0);
      bg.addColorStop(0,    "#1c6e38");
      bg.addColorStop(0.3,  "#28a04e");
      bg.addColorStop(0.65, "#33c05e");
      bg.addColorStop(1,    "#1c6e38");
      ctx.fillStyle = bg;
      ctx.fillRect(px + 6, py, pw - 12, ph);

      // cap
      const capY = capAtBottom ? py + ph - capH : py;
      const cg = ctx.createLinearGradient(px, 0, px + pw, 0);
      cg.addColorStop(0,    "#145029");
      cg.addColorStop(0.35, "#1e8040");
      cg.addColorStop(0.65, "#28a04e");
      cg.addColorStop(1,    "#145029");
      ctx.fillStyle = cg;
      ctx.beginPath();
      if (capAtBottom) {
        ctx.roundRect(px, capY, pw, capH, [0, 0, 5, 5]);
      } else {
        ctx.roundRect(px, capY, pw, capH, [5, 5, 0, 0]);
      }
      ctx.fill();

      // highlight stripe
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.fillRect(px + 12, py, 8, ph);
    }

    seg(x, 0,    PIPE_W, topH, true);   // top pipe
    seg(x, botY, PIPE_W, botH, false);  // bottom pipe
  }
}

function drawGround(ctx: CanvasRenderingContext2D, scrollX: number) {
  const y = H - GROUND_H;
  // dirt
  const g = ctx.createLinearGradient(0, y, 0, H);
  g.addColorStop(0,    "#5c8c1c");
  g.addColorStop(0.12, "#4a7a14");
  g.addColorStop(0.22, "#8B6410");
  g.addColorStop(1,    "#4a3208");
  ctx.fillStyle = g;
  ctx.fillRect(0, y, W, GROUND_H);

  // grass top strip
  ctx.fillStyle = "#6aaa22";
  ctx.fillRect(0, y, W, 7);

  // scrolling tile lines
  ctx.strokeStyle = "rgba(0,0,0,0.10)";
  ctx.lineWidth = 1;
  const tileW = 44;
  const offset = (-(scrollX % tileW) + tileW) % tileW;
  for (let i = -1; i < W / tileW + 2; i++) {
    const tx = offset + i * tileW;
    ctx.strokeRect(tx, y + 8, tileW, 28);
  }
}

function drawBird(
  ctx: CanvasRenderingContext2D,
  by: number, bvy: number,
  wingPhase: number,
  dead: boolean
) {
  const tilt = dead
    ? Math.PI * 0.55
    : Math.max(-0.42, Math.min(0.95, bvy * 0.052));

  ctx.save();
  ctx.translate(BIRD_X, by);
  ctx.rotate(tilt);

  // shadow under bird
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  ctx.beginPath();
  ctx.ellipse(2, 16, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // tail
  ctx.fillStyle = "#c86800";
  ctx.beginPath();
  ctx.moveTo(-15, 2);
  ctx.lineTo(-27, -3);
  ctx.lineTo(-26, 8);
  ctx.closePath();
  ctx.fill();

  // wing (behind body)
  const wFold = Math.sin(wingPhase) * 0.6; // -0.6 to +0.6 rad
  ctx.save();
  ctx.translate(-3, 2);
  ctx.rotate(wFold);
  const wGrad = ctx.createLinearGradient(0, 0, 0, 16);
  wGrad.addColorStop(0, "#ffc800");
  wGrad.addColorStop(1, "#b86000");
  ctx.fillStyle = wGrad;
  ctx.beginPath();
  ctx.ellipse(0, 7, 8, 14, -0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // body
  const bodyGrad = ctx.createRadialGradient(-3, -5, 1, 0, 0, 19);
  bodyGrad.addColorStop(0,   "#fff0a0");
  bodyGrad.addColorStop(0.5, "#ffcc00");
  bodyGrad.addColorStop(1,   "#dd8800");
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // belly
  ctx.fillStyle = "#fff8d0";
  ctx.beginPath();
  ctx.ellipse(4, 4, 9, 7, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // eye white
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(9, -5, 6, 0, Math.PI * 2);
  ctx.fill();
  // pupil — looks slightly forward
  ctx.fillStyle = "#111";
  ctx.beginPath();
  ctx.arc(10.5, -5, 3.2, 0, Math.PI * 2);
  ctx.fill();
  // gleam
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(11.8, -6.5, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // beak
  ctx.fillStyle = "#ff7000";
  ctx.beginPath();
  ctx.moveTo(17, -3);
  ctx.lineTo(29, 0);
  ctx.lineTo(17, 5);
  ctx.closePath();
  ctx.fill();
  // beak lower jaw line
  ctx.fillStyle = "#cc4400";
  ctx.beginPath();
  ctx.moveTo(17, 1);
  ctx.lineTo(28, 0.5);
  ctx.lineTo(28, 3);
  ctx.lineTo(17, 4);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawPuffs(ctx: CanvasRenderingContext2D, puffs: Puff[]) {
  for (const p of puffs) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / 40);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ─── component ───────────────────────────────────────────────────────────────
export default function FlappyBird({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const phaseRef  = useRef<"idle" | "playing" | "dying" | "dead">("idle");
  const bestRef   = useRef(0);

  // All mutable game state in ONE ref — no stale closure issues
  const S = useRef({
    by: H / 2, bvy: 0,
    pipes:  [] as Pipe[],
    puffs:  [] as Puff[],
    clouds: [] as Cloud[],
    score: 0, frame: 0,
    scrollX: 0,
    wingPhase: 0,
    flashFrames: 0,
  });

  // React state only for UI rendering
  const [uiScore, setUiScore] = useState(0);
  const [uiBest,  setUiBest]  = useState(0);
  const [uiPhase, setUiPhase] = useState<"menu" | "playing" | "dead">("menu");

  // ── spawn helpers ─────────────────────────────────────
  function spawnPuffs(x: number, y: number) {
    const palette = ["#ffe066","#ffaa00","#ff5500","#ff2222","#ffffff","#ffdd88"];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd   = 1 + Math.random() * 5.5;
      S.current.puffs.push({
        x, y,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd - 2,
        life: 20 + Math.random() * 20,
        r: 2 + Math.random() * 5,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }
  }

  function makeClouds(): Cloud[] {
    return Array.from({ length: 6 }, (_, i) => ({
      x:   (W / 6) * i + Math.random() * 40,
      y:   30 + Math.random() * 140,
      w:   55 + Math.random() * 80,
      spd: 0.2 + Math.random() * 0.4,
    }));
  }

  function firstPipe(): Pipe[] {
    return [
      { x: W + 60,        gapTop: 80 + Math.random() * (H - GROUND_H - GAP - 120), passed: false },
      { x: W + 60 + 240,  gapTop: 80 + Math.random() * (H - GROUND_H - GAP - 120), passed: false },
    ];
  }

  // ── jump (called from input handlers) ────────────────
  function jump() {
    if (phaseRef.current !== "playing") return;
    S.current.bvy = JUMP_V;
    S.current.wingPhase = -Math.PI / 2; // snap wing up on flap
  }

  // ── start ─────────────────────────────────────────────
  function startGame() {
    S.current = {
      by: H * 0.42, bvy: 0,
      pipes:  firstPipe(),
      puffs:  [],
      clouds: makeClouds(),
      score: 0, frame: 0,
      scrollX: 0,
      wingPhase: 0,
      flashFrames: 0,
    };
    setUiScore(0);
    phaseRef.current = "playing";
    setUiPhase("playing");
  }

  // ── main loop (runs once, reads phaseRef for state) ──
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    // init idle state
    S.current.clouds = makeClouds();
    S.current.pipes  = firstPipe();
    S.current.by     = H * 0.42;

    function tick() {
      const s     = S.current;
      const phase = phaseRef.current;
      s.frame++;

      // ── update ────────────────────────────────────────
      if (phase === "playing") {
        const speed = Math.min(2.2 + s.score * 0.06, 6.0);

        // physics
        s.bvy += GRAVITY;
        s.by  += s.bvy;

        // wing
        s.wingPhase += 0.18;

        // scroll
        s.scrollX += speed;

        // clouds (parallax)
        for (const c of s.clouds) {
          c.x -= c.spd;
          if (c.x < -(c.w + 20)) {
            c.x = W + c.w + 10;
            c.y = 30 + Math.random() * 140;
            c.w = 55 + Math.random() * 80;
          }
        }

        // pipes
        for (const p of s.pipes) p.x -= speed;

        // remove off-screen pipes, spawn new one
        if (s.pipes.length > 0 && s.pipes[0].x < -PIPE_W - 10) {
          s.pipes.shift();
        }
        // keep 2 pipes ahead
        while (s.pipes.length < 2) {
          const lastX = s.pipes.length > 0
            ? s.pipes[s.pipes.length - 1].x
            : W + 60;
          s.pipes.push({
            x: lastX + 240,
            gapTop: 80 + Math.random() * (H - GROUND_H - GAP - 120),
            passed: false,
          });
        }

        // scoring
        for (const p of s.pipes) {
          if (!p.passed && p.x + PIPE_W < BIRD_X) {
            p.passed = true;
            s.score++;
            setUiScore(s.score);
            if (s.score > bestRef.current) {
              bestRef.current = s.score;
              setUiBest(s.score);
            }
          }
        }

        // ── collision ──────────────────────────────────
        let hit = false;

        // ground / ceiling
        if (s.by + BIRD_R > H - GROUND_H || s.by - BIRD_R < 0) hit = true;

        // pipes (shrink hitbox a little for fairness)
        if (!hit) {
          for (const p of s.pipes) {
            const birdLeft  = BIRD_X - BIRD_R + 3;
            const birdRight = BIRD_X + BIRD_R - 3;
            const pipeLeft  = p.x + 4;
            const pipeRight = p.x + PIPE_W - 4;
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
              const birdTop = s.by - BIRD_R + 3;
              const birdBot = s.by + BIRD_R - 3;
              if (birdTop < p.gapTop || birdBot > p.gapTop + GAP) {
                hit = true;
                break;
              }
            }
          }
        }

        if (hit) {
          spawnPuffs(BIRD_X, s.by);
          s.flashFrames = 10;
          s.bvy = JUMP_V * 0.3; // small bounce on death
          phaseRef.current = "dying";
          setTimeout(() => {
            phaseRef.current = "dead";
            setUiPhase("dead");
          }, 900);
        }
      }

      if (phase === "dying") {
        s.bvy += GRAVITY * 1.6;
        s.by = Math.min(H - GROUND_H - BIRD_R, s.by + s.bvy);
        if (s.flashFrames > 0) s.flashFrames--;
      }

      if (phase === "idle") {
        // gentle bob
        s.by = H * 0.42 + Math.sin(s.frame * 0.055) * 14;
        s.wingPhase += 0.12;
        for (const c of s.clouds) {
          c.x -= c.spd * 0.6;
          if (c.x < -(c.w + 20)) { c.x = W + c.w + 10; c.y = 30 + Math.random() * 140; }
        }
      }

      // puffs (always update)
      for (const p of s.puffs) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.28;
        p.life--;
      }
      s.puffs = s.puffs.filter(p => p.life > 0);

      // ── draw ──────────────────────────────────────────
      // flash overlay (red screen on hit)
      if (s.flashFrames > 0 && s.flashFrames % 2 === 0) {
        ctx.fillStyle = "rgba(255,60,60,0.45)";
        ctx.fillRect(0, 0, W, H);
      } else {
        drawSky(ctx, s.score);
        drawClouds(ctx, s.clouds);
        drawPipes(ctx, s.pipes);
        drawGround(ctx, s.scrollX);
      }

      drawPuffs(ctx, s.puffs);

      const isDead = phase === "dying" || phase === "dead";
      drawBird(ctx, s.by, s.bvy, s.wingPhase, isDead);

      // score on canvas (only while playing / dying)
      if (phase === "playing" || phase === "dying") {
        ctx.save();
        ctx.font         = "900 42px 'Orbitron', monospace";
        ctx.textAlign    = "center";
        ctx.lineWidth    = 6;
        ctx.strokeStyle  = "rgba(0,0,0,0.45)";
        ctx.strokeText(String(s.score), W / 2, 68);
        ctx.fillStyle    = "#ffffff";
        ctx.fillText(String(s.score), W / 2, 68);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // runs ONCE — all state via refs

  // responsive sizing
  const cw = typeof window !== "undefined" ? Math.min(window.innerWidth, W) : W;
  const ch = Math.round(cw * H / W);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Nunito:wght@800;900&display=swap');
        :root { --gold:#f9a825; --dark:#0a1628; --panel:rgba(8,18,36,0.92); }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .fb-root {
          width:100%; height:100dvh;
          display:flex; flex-direction:column;
          background:var(--dark);
          font-family:'Nunito',sans-serif;
          overflow:hidden;
          user-select:none; -webkit-user-select:none;
        }

        /* ── header ── */
        .fb-header {
          display:flex; align-items:center; gap:10px;
          padding:0 10px; height:52px; min-height:52px; flex-shrink:0;
          background:rgba(0,0,0,0.55);
          border-bottom:1px solid rgba(255,255,255,0.06);
          backdrop-filter:blur(10px);
          position:relative; z-index:20;
        }
        .fb-back {
          background:none; border:none;
          color:rgba(255,255,255,0.45); cursor:pointer;
          padding:10px; display:flex; align-items:center; justify-content:center;
          border-radius:50%; -webkit-tap-highlight-color:transparent;
          transition:color .15s;
        }
        .fb-back:hover { color:#fff; }
        .fb-title {
          font-family:'Orbitron',monospace; color:#fff;
          font-size:15px; font-weight:900; flex:1;
          letter-spacing:2px;
          text-shadow:0 0 24px rgba(249,168,37,0.7);
        }
        .fb-best {
          font-family:'Orbitron',monospace;
          color:var(--gold); font-size:13px; font-weight:700;
        }

        /* ── canvas area ── */
        .fb-wrap {
          flex:1; position:relative;
          display:flex; align-items:flex-start; justify-content:center;
          overflow:hidden;
          touch-action:none;
        }
        canvas { display:block; }

        /* ── overlays ── */
        .fb-overlay {
          position:absolute; inset:0;
          display:flex; align-items:center; justify-content:center;
          z-index:10; pointer-events:none;
        }
        .fb-card {
          pointer-events:all;
          background:var(--panel);
          border:1px solid rgba(255,255,255,0.10);
          border-radius:24px;
          padding:30px 28px;
          display:flex; flex-direction:column; align-items:center; gap:18px;
          width:min(86%, 290px);
          backdrop-filter:blur(20px);
          box-shadow:0 28px 70px rgba(0,0,0,0.6);
          animation:cardPop .32s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes cardPop {
          from { opacity:0; transform:scale(0.82) translateY(16px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }

        .fb-emoji  { font-size:54px; line-height:1; filter:drop-shadow(0 4px 14px rgba(249,168,37,0.55)); }
        .fb-gtitle {
          font-family:'Orbitron',monospace; color:#fff;
          font-size:26px; font-weight:900; letter-spacing:3px;
          text-shadow:0 0 32px rgba(249,168,37,0.65);
        }
        .fb-lbl    { color:rgba(255,255,255,0.4); font-size:11px; font-weight:800; letter-spacing:2px; text-transform:uppercase; }
        .fb-snum   { font-family:'Orbitron',monospace; color:var(--gold); font-size:66px; font-weight:900; line-height:1; text-shadow:0 4px 22px rgba(249,168,37,0.45); }
        .fb-brow   { display:flex; align-items:center; gap:8px; color:rgba(255,255,255,0.5); font-size:13px; font-weight:800; }
        .fb-brow b { color:var(--gold); }

        .fb-btn {
          background:linear-gradient(135deg, #f9a825, #e65000);
          border:none; color:#fff;
          font-family:'Orbitron',monospace; font-size:14px; font-weight:700; letter-spacing:2px;
          padding:14px 0; border-radius:50px; cursor:pointer; width:100%;
          box-shadow:0 6px 26px rgba(249,168,37,0.48);
          transition:transform .12s, box-shadow .12s;
          -webkit-tap-highlight-color:transparent;
        }
        .fb-btn:active { transform:scale(0.94); box-shadow:0 2px 10px rgba(249,168,37,0.28); }

        .fb-hint { color:rgba(255,255,255,0.28); font-size:11px; font-weight:700; letter-spacing:1px; text-align:center; }

        .fb-tap {
          position:absolute; bottom:20px; left:50%; transform:translateX(-50%);
          color:rgba(255,255,255,0.38); font-size:12px; font-weight:800; letter-spacing:1px;
          pointer-events:none;
          animation:blink 1.5s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:0.35} 50%{opacity:0.9} }
      `}</style>

      <div className="fb-root">
        <header className="fb-header">
          <button className="fb-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <span className="fb-title">FLAPPY</span>
          {uiBest > 0 && <span className="fb-best">🏆 {uiBest}</span>}
        </header>

        <div
          className="fb-wrap"
          onClick={() => {
            if (uiPhase === "playing") { jump(); }
            else if (uiPhase === "dead") { startGame(); }
          }}
          onTouchStart={e => {
            e.preventDefault();
            if (uiPhase === "playing") { jump(); }
            else if (uiPhase === "dead") { startGame(); }
          }}
        >
          <canvas ref={canvasRef} width={W} height={H} style={{ width: cw, height: ch }} />

          {/* MENU */}
          {uiPhase === "menu" && (
            <div className="fb-overlay">
              <div className="fb-card">
                <div className="fb-emoji">🐤</div>
                <div className="fb-gtitle">FLAPPY</div>
                <div className="fb-hint">TOQUE NA TELA OU PRESSIONE ESPAÇO</div>
                <button className="fb-btn" onClick={e => { e.stopPropagation(); startGame(); }}>
                  ▶ JOGAR
                </button>
              </div>
            </div>
          )}

          {/* DEAD */}
          {uiPhase === "dead" && (
            <div className="fb-overlay">
              <div className="fb-card">
                <div className="fb-lbl">PONTUAÇÃO</div>
                <div className="fb-snum">{uiScore}</div>
                <div className="fb-brow">🏆 Recorde: <b>{uiBest}</b></div>
                <button className="fb-btn" onClick={e => { e.stopPropagation(); startGame(); }}>
                  ↺ TENTAR DE NOVO
                </button>
              </div>
            </div>
          )}

          {uiPhase === "playing" && (
            <div className="fb-tap">TOQUE PARA VOAR</div>
          )}
        </div>
      </div>
    </>
  );
}
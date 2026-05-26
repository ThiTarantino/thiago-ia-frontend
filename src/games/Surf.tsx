import { useEffect, useRef, useState, useCallback } from "react";
type Props = { onBack: () => void };

const W = 360;
const H = 560;

interface Obstacle {
  x: number; y: number; w: number; h: number; type: "rock" | "buoy" | "shark";
}
interface Wave {
  x: number; y: number; speed: number; amp: number; phase: number;
}
interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; maxLife: number;
  color: string; size: number;
}
interface PowerUp {
  x: number; y: number; type: "shield" | "slowmo";
}

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }

export default function Surf({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rodando = useRef(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [gameState, setGameState] = useState<"menu" | "playing" | "dead">("menu");
  const [hiScore, setHiScore] = useState(0);
  const keysRef = useRef<Record<string, boolean>>({});
  const touchRef = useRef<{ id: number; startX: number; x: number } | null>(null);

  const gameRef = useRef({
    x: W / 2, y: H - 120, vx: 0,
    obs: [] as Obstacle[],
    waves: [] as Wave[],
    particles: [] as Particle[],
    powerups: [] as PowerUp[],
    score: 0,
    speed: 2.5,
    frame: 0,
    shieldTime: 0,
    slowmoTime: 0,
    combo: 0,
    waveOffset: 0,
    alive: true,
    trail: [] as { x: number; y: number }[],
  });

  function spawnParticles(x: number, y: number, color: string, n: number) {
    const g = gameRef.current;
    for (let i = 0; i < n; i++) {
      g.particles.push({
        x, y,
        vx: rand(-3, 3), vy: rand(-4, 0),
        life: 30, maxLife: 30,
        color, size: rand(2, 6),
      });
    }
  }

  function spawnSplash(x: number, y: number) {
    const g = gameRef.current;
    for (let i = 0; i < 8; i++) {
      const angle = rand(0, Math.PI * 2);
      const speed = rand(1, 4);
      g.particles.push({
        x, y,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
        life: 20, maxLife: 20,
        color: "#88ccff", size: rand(2, 5),
      });
    }
  }

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.x = W / 2; g.y = H - 120; g.vx = 0;
    g.obs = []; g.particles = []; g.powerups = [];
    g.score = 0; g.speed = 2.5; g.frame = 0;
    g.shieldTime = 0; g.slowmoTime = 0; g.combo = 0;
    g.waveOffset = 0; g.alive = true; g.trail = [];
    // init background waves
    g.waves = Array.from({ length: 5 }, (_, i) => ({
      x: 0, y: (H / 5) * i,
      speed: rand(0.3, 0.8), amp: rand(8, 18), phase: rand(0, Math.PI * 2),
    }));
    rodando.current = true;
    setGameState("playing");
    setDisplayScore(0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let raf = 0;
    const hiRef = { val: 0 };

    function drawBackground(frame: number, waveOffset: number) {
      // Deep ocean gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#001a3a");
      grad.addColorStop(0.4, "#003366");
      grad.addColorStop(1, "#004488");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Animated wave stripes
      for (let i = 0; i < 12; i++) {
        const y = ((frame * 1.5 + i * 55) % (H + 80)) - 30;
        const alpha = 0.03 + (i % 3) * 0.02;
        ctx.fillStyle = `rgba(100, 180, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= W; x += 6) {
          ctx.lineTo(x, y + Math.sin(x * 0.04 + frame * 0.04 + i) * 8);
        }
        ctx.lineTo(W, y + 40); ctx.lineTo(0, y + 40);
        ctx.closePath();
        ctx.fill();
      }

      // Foam/sparkle dots
      for (let i = 0; i < 8; i++) {
        const fx = (i * 137 + frame * 0.7) % W;
        const fy = ((i * 73 + frame * 1.2) % H);
        ctx.fillStyle = `rgba(255,255,255,${0.1 + Math.sin(frame * 0.05 + i) * 0.05})`;
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sun reflection
      const sunY = H * 0.15;
      const sunGrad = ctx.createRadialGradient(W / 2, sunY, 0, W / 2, sunY, 80);
      sunGrad.addColorStop(0, "rgba(255, 220, 100, 0.15)");
      sunGrad.addColorStop(1, "rgba(255, 200, 0, 0)");
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, W, H);

      // Reflection line
      ctx.strokeStyle = "rgba(255, 220, 100, 0.08)";
      ctx.lineWidth = 60;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 10, 0); ctx.lineTo(W / 2 + 10, H);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    function drawObstacle(o: Obstacle) {
      ctx.save();
      ctx.translate(o.x, o.y);
      if (o.type === "rock") {
        // Rock shadow
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.beginPath();
        ctx.ellipse(2, 4, o.w / 2 + 2, o.h / 2 + 2, 0, 0, Math.PI * 2);
        ctx.fill();
        // Rock body
        const rg = ctx.createRadialGradient(-o.w * 0.1, -o.h * 0.2, 0, 0, 0, o.w / 2);
        rg.addColorStop(0, "#6b7280");
        rg.addColorStop(0.6, "#374151");
        rg.addColorStop(1, "#1f2937");
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(-o.w / 2, o.h * 0.2);
        ctx.bezierCurveTo(-o.w * 0.6, -o.h * 0.4, -o.w * 0.2, -o.h * 0.7, 0, -o.h * 0.5);
        ctx.bezierCurveTo(o.w * 0.3, -o.h * 0.8, o.w * 0.6, -o.h * 0.3, o.w / 2, o.h * 0.2);
        ctx.bezierCurveTo(o.w * 0.4, o.h * 0.5, -o.w * 0.4, o.h * 0.5, -o.w / 2, o.h * 0.2);
        ctx.closePath();
        ctx.fill();
        // Foam
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.ellipse(-o.w * 0.1, o.h * 0.25, o.w * 0.4, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === "buoy") {
        // Stick
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, o.h); ctx.lineTo(0, -o.h);
        ctx.stroke();
        // Float
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(0, 0, o.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(0, -o.w * 0.15, o.w * 0.25, 0, Math.PI * 2);
        ctx.fill();
        // Light
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath();
        ctx.arc(0, -o.h * 0.9, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + Math.sin(Date.now() * 0.005) * 0.2})`;
        ctx.beginPath();
        ctx.arc(0, -o.h * 0.9, 10, 0, Math.PI * 2);
        ctx.fill();
      } else if (o.type === "shark") {
        // Fin
        ctx.fillStyle = "#4b5563";
        ctx.beginPath();
        ctx.moveTo(-o.w / 2, o.h * 0.3);
        ctx.lineTo(0, -o.h);
        ctx.lineTo(o.w * 0.2, 0);
        ctx.bezierCurveTo(o.w * 0.3, o.h * 0.4, -o.w * 0.2, o.h * 0.5, -o.w / 2, o.h * 0.3);
        ctx.closePath();
        ctx.fill();
        // Wake
        ctx.strokeStyle = "rgba(150, 220, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(o.w * 0.2, 0); ctx.lineTo(o.w * 0.8, 8);
        ctx.moveTo(o.w * 0.2, 4); ctx.lineTo(o.w, 12);
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      ctx.restore();
    }

    function drawSurfer(x: number, y: number, vx: number, shieldTime: number, trail: { x: number; y: number }[]) {
      // Trail
      for (let i = 0; i < trail.length; i++) {
        const alpha = (i / trail.length) * 0.4;
        ctx.fillStyle = `rgba(100, 220, 255, ${alpha})`;
        ctx.beginPath();
        ctx.ellipse(trail[i].x, trail[i].y + 8, 16 * (i / trail.length), 4, vx * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.translate(x, y);
      const lean = vx * 0.08;
      ctx.rotate(lean);

      // Board shadow
      ctx.fillStyle = "rgba(0,0,40,0.25)";
      ctx.beginPath();
      ctx.ellipse(2, 16, 28, 6, lean, 0, Math.PI * 2);
      ctx.fill();

      // Board
      const boardGrad = ctx.createLinearGradient(-24, 10, 24, 18);
      boardGrad.addColorStop(0, "#f97316");
      boardGrad.addColorStop(0.5, "#fb923c");
      boardGrad.addColorStop(1, "#ea580c");
      ctx.fillStyle = boardGrad;
      ctx.beginPath();
      ctx.moveTo(-22, 10);
      ctx.bezierCurveTo(-26, 14, -26, 18, -18, 20);
      ctx.lineTo(20, 18);
      ctx.bezierCurveTo(26, 16, 26, 12, 22, 10);
      ctx.bezierCurveTo(18, 8, -18, 8, -22, 10);
      ctx.closePath();
      ctx.fill();
      // Board stripe
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.beginPath();
      ctx.moveTo(-10, 9); ctx.lineTo(10, 9); ctx.lineTo(12, 19); ctx.lineTo(-12, 19);
      ctx.closePath();
      ctx.fill();

      // Body
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.moveTo(-6, 8); ctx.lineTo(6, 8); ctx.lineTo(8, -8); ctx.lineTo(-8, -8);
      ctx.closePath();
      ctx.fill();

      // Wetsuit highlight
      ctx.fillStyle = "#00d4ff";
      ctx.fillRect(-5, -4, 10, 2);

      // Head
      ctx.fillStyle = "#fbbf24";
      ctx.beginPath();
      ctx.arc(0, -16, 10, 0, Math.PI * 2);
      ctx.fill();
      // Helmet
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(0, -17, 10, Math.PI, 0);
      ctx.fill();

      // Arms
      const armAngle = Math.sin(Date.now() * 0.004) * 0.3;
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-6, -5); ctx.lineTo(-16 + vx * 0.5, -2 + Math.sin(armAngle) * 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(6, -5); ctx.lineTo(16 + vx * 0.5, -2 - Math.sin(armAngle) * 5);
      ctx.stroke();
      ctx.lineWidth = 1;

      // Shield
      if (shieldTime > 0) {
        const pulse = 0.6 + Math.sin(Date.now() * 0.01) * 0.3;
        ctx.strokeStyle = `rgba(0, 212, 255, ${pulse})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, -4, 32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(0, 212, 255, 0.08)`;
        ctx.beginPath();
        ctx.arc(0, -4, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 1;
      }

      ctx.restore();
    }

    function loop() {
      if (!rodando.current) return;
      const g = gameRef.current;
      if (!g.alive) return;

      g.frame++;
      const slowFactor = g.slowmoTime > 0 ? 0.4 : 1;
      const spd = g.speed * slowFactor;

      // Input
      let inputX = 0;
      if (keysRef.current["ArrowLeft"] || keysRef.current["a"]) inputX -= 1;
      if (keysRef.current["ArrowRight"] || keysRef.current["d"]) inputX += 1;
      // Touch
      if (touchRef.current) {
        const dx = touchRef.current.x - touchRef.current.startX;
        inputX += Math.max(-1, Math.min(1, dx / 40));
      }

      g.vx += inputX * 0.6;
      g.vx *= 0.85;
      g.vx = Math.max(-8, Math.min(8, g.vx));
      g.x = Math.max(30, Math.min(W - 30, g.x + g.vx * slowFactor));

      // Trail
      g.trail.push({ x: g.x, y: g.y });
      if (g.trail.length > 20) g.trail.shift();

      // Spawn obstacles
      if (g.frame % Math.max(25, Math.floor(70 - g.speed * 6)) === 0) {
        const t = Math.random();
        const type: "rock" | "buoy" | "shark" =
          t < 0.6 ? "rock" : t < 0.85 ? "buoy" : "shark";
        const w = type === "rock" ? rand(30, 55) : type === "buoy" ? 16 : 20;
        const h = type === "rock" ? rand(20, 32) : type === "buoy" ? 40 : 35;
        g.obs.push({ x: rand(w, W - w), y: -60, w, h, type });
      }

      // Spawn power-ups
      if (g.frame % 300 === 0 && Math.random() > 0.4) {
        g.powerups.push({
          x: rand(30, W - 30),
          y: -30,
          type: Math.random() > 0.5 ? "shield" : "slowmo",
        });
      }

      // Move obs
      g.obs.forEach(o => { o.y += spd; });
      g.obs = g.obs.filter(o => o.y < H + 80);

      // Move powerups
      g.powerups.forEach(p => { p.y += spd; });
      g.powerups = g.powerups.filter(p => p.y < H + 40);

      // Score
      g.score += slowFactor > 0.5 ? 1 : 0.4;
      if (g.frame % 600 === 0) g.speed = Math.min(g.speed + 0.3, 8);

      // Timers
      if (g.shieldTime > 0) g.shieldTime -= slowFactor;
      if (g.slowmoTime > 0) g.slowmoTime -= 1;

      // Particles
      g.particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
      });
      g.particles = g.particles.filter(p => p.life > 0);

      // Spray particles
      if (g.frame % 3 === 0) {
        spawnSplash(g.x - g.vx, g.y + 12);
      }

      // Collision
      for (const o of g.obs) {
        let hw = o.w * 0.4, hh = o.h * 0.4;
        if (o.type === "buoy") { hw = 10; hh = 10; }
        if (Math.abs(g.x - o.x) < hw + 14 && Math.abs(g.y - o.y) < hh + 12) {
          if (g.shieldTime > 0) {
            spawnParticles(o.x, o.y, "#00d4ff", 12);
            g.obs = g.obs.filter(ob => ob !== o);
            g.shieldTime = 0;
            break;
          }
          g.alive = false;
          spawnParticles(g.x, g.y, "#ff6b35", 20);
          rodando.current = false;
          const finalScore = Math.floor(g.score);
          if (finalScore > hiRef.val) {
            hiRef.val = finalScore;
            setHiScore(finalScore);
          }
          setGameState("dead");
          setDisplayScore(finalScore);
          // Do one more frame to render particles
          setTimeout(() => {
            drawScene(g);
          }, 50);
          return;
        }
      }

      // Power-up collection
      for (const p of g.powerups) {
        if (Math.abs(g.x - p.x) < 24 && Math.abs(g.y - p.y) < 24) {
          if (p.type === "shield") {
            g.shieldTime = 300;
            spawnParticles(p.x, p.y, "#00d4ff", 10);
          } else {
            g.slowmoTime = 200;
            spawnParticles(p.x, p.y, "#a78bfa", 10);
          }
          g.powerups = g.powerups.filter(pu => pu !== p);
        }
      }

      setDisplayScore(Math.floor(g.score));
      drawScene(g);
      raf = requestAnimationFrame(loop);
    }

    function drawScene(g: typeof gameRef.current) {
      drawBackground(g.frame, g.waveOffset);

      // Power-ups
      g.powerups.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        const pulse = 0.85 + Math.sin(g.frame * 0.1) * 0.15;
        ctx.scale(pulse, pulse);
        if (p.type === "shield") {
          ctx.fillStyle = "#00d4ff";
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🛡", 0, 1);
        } else {
          ctx.fillStyle = "#a78bfa";
          ctx.beginPath();
          ctx.arc(0, 0, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "white";
          ctx.font = "bold 14px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("⏱", 0, 1);
        }
        ctx.restore();
      });

      // Obstacles
      g.obs.forEach(o => drawObstacle(o));

      // Surfer
      if (g.alive) {
        drawSurfer(g.x, g.y, g.vx, g.shieldTime, g.trail);
      }

      // Particles
      g.particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Speed lines at high speed
      if (g.speed > 5) {
        const intensity = (g.speed - 5) / 3;
        for (let i = 0; i < 5; i++) {
          const lx = rand(0, W);
          const ly = rand(0, H);
          ctx.strokeStyle = `rgba(150,220,255,${intensity * 0.15})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(lx, ly); ctx.lineTo(lx, ly + rand(20, 50));
          ctx.stroke();
        }
        ctx.lineWidth = 1;
      }

      // Slow-mo vignette
      if (g.slowmoTime > 0) {
        const vg = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.9);
        vg.addColorStop(0, "rgba(100,50,200,0)");
        vg.addColorStop(1, `rgba(100,50,200,${Math.min(0.35, (g.slowmoTime / 200) * 0.35)})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
      }
    }

    // Idle animation when not playing
    function idleLoop() {
      if (rodando.current) return;
      const t = Date.now() * 0.001;
      const g = { frame: Math.floor(t * 60), waveOffset: t, score: 0, obs: [], particles: [], powerups: [], x: W / 2, y: H - 120, vx: Math.sin(t) * 2, shieldTime: 0, slowmoTime: 0, trail: [], alive: true, speed: 2, combo: 0, waves: [] };
      drawScene(g as any);
      raf = requestAnimationFrame(idleLoop);
    }

    if (!rodando.current) {
      raf = requestAnimationFrame(idleLoop);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => { keysRef.current[e.key] = e.type === "keydown"; };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, [gameState]);

  useEffect(() => {
    if (gameState === "playing") {
      const g = gameRef.current;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      // kick off loop on next tick (effect re-runs)
    }
  }, [gameState]);

  const canvasW = Math.min(typeof window !== "undefined" ? window.innerWidth - 24 : W, W);
  const canvasH = canvasW * H / W;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;700;800&display=swap');
        :root {
          --ocean: #001a3a;
          --ocean2: #003066;
          --wave: #0055aa;
          --foam: #88ccff;
          --accent: #f97316;
          --gold: #fbbf24;
          --purple: #a78bfa;
          --green: #34d399;
          --red: #ef4444;
          --text: #e0f4ff;
        }
        * { box-sizing: border-box; }
        .surf-root { width: 100%; height: 100dvh; display: flex; flex-direction: column; background: var(--ocean); font-family: 'Nunito', sans-serif; overflow: hidden; position: relative; }
        .surf-header { display: flex; align-items: center; gap: 12px; padding: 8px 14px; background: rgba(0,0,0,0.4); position: absolute; top: 0; left: 0; right: 0; z-index: 20; backdrop-filter: blur(4px); }
        .surf-back { background: none; border: none; color: var(--foam); font-size: 20px; cursor: pointer; }
        .surf-title { font-family: 'Bangers', cursive; color: white; font-size: 20px; letter-spacing: 2px; flex: 1; text-shadow: 0 2px 8px rgba(0,150,255,0.5); }
        .surf-score-hud { font-family: 'Bangers', cursive; color: var(--gold); font-size: 22px; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .surf-canvas-wrap { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; }
        .surf-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; z-index: 10; }
        .surf-card { background: rgba(0, 30, 70, 0.92); border: 2px solid rgba(100, 200, 255, 0.3); border-radius: 20px; padding: 28px 32px; display: flex; flex-direction: column; align-items: center; gap: 14px; backdrop-filter: blur(10px); max-width: 280px; width: 90%; }
        .surf-big-score { font-family: 'Bangers', cursive; font-size: 64px; color: var(--gold); line-height: 1; text-shadow: 0 4px 20px rgba(251,191,36,0.4); }
        .surf-hi { font-family: 'Bangers', cursive; font-size: 20px; color: var(--foam); opacity: 0.8; }
        .surf-play-btn { background: linear-gradient(135deg, var(--accent), #ff8c42); border: none; color: white; font-family: 'Bangers', cursive; font-size: 24px; letter-spacing: 2px; padding: 12px 36px; border-radius: 50px; cursor: pointer; box-shadow: 0 4px 20px rgba(249,115,22,0.4); transition: transform 0.1s, box-shadow 0.1s; }
        .surf-play-btn:active { transform: scale(0.96); }
        .surf-hint { color: var(--foam); font-size: 13px; opacity: 0.7; text-align: center; }
        .surf-controls { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 24px; z-index: 10; }
        .surf-ctrl-btn { background: rgba(0, 40, 90, 0.85); border: 2px solid rgba(100, 200, 255, 0.4); color: var(--foam); font-size: 28px; width: 70px; height: 70px; border-radius: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; user-select: none; -webkit-user-select: none; touch-action: none; }
        .surf-ctrl-btn:active { background: rgba(0, 80, 160, 0.9); }
        .surf-status-bar { position: absolute; bottom: 92px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 10; }
        .surf-status-pill { background: rgba(0,0,0,0.5); border-radius: 20px; padding: 4px 10px; font-size: 12px; font-weight: 700; color: white; border: 1px solid rgba(255,255,255,0.2); }
        .surf-game-title { font-family: 'Bangers', cursive; font-size: 42px; color: white; letter-spacing: 3px; text-shadow: 0 4px 20px rgba(0,150,255,0.5); }
        @keyframes floatIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .surf-card { animation: floatIn 0.3s ease; }
      `}</style>

      <div className="surf-root">
        <div className="surf-header">
          <button className="surf-back" onClick={onBack}>←</button>
          <span className="surf-title">🌊 SURF RADICAL</span>
          {gameState === "playing" && (
            <span className="surf-score-hud">{displayScore}</span>
          )}
        </div>

        <div className="surf-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            style={{ width: canvasW, height: canvasH, borderRadius: 0, display: "block" }}
            onTouchStart={e => {
              const t = e.touches[0];
              touchRef.current = { id: t.identifier, startX: t.clientX, x: t.clientX };
            }}
            onTouchMove={e => {
              for (const t of Array.from(e.touches)) {
                if (touchRef.current && t.identifier === touchRef.current.id) {
                  touchRef.current.x = t.clientX;
                }
              }
            }}
            onTouchEnd={() => { touchRef.current = null; }}
          />

          {/* Menu */}
          {gameState === "menu" && (
            <div className="surf-overlay">
              <div className="surf-card">
                <div className="surf-game-title">🏄 SURF</div>
                <div className="surf-hint">Desvie das rochas, boias e tubarões!</div>
                <div style={{ display: "flex", gap: 12, fontSize: 22, marginTop: 4 }}>
                  <span title="Escudo">🛡️ = escudo</span>
                  <span title="Câmera lenta">⏱️ = slow-mo</span>
                </div>
                <button className="surf-play-btn" onClick={startGame}>▶ JOGAR</button>
                {hiScore > 0 && <div className="surf-hi">🏆 Recorde: {hiScore}</div>}
                <div className="surf-hint">Arraste ou use ← → para controlar</div>
              </div>
            </div>
          )}

          {/* Game Over */}
          {gameState === "dead" && (
            <div className="surf-overlay">
              <div className="surf-card">
                <div style={{ fontSize: 40 }}>💥</div>
                <div style={{ color: "#ef4444", fontFamily: "Bangers, cursive", fontSize: 28 }}>FIM DE JOGO!</div>
                <div className="surf-big-score">{displayScore}</div>
                <div className="surf-hi">🏆 Recorde: {hiScore}</div>
                <button className="surf-play-btn" onClick={startGame}>↺ TENTAR DE NOVO</button>
              </div>
            </div>
          )}

          {/* Controls */}
          {gameState === "playing" && (
            <>
              <div className="surf-status-bar">
                {gameRef.current.shieldTime > 0 && (
                  <span className="surf-status-pill" style={{ color: "#00d4ff" }}>🛡️ Escudo ativo</span>
                )}
                {gameRef.current.slowmoTime > 0 && (
                  <span className="surf-status-pill" style={{ color: "#a78bfa" }}>⏱️ Slow-mo</span>
                )}
              </div>
              <div className="surf-controls">
                <button className="surf-ctrl-btn"
                  onTouchStart={e => { e.preventDefault(); keysRef.current["ArrowLeft"] = true; }}
                  onTouchEnd={e => { e.preventDefault(); keysRef.current["ArrowLeft"] = false; }}
                  onMouseDown={() => keysRef.current["ArrowLeft"] = true}
                  onMouseUp={() => keysRef.current["ArrowLeft"] = false}
                >⬅️</button>
                <button className="surf-ctrl-btn"
                  onTouchStart={e => { e.preventDefault(); keysRef.current["ArrowRight"] = true; }}
                  onTouchEnd={e => { e.preventDefault(); keysRef.current["ArrowRight"] = false; }}
                  onMouseDown={() => keysRef.current["ArrowRight"] = true}
                  onMouseUp={() => keysRef.current["ArrowRight"] = false}
                >➡️</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
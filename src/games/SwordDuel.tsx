import { useEffect, useRef, useState, useCallback } from "react";
type Props = { onBack: () => void };

const W = 400; const H = 600;

// ── Áudio ──────────────────────────────────────────────
function createAudio() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

  function shoot(freq = 220, type: OscillatorType = "square") {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = type; o.frequency.setValueAtTime(freq, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o.start(); o.stop(ctx.currentTime + 0.15);
  }

  function explosion() {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.4, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ctx.createBufferSource(); const g = ctx.createGain();
    src.buffer = buf; src.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.5, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    src.start();
  }

  function powerup() {
    [440, 550, 660, 880].forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
      g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.08 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.12);
      o.start(ctx.currentTime + i * 0.08); o.stop(ctx.currentTime + i * 0.08 + 0.15);
    });
  }

  function boxDrop() {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "triangle"; o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.start(); o.stop(ctx.currentTime + 0.3);
  }

  function hit() {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sawtooth"; o.frequency.value = 150;
    g.gain.setValueAtTime(0.4, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    o.start(); o.stop(ctx.currentTime + 0.2);
  }

  return { shoot, explosion, powerup, boxDrop, hit, resume: () => ctx.state === "suspended" && ctx.resume() };
}

// ── Types ──────────────────────────────────────────────
type MapId = "desert" | "forest" | "arctic";
type PowerType = "speed" | "shield" | "guided";

interface Tank {
  x: number; y: number; angle: number; // angle em radianos
  speed: number; hp: number; hits: number;
  color: string; accentColor: string; name: string; player: 1 | 2;
  shootCooldown: number; baseCD: number;
  powerup: PowerType | null; powerTimer: number;
  invincible: number; guidedAmmo: number;
}

interface Bullet {
  x: number; y: number; vx: number; vy: number;
  owner: 1 | 2; guided: boolean; life: number;
  trail: { x: number; y: number }[];
}

interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; r: number; }
interface PowerBox { x: number; y: number; type: PowerType; scale: number; bounce: number; }
interface Wall { x: number; y: number; w: number; h: number; }

const MAPS: { id: MapId; name: string; emoji: string; bg: string; wallColor: string; floorA: string; floorB: string; walls: Wall[] }[] = [
  {
    id: "desert", name: "Deserto", emoji: "🏜️",
    bg: "#c2944a", wallColor: "#8B5E3C", floorA: "#d4a855", floorB: "#c8a050",
    walls: [
      { x: 60, y: 80, w: 80, h: 20 }, { x: 260, y: 80, w: 80, h: 20 },
      { x: 160, y: 180, w: 80, h: 20 }, { x: 60, y: 300, w: 20, h: 80 },
      { x: 320, y: 300, w: 20, h: 80 }, { x: 160, y: 400, w: 80, h: 20 },
      { x: 60, y: 500, w: 80, h: 20 }, { x: 260, y: 500, w: 80, h: 20 },
    ]
  },
  {
    id: "forest", name: "Floresta", emoji: "🌲",
    bg: "#2d5a1b", wallColor: "#1a3a0a", floorA: "#3a7a22", floorB: "#346b1e",
    walls: [
      { x: 40, y: 40, w: 40, h: 40 }, { x: 320, y: 40, w: 40, h: 40 },
      { x: 180, y: 120, w: 40, h: 40 }, { x: 80, y: 220, w: 40, h: 40 },
      { x: 280, y: 220, w: 40, h: 40 }, { x: 180, y: 320, w: 40, h: 40 },
      { x: 60, y: 420, w: 40, h: 40 }, { x: 300, y: 420, w: 40, h: 40 },
      { x: 40, y: 520, w: 40, h: 40 }, { x: 320, y: 520, w: 40, h: 40 },
    ]
  },
  {
    id: "arctic", name: "Ártico", emoji: "❄️",
    bg: "#c8dff0", wallColor: "#8ab4cc", floorA: "#d8eef8", floorB: "#cce4f4",
    walls: [
      { x: 50, y: 60, w: 100, h: 16 }, { x: 250, y: 60, w: 100, h: 16 },
      { x: 50, y: 524, w: 100, h: 16 }, { x: 250, y: 524, w: 100, h: 16 },
      { x: 32, y: 180, w: 16, h: 100 }, { x: 352, y: 180, w: 16, h: 100 },
      { x: 32, y: 320, w: 16, h: 100 }, { x: 352, y: 320, w: 16, h: 100 },
      { x: 160, y: 240, w: 80, h: 16 }, { x: 160, y: 344, w: 80, h: 16 },
    ]
  },
];

function rand(a: number, b: number) { return Math.random() * (b - a) + a; }

function rectCircle(rx: number, ry: number, rw: number, rh: number, cx: number, cy: number, cr: number) {
  const nearX = Math.max(rx, Math.min(cx, rx + rw));
  const nearY = Math.max(ry, Math.min(cy, ry + rh));
  return Math.hypot(cx - nearX, cy - nearY) < cr;
}

function makeTank(x: number, y: number, angle: number, color: string, accent: string, name: string, player: 1 | 2): Tank {
  return { x, y, angle, speed: 2.2, hp: 3, hits: 0, color, accentColor: accent, name, player, shootCooldown: 0, baseCD: 35, powerup: null, powerTimer: 0, invincible: 0, guidedAmmo: 0 };
}

function drawTank(ctx: CanvasRenderingContext2D, t: Tank, frame: number) {
  ctx.save();
  ctx.translate(t.x, t.y);
  ctx.rotate(t.angle);

  // Escudo (invencibilidade)
  if (t.invincible > 0) {
    ctx.strokeStyle = `rgba(0,255,225,${0.3 + Math.sin(frame * 0.2) * 0.3})`;
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 28, 0, Math.PI * 2); ctx.stroke();
  }

  // Lagartas (tracks)
  ctx.fillStyle = "#333";
  ctx.fillRect(-22, -12, 44, 8); // esquerda cima
  ctx.fillRect(-22, 4, 44, 8);   // direita baixo
  // Detalhes lagartas
  ctx.fillStyle = "#222";
  for (let i = 0; i < 5; i++) {
    ctx.fillRect(-22 + i * 9, -12, 2, 8);
    ctx.fillRect(-22 + i * 9, 4, 2, 8);
  }

  // Corpo principal
  const bodyG = ctx.createLinearGradient(-18, -8, 18, 8);
  bodyG.addColorStop(0, t.color);
  bodyG.addColorStop(1, t.accentColor);
  ctx.fillStyle = bodyG;
  ctx.beginPath();
  ctx.roundRect(-18, -8, 36, 16, 3);
  ctx.fill();

  // Detalhe corpo
  ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1;
  ctx.strokeRect(-14, -6, 28, 12);

  // Cúpula
  const cupG = ctx.createRadialGradient(-3, -3, 1, 0, 0, 10);
  cupG.addColorStop(0, "#fff8"); cupG.addColorStop(1, t.color + "cc");
  ctx.fillStyle = cupG;
  ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.stroke();

  // Canhão
  ctx.fillStyle = "#444";
  ctx.fillRect(6, -4, 20, 8);
  ctx.fillStyle = "#222";
  ctx.fillRect(22, -3, 6, 6);

  // Indicador de power-up
  if (t.powerup) {
    const colors: Record<PowerType, string> = { speed: "#f97316", shield: "#00ffe1", guided: "#ffd700" };
    const emojis: Record<PowerType, string> = { speed: "⚡", shield: "🛡", guided: "🎯" };
    ctx.save(); ctx.rotate(-t.angle);
    ctx.fillStyle = colors[t.powerup] + "88";
    ctx.beginPath(); ctx.arc(0, -24, 10, 0, Math.PI * 2); ctx.fill();
    ctx.font = "10px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(emojis[t.powerup], 0, -24);
    ctx.restore();
  }

  ctx.restore();

  // Nome
  ctx.save();
  ctx.fillStyle = t.color + "cc";
  ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center";
  ctx.fillText(t.name, t.x, t.y + 36);
  ctx.restore();
}

function drawBullet(ctx: CanvasRenderingContext2D, b: Bullet) {
  // Trail
  b.trail.forEach((p, i) => {
    ctx.save();
    ctx.globalAlpha = (i / b.trail.length) * 0.5;
    ctx.fillStyle = b.guided ? "#ffd700" : b.owner === 1 ? "#4299e1" : "#f87171";
    ctx.beginPath(); ctx.arc(p.x, p.y, b.guided ? 5 : 3, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  });
  // Bala
  const color = b.guided ? "#ffd700" : b.owner === 1 ? "#60b8ff" : "#ff8080";
  const grd = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.guided ? 8 : 6);
  grd.addColorStop(0, "#fff");
  grd.addColorStop(0.3, color);
  grd.addColorStop(1, color + "00");
  ctx.fillStyle = grd;
  ctx.beginPath(); ctx.arc(b.x, b.y, b.guided ? 8 : 6, 0, Math.PI * 2); ctx.fill();
  if (b.guided) {
    ctx.strokeStyle = "#ffd700"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(b.x, b.y, 12, 0, Math.PI * 2); ctx.stroke();
  }
}

function drawMap(ctx: CanvasRenderingContext2D, map: typeof MAPS[0], frame: number) {
  // Piso xadrez
  const tile = 40;
  for (let row = 0; row < Math.ceil(H / tile); row++) {
    for (let col = 0; col < Math.ceil(W / tile); col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? map.floorA : map.floorB;
      ctx.fillRect(col * tile, row * tile, tile, tile);
    }
  }

  // Paredes
  map.walls.forEach(w => {
    const wg = ctx.createLinearGradient(w.x, w.y, w.x + w.w, w.y + w.h);
    wg.addColorStop(0, map.wallColor);
    wg.addColorStop(1, map.wallColor + "bb");
    ctx.fillStyle = wg;
    ctx.beginPath(); ctx.roundRect(w.x, w.y, w.w, w.h, 4); ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.3)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(w.x, w.y, w.w, w.h, 4); ctx.stroke();
    // Sombra
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(w.x + 3, w.y + w.h, w.w, 4);
  });

  // Borda do mapa
  ctx.strokeStyle = "rgba(0,0,0,0.4)"; ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W - 4, H - 4);
}

function drawPowerBox(ctx: CanvasRenderingContext2D, box: PowerBox, frame: number) {
  const colors: Record<PowerType, string> = { speed: "#f97316", shield: "#00ffe1", guided: "#ffd700" };
  const emojis: Record<PowerType, string> = { speed: "⚡", shield: "🛡", guided: "🎯" };
  const c = colors[box.type];
  const bounce = Math.sin(frame * 0.08) * 4;

  ctx.save();
  ctx.translate(box.x, box.y + bounce);
  ctx.scale(box.scale, box.scale);

  // Sombra
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath(); ctx.ellipse(0, 22, 18, 5, 0, 0, Math.PI * 2); ctx.fill();

  // Caixa
  const bg = ctx.createLinearGradient(-18, -18, 18, 18);
  bg.addColorStop(0, c + "dd"); bg.addColorStop(1, c + "88");
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.roundRect(-18, -18, 36, 36, 5); ctx.fill();
  ctx.strokeStyle = c; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(-18, -18, 36, 36, 5); ctx.stroke();

  // Brilho pulsante
  ctx.strokeStyle = c + "66"; ctx.lineWidth = 3;
  const pulse = 20 + Math.sin(frame * 0.1) * 5;
  ctx.beginPath(); ctx.arc(0, 0, pulse, 0, Math.PI * 2); ctx.stroke();

  // Emoji
  ctx.font = "18px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(emojis[box.type], 0, 1);

  ctx.restore();
}

// ── Componente principal ───────────────────────────────
export default function TankBattle({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<"mapSelect" | "playing" | "fim">("mapSelect");
  const [selMap, setSelMap] = useState(MAPS[0]);
  const [winner, setWinner] = useState("");
  const [hitsUI, setHitsUI] = useState({ p1: 0, p2: 0 });
  const [powerUI, setPowerUI] = useState({ p1: null as PowerType | null, p2: null as PowerType | null });
  const [boxTimerUI, setBoxTimerUI] = useState(30);
  const rodando = useRef(false);
  const audioRef = useRef<ReturnType<typeof createAudio> | null>(null);

  const G = useRef({
    t1: makeTank(W * 0.3, H * 0.2, Math.PI / 2, "#2563eb", "#60a5fa", "Azul", 1),
    t2: makeTank(W * 0.7, H * 0.8, -Math.PI / 2, "#dc2626", "#f87171", "Vermelho", 2),
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    powerBox: null as PowerBox | null,
    boxTimer: 30 * 60,
    frame: 0,
    map: MAPS[0],
  });

  const keys = useRef<Record<string, boolean>>({});
  const btns = useRef({
    t1l: false, t1r: false, t1u: false, t1d: false, t1s: false,
    t2l: false, t2r: false, t2u: false, t2d: false, t2s: false,
  });

  function spawnParticles(x: number, y: number, color: string, n = 10) {
    for (let i = 0; i < n; i++) {
      G.current.particles.push({ x, y, vx: rand(-5, 5), vy: rand(-5, 5), life: rand(20, 40), maxLife: 40, color, r: rand(2, 5) });
    }
  }

  function checkWallCollision(x: number, y: number, map: typeof MAPS[0]): boolean {
    if (x < 18 || x > W - 18 || y < 18 || y > H - 18) return true;
    return map.walls.some(w => rectCircle(w.x, w.y, w.w, w.h, x, y, 18));
  }

  function shootTank(tank: Tank, guided = false) {
    if (tank.shootCooldown > 0) return;
    const cd = guided ? 1 : tank.baseCD;
    tank.shootCooldown = cd;
    const spd = guided ? 1.5 : 7;
    const bx = tank.x + Math.cos(tank.angle) * 28;
    const by = tank.y + Math.sin(tank.angle) * 28;
    G.current.bullets.push({
      x: bx, y: by,
      vx: Math.cos(tank.angle) * spd,
      vy: Math.sin(tank.angle) * spd,
      owner: tank.player, guided, life: guided ? 240 : 120,
      trail: [],
    });
    audioRef.current?.shoot(guided ? 330 : 220);
  }

  const startGame = useCallback((map: typeof MAPS[0]) => {
    audioRef.current = createAudio();
    G.current = {
      t1: makeTank(W * 0.3, H * 0.2, Math.PI / 2, "#2563eb", "#60a5fa", "Azul", 1),
      t2: makeTank(W * 0.7, H * 0.8, -Math.PI / 2, "#dc2626", "#f87171", "Vermelho", 2),
      bullets: [], particles: [], powerBox: null,
      boxTimer: 30 * 60, frame: 0, map,
    };
    setHitsUI({ p1: 0, p2: 0 }); setPowerUI({ p1: null, p2: null });
    setBoxTimerUI(30); setWinner("");
    rodando.current = true; setScreen("playing");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    function update() {
      const g = G.current;
      const { t1, t2, map } = g;
      g.frame++;

      // Movimento tanques
      function moveTank(t: Tank, left: boolean, right: boolean, fwd: boolean, bwd: boolean, shoot: boolean) {
        const spd = t.powerup === "speed" ? t.speed * 1.7 : t.speed;
        if (left) t.angle -= 0.045;
        if (right) t.angle += 0.045;
        if (fwd) {
          const nx = t.x + Math.cos(t.angle) * spd;
          const ny = t.y + Math.sin(t.angle) * spd;
          if (!checkWallCollision(nx, ny, map)) { t.x = nx; t.y = ny; }
        }
        if (bwd) {
          const nx = t.x - Math.cos(t.angle) * spd * 0.6;
          const ny = t.y - Math.sin(t.angle) * spd * 0.6;
          if (!checkWallCollision(nx, ny, map)) { t.x = nx; t.y = ny; }
        }
        if (shoot) {
          if (t.guidedAmmo > 0 && t.powerup === "guided") {
            shootTank(t, true);
            t.guidedAmmo--;
            if (t.guidedAmmo <= 0) { t.powerup = null; t.powerTimer = 0; }
          } else {
            shootTank(t, false);
          }
        }
        if (t.shootCooldown > 0) t.shootCooldown--;
        if (t.invincible > 0) t.invincible--;
        if (t.powerup && t.powerTimer > 0) {
          t.powerTimer--;
          if (t.powerTimer <= 0 && t.powerup !== "guided") t.powerup = null;
        }
      }

      const K = keys.current; const B = btns.current;
      moveTank(t1, K["a"] || B.t1l, K["d"] || B.t1r, K["w"] || B.t1u, K["s"] || B.t1d, K[" "] || K["f"] || B.t1s);
      moveTank(t2, K["ArrowLeft"] || B.t2l, K["ArrowRight"] || B.t2r, K["ArrowUp"] || B.t2u, K["ArrowDown"] || B.t2d, K["Enter"] || K[","] || B.t2s);

      // Balas guiadas perseguem o inimigo
      g.bullets.forEach(b => {
        b.trail.push({ x: b.x, y: b.y });
        if (b.trail.length > 10) b.trail.shift();
        if (b.guided) {
          const target = b.owner === 1 ? t2 : t1;
          const dx = target.x - b.x; const dy = target.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0) {
            b.vx += (dx / dist) * 0.08;
            b.vy += (dy / dist) * 0.08;
            const spd = Math.hypot(b.vx, b.vy);
            if (spd > 1.5) { b.vx = b.vx / spd * 1.5; b.vy = b.vy / spd * 1.5; }
          }
        }
        b.x += b.vx; b.y += b.vy; b.life--;
        // Rebate em paredes
        if (b.x < 8 || b.x > W - 8) { b.vx *= -1; spawnParticles(b.x, b.y, "#fff", 3); }
        if (b.y < 8 || b.y > H - 8) { b.vy *= -1; spawnParticles(b.x, b.y, "#fff", 3); }
        // Colisão com paredes do mapa
        map.walls.forEach(w => {
          if (rectCircle(w.x, w.y, w.w, w.h, b.x, b.y, 6)) {
            b.vx *= -1; b.vy *= -1; b.life -= 10;
            spawnParticles(b.x, b.y, map.wallColor, 4);
          }
        });
      });

      // Colisão balas vs tanques
      g.bullets = g.bullets.filter(b => {
        if (b.life <= 0) return false;
        const target = b.owner === 1 ? t2 : t1;
        if (target.invincible > 0) return b.life > 0;
        if (Math.hypot(b.x - target.x, b.y - target.y) < 20) {
          spawnParticles(b.x, b.y, target.color, 14);
          audioRef.current?.hit();
          target.hits++;
          const newHits = { p1: t1.hits, p2: t2.hits };
          setHitsUI(newHits);
          if (target.hits >= 3) {
            const winnerName = b.owner === 1 ? t1.name : t2.name;
            audioRef.current?.explosion();
            spawnParticles(target.x, target.y, target.color, 30);
            rodando.current = false; setWinner(winnerName); setScreen("fim");
          }
          return false;
        }
        return true;
      });

      // Power box timer
      g.boxTimer--;
      setBoxTimerUI(Math.ceil(g.boxTimer / 60));
      if (g.boxTimer <= 0 && !g.powerBox) {
        const types: PowerType[] = ["speed", "shield", "guided"];
        g.powerBox = {
          x: W / 2 + rand(-40, 40),
          y: H / 2 + rand(-40, 40),
          type: types[Math.floor(Math.random() * 3)],
          scale: 0, bounce: 0,
        };
        g.boxTimer = 30 * 60;
        audioRef.current?.boxDrop();
      }
      if (g.powerBox && g.powerBox.scale < 1) g.powerBox.scale = Math.min(1, g.powerBox.scale + 0.06);

      // Pegar power box
      if (g.powerBox) {
        [t1, t2].forEach(t => {
          if (g.powerBox && Math.hypot(t.x - g.powerBox.x, t.y - g.powerBox.y) < 28) {
            const pt = g.powerBox.type;
            t.powerup = pt;
            if (pt === "speed") t.powerTimer = 5 * 60;
            else if (pt === "shield") { t.invincible = 5 * 60; t.powerTimer = 5 * 60; }
            else if (pt === "guided") { t.guidedAmmo = 1; t.powerTimer = 999; }
            spawnParticles(t.x, t.y, "#ffd700", 16);
            audioRef.current?.powerup();
            g.powerBox = null;
            setPowerUI({ p1: t1.powerup, p2: t2.powerup });
          }
        });
      }

      // Partículas
      g.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vx *= 0.92; p.vy *= 0.92; p.life--; });
      g.particles = g.particles.filter(p => p.life > 0);
    }

    function render() {
      const { t1, t2, bullets, particles, powerBox, frame, map } = G.current;
      drawMap(ctx, map, frame);

      // Partículas
      particles.forEach(p => {
        ctx.save(); ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      if (powerBox) drawPowerBox(ctx, powerBox, frame);

      bullets.forEach(b => drawBullet(ctx, b));
      drawTank(ctx, t1, frame);
      drawTank(ctx, t2, frame);
    }

    function loop() {
      if (rodando.current) update();
      render();
      raf = requestAnimationFrame(loop);
    }

    const onKey = (e: KeyboardEvent) => {
      keys.current[e.key] = e.type === "keydown";
      if ([" ", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("keyup", onKey);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); window.removeEventListener("keyup", onKey); };
  }, []);

  function btn(k: keyof typeof btns.current) {
    return {
      onTouchStart: (e: React.TouchEvent) => { e.preventDefault(); audioRef.current?.resume(); btns.current[k] = true; },
      onTouchEnd: (e: React.TouchEvent) => { e.preventDefault(); btns.current[k] = false; },
      onTouchCancel: (e: React.TouchEvent) => { e.preventDefault(); btns.current[k] = false; },
      onMouseDown: () => { audioRef.current?.resume(); btns.current[k] = true; },
      onMouseUp: () => btns.current[k] = false,
      onMouseLeave: () => btns.current[k] = false,
      style: { touchAction: "none" } as React.CSSProperties,
    };
  }

  const cw = typeof window !== "undefined" ? Math.min(window.innerWidth, W) : W;
  const ch = cw * H / W;
  const POWER_COLORS: Record<PowerType, string> = { speed: "#f97316", shield: "#00ffe1", guided: "#ffd700" };
  const POWER_EMOJI: Record<PowerType, string> = { speed: "⚡ Vel.", shield: "🛡 Escudo", guided: "🎯 Guiado" };

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#111;}
        .tb{width:100%;height:100dvh;display:flex;flex-direction:column;background:#111;overflow:hidden;font-family:sans-serif;}

        /* Controles */
        .ctrl{display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:rgba(0,0,0,0.7);flex-shrink:0;}
        .ctrl.p2{transform:rotate(180deg);}
        .dpad{display:grid;grid-template-columns:repeat(3,42px);grid-template-rows:repeat(2,38px);gap:3px;}
        .dp{width:42px;height:38px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:#ccc;border-radius:8px;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;user-select:none;-webkit-user-select:none;}
        .dp:active{filter:brightness(1.5);}
        .dp-e{width:42px;height:38px;}
        .shoot{width:68px;height:68px;border-radius:50%;font-size:22px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;user-select:none;-webkit-user-select:none;border:3px solid;}

        /* HUD */
        .hud{display:flex;align-items:center;justify-content:space-between;padding:4px 10px;background:rgba(0,0,0,0.8);border-bottom:1px solid #222;flex-shrink:0;}
        .hud-back{background:none;border:1px solid #444;color:#aaa;font-size:11px;padding:3px 8px;border-radius:5px;cursor:pointer;}
        .hud-score{display:flex;align-items:center;gap:6px;}
        .hit-dot{width:14px;height:14px;border-radius:50%;border:2px solid;}
        .hit-dot.filled{opacity:1;}
        .hit-dot.empty{opacity:0.25;}
        .hud-timer{color:#ffd700;font-size:11px;font-weight:700;text-align:center;}
        .hud-power{font-size:10px;padding:2px 6px;border-radius:4px;font-weight:700;}

        /* Overlay */
        .ov{position:fixed;inset:0;background:rgba(0,0,0,0.88);display:flex;align-items:center;justify-content:center;z-index:50;}
        .card{background:linear-gradient(160deg,#1a1a2e,#0d0d1a);border:2px solid #333;border-radius:18px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;gap:14px;width:90%;max-width:320px;}
        .card-title{font-size:20px;font-weight:800;letter-spacing:2px;text-align:center;color:#e9edef;}
        .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;}
        .sel{background:#1f2c34;border:2px solid #333;border-radius:12px;padding:12px 6px;display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;transition:all 0.15s;}
        .sel.on{border-color:#ffd700;background:#2a3010;}
        .sel-e{font-size:26px;}
        .sel-n{font-size:10px;color:#8696a0;text-align:center;font-weight:600;}
        .pbtn{border:none;border-radius:12px;font-size:15px;font-weight:800;padding:13px 32px;cursor:pointer;letter-spacing:1px;transition:transform 0.1s;}
        .pbtn:active{transform:scale(0.95);}
        .hint{color:#8696a0;font-size:11px;text-align:center;line-height:2;}
        .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
        @keyframes pop{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
        .card{animation:pop 0.2s ease;}
      `}</style>

      <div className="tb">

        {/* Controles T2 — topo, rotacionados */}
        {screen === "playing" && (
          <div className="ctrl p2">
            <div className="dpad">
              <div className="dp-e" />
              <div className="dp" {...btn("t2u")}>▲</div>
              <div className="dp-e" />
              <div className="dp" {...btn("t2l")}>◀</div>
              <div className="dp" {...btn("t2d")}>▼</div>
              <div className="dp" {...btn("t2r")}>▶</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {powerUI.p2 && <span className="hud-power" style={{ background: POWER_COLORS[powerUI.p2] + "33", color: POWER_COLORS[powerUI.p2], border: `1px solid ${POWER_COLORS[powerUI.p2]}66` }}>{POWER_EMOJI[powerUI.p2]}</span>}
              <div className="shoot" style={{ background: "rgba(220,38,38,0.85)", borderColor: "#f87171", color: "#fff" }} {...btn("t2s")}>🔴</div>
            </div>
          </div>
        )}

        {/* HUD */}
        <div className="hud">
          <button className="hud-back" onClick={onBack}>← Voltar</button>

          {screen === "playing" && <>
            <div className="hud-score">
              {[0, 1, 2].map(i => (
                <div key={i} className={`hit-dot ${i < hitsUI.p2 ? "filled" : "empty"}`} style={{ background: i < hitsUI.p2 ? "#f87171" : "transparent", borderColor: "#f87171" }} />
              ))}
              <span style={{ color: "#666", fontSize: 10 }}>VS</span>
              {[0, 1, 2].map(i => (
                <div key={i} className={`hit-dot ${i < hitsUI.p1 ? "filled" : "empty"}`} style={{ background: i < hitsUI.p1 ? "#60a5fa" : "transparent", borderColor: "#60a5fa" }} />
              ))}
            </div>
            <div className="hud-timer">📦 {boxTimerUI}s</div>
          </>}
        </div>

        {/* Canvas */}
        <div style={{ display: "flex", justifyContent: "center", flex: 1, minHeight: 0 }}>
          <canvas ref={canvasRef} width={W} height={H} style={{ width: cw, height: cw * H / W, display: "block", objectFit: "contain" }} />
        </div>

        {/* Controles T1 — base */}
        {screen === "playing" && (
          <div className="ctrl">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {powerUI.p1 && <span className="hud-power" style={{ background: POWER_COLORS[powerUI.p1] + "33", color: POWER_COLORS[powerUI.p1], border: `1px solid ${POWER_COLORS[powerUI.p1]}66` }}>{POWER_EMOJI[powerUI.p1]}</span>}
              <div className="shoot" style={{ background: "rgba(37,99,235,0.85)", borderColor: "#60a5fa", color: "#fff" }} {...btn("t1s")}>🔵</div>
            </div>
            <div className="dpad">
              <div className="dp-e" />
              <div className="dp" {...btn("t1u")}>▲</div>
              <div className="dp-e" />
              <div className="dp" {...btn("t1l")}>◀</div>
              <div className="dp" {...btn("t1d")}>▼</div>
              <div className="dp" {...btn("t1r")}>▶</div>
            </div>
          </div>
        )}

        {/* SELECIONAR MAPA */}
        {screen === "mapSelect" && (
          <div className="ov">
            <div className="card">
              <div style={{ fontSize: 42 }}>🚗</div>
              <div className="card-title">BATALHA DE TANQUES</div>
              <div style={{ color: "#ffd700", fontSize: 13, fontWeight: 700 }}>🗺️ Escolha o mapa</div>
              <div className="grid3">
                {MAPS.map(m => (
                  <div key={m.id} className={`sel ${selMap.id === m.id ? "on" : ""}`} onClick={() => setSelMap(m)}>
                    <span className="sel-e">{m.emoji}</span>
                    <span className="sel-n">{m.name}</span>
                  </div>
                ))}
              </div>
              <div className="hint">
                Quem acertar 3 tiros primeiro vence!{"\n"}
                A cada 30s uma caixa de bônus aparece no centro{"\n"}
                ⚡ Velocidade · 🛡 Escudo · 🎯 Tiro guiado{"\n"}
                Cada jogador segura uma ponta do celular
              </div>
              <button className="pbtn" style={{ background: "#ffd700", color: "#000" }} onClick={() => startGame(selMap)}>
                🚀 INICIAR BATALHA
              </button>
            </div>
          </div>
        )}

        {/* FIM */}
        {screen === "fim" && (
          <div className="ov">
            <div className="card">
              <div style={{ fontSize: 52 }}>🏆</div>
              <div className="card-title" style={{ color: "#ffd700" }}>VITÓRIA!</div>
              <div style={{ color: "#e9edef", fontSize: 20, fontWeight: 800 }}>{winner}</div>
              <div className="row">
                <button className="pbtn" style={{ background: "#374045", color: "#e9edef" }} onClick={() => setScreen("mapSelect")}>🗺️ Trocar Mapa</button>
                <button className="pbtn" style={{ background: "#ffd700", color: "#000" }} onClick={() => startGame(selMap)}>↺ Revanche</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
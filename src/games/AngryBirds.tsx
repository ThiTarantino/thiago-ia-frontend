import { useState, useEffect, useRef, useCallback } from "react";

type Props = { onBack: () => void };

// ─── TIPOS ──────────────────────────────────────────────────────────────────
interface PlantDef {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  maxHp: number;
  desc: string;
  shootDmg?: number;
  shootInterval?: number;
  slowFactor?: number;
  produceSun?: boolean;
  sunInterval?: number;
  isWall?: boolean;
  isBomb?: boolean;
  isMine?: boolean;
  bombRadius?: number;
  isSpike?: boolean;
  cooldown: number;
}

interface CellPlant {
  defId: string;
  hp: number;
  shootTimer: number;
  sunTimer: number;
}

interface Zombie {
  id: number;
  row: number;
  x: number; // 0..1 (1=direita, 0=esquerda fim)
  hp: number;
  maxHp: number;
  speed: number;
  baseSpeed: number;
  dmgPerSec: number;
  emoji: string;
  eatTimer: number;
  slowTimer: number;
  stunTimer: number;
  armor: number; // hp extra de armadura
  maxArmor: number;
  armorEmoji?: string;
  isFrozen: boolean;
  shake: number;
  type: number;
}

interface Bullet {
  id: number;
  row: number;
  x: number; // %
  dmg: number;
  slow: boolean;
  freeze: boolean;
  explosive: boolean;
}

interface SunDrop {
  id: number;
  x: number;
  y: number;
  fromPlant: boolean;
  collected: boolean;
}

interface FloatText {
  id: number;
  row: number;
  x: number;
  text: string;
  color: string;
}

// ─── DEFINIÇÕES DE PLANTAS ──────────────────────────────────────────────────
const PLANT_DEFS: PlantDef[] = [
  {
    id: "sunflower",
    name: "Girassol",
    emoji: "🌻",
    cost: 50,
    maxHp: 100,
    desc: "Gera sol",
    produceSun: true,
    sunInterval: 7000,
    cooldown: 7,
  },
  {
    id: "peashooter",
    name: "Ervilha",
    emoji: "🌿",
    cost: 100,
    maxHp: 150,
    desc: "Atira ervilhas",
    shootDmg: 20,
    shootInterval: 1400,
    cooldown: 7.5,
  },
  {
    id: "snowpea",
    name: "Ervilha Gelo",
    emoji: "❄️",
    cost: 175,
    maxHp: 120,
    desc: "Congela zumbis",
    shootDmg: 15,
    shootInterval: 1400,
    slowFactor: 0.4,
    cooldown: 14,
  },
  {
    id: "wallnut",
    name: "Noz",
    emoji: "🥜",
    cost: 50,
    maxHp: 800,
    desc: "Parede durona",
    isWall: true,
    cooldown: 30,
  },
  {
    id: "cherrybomb",
    name: "Cereja",
    emoji: "🍒",
    cost: 150,
    maxHp: 1,
    desc: "Explode área 3x3",
    isBomb: true,
    bombRadius: 1,
    cooldown: 50,
  },
  {
    id: "potato",
    name: "Batata Mina",
    emoji: "🥔",
    cost: 25,
    maxHp: 1,
    desc: "Mina explosiva",
    isMine: true,
    cooldown: 30,
  },
  {
    id: "spikeweed",
    name: "Espinho",
    emoji: "🌵",
    cost: 100,
    maxHp: 300,
    desc: "Dano contínuo",
    isSpike: true,
    shootDmg: 5,
    cooldown: 7,
  },
  {
    id: "repeater",
    name: "Disparador",
    emoji: "🎋",
    cost: 200,
    maxHp: 150,
    desc: "2 ervilhas/vez",
    shootDmg: 20,
    shootInterval: 700,
    cooldown: 10,
  },
];

// ─── DEFINIÇÕES DE ZUMBIS ────────────────────────────────────────────────────
interface ZombieDef {
  emoji: string;
  hp: number;
  speed: number;
  dmg: number;
  armor?: number;
  armorEmoji?: string;
  type: number;
}

const ZOMBIE_DEFS: ZombieDef[] = [
  { emoji: "🧟", hp: 150, speed: 0.0003, dmg: 30, type: 0 },
  { emoji: "🧟‍♂️", hp: 280, speed: 0.0003, dmg: 35, type: 1 },
  { emoji: "🪖", hp: 200, speed: 0.0003, dmg: 30, armor: 200, armorEmoji: "🪖", type: 2 },
  { emoji: "🚗", hp: 500, speed: 0.008, dmg: 40, type: 3 },
  { emoji: "🎩", hp: 180, speed: 0.015, dmg: 25, armor: 350, armorEmoji: "🪣", type: 4 },
  { emoji: "🧟‍♀️", hp: 120, speed: 0.02, dmg: 20, type: 5 },
  { emoji: "🪓", hp: 400, speed: 0.007, dmg: 60, armor: 400, armorEmoji: "🪓", type: 6 },
  { emoji: "🧊", hp: 600, speed: 0.006, dmg: 50, type: 7 },
  { emoji: "🦾", hp: 1000, speed: 0.005, dmg: 80, armor: 600, armorEmoji: "🦾", type: 8 },
  { emoji: "👑", hp: 3000, speed: 0.004, dmg: 100, armor: 2000, armorEmoji: "👑", type: 9 },
];

// ─── ONDAS POR FASE ──────────────────────────────────────────────────────────
interface WaveDef {
  zombies: { defIdx: number; row?: number }[];
  delay: number; // ms entre spawns
}

interface LevelDef {
  title: string;
  waves: WaveDef[];
  startSun: number;
  bg: string;
}

const LEVELS: LevelDef[] = [
  {
    title: "Fase 1 – Amanhecer",
    startSun: 150,
    bg: "#0f2010",
    waves: [
      { zombies: Array(5).fill({ defIdx: 0 }), delay: 2500 },
      { zombies: Array(7).fill({ defIdx: 0 }).concat([{ defIdx: 1 }]), delay: 2000 },
    ],
  },
  {
    title: "Fase 2 – Gramado",
    startSun: 125,
    bg: "#0d1e0d",
    waves: [
      { zombies: Array(6).fill({ defIdx: 0 }).concat(Array(3).fill({ defIdx: 1 })), delay: 2200 },
      { zombies: Array(4).fill({ defIdx: 1 }).concat(Array(3).fill({ defIdx: 2 })), delay: 2000 },
    ],
  },
  {
    title: "Fase 3 – Cones de Lata",
    startSun: 125,
    bg: "#0c1c10",
    waves: [
      { zombies: Array(5).fill({ defIdx: 2 }).concat(Array(5).fill({ defIdx: 1 })), delay: 2000 },
      { zombies: Array(6).fill({ defIdx: 2 }).concat([{ defIdx: 3 }]), delay: 1800 },
    ],
  },
  {
    title: "Fase 4 – Baldes",
    startSun: 100,
    bg: "#0b1a0f",
    waves: [
      { zombies: Array(4).fill({ defIdx: 4 }).concat(Array(6).fill({ defIdx: 2 })), delay: 2000 },
      { zombies: Array(5).fill({ defIdx: 4 }).concat(Array(3).fill({ defIdx: 3 })), delay: 1800 },
    ],
  },
  {
    title: "Fase 5 – Machados",
    startSun: 100,
    bg: "#0a1810",
    waves: [
      { zombies: Array(8).fill({ defIdx: 2 }).concat(Array(4).fill({ defIdx: 6 })), delay: 1800 },
      { zombies: Array(5).fill({ defIdx: 6 }).concat(Array(6).fill({ defIdx: 4 })), delay: 1600 },
    ],
  },
  {
    title: "Fase 6 – Gelados",
    startSun: 100,
    bg: "#0a1820",
    waves: [
      { zombies: Array(6).fill({ defIdx: 7 }).concat(Array(5).fill({ defIdx: 5 })), delay: 1800 },
      { zombies: Array(8).fill({ defIdx: 7 }).concat(Array(3).fill({ defIdx: 6 })), delay: 1500 },
    ],
  },
  {
    title: "Fase 7 – Hordas",
    startSun: 100,
    bg: "#180a10",
    waves: [
      { zombies: Array(12).fill({ defIdx: 0 }).concat(Array(6).fill({ defIdx: 5 })), delay: 1400 },
      { zombies: Array(8).fill({ defIdx: 7 }).concat(Array(6).fill({ defIdx: 6 })), delay: 1400 },
    ],
  },
  {
    title: "Fase 8 – Mecânicos",
    startSun: 100,
    bg: "#101010",
    waves: [
      { zombies: Array(6).fill({ defIdx: 8 }).concat(Array(8).fill({ defIdx: 7 })), delay: 1500 },
      { zombies: Array(8).fill({ defIdx: 8 }).concat(Array(5).fill({ defIdx: 6 })), delay: 1300 },
    ],
  },
  {
    title: "Fase 9 – Apocalipse",
    startSun: 125,
    bg: "#1a0808",
    waves: [
      { zombies: Array(10).fill({ defIdx: 8 }).concat(Array(6).fill({ defIdx: 7 })), delay: 1200 },
      { zombies: Array(8).fill({ defIdx: 8 }).concat(Array(8).fill({ defIdx: 6 })), delay: 1200 },
    ],
  },
  {
    title: "Fase 10 – Boss Final",
    startSun: 150,
    bg: "#200808",
    waves: [
      { zombies: Array(8).fill({ defIdx: 8 }).concat(Array(4).fill({ defIdx: 9 })), delay: 1500 },
      { zombies: [{ defIdx: 9 }, { defIdx: 9 }, { defIdx: 9 }, { defIdx: 9 }, { defIdx: 9 }].concat(Array(10).fill({ defIdx: 8 })), delay: 1200 },
    ],
  },
];

const ROWS = 5;
const COLS = 9;

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export default function PlantsVsZombies({ onBack }: Props) {
  const [screen, setScreen] = useState<"menu" | "levelsel" | "playing" | "pause" | "win" | "lose" | "levelwin">("menu");
  const [currentLevel, setCurrentLevel] = useState(0);

  // Estado do jogo (refs para o loop de animação)
  const gridRef = useRef<(CellPlant | null)[][]>([]);
  const zombiesRef = useRef<Zombie[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const sunDropsRef = useRef<SunDrop[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const sunCountRef = useRef(150);
  const livesRef = useRef(5);
  const waveIdxRef = useRef(0);
  const spawnListRef = useRef<{ defIdx: number; row: number; delay: number }[]>([]);
  const spawnIdxRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const cdTimersRef = useRef<Record<string, number>>({});
  const nextIdRef = useRef(0);
  const lastTsRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const allWavesDoneRef = useRef(false);
  const gameStateRef = useRef<"running" | "over" | "win">("running");

  // Estado React para render da UI
  const [sunDisplay, setSunDisplay] = useState(150);
  const [livesDisplay, setLivesDisplay] = useState(5);
  const [waveDisplay, setWaveDisplay] = useState("Onda 1");
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [shovelMode, setShovelMode] = useState(false);
  const [cdDisplay, setCdDisplay] = useState<Record<string, number>>({});
  const [renderTick, setRenderTick] = useState(0);

  const forceRender = useCallback(() => setRenderTick(t => t + 1), []);

  // ─── INIT GAME ────────────────────────────────────────────────────────────
  function initGame(lvlIdx: number) {
    const lvl = LEVELS[lvlIdx];
    gridRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    zombiesRef.current = [];
    bulletsRef.current = [];
    sunDropsRef.current = [];
    floatTextsRef.current = [];
    sunCountRef.current = lvl.startSun;
    livesRef.current = 5;
    waveIdxRef.current = 0;
    spawnIdxRef.current = 0;
    spawnTimerRef.current = 0;
    nextIdRef.current = 0;
    lastTsRef.current = 0;
    allWavesDoneRef.current = false;
    gameStateRef.current = "running";
    cdTimersRef.current = {};
    PLANT_DEFS.forEach(p => (cdTimersRef.current[p.id] = 0));
    buildSpawnList(lvlIdx, 0);
    setSunDisplay(lvl.startSun);
    setLivesDisplay(5);
    setWaveDisplay("Onda 1");
    setSelectedPlant(null);
    setShovelMode(false);
    setScreen("playing");
    forceRender();
  }

  function buildSpawnList(lvlIdx: number, waveIdx: number) {
    const wave = LEVELS[lvlIdx].waves[waveIdx];
    const list: { defIdx: number; row: number; delay: number }[] = [];
    const shuffled = [...wave.zombies];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffled.forEach((z, i) => {
      list.push({
        defIdx: z.defIdx,
        row: z.row !== undefined ? z.row : Math.floor(Math.random() * ROWS),
        delay: i === 0 ? 3000 : wave.delay + Math.random() * 600,
      });
    });
    spawnListRef.current = list;
    spawnIdxRef.current = 0;
    spawnTimerRef.current = 0;
  }

  // ─── GAME LOOP ────────────────────────────────────────────────────────────
  const gameLoop = useCallback((ts: number) => {
    if (gameStateRef.current !== "running") return;
    const dt = lastTsRef.current === 0 ? 16 : Math.min(ts - lastTsRef.current, 80);
    lastTsRef.current = ts;

    const grid = gridRef.current;
    const zombies = zombiesRef.current;
    const bullets = bulletsRef.current;
    const sunDrops = sunDropsRef.current;

    // ── cd timers
    let cdChanged = false;
    PLANT_DEFS.forEach(p => {
      if ((cdTimersRef.current[p.id] || 0) > 0) {
        cdTimersRef.current[p.id] = Math.max(0, cdTimersRef.current[p.id] - dt / 1000);
        cdChanged = true;
      }
    });

    // ── spawns
    if (spawnIdxRef.current < spawnListRef.current.length) {
      spawnTimerRef.current += dt;
      const nextDelay = spawnListRef.current[spawnIdxRef.current]?.delay || 2000;
      if (spawnTimerRef.current >= nextDelay) {
        spawnTimerRef.current = 0;
        const s = spawnListRef.current[spawnIdxRef.current++];
        spawnZombieInternal(s.defIdx, s.row);
      }
    }

    // ── girassóis produzem sol
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (!cell) continue;
        const def = PLANT_DEFS.find(p => p.id === cell.defId);
        if (!def) continue;
        if (def.produceSun) {
          cell.sunTimer -= dt;
          if (cell.sunTimer <= 0) {
            cell.sunTimer = def.sunInterval!;
            dropSunInternal(r, c, true);
          }
        }
        // espinho causa dano
        if (def.isSpike) {
          const zHere = zombies.filter(z => {
            const zCol = Math.floor(z.x * COLS);
            return z.row === r && zCol === c;
          });
          zHere.forEach(z => {
            z.hp -= (def.shootDmg! * dt) / 1000 * 60;
            addFloat(r, c, `-${def.shootDmg!}`, "#fbbf24");
            if (z.hp <= 0) killZombie(z.id);
          });
        }
        // atiradores
        if (def.shootDmg && def.shootInterval && !def.isSpike) {
          const hasTarget = zombies.some(z => z.row === r && z.x * COLS > c);
          if (hasTarget) {
            cell.shootTimer -= dt;
            if (cell.shootTimer <= 0) {
              cell.shootTimer = def.shootInterval;
              fireBullet(r, c, def);
              if (def.id === "repeater") {
                setTimeout(() => fireBullet(r, c, def), 150);
              }
            }
          }
        }
      }
    }

    // ── mover balas
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.x += 1.1;
      if (b.x > 103) { bullets.splice(i, 1); continue; }
      const bXNorm = b.x / 100;
      let hit = false;
      for (let j = zombies.length - 1; j >= 0; j--) {
        const z = zombies[j];
        if (z.row !== b.row) continue;
        if (Math.abs(z.x - bXNorm) < 0.06) {
          hit = true;
          dealDmgZombie(z, b.dmg);
          if (b.slow) { z.slowTimer = 3000; z.speed = z.baseSpeed * 0.35; z.isFrozen = false; }
          if (b.freeze) { z.slowTimer = 4000; z.speed = 0; z.isFrozen = true; }
          if (b.explosive) {
            zombies.filter(zz => zz.row === b.row && Math.abs(zz.x - bXNorm) < 0.12)
              .forEach(zz => { if (zz.id !== z.id) dealDmgZombie(zz, b.dmg * 0.6); });
          }
          addFloat(b.row, z.x, `-${b.dmg}`, b.freeze ? "#93c5fd" : b.slow ? "#60a5fa" : "#fbbf24");
          bullets.splice(i, 1);
          break;
        }
      }
    }

    // ── mover zumbis
    for (let i = zombies.length - 1; i >= 0; i--) {
      const z = zombies[i];

      if (z.slowTimer > 0) {
        z.slowTimer -= dt;
        if (z.slowTimer <= 0) {
          z.slowTimer = 0;
          z.speed = z.baseSpeed;
          z.isFrozen = false;
        }
      }
      if (z.stunTimer > 0) { z.stunTimer -= dt; continue; }

      const col = Math.floor(z.x * COLS);
      const plantHere = col >= 0 && col < COLS && grid[z.row] ? grid[z.row][col] : null;

      if (plantHere) {
        z.eatTimer += dt;
        if (z.eatTimer >= 600) {
          z.eatTimer = 0;
          const def = PLANT_DEFS.find(p => p.id === plantHere.defId);
          // mina explode
          if (def?.isMine) {
            addFloat(z.row, z.x, "💥", "#ef4444");
            const dmg = z.maxHp * 1.5;
            dealDmgZombie(z, dmg);
            grid[z.row][col] = null;
            forceRender();
            continue;
          }
          plantHere.hp -= z.dmgPerSec;
          addFloat(z.row, col / COLS, `-${z.dmgPerSec}`, "#ef4444");
          if (plantHere.hp <= 0) {
            grid[z.row][col] = null;
            z.eatTimer = 0;
          }
          forceRender();
        }
      } else {
        z.eatTimer = 0;
        z.x -= z.speed * (dt / 16);
      }

      if (z.x <= 0) {
        livesRef.current = Math.max(0, livesRef.current - 1);
        setLivesDisplay(livesRef.current);
        killZombie(z.id);
        if (livesRef.current <= 0) {
          gameStateRef.current = "over";
          setScreen("lose");
          return;
        }
        continue;
      }
    }

    // ── checar fim de onda
    if (
      spawnIdxRef.current >= spawnListRef.current.length &&
      zombies.length === 0 &&
      !allWavesDoneRef.current
    ) {
      const lvl = LEVELS[currentLevel];
      const nextWave = waveIdxRef.current + 1;
      if (nextWave < lvl.waves.length) {
        waveIdxRef.current = nextWave;
        setWaveDisplay(`Onda ${nextWave + 1}`);
        sunCountRef.current += 75;
        setSunDisplay(sunCountRef.current);
        buildSpawnList(currentLevel, nextWave);
      } else {
        allWavesDoneRef.current = true;
        gameStateRef.current = "win";
        setTimeout(() => setScreen("levelwin"), 1000);
        return;
      }
    }

    // ── sol aleatório a cada 9s
    sunDropsRef.current = sunDropsRef.current.filter(s => !s.collected);

    if (Math.random() < (dt / 9000)) dropSunInternal(-1, -1, false);

    if (cdChanged) setCdDisplay({ ...cdTimersRef.current });
    setSunDisplay(sunCountRef.current);

    animFrameRef.current = requestAnimationFrame(gameLoop);
    setRenderTick(t => t + 1);
  }, [currentLevel]);

  function spawnZombieInternal(defIdx: number, row: number) {
    const def = ZOMBIE_DEFS[defIdx] || ZOMBIE_DEFS[0];
    const z: Zombie = {
      id: nextIdRef.current++,
      row,
      x: 1.01,
      hp: def.hp,
      maxHp: def.hp,
      speed: def.speed,
      baseSpeed: def.speed,
      dmgPerSec: def.dmg,
      emoji: def.emoji,
      eatTimer: 0,
      slowTimer: 0,
      stunTimer: 0,
      armor: def.armor || 0,
      maxArmor: def.armor || 0,
      armorEmoji: def.armorEmoji,
      isFrozen: false,
      shake: 0,
      type: def.type,
    };
    zombiesRef.current.push(z);
  }

  function dealDmgZombie(z: Zombie, dmg: number) {
    if (z.armor > 0) {
      const ad = Math.min(z.armor, dmg);
      z.armor -= ad;
      dmg -= ad;
    }
    z.hp -= dmg;
    z.shake = 200;
    if (z.hp <= 0) killZombie(z.id);
  }

  function killZombie(id: number) {
    zombiesRef.current = zombiesRef.current.filter(z => z.id !== id);
  }

  function fireBullet(r: number, c: number, def: PlantDef) {
    const b: Bullet = {
      id: nextIdRef.current++,
      row: r,
      x: (c / COLS) * 100 + 8,
      dmg: def.shootDmg!,
      slow: def.id === "snowpea",
      freeze: false,
      explosive: false,
    };
    bulletsRef.current.push(b);
  }

  function dropSunInternal(r: number, c: number, fromPlant: boolean) {
    const s: SunDrop = {
      id: nextIdRef.current++,
      x: fromPlant ? (c / COLS) * 100 + 5 + Math.random() * 5 : Math.random() * 85 + 5,
      y: fromPlant ? (r / ROWS) * 100 + 5 : Math.random() * 60 + 5,
      fromPlant,
      collected: false,
    };
    sunDropsRef.current.push(s);
  }

  function addFloat(row: number, x: number, text: string, color: string) {
    floatTextsRef.current.push({
      id: nextIdRef.current++,
      row,
      x: typeof x === "number" ? x * 100 : x,
      text,
      color,
    });
    setTimeout(() => {
      floatTextsRef.current = floatTextsRef.current.filter(f => f.text !== text);
    }, 700);
  }

  // ─── INICIAR LOOP ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (screen === "playing") {
      lastTsRef.current = 0;
      animFrameRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [screen, gameLoop]);

  // ─── AÇÕES DO JOGADOR ─────────────────────────────────────────────────────
  function handleCellClick(r: number, c: number) {
    if (screen !== "playing") return;
    const grid = gridRef.current;

    if (shovelMode) {
      if (grid[r][c]) {
        grid[r][c] = null;
        forceRender();
      }
      return;
    }

    if (!selectedPlant) return;
    const def = PLANT_DEFS.find(p => p.id === selectedPlant);
    if (!def) return;
    if (sunCountRef.current < def.cost) return;
    if ((cdTimersRef.current[def.id] || 0) > 0) return;
    if (grid[r][c]) return;

    sunCountRef.current -= def.cost;
    setSunDisplay(sunCountRef.current);
    cdTimersRef.current[def.id] = def.cooldown;
    setCdDisplay({ ...cdTimersRef.current });

    if (def.isBomb) {
      // explosão imediata 3x3
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            grid[nr][nc] = null;
          }
        }
      }
      const killRows = [r - 1, r, r + 1].filter(x => x >= 0 && x < ROWS);
      zombiesRef.current = zombiesRef.current.filter(z => {
        const zc = Math.floor(z.x * COLS);
        const inRow = killRows.includes(z.row);
        const inCol = zc >= c - 1 && zc <= c + 1;
        if (inRow && inCol) { addFloat(z.row, z.x, "💥 BOOM!", "#ef4444"); return false; }
        return true;
      });
      forceRender();
      return;
    }

    const newPlant: CellPlant = {
      defId: def.id,
      hp: def.maxHp,
      shootTimer: def.shootInterval || 0,
      sunTimer: def.sunInterval || 0,
    };
    grid[r][c] = newPlant;
    forceRender();
  }

  function collectSun(sid: number) {
    const s = sunDropsRef.current.find(x => x.id === sid);
    if (!s || s.collected) return;
    s.collected = true;
    sunCountRef.current += 25;
    setSunDisplay(sunCountRef.current);
  }

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  function canPlant(defId: string) {
    const def = PLANT_DEFS.find(p => p.id === defId);
    if (!def) return false;
    return sunCountRef.current >= def.cost && (cdTimersRef.current[defId] || 0) === 0;
  }

  // ─── TELA: MENU ───────────────────────────────────────────────────────────
  if (screen === "menu") {
    return (
      <div style={styles.shell}>
        <div style={styles.menuBg}>
          <button style={styles.backBtn} onClick={onBack}>← Voltar</button>
          <div style={styles.menuTitle}>🌻 Plants vs Zombies</div>
          <div style={styles.menuSubtitle}>Defenda seu jardim!</div>
          <div style={styles.menuZombieRow}>🧟‍♂️🧟🧟‍♀️</div>
          <div style={styles.menuActions}>
            <button style={styles.bigBtn} onClick={() => setScreen("levelsel")}>🌱 Jogar</button>
          </div>
          <div style={styles.menuHints}>
            <div style={styles.hintItem}>🌻 Plante girassóis para gerar sol</div>
            <div style={styles.hintItem}>🌿 Ervilheiros atiram nos zumbis</div>
            <div style={styles.hintItem}>🥜 Nozes servem de barreira</div>
            <div style={styles.hintItem}>🍒 Cereja bomba explode área 3×3</div>
          </div>
        </div>
      </div>
    );
  }

  // ─── TELA: SELEÇÃO DE FASE ────────────────────────────────────────────────
  if (screen === "levelsel") {
    return (
      <div style={styles.shell}>
        <div style={styles.levelSelBg}>
          <div style={styles.levelSelHeader}>
            <button style={styles.backBtn} onClick={() => setScreen("menu")}>← Voltar</button>
            <span style={styles.levelSelTitle}>Escolha a Fase</span>
          </div>
          <div style={styles.levelList}>
            {LEVELS.map((lvl, i) => (
              <div key={i} style={styles.levelCard} onClick={() => { setCurrentLevel(i); initGame(i); }}>
                <span style={styles.levelNum}>Fase {i + 1}</span>
                <span style={styles.levelName}>{lvl.title.split("–")[1]?.trim()}</span>
                <span style={styles.levelArrow}>▶</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── TELA: WIN / LOSE ─────────────────────────────────────────────────────
  if (screen === "lose" || screen === "win") {
    const won = screen === "win";
    return (
      <div style={styles.shell}>
        <div style={{ ...styles.endScreen, background: won ? "#0a2010" : "#200a0a" }}>
          <div style={styles.endEmoji}>{won ? "🏆" : "💀"}</div>
          <div style={{ ...styles.endTitle, color: won ? "#4ade80" : "#ef4444" }}>
            {won ? "VITÓRIA!" : "GAME OVER"}
          </div>
          <div style={styles.endSub}>{won ? "Você sobreviveu!" : "Os zumbis invadiram..."}</div>
          <button style={styles.bigBtn} onClick={() => initGame(currentLevel)}>🔄 Tentar de novo</button>
          <button style={{ ...styles.bigBtn, background: "#1f2c34", marginTop: 8 }} onClick={() => setScreen("levelsel")}>📋 Fases</button>
        </div>
      </div>
    );
  }

  if (screen === "levelwin") {
    const nextLvl = currentLevel + 1;
    const hasNext = nextLvl < LEVELS.length;
    return (
      <div style={styles.shell}>
        <div style={{ ...styles.endScreen, background: "#0a2010" }}>
          <div style={styles.endEmoji}>🌟</div>
          <div style={{ ...styles.endTitle, color: "#fbbf24" }}>FASE {currentLevel + 1} COMPLETA!</div>
          <div style={styles.endSub}>{LEVELS[currentLevel].title}</div>
          {hasNext ? (
            <button style={styles.bigBtn} onClick={() => { setCurrentLevel(nextLvl); initGame(nextLvl); }}>
              ▶ Fase {nextLvl + 1}
            </button>
          ) : (
            <div style={{ color: "#4ade80", fontSize: 18, fontWeight: 700, textAlign: "center" }}>
              🎉 Você zerou o jogo!
            </div>
          )}
          <button style={{ ...styles.bigBtn, background: "#1f2c34", marginTop: 8 }} onClick={() => initGame(currentLevel)}>🔄 Replay</button>
          <button style={{ ...styles.bigBtn, background: "#1a1a1a", marginTop: 8 }} onClick={() => setScreen("levelsel")}>📋 Fases</button>
        </div>
      </div>
    );
  }

  // ─── TELA: JOGO ───────────────────────────────────────────────────────────
  const grid = gridRef.current;
  const zombies = zombiesRef.current;
  const bullets = bulletsRef.current;
  const sunDrops = sunDropsRef.current.filter(s => !s.collected);

  return (
    <div style={styles.shell}>
      {/* TOPBAR */}
      <div style={styles.topbar}>
        <button style={styles.miniBtn} onClick={() => { cancelAnimationFrame(animFrameRef.current); setScreen("menu"); }}>✕</button>
        <div style={styles.sunBox}>
          <span style={{ fontSize: 16 }}>☀️</span>
          <span style={styles.sunNum}>{sunDisplay}</span>
        </div>
        <span style={styles.waveLabel}>{waveDisplay} · Fase {currentLevel + 1}</span>
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: livesDisplay }).map((_, i) => (
            <span key={i} style={{ fontSize: 13 }}>❤️</span>
          ))}
        </div>
      </div>

      {/* SHOP */}
      <div style={styles.shop}>
        <div
          style={{ ...styles.shovelBtn, borderColor: shovelMode ? "#fbbf24" : "#4a3010" }}
          onClick={() => { setShovelMode(s => !s); setSelectedPlant(null); }}
        >🪣</div>
        {PLANT_DEFS.map(p => {
          const cd = cdDisplay[p.id] || 0;
          const pct = cd > 0 ? Math.round((cd / p.cooldown) * 100) : 0;
          const canAfford = sunDisplay >= p.cost;
          const onCd = cd > 0;
          const isSel = selectedPlant === p.id;
          return (
            <div
              key={p.id}
              style={{
                ...styles.plantCard,
                opacity: (!canAfford || onCd) ? 0.45 : 1,
                borderColor: isSel ? "#4ade80" : onCd ? "#1a3a1a" : "#2a5a2a",
                background: isSel ? "#16401a" : "#1a3a1a",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() => {
                if (!canAfford || onCd) return;
                setShovelMode(false);
                setSelectedPlant(prev => prev === p.id ? null : p.id);
              }}
            >
              {pct > 0 && (
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "#aaa", fontWeight: 700, zIndex: 2,
                }}>
                  {Math.ceil(cd)}s
                </div>
              )}
              <span style={{ fontSize: 22, lineHeight: 1 }}>{p.emoji}</span>
              <span style={styles.cardName}>{p.name}</span>
              <span style={styles.cardCost}>☀️{p.cost}</span>
              <div style={{ position: "absolute", bottom: 0, left: 0, height: 3, width: `${100 - pct}%`, background: "#4ade80", borderRadius: "0 0 6px 6px", transition: "width .3s" }} />
            </div>
          );
        })}
      </div>

      {/* CAMPO */}
      <div style={{ ...styles.garden, background: LEVELS[currentLevel]?.bg || "#0f2010", position: "relative", flex: 1 }}>
        {/* Grid de células */}
        {Array.from({ length: ROWS }, (_, r) => (
          <div key={r} style={{ display: "flex", flex: 1 }}>
            {Array.from({ length: COLS }, (_, c) => {
              const cell = grid[r]?.[c] || null;
              const def = cell ? PLANT_DEFS.find(p => p.id === cell.defId) : null;
              const hpPct = cell && def ? Math.round((cell.hp / def.maxHp) * 100) : 100;
              const evenRow = r % 2 === 0;
              return (
                <div
                  key={c}
                  onClick={() => handleCellClick(r, c)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: evenRow ? "rgba(255,255,255,0.025)" : "transparent",
                    border: "0.5px solid rgba(255,255,255,0.04)",
                    cursor: selectedPlant || shovelMode ? "pointer" : "default",
                    position: "relative",
                    minHeight: 0,
                  }}
                >
                  {cell && def && (
                    <>
                      <span style={{ fontSize: 20, lineHeight: 1, filter: cell.hp < def.maxHp * 0.4 ? "grayscale(60%)" : "none" }}>{def.emoji}</span>
                      <div style={{ width: 28, height: 3, background: "#222", borderRadius: 2, marginTop: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${hpPct}%`, background: hpPct > 60 ? "#4ade80" : hpPct > 30 ? "#fbbf24" : "#ef4444", borderRadius: 2, transition: "width .15s" }} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Zumbis */}
        {zombies.map(z => {
          const hpPct = Math.round((z.hp / z.maxHp) * 100);
          const armorPct = z.maxArmor > 0 ? Math.round((z.armor / z.maxArmor) * 100) : 0;
          const rowH = 100 / ROWS;
          const isBoss = z.type === 9;
          return (
            <div
              key={z.id}
              style={{
                position: "absolute",
                left: `${Math.round(z.x * 100)}%`,
                top: `${Math.round(z.row * rowH)}%`,
                height: `${rowH}%`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateX(-50%) ${z.isFrozen ? "scale(0.95)" : ""}`,
                zIndex: 5,
                filter: z.isFrozen ? "hue-rotate(180deg) brightness(1.3)" : "none",
                transition: "left .05s linear",
              }}
            >
              <span style={{ fontSize: isBoss ? 30 : 22, lineHeight: 1 }}>{z.emoji}</span>
              <div style={{ width: isBoss ? 40 : 30, height: 3, background: "#222", borderRadius: 2, marginTop: 1, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${hpPct}%`, background: "#ef4444", borderRadius: 2 }} />
              </div>
              {z.maxArmor > 0 && (
                <div style={{ width: isBoss ? 40 : 30, height: 2, background: "#222", borderRadius: 2, marginTop: 1, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${armorPct}%`, background: "#94a3b8", borderRadius: 2 }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Balas */}
        {bullets.map(b => (
          <div
            key={b.id}
            style={{
              position: "absolute",
              left: `${Math.round(b.x)}%`,
              top: `${Math.round((b.row / ROWS + 0.1 / ROWS) * 100)}%`,
              transform: "translate(-50%,-50%)",
              fontSize: 12,
              zIndex: 6,
              pointerEvents: "none",
            }}
          >
            {b.slow ? "❄️" : b.freeze ? "🧊" : "🟢"}
          </div>
        ))}

        {/* Sol */}
        {sunDrops.map(s => (
          <div
            key={s.id}
            onClick={() => collectSun(s.id)}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              fontSize: 22,
              cursor: "pointer",
              zIndex: 15,
              animation: "pvzSunPulse 0.8s ease-in-out infinite alternate",
            }}
          >
            ☀️
          </div>
        ))}

        {/* Float texts */}
        {floatTextsRef.current.map(f => (
          <div
            key={f.id}
            style={{
              position: "absolute",
              left: `${f.x}%`,
              top: `${Math.round((f.row / ROWS) * 100 + 10)}%`,
              color: f.color,
              fontSize: 11,
              fontWeight: 700,
              zIndex: 20,
              pointerEvents: "none",
              animation: "pvzFloat .7s ease forwards",
            }}
          >
            {f.text}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pvzSunPulse { from { transform: scale(1) } to { transform: scale(1.18) } }
        @keyframes pvzFloat { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-22px)} }
      `}</style>
    </div>
  );
}

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  shell: {
    width: "100%",
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
    background: "#0b141a",
    fontFamily: "-apple-system, 'Helvetica Neue', Arial, sans-serif",
    overflow: "hidden",
    WebkitUserSelect: "none",
    userSelect: "none",
  },
  menuBg: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0b1a0b",
    gap: 12,
    padding: 24,
    overflowY: "auto",
  },
  backBtn: {
    alignSelf: "flex-start",
    background: "none",
    border: "none",
    color: "#4ade80",
    fontSize: 15,
    cursor: "pointer",
    padding: "4px 0",
    marginBottom: 8,
  },
  menuTitle: {
    color: "#4ade80",
    fontSize: 28,
    fontWeight: 800,
    textAlign: "center",
  },
  menuSubtitle: { color: "#6b7280", fontSize: 14, textAlign: "center" },
  menuZombieRow: { fontSize: 40, letterSpacing: 8, margin: "8px 0" },
  menuActions: { marginTop: 8 },
  bigBtn: {
    background: "#16a34a",
    border: "none",
    color: "#fff",
    padding: "14px 36px",
    borderRadius: 28,
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    display: "block",
    minWidth: 160,
    textAlign: "center",
  },
  menuHints: {
    marginTop: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    background: "#0f240f",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #1a4a1a",
    width: "100%",
    maxWidth: 320,
  },
  hintItem: { color: "#86efac", fontSize: 13 },
  levelSelBg: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#0b1a0b",
    overflow: "hidden",
  },
  levelSelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
    background: "#111b21",
    flexShrink: 0,
  },
  levelSelTitle: { color: "#e9edef", fontSize: 17, fontWeight: 700 },
  levelList: {
    flex: 1,
    overflowY: "auto",
    padding: "12px 12px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  levelCard: {
    background: "#1a3a1a",
    border: "1px solid #2a5a2a",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
  },
  levelNum: { color: "#4ade80", fontWeight: 800, fontSize: 14, minWidth: 52 },
  levelName: { color: "#e9edef", fontSize: 14, flex: 1 },
  levelArrow: { color: "#4ade80", fontSize: 16 },
  endScreen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  endEmoji: { fontSize: 56 },
  endTitle: { fontSize: 30, fontWeight: 900 },
  endSub: { color: "#9ca3af", fontSize: 15, textAlign: "center", marginBottom: 8 },
  topbar: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    background: "#111",
    borderBottom: "1px solid #1a3a1a",
    flexShrink: 0,
    zIndex: 20,
  },
  miniBtn: {
    background: "none",
    border: "1px solid #333",
    color: "#9ca3af",
    width: 30,
    height: 30,
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sunBox: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#1a3a00",
    borderRadius: 16,
    padding: "3px 10px",
    border: "1px solid #2a5a00",
    flexShrink: 0,
  },
  sunNum: { color: "#fbbf24", fontSize: 15, fontWeight: 700 },
  waveLabel: { color: "#86efac", fontSize: 12, fontWeight: 600, flex: 1, textAlign: "center" },
  shop: {
    display: "flex",
    gap: 5,
    padding: "5px 8px",
    background: "#0b141a",
    borderBottom: "2px solid #1a3a1a",
    overflowX: "auto",
    flexShrink: 0,
    scrollbarWidth: "none",
    alignItems: "center",
  },
  shovelBtn: {
    width: 46,
    height: 60,
    background: "#2a1a00",
    border: "2px solid #4a3010",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    cursor: "pointer",
    flexShrink: 0,
  },
  plantCard: {
    flexShrink: 0,
    width: 50,
    height: 60,
    background: "#1a3a1a",
    borderRadius: 8,
    border: "2px solid #2a5a2a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    cursor: "pointer",
  },
  cardName: { fontSize: 8, color: "#6ee7b7", fontWeight: 700, textAlign: "center", lineHeight: 1.1 },
  cardCost: { fontSize: 9, color: "#fbbf24", fontWeight: 700 },
  garden: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};
import { useState, useEffect, useRef, useCallback } from "react";

import * as Tone from "tone";

/* ============================================================
   TIPOS
============================================================ */
type Direction = "up" | "down" | "left" | "right";
type EnemyType = "slime" | "goblin" | "skeleton" | "boss";
type ItemType = "potion" | "weapon" | "armor" | "coin" | "chest";
type Ability = "dash" | "shield" | "arrow" | "fireball";

type Enemy = {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  atk: number;
  speed: number;
  aggro: number;
  radius: number;
  lastAttack: number;
  lastShot: number;
  lastHitBy: number;
  flash: number;
  dying: number;
  facing: Direction;
};

type MapItem = {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  name: string;
  value: number;
  collected: boolean;
  opened?: boolean;
  ability?: Ability;
};

type Projectile = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  dmg: number;
  ttl: number;
  owner: "enemy" | "player";
  color: string;
  size: number;
};

type FloatText = {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  born: number;
};

type LevelConfig = {
  id: number;
  name: string;
  cols: number;
  rows: number;
  walls: [number, number][];
  water: [number, number][];
  playerStart: [number, number];
  door: [number, number];
  enemies: { type: EnemyType; x: number; y: number }[];
  items: { type: ItemType; x: number; y: number; name: string; value: number; ability?: Ability }[];
  isBoss?: boolean;
};

type GameState = "menu" | "playing" | "levelClear" | "gameOver" | "victory";

/* ============================================================
   CONFIG DE INIMIGOS E XP
============================================================ */
const ENEMY_BASE: Record<
  EnemyType,
  { hp: number; atk: number; speed: number; aggro: number; radius: number }
> = {
  slime: { hp: 22, atk: 6, speed: 1.1, aggro: 3.2, radius: 0.32 },
  goblin: { hp: 32, atk: 9, speed: 1.9, aggro: 4.2, radius: 0.33 },
  skeleton: { hp: 26, atk: 8, speed: 1.4, aggro: 5.2, radius: 0.33 },
  boss: { hp: 220, atk: 17, speed: 1.6, aggro: 9, radius: 0.55 },
};

const XP_GAIN: Record<EnemyType, number> = { slime: 8, goblin: 14, skeleton: 16, boss: 140 };

/* ============================================================
   HABILIDADES (arma secundaria trocavel via inventario)
============================================================ */
const ABILITY_INFO: Record<Ability, { label: string; icon: string; desc: string }> = {
  dash: { label: "Investida", icon: "💨", desc: "Avanca rapidamente e fica invulneravel por um instante." },
  shield: { label: "Escudo Arcano", icon: "🛡", desc: "Fica invulneravel por 2 segundos." },
  arrow: { label: "Flecha", icon: "🏹", desc: "Dispara a distancia, metade do dano da arma principal. Recarga curta." },
  fireball: { label: "Bola de Fogo", icon: "🔥", desc: "Dispara a distancia com o mesmo dano da arma principal. Recarga longa." },
};

const ABILITY_COOLDOWN_MS: Record<Ability, number> = {
  dash: 3500,
  shield: 9000,
  arrow: 1100,
  fireball: 7000,
};

/* ============================================================
   VISUAL DOS ITENS DE CHAO
============================================================ */
const ITEM_VISUALS: Record<ItemType, { bg: string; radius: string; scale: number }> = {
  potion: { bg: "radial-gradient(circle at 35% 30%,#93c5fd,#2563eb)", radius: "50%", scale: 0.55 },
  weapon: { bg: "radial-gradient(circle at 35% 30%,#fde68a,#d97706)", radius: "4px", scale: 0.55 },
  armor: { bg: "radial-gradient(circle at 35% 30%,#d1d5db,#6b7280)", radius: "4px", scale: 0.55 },
  coin: { bg: "radial-gradient(circle at 35% 30%,#fff7ae,#eab308)", radius: "50%", scale: 0.32 },
  chest: { bg: "linear-gradient(180deg,#c68642,#7c4a24)", radius: "3px", scale: 0.72 },
};

/* ============================================================
   GERADOR DE SALAS (retangulo oco com uma abertura)
============================================================ */
type Gap = { side: "top" | "bottom" | "left" | "right"; at: number };
function room(x0: number, x1: number, y0: number, y1: number, gap: Gap): [number, number][] {
  const w: [number, number][] = [];
  for (let x = x0; x <= x1; x++) {
    if (!(gap.side === "top" && x === gap.at)) w.push([x, y0]);
    if (!(gap.side === "bottom" && x === gap.at)) w.push([x, y1]);
  }
  for (let y = y0 + 1; y < y1; y++) {
    if (!(gap.side === "left" && y === gap.at)) w.push([x0, y]);
    if (!(gap.side === "right" && y === gap.at)) w.push([x1, y]);
  }
  return w;
}

function roomSlots(x0: number, x1: number, y0: number, y1: number): [number, number][] {
  const midX = Math.round((x0 + x1) / 2);
  const midY = Math.round((y0 + y1) / 2);
  const qx0 = Math.round(x0 + (x1 - x0) / 4);
  const qx1 = Math.round(x1 - (x1 - x0) / 4);
  const qy0 = Math.round(y0 + (y1 - y0) / 4);
  const qy1 = Math.round(y1 - (y1 - y0) / 4);
  return [
    [x0 + 1, y0 + 1],
    [x1 - 1, y0 + 1],
    [x0 + 1, y1 - 1],
    [x1 - 1, y1 - 1],
    [midX, midY],
    [qx0, qy0],
    [qx1, qy0],
    [qx0, qy1],
    [qx1, qy1],
    [midX, y0 + 1],
    [midX, y1 - 1],
    [x0 + 1, midY],
    [x1 - 1, midY],
  ];
}

/* ============================================================
   GERADOR DE FASES (17 colunas fixas, mapas crescem em "bandas" de salas)
============================================================ */
const MCOLS2 = 17;

function bandRows(bandIndex: number): [number, number] {
  const top = 3 + bandIndex * 10;
  return [top, top + 6];
}

// Quais salas (banda, lado) estao ativas em cada fase normal (indice 0..13)
const ROOM_TABLE: [number, "L" | "R"][][] = [
  [[0, "L"]],
  [[0, "L"], [0, "R"]],
  [[0, "L"], [0, "R"], [1, "L"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"], [2, "R"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"], [2, "R"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"], [2, "R"], [3, "L"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"], [2, "R"], [3, "L"], [3, "R"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"], [2, "R"], [3, "L"], [3, "R"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"], [2, "R"], [3, "L"], [3, "R"], [4, "L"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"], [2, "R"], [3, "L"], [3, "R"], [4, "L"], [4, "R"]],
  [[0, "L"], [0, "R"], [1, "L"], [1, "R"], [2, "L"], [2, "R"], [3, "L"], [3, "R"], [4, "L"], [4, "R"]],
];

const LEVEL_NAMES = [
  "Floresta Sombria",
  "Pantano Nebuloso",
  "Ruinas Esquecidas",
  "Caverna Profunda",
  "Fortaleza Maldita",
  "Bosque Petrificado",
  "Catacumbas Antigas",
  "Torre do Feiticeiro",
  "Vale Congelado",
  "Mina Abandonada",
  "Templo Afundado",
  "Picos Sombrios",
  "Labirinto de Pedra",
  "Portao do Abismo",
];

const WEAPON_PROGRESSION = [
  { name: "Espada de Ferro", value: 4 },
  { name: "Machado de Guerra", value: 7 },
  { name: "Espada Elfica", value: 10 },
  { name: "Lamina Rubra", value: 13 },
  { name: "Espada Sombria", value: 16 },
  { name: "Lamina do Vazio", value: 19 },
  { name: "Espada Runica", value: 23 },
];

const ARMOR_PROGRESSION = [
  { name: "Escudo de Couro", value: 2 },
  { name: "Armadura de Placas", value: 5 },
  { name: "Cota Elfica", value: 8 },
  { name: "Armadura Runica", value: 11 },
  { name: "Placas do Guardiao", value: 14 },
  { name: "Manto Sombrio", value: 18 },
  { name: "Armadura Draconica", value: 21 },
];

function pickEnemyTypes(idx: number, count: number): EnemyType[] {
  const pool: EnemyType[] =
    idx < 2 ? ["slime"] : idx < 5 ? ["slime", "goblin"] : idx < 9 ? ["goblin", "skeleton", "slime"] : ["goblin", "skeleton"];
  const arr: EnemyType[] = [];
  for (let i = 0; i < count; i++) arr.push(pool[i % pool.length]);
  return arr;
}

// Fases em que novas habilidades sao desbloqueadas (indice 0-based), agora entregues
// via um bau especial que aparece no chao do mapa (em vez de automatico ao limpar a sala).
const UNLOCK_AT: { levelIdx: number; ability: Ability }[] = [
  { levelIdx: 0, ability: "shield" },
  { levelIdx: 2, ability: "arrow" },
  { levelIdx: 7, ability: "fireball" },
];

function buildNormalLevels(): LevelConfig[] {
  const levels: LevelConfig[] = [];
  let weaponIdx = 0;
  let armorIdx = 0;

  for (let idx = 0; idx < 14; idx++) {
    const roomsActive = ROOM_TABLE[idx];
    const bands = Math.max(...roomsActive.map(([b]) => b)) + 1;
    const cols = MCOLS2;
    const rows = bandRows(bands - 1)[1] + 4;

    let walls: [number, number][] = [];
    const rooms: { x0: number; x1: number; y0: number; y1: number }[] = [];
    for (const [band, side] of roomsActive) {
      const [y0, y1] = bandRows(band);
      const x0 = side === "L" ? 2 : cols - 7;
      const x1 = side === "L" ? 6 : cols - 3;
      const gapSide: "left" | "right" = side === "L" ? "right" : "left";
      walls = walls.concat(room(x0, x1, y0, y1, { side: gapSide, at: Math.round((y0 + y1) / 2) }));
      rooms.push({ x0, x1, y0, y1 });
    }

    // Mais inimigos por sala conforme a aventura avanca (mapas maiores pedem mais oposicao)
    const enemyCount = idx < 2 ? 2 : idx < 5 ? 3 : idx < 9 ? 4 : 5;
    const types = pickEnemyTypes(idx, enemyCount);
    const enemies: { type: EnemyType; x: number; y: number }[] = [];
    const items: { type: ItemType; x: number; y: number; name: string; value: number; ability?: Ability }[] = [];

    const abilityUnlock = UNLOCK_AT.find((u) => u.levelIdx === idx);
    const abilityChestRoom = Math.min(rooms.length - 1, Math.floor(rooms.length / 2));
    const coinCount = idx < 4 ? 2 : 3;

    rooms.forEach((r, ri) => {
      const slots = roomSlots(r.x0, r.x1, r.y0, r.y1);
      let slotI = 0;

      for (let e = 0; e < enemyCount && slotI < slots.length; e++, slotI++) {
        const [sx, sy] = slots[slotI];
        enemies.push({ type: types[e % types.length], x: sx, y: sy });
      }

      if (ri === 0 && slotI < slots.length) {
        const [sx, sy] = slots[slotI++];
        items.push({ type: "potion", x: sx, y: sy, name: "Pocao de Vida", value: 30 + idx * 2 });
      }

      // moedas espalhadas pela sala, para o mapa nao ficar vazio
      for (let c = 0; c < coinCount && slotI < slots.length; c++, slotI++) {
        const [sx, sy] = slots[slotI];
        items.push({ type: "coin", x: sx, y: sy, name: "Moeda", value: 5 + Math.floor(idx / 2) });
      }

      // bau garantido com a habilidade secundaria da fase
      if (abilityUnlock && ri === abilityChestRoom && slotI < slots.length) {
        const [sx, sy] = slots[slotI++];
        items.push({
          type: "chest",
          x: sx,
          y: sy,
          name: `Bau: ${ABILITY_INFO[abilityUnlock.ability].label}`,
          value: 25 + idx * 4,
          ability: abilityUnlock.ability,
        });
      } else if (idx >= 1 && ri === rooms.length - 1 && slotI < slots.length) {
        // bau de tesouro comum (so moedas) na ultima sala da fase
        const [sx, sy] = slots[slotI++];
        items.push({ type: "chest", x: sx, y: sy, name: "Bau do Tesouro", value: 15 + idx * 3 });
      }
    });

    if (idx % 2 === 0 && weaponIdx < WEAPON_PROGRESSION.length) {
      const w = WEAPON_PROGRESSION[weaponIdx++];
      const r = rooms[rooms.length - 1];
      const slots = roomSlots(r.x0, r.x1, r.y0, r.y1);
      const [sx, sy] = slots[slots.length - 1];
      items.push({ type: "weapon", x: sx, y: sy, name: w.name, value: w.value });
    } else if (armorIdx < ARMOR_PROGRESSION.length) {
      const a = ARMOR_PROGRESSION[armorIdx++];
      const r = rooms[Math.min(1, rooms.length - 1)];
      const slots = roomSlots(r.x0, r.x1, r.y0, r.y1);
      const [sx, sy] = slots[slots.length - 2 >= 0 ? slots.length - 2 : 0];
      items.push({ type: "armor", x: sx, y: sy, name: a.name, value: a.value });
    }

    levels.push({
      id: idx + 1,
      name: LEVEL_NAMES[idx],
      cols,
      rows,
      walls,
      water: idx % 4 === 1 ? [[7, bandRows(0)[1] + 2], [9, bandRows(0)[1] + 2]] : [],
      playerStart: [8, rows - 2],
      door: [8, 1],
      enemies,
      items,
    });
  }
  return levels;
}

const BOSS_LEVEL: LevelConfig = {
  id: 15,
  name: "Covil do Dragao Ancestral",
  cols: 17,
  rows: 31,
  walls: [
    [5, 9], [11, 9],
    [4, 15], [12, 15],
    [5, 21], [11, 21],
    [8, 12], [8, 18],
  ],
  water: [],
  playerStart: [8, 27],
  door: [8, 1],
  enemies: [
    { type: "boss", x: 8, y: 6 },
    { type: "skeleton", x: 5, y: 13 },
    { type: "skeleton", x: 11, y: 13 },
    { type: "goblin", x: 5, y: 19 },
    { type: "goblin", x: 11, y: 19 },
    { type: "goblin", x: 8, y: 23 },
  ],
  items: [
    { type: "potion", x: 3, y: 25, name: "Pocao de Vida", value: 40 },
    { type: "potion", x: 13, y: 25, name: "Pocao de Vida", value: 40 },
    { type: "potion", x: 8, y: 16, name: "Pocao de Vida", value: 40 },
    { type: "coin", x: 5, y: 25, name: "Moeda", value: 25 },
    { type: "coin", x: 11, y: 25, name: "Moeda", value: 25 },
    { type: "coin", x: 8, y: 20, name: "Moeda", value: 25 },
    { type: "chest", x: 8, y: 9, name: "Bau do Dragao", value: 150 },
  ],
  isBoss: true,
};

const LEVELS: LevelConfig[] = [...buildNormalLevels(), BOSS_LEVEL];

/* ============================================================
   VIEWPORT (camera)
============================================================ */
const VIEWPORT_COLS = 9;
const VIEWPORT_ROWS = 13;

/* ============================================================
   SPRITES EM PIXEL (CSS)
============================================================ */
const HUMANOID_SHAPE = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 4, 1, 1, 4, 1, 0],
  [0, 2, 2, 2, 2, 2, 2, 0],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [0, 2, 2, 2, 2, 2, 2, 0],
  [0, 3, 3, 0, 0, 3, 3, 0],
  [0, 3, 3, 0, 0, 3, 3, 0],
];

const SLIME_SHAPE = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 2, 1, 1, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 0],
];

const BOSS_SHAPE = [
  [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 4, 1, 1, 4, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 3, 3, 0, 0, 0, 0, 3, 3, 0],
  [0, 3, 3, 0, 0, 0, 0, 3, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const PALETTES: Record<string, Record<number, string>> = {
  player: { 1: "#f2c299", 2: "#1fae7a", 3: "#2f3b52", 4: "#0b1014" },
  slime: { 1: "#3ddc84", 2: "#0b1014" },
  goblin: { 1: "#8fbf5a", 2: "#4c6b2a", 3: "#2f3b1f", 4: "#0b1014" },
  skeleton: { 1: "#e8e8e0", 2: "#c9c9bd", 3: "#8f8f82", 4: "#0b1014" },
  boss: { 1: "#ff6b6b", 2: "#8f1f2b", 3: "#3b0a10", 4: "#ffd23f" },
};

function Pixels({
  shape,
  palette,
  flip,
  flash,
  dyingProgress,
}: {
  shape: number[][];
  palette: Record<number, string>;
  flip?: boolean;
  flash?: boolean;
  dyingProgress?: number;
}) {
  const rows = shape.length;
  const cols = shape[0].length;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: "100%",
        height: "100%",
        transform: `${flip ? "scaleX(-1)" : ""} ${
          dyingProgress ? `scale(${1 - dyingProgress}) rotate(${dyingProgress * 60}deg)` : ""
        }`,
        opacity: dyingProgress ? 1 - dyingProgress : 1,
        transition: "transform 0.05s linear",
      }}
    >
      {shape.flatMap((row, ri) =>
        row.map((v, ci) => (
          <div
            key={`${ri}-${ci}`}
            style={{
              background: v === 0 ? "transparent" : flash ? "#ffffff" : palette[v],
            }}
          />
        ))
      )}
    </div>
  );
}

/* ============================================================
   HELPERS
============================================================ */
const now = () => performance.now();
let uid = 0;
const nextId = () => `${Date.now()}-${uid++}`;

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x1 - x2, y1 - y2);
}

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
export default function RPGAdventure({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [levelIndex, setLevelIndex] = useState(0);
  const [, forceTick] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const invOpenRef = useRef(false);
  useEffect(() => {
    invOpenRef.current = inventoryOpen;
  }, [inventoryOpen]);

  const musicRef = useRef<{
    started: boolean;
    melody?: any;
    bass?: any;
    pad?: any;
    perc?: any;
    hat?: any;
    reverb?: any;
    delay?: any;
    loops?: any[];
  }>({ started: false });

  const g = useRef({
    player: {
      x: 8,
      y: 21,
      hp: 100,
      maxHp: 100,
      atk: 10,
      def: 1,
      weaponName: "Punhos",
      armorName: "Roupa Simples",
      potions: 1,
      gold: 0,
      facing: "up" as Direction,
      lastAttack: 0,
      attackUntil: 0,
      invulnUntil: 0,
      level: 1,
      xp: 0,
      xpToNext: 30,
      unlockedAbilities: ["dash"] as Ability[],
      equippedAbility: "dash" as Ability,
      abilityCooldowns: { dash: 0, shield: 0, arrow: 0, fireball: 0 } as Record<Ability, number>,
      shieldUntil: 0,
    },
    enemies: [] as Enemy[],
    items: [] as MapItem[],
    projectiles: [] as Projectile[],
    floats: [] as FloatText[],
    joystick: { active: false, dx: 0, dy: 0 },
    keys: { up: false, down: false, left: false, right: false },
    doorOpen: false,
    doorWasOpen: false,
    lastFrame: 0,
    shake: 0,
    pendingLevelUps: 0,
    renderTick: 0,
  });

  const joyBaseRef = useRef<HTMLDivElement | null>(null);
  const joyPointerId = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const level = LEVELS[levelIndex];

  /* ---------- musica de fundo (Tone.js, gerada proceduralmente) ---------- */
  const toggleMusic = async () => {
    if (!musicOn) {
      await Tone.start();
      if (!musicRef.current.started) {
        // Cauda de reverb + delay curto para dar sensacao de "masmorra/aventura"
        const reverb = new Tone.Reverb({ decay: 3.2, wet: 0.28 }).toDestination();
        const delay = new Tone.FeedbackDelay("8n.", 0.22).connect(reverb);
        delay.wet.value = 0.16;

       const melody = new Tone.Synth({
  oscillator: { type: "fatsawtooth", count: 2, spread: 15 },
  envelope: { attack: 0.015, decay: 0.25, sustain: 0.3, release: 0.6 },
});
melody.volume.value = -12;
melody.connect(delay);

        const bass = new Tone.Synth({
          oscillator: { type: "sine" },
          envelope: { attack: 0.02, decay: 0.3, sustain: 0.5, release: 0.6 },
        }).toDestination();
        bass.volume.value = -13;

        const pad = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "sine" },
          envelope: { attack: 0.9, decay: 0.5, sustain: 0.65, release: 1.6 },
        }).connect(reverb);
        pad.volume.value = -20;

        const perc = new Tone.MembraneSynth({
          pitchDecay: 0.03,
          octaves: 4,
          envelope: { attack: 0.001, decay: 0.25, sustain: 0 },
        }).toDestination();
        perc.volume.value = -17;

        const hat = new Tone.NoiseSynth({
          noise: { type: "white" },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
        }).toDestination();
        hat.volume.value = -30;

        // Progressao epica classica de aventura: Am - F - C - G (tom de A menor)
        const melodyNotes = [
          "A3", "C4", "E4", "A4", "E4", "C4", "D4", "F4",
          "E4", "C4", "B3", "D4", "C4", "A3", "G3", "A3",
        ];
        const bassNotes = ["A2", "A2", "F2", "F2", "C2", "C2", "G2", "G2"];
        const padChords: string[][] = [
          ["A3", "C4", "E4"],
          ["F3", "A3", "C4"],
          ["C3", "E3", "G3"],
          ["G2", "B2", "D3"],
        ];

        let mi = 0;
        let bi = 0;
        let pi = 0;
        let hi = 0;

        const melodyLoop = new Tone.Loop((time) => {
          melody.triggerAttackRelease(melodyNotes[mi % melodyNotes.length], "8n", time);
          mi++;
        }, "8n").start(0);

        const bassLoop = new Tone.Loop((time) => {
          bass.triggerAttackRelease(bassNotes[bi % bassNotes.length], "2n", time);
          bi++;
        }, "2n").start(0);

        const padLoop = new Tone.Loop((time) => {
          pad.triggerAttackRelease(padChords[pi % padChords.length], "1n", time);
          pi++;
        }, "1m").start(0);

        // Pulso ritmico leve (bumbo suave + chimbal ocasional) para dar corpo de trilha de RPG
        const percLoop = new Tone.Loop((time) => {
          perc.triggerAttackRelease("C2", "8n", time);
          if (hi % 2 === 1) hat.triggerAttackRelease("16n", time + Tone.Time("8n").toSeconds());
          hi++;
        }, "4n").start(0);

        Tone.Transport.bpm.value = 96;
        musicRef.current = {
          started: true,
          melody,
          bass,
          pad,
          perc,
          hat,
          reverb,
          delay,
          loops: [melodyLoop, bassLoop, padLoop, percLoop],
        };
      }
      Tone.Transport.start();
      setMusicOn(true);
    } else {
      Tone.Transport.pause();
      setMusicOn(false);
    }
  };

  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      musicRef.current.loops?.forEach((l) => l.dispose());
      musicRef.current.melody?.dispose();
      musicRef.current.bass?.dispose();
      musicRef.current.pad?.dispose();
      musicRef.current.perc?.dispose();
      musicRef.current.hat?.dispose();
      musicRef.current.delay?.dispose();
      musicRef.current.reverb?.dispose();
    };
  }, []);

  /* ---------- iniciar / reiniciar fase ---------- */
  const loadLevel = useCallback((idx: number, keepPlayer: boolean) => {
    const lv = LEVELS[idx];
    const state = g.current;
    state.player.x = lv.playerStart[0];
    state.player.y = lv.playerStart[1];
    if (!keepPlayer) {
      state.player.hp = 100;
      state.player.maxHp = 100;
      state.player.atk = 10;
      state.player.def = 1;
      state.player.weaponName = "Punhos";
      state.player.armorName = "Roupa Simples";
      state.player.potions = 1;
      state.player.gold = 0;
      state.player.level = 1;
      state.player.xp = 0;
      state.player.xpToNext = 30;
      state.player.unlockedAbilities = ["dash"];
      state.player.equippedAbility = "dash";
      state.player.abilityCooldowns = { dash: 0, shield: 0, arrow: 0, fireball: 0 };
      state.player.shieldUntil = 0;
    } else {
      state.player.hp = state.player.maxHp;
    }
    const scaleMult = 1 + idx * 0.12;
    state.enemies = lv.enemies.map((e) => {
      const base = ENEMY_BASE[e.type];
      const hp = Math.round(base.hp * scaleMult);
      const atk = Math.round(base.atk * scaleMult);
      return {
        id: nextId(),
        type: e.type,
        x: e.x,
        y: e.y,
        hp,
        maxHp: hp,
        atk,
        speed: base.speed,
        aggro: base.aggro,
        radius: base.radius,
        lastAttack: 0,
        lastShot: 0,
        lastHitBy: 0,
        flash: 0,
        dying: 0,
        facing: "down",
      };
    });
    state.items = lv.items.map((it) => ({
      id: nextId(),
      type: it.type,
      x: it.x,
      y: it.y,
      name: it.name,
      value: it.value,
      ability: it.ability,
      opened: false,
      collected: false,
    }));
    state.projectiles = [];
    state.floats = [];
    state.doorOpen = false;
    state.doorWasOpen = false;
    state.shake = 0;
    state.pendingLevelUps = 0;
  }, []);

  const startGame = () => {
    loadLevel(0, false);
    setLevelIndex(0);
    setGameState("playing");
  };

  const retryGame = () => {
    loadLevel(0, false);
    setLevelIndex(0);
    setGameState("playing");
  };

  const nextLevel = () => {
    const idx = levelIndex + 1;
    if (idx >= LEVELS.length) return;
    loadLevel(idx, true);
    setLevelIndex(idx);
    setGameState("playing");
  };

  /* ---------- colisao com paredes ---------- */
 const wallSetsRef = useRef(new Map<LevelConfig, Set<string>>());
const waterSetsRef = useRef(new Map<LevelConfig, Set<string>>());
const getWallSet = useCallback((lv: LevelConfig) => {
  let s = wallSetsRef.current.get(lv);
  if (!s) { s = new Set(lv.walls.map(([x, y]) => `${x},${y}`)); wallSetsRef.current.set(lv, s); }
  return s;
}, []);
const getWaterSet = useCallback((lv: LevelConfig) => {
  let s = waterSetsRef.current.get(lv);
  if (!s) { s = new Set(lv.water.map(([x, y]) => `${x},${y}`)); waterSetsRef.current.set(lv, s); }
  return s;
}, []);
const isSolid = useCallback((lv: LevelConfig, x: number, y: number) => {
    const tx = Math.floor(x);
    const ty = Math.floor(y);
    if (tx < 0 || ty < 0 || tx >= lv.cols || ty >= lv.rows) return true;
    const key = `${tx},${ty}`;
    return getWallSet(lv).has(key) || getWaterSet(lv).has(key);
  }, [getWallSet, getWaterSet]);

  /* ---------- habilidade equipada (arma secundaria) ---------- */
  const useAbility = () => {
    const state = g.current;
    const p = state.player;
    const t = now();
    const ab = p.equippedAbility;
    if (t < p.abilityCooldowns[ab]) return;
    const lv = LEVELS[levelIndex];
    const dir = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[p.facing];

    if (ab === "shield") {
      p.abilityCooldowns.shield = t + ABILITY_COOLDOWN_MS.shield;
      p.shieldUntil = t + 2000;
      p.invulnUntil = Math.max(p.invulnUntil, t + 2000);
      state.floats.push({ id: nextId(), x: p.x, y: p.y - 0.5, text: "Escudo!", color: "#60a5fa", born: t });
    } else if (ab === "dash") {
      p.abilityCooldowns.dash = t + ABILITY_COOLDOWN_MS.dash;
      let steps = 0;
      while (steps < 10) {
        const nx = p.x + dir[0] * 0.28;
        const ny = p.y + dir[1] * 0.28;
        if (isSolid(lv, nx, ny)) break;
        p.x = nx;
        p.y = ny;
        steps++;
      }
      p.invulnUntil = Math.max(p.invulnUntil, t + 250);
      state.floats.push({ id: nextId(), x: p.x, y: p.y - 0.5, text: "Investida!", color: "#93c5fd", born: t });
    } else if (ab === "arrow") {
      p.abilityCooldowns.arrow = t + ABILITY_COOLDOWN_MS.arrow;
      state.projectiles.push({
        id: nextId(),
        x: p.x + dir[0] * 0.4,
        y: p.y + dir[1] * 0.4,
        vx: dir[0] * 7,
        vy: dir[1] * 7,
        dmg: Math.max(1, Math.round(p.atk * 0.5)),
        ttl: t + 1200,
        owner: "player",
        color: "#d6d3d1",
        size: 1,
      });
    } else if (ab === "fireball") {
      p.abilityCooldowns.fireball = t + ABILITY_COOLDOWN_MS.fireball;
      state.projectiles.push({
        id: nextId(),
        x: p.x + dir[0] * 0.4,
        y: p.y + dir[1] * 0.4,
        vx: dir[0] * 4.6,
        vy: dir[1] * 4.6,
        dmg: Math.max(1, Math.round(p.atk)),
        ttl: t + 1800,
        owner: "player",
        color: "#ff6b35",
        size: 1.8,
      });
    }
  };

  const equipAbility = (ab: Ability) => {
    g.current.player.equippedAbility = ab;
    setInventoryOpen(false);
  };

  /* ---------- escolha de nivel ---------- */
  const chooseLevelUp = (stat: "hp" | "atk" | "def") => {
    const p = g.current.player;
    if (stat === "hp") {
      p.maxHp += 20;
      p.hp = Math.min(p.maxHp, p.hp + 20);
    } else if (stat === "atk") {
      p.atk += 3;
    } else {
      p.def += 2;
    }
    g.current.pendingLevelUps = Math.max(0, g.current.pendingLevelUps - 1);
    forceTick((n) => n + 1);
  };

  /* ---------- loop principal ---------- */
  useEffect(() => {
    if (gameState !== "playing") return;

    const step = (t: number) => {
      const state = g.current;
      if (!state.lastFrame) state.lastFrame = t;
      let dt = (t - state.lastFrame) / 1000;
      dt = Math.min(dt, 0.05);
      state.lastFrame = t;

      const lv = LEVELS[levelIndex];
      const p = state.player;

      if (state.pendingLevelUps === 0 && !invOpenRef.current) {
        // -------- movimento do jogador --------
        let dx = state.joystick.active ? state.joystick.dx : 0;
        let dy = state.joystick.active ? state.joystick.dy : 0;
        if (state.keys.left) dx -= 1;
        if (state.keys.right) dx += 1;
        if (state.keys.up) dy -= 1;
        if (state.keys.down) dy += 1;
        const mag = Math.hypot(dx, dy);
        if (mag > 1) {
          dx /= mag;
          dy /= mag;
        }

        if (mag > 0.05) {
          if (Math.abs(dx) > Math.abs(dy)) p.facing = dx > 0 ? "right" : "left";
          else p.facing = dy > 0 ? "down" : "up";

          const speed = 3.1;
          const nx = p.x + dx * speed * dt;
          const ny = p.y + dy * speed * dt;
          const r = 0.32;
          if (
            !isSolid(lv, nx + Math.sign(dx) * r, p.y + r * 0.6) &&
            !isSolid(lv, nx + Math.sign(dx) * r, p.y - r * 0.6)
          ) {
            p.x = nx;
          }
          if (
            !isSolid(lv, p.x + r * 0.6, ny + Math.sign(dy) * r) &&
            !isSolid(lv, p.x - r * 0.6, ny + Math.sign(dy) * r)
          ) {
            p.y = ny;
          }
          p.x = Math.max(1, Math.min(lv.cols - 1, p.x));
          p.y = Math.max(1, Math.min(lv.rows - 1, p.y));
        }

        // -------- ataque do jogador (arma principal) --------
        const attacking = t < p.attackUntil;
        if (attacking) {
          const off = { up: [0, -0.9], down: [0, 0.9], left: [-0.9, 0], right: [0.9, 0] }[p.facing];
          const hx = p.x + off[0];
          const hy = p.y + off[1];
          for (const en of state.enemies) {
            if (en.dying) continue;
            if (en.lastHitBy === p.lastAttack) continue;
            if (dist(hx, hy, en.x, en.y) < 0.75) {
              const dmg = Math.max(1, Math.round(p.atk * (0.85 + Math.random() * 0.3)));
              en.hp -= dmg;
              en.flash = t;
              en.lastHitBy = p.lastAttack;
              state.floats.push({ id: nextId(), x: en.x, y: en.y, text: `-${dmg}`, color: "#fff", born: t });
              const kdx = en.x - p.x;
              const kdy = en.y - p.y;
              const kd = Math.hypot(kdx, kdy) || 1;
              en.x += (kdx / kd) * 0.15;
              en.y += (kdy / kd) * 0.15;
              if (en.hp <= 0 && !en.dying) {
                en.dying = t;
                const gain = XP_GAIN[en.type];
                p.xp += gain;
                state.floats.push({ id: nextId(), x: en.x, y: en.y - 0.4, text: `+${gain} XP`, color: "#fbbf24", born: t });
                while (p.xp >= p.xpToNext) {
                  p.xp -= p.xpToNext;
                  p.level += 1;
                  p.xpToNext = Math.round(p.xpToNext * 1.35 + 10);
                  state.pendingLevelUps += 1;
                }
              }
            }
          }
        }

        // -------- inimigos --------
        for (const en of state.enemies) {
          if (en.dying) continue;
          const d = dist(p.x, p.y, en.x, en.y);

          if (d < en.aggro && d > 0.05) {
            const vx = (p.x - en.x) / d;
            const vy = (p.y - en.y) / d;
            if (en.type !== "skeleton" || d < 2.2) {
              const nx = en.x + vx * en.speed * dt;
              const ny = en.y + vy * en.speed * dt;
              if (!isSolid(lv, nx, en.y)) en.x = nx;
              if (!isSolid(lv, en.x, ny)) en.y = ny;
            }
            en.facing = Math.abs(vx) > Math.abs(vy) ? (vx > 0 ? "right" : "left") : vy > 0 ? "down" : "up";
          }

          if (d < 0.55 + en.radius && t - en.lastAttack > 850 && t > p.invulnUntil) {
            en.lastAttack = t;
            const dmg = Math.max(1, en.atk - p.def);
            p.hp -= dmg;
            p.invulnUntil = t + 500;
            state.shake = t + 250;
            state.floats.push({ id: nextId(), x: p.x, y: p.y, text: `-${dmg}`, color: "#ef4444", born: t });
          }

          if (en.type === "skeleton" && d < 6 && t - en.lastShot > 2200) {
            en.lastShot = t;
            const vx = (p.x - en.x) / d;
            const vy = (p.y - en.y) / d;
            state.projectiles.push({
              id: nextId(),
              x: en.x,
              y: en.y,
              vx: vx * 3.4,
              vy: vy * 3.4,
              dmg: en.atk - 2,
              ttl: t + 3000,
              owner: "enemy",
              color: "#fbbf24",
              size: 1,
            });
          }

          if (en.type === "boss" && d < 5 && t - en.lastShot > 4200) {
            en.lastShot = t;
            en.speed = 4.2;
            setTimeout(() => {
              en.speed = ENEMY_BASE.boss.speed;
            }, 500);
          }
        }
        state.enemies = state.enemies.filter((en) => !en.dying || t - en.dying < 400);

        // -------- projeteis --------
        for (const pr of state.projectiles) {
          pr.x += pr.vx * dt;
          pr.y += pr.vy * dt;
        }
        state.projectiles = state.projectiles.filter((pr) => {
          if (t > pr.ttl) return false;
          if (isSolid(lv, pr.x, pr.y)) return false;

          if (pr.owner === "enemy") {
            if (dist(pr.x, pr.y, p.x, p.y) < 0.4 && t > p.invulnUntil) {
              p.hp -= pr.dmg;
              p.invulnUntil = t + 500;
              state.shake = t + 250;
              state.floats.push({ id: nextId(), x: p.x, y: p.y, text: `-${pr.dmg}`, color: "#ef4444", born: t });
              return false;
            }
            return true;
          }

          for (const en of state.enemies) {
            if (en.dying) continue;
            if (dist(pr.x, pr.y, en.x, en.y) < 0.45) {
              en.hp -= pr.dmg;
              en.flash = t;
              state.floats.push({ id: nextId(), x: en.x, y: en.y, text: `-${pr.dmg}`, color: "#fff", born: t });
              if (en.hp <= 0 && !en.dying) {
                en.dying = t;
                const gain = XP_GAIN[en.type];
                p.xp += gain;
                state.floats.push({ id: nextId(), x: en.x, y: en.y - 0.4, text: `+${gain} XP`, color: "#fbbf24", born: t });
                while (p.xp >= p.xpToNext) {
                  p.xp -= p.xpToNext;
                  p.level += 1;
                  p.xpToNext = Math.round(p.xpToNext * 1.35 + 10);
                  state.pendingLevelUps += 1;
                }
              }
              return false;
            }
          }
          return true;
        });

        // -------- itens (pocoes, moedas, baus, arma e armadura) --------
        for (const it of state.items) {
          if (it.collected) continue;
          if (dist(p.x, p.y, it.x, it.y) < 0.5) {
            it.collected = true;
            let toastDuration = 2200;
            if (it.type === "potion") {
              p.potions += 1;
              setToast(`+1 ${it.name}`);
            } else if (it.type === "weapon") {
              p.atk = 10 + it.value;
              p.weaponName = it.name;
              setToast(`Equipado: ${it.name} (+${it.value} ATK)`);
            } else if (it.type === "armor") {
              p.def = 1 + it.value;
              p.armorName = it.name;
              setToast(`Equipado: ${it.name} (+${it.value} DEF)`);
            } else if (it.type === "coin") {
              p.gold += it.value;
              setToast(`+${it.value} moedas`);
            } else if (it.type === "chest") {
              it.opened = true;
              p.gold += it.value;
              if (it.ability && !p.unlockedAbilities.includes(it.ability)) {
                p.unlockedAbilities.push(it.ability);
                setToast(`Bau aberto! ${ABILITY_INFO[it.ability].icon} ${ABILITY_INFO[it.ability].label} desbloqueada!`);
                toastDuration = 3200;
              } else {
                setToast(`Bau aberto: +${it.value} moedas`);
              }
            }
            setTimeout(() => setToast(null), toastDuration);
          }
        }

        // -------- porta --------
        state.doorOpen = state.enemies.filter((e) => !e.dying).length === 0;
        if (state.doorOpen && !state.doorWasOpen) {
          state.doorWasOpen = true;
        }
        if (state.doorOpen && dist(p.x, p.y, lv.door[0], lv.door[1]) < 0.6) {
          if (lv.isBoss) setGameState("victory");
          else setGameState("levelClear");
        }

        // -------- textos flutuantes --------
        state.floats = state.floats.filter((f) => t - f.born < 900);

        if (p.hp <= 0) {
          setGameState("gameOver");
        }
      }

      state.renderTick = (state.renderTick || 0) + 1;
      if (state.renderTick % 2 === 0) forceTick((n) => n + 1);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      g.current.lastFrame = 0;
    };
  }, [gameState, levelIndex, isSolid]);

  /* ---------- teclado (desktop) ---------- */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") g.current.keys.up = true;
      if (k === "arrowdown" || k === "s") g.current.keys.down = true;
      if (k === "arrowleft" || k === "a") g.current.keys.left = true;
      if (k === "arrowright" || k === "d") g.current.keys.right = true;
      if (k === " " || k === "enter") doAttack();
      if (k === "shift") useAbility();
      if (k === "i") setInventoryOpen((v) => !v);
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") g.current.keys.up = false;
      if (k === "arrowdown" || k === "s") g.current.keys.down = false;
      if (k === "arrowleft" || k === "a") g.current.keys.left = false;
      if (k === "arrowright" || k === "d") g.current.keys.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  });

  /* ---------- ataque ---------- */
  const doAttack = () => {
    const t = now();
    const p = g.current.player;
    if (t - p.lastAttack < 420) return;
    p.lastAttack = t;
    p.attackUntil = t + 220;
  };

  const usePotion = () => {
    const p = g.current.player;
    if (p.potions <= 0) return;
    if (p.hp >= p.maxHp) return;
    p.potions -= 1;
    p.hp = Math.min(p.maxHp, p.hp + 30);
    setToast("+30 HP");
    setTimeout(() => setToast(null), 1200);
  };

  /* ---------- joystick touch ---------- */
  const onJoyDown = (e: React.PointerEvent) => {
    joyPointerId.current = e.pointerId;
    g.current.joystick.active = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateJoy(e);
  };
  const updateJoy = (e: React.PointerEvent) => {
    const base = joyBaseRef.current;
    if (!base) return;
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let dx = (e.clientX - cx) / (rect.width / 2);
    let dy = (e.clientY - cy) / (rect.height / 2);
    const mag = Math.hypot(dx, dy);
    if (mag > 1) {
      dx /= mag;
      dy /= mag;
    }
    g.current.joystick.dx = dx;
    g.current.joystick.dy = dy;
  };
  const onJoyMove = (e: React.PointerEvent) => {
    if (joyPointerId.current !== e.pointerId || !g.current.joystick.active) return;
    updateJoy(e);
  };
  const onJoyUp = (e: React.PointerEvent) => {
    if (joyPointerId.current !== e.pointerId) return;
    joyPointerId.current = null;
    g.current.joystick.active = false;
    g.current.joystick.dx = 0;
    g.current.joystick.dy = 0;
  };

  /* ============================================================
     RENDER
  ============================================================ */
  const p = g.current.player;
  const t = now();
  const shaking = t < g.current.shake;
  const shielded = t < p.shieldUntil;

  const camX = Math.max(0, Math.min(level.cols - VIEWPORT_COLS, p.x - VIEWPORT_COLS / 2));
  const camY = Math.max(0, Math.min(level.rows - VIEWPORT_ROWS, p.y - VIEWPORT_ROWS / 2));

  const startX = Math.max(0, Math.floor(camX) - 1);
  const endX = Math.min(level.cols - 1, Math.ceil(camX + VIEWPORT_COLS) + 1);
  const startY = Math.max(0, Math.floor(camY) - 1);
  const endY = Math.min(level.rows - 1, Math.ceil(camY + VIEWPORT_ROWS) + 1);
  const visibleXs: number[] = [];
  for (let x = startX; x <= endX; x++) visibleXs.push(x);
  const visibleYs: number[] = [];
  for (let y = startY; y <= endY; y++) visibleYs.push(y);

  const abilityTotal = ABILITY_COOLDOWN_MS[p.equippedAbility];
  const abilityFrac = Math.max(0, Math.min(1, (p.abilityCooldowns[p.equippedAbility] - t) / abilityTotal));

  return (
    <>
      <style>{`
        .rpg-screen {
          width: 100%;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: #0b1014;
          color: #f1f5f9;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          user-select: none;
          overflow: hidden;
          touch-action: none;
        }
        .rpg-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          height: 48px;
          gap: 8px;
          z-index: 20;
        }
        .rpg-btn {
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .rpg-btn:active { background: #334155; color: #fff; }
        .rpg-btn.accent {
          background: #3b2a12;
          border-color: #92620f;
          color: #fcd34d;
        }
        .rpg-btn.accent:active { background: #92620f; color: #fff; }
        .rpg-title-badge {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 12px;
          background: #111827;
          border-radius: 20px;
          border: 1px solid #1f2937;
          white-space: nowrap;
        }
        .rpg-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
        }
        .setup-container {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          padding: 16px;
        }
        .setup-title { font-size: 26px; font-weight: 800; color: #f8fafc; margin: 0; }
        .setup-subtitle { font-size: 13px; color: #94a3b8; line-height: 1.5; }
        .start-btn {
          width: 100%;
          background: linear-gradient(135deg, #00a884, #0d7d63);
          border: none;
          color: #fff;
          padding: 14px 20px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }
        .level-list { display: flex; flex-direction: column; gap: 6px; width: 100%; text-align: left; max-height: 260px; overflow-y: auto; }
        .level-item {
          display: flex; justify-content: space-between; align-items: center;
          background: #111827; border: 1px solid #1f2937; border-radius: 10px;
          padding: 8px 12px; font-size: 12px; color: #cbd5e1;
        }
        .arena-wrap {
          position: relative;
          aspect-ratio: ${VIEWPORT_COLS} / ${VIEWPORT_ROWS};
          height: 100%;
          max-height: 100%;
          max-width: 98vw;
          background: #16211c;
          border: 3px solid #23331f;
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.6);
          overflow: hidden;
          transform: ${shaking ? "translate(2px, -1px)" : "none"};
        }
        .world { position: absolute; }
        .tile { position: absolute; box-sizing: border-box; }
        .entity { position: absolute; box-sizing: border-box; transform: translate(-50%, -50%); }
        .hp-bar-bg {
          position: absolute; top: -14%; left: 0; width: 100%; height: 10%;
          background: rgba(0,0,0,0.5); border-radius: 3px; overflow: hidden;
        }
        .hp-bar-fg { height: 100%; background: #ef4444; }
        .float-text {
          position: absolute; font-size: 11px; font-weight: 800;
          transform: translate(-50%, -50%);
          pointer-events: none;
          text-shadow: 0 1px 2px rgba(0,0,0,0.8);
        }
        .hud {
          position: absolute; top: 6px; left: 6px; right: 6px;
          display: flex; justify-content: space-between; align-items: flex-start;
          font-size: 10px; z-index: 15; pointer-events: none;
        }
        .hud-card {
          background: rgba(11,16,20,0.85);
          border: 1px solid #263041;
          border-radius: 10px;
          padding: 6px 10px;
          min-width: 108px;
        }
          .inv-btn-arena {
  position: absolute;
  top: 678px;
  left: 91%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: radial-gradient(circle at 35% 30%, #fcd34d, #b45309);
  border: 2px solid rgba(255,255,255,0.35);
  color: #fff;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 18;
  box-shadow: 0 4px 10px rgba(0,0,0,0.4);
}
.inv-btn-arena:active { transform: translateX(-50%) scale(0.92); }
        .hp-outer { background: #1f2937; border-radius: 6px; height: 8px; overflow: hidden; margin-top: 3px; }
        .hp-inner { height: 100%; background: linear-gradient(90deg,#00a884,#2dd4bf); transition: width 0.15s; }
        .xp-inner { height: 100%; background: linear-gradient(90deg,#d97706,#fbbf24); transition: width 0.15s; }
        .toast {
          position: absolute; top: 8px; left: 50%; transform: translateX(-50%);
          background: rgba(0,168,132,0.95); color: #fff; font-size: 11px; font-weight: 700;
          padding: 6px 14px; border-radius: 20px; z-index: 30; white-space: nowrap;
          max-width: 90%; overflow: hidden; text-overflow: ellipsis;
        }
        .controls {
          position: absolute; bottom: 14px; left: 0; right: 0;
          display: flex; justify-content: space-between; align-items: flex-end;
          padding: 0 16px; z-index: 20; pointer-events: none;
        }
        .joy-base {
          width: 92px; height: 92px; border-radius: 50%;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15);
          position: relative; pointer-events: auto; touch-action: none;
        }
        .joy-stick {
          width: 40px; height: 40px; border-radius: 50%;
          background: rgba(0,168,132,0.7); border: 1px solid rgba(255,255,255,0.4);
          position: absolute; top: 50%; left: 50%;
          pointer-events: none;
        }
        .action-col { display: flex; flex-direction: column; gap: 10px; align-items: center; pointer-events: auto; }
        .action-row { display: flex; gap: 8px; }
        .attack-btn {
          width: 68px; height: 68px; border-radius: 50%;
          background: radial-gradient(circle at 35% 30%, #ef8a8a, #ef4444);
          border: 2px solid rgba(255,255,255,0.3);
          color: #fff; font-size: 22px; font-weight: 800;
          box-shadow: 0 6px 16px rgba(239,68,68,0.4);
        }
        .attack-btn:active { transform: scale(0.92); }
        .potion-btn {
          width: 44px; height: 44px; border-radius: 14px;
          background: radial-gradient(circle at 35% 30%, #93c5fd, #3b82f6);
          border: 2px solid rgba(255,255,255,0.3);
          color: #fff; font-size: 10px; font-weight: 800;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .special-btn {
          width: 44px; height: 44px; border-radius: 14px;
          background: radial-gradient(circle at 35% 30%, #c4b5fd, #7c3aed);
          border: 2px solid rgba(255,255,255,0.3);
          color: #fff; font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .cooldown-mask { position: absolute; inset: 0; }
        .overlay-screen {
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          background: rgba(11,16,20,0.92); z-index: 40; flex-direction: column; gap: 14px; text-align: center; padding: 20px;
        }
        .overlay-title { font-size: 26px; font-weight: 800; }
        .overlay-btn {
          background: linear-gradient(135deg, #00a884, #0d7d63);
          border: none; color: #fff; padding: 12px 28px; border-radius: 12px;
          font-size: 14px; font-weight: 700; cursor: pointer;
        }
        .levelup-btn {
          width: 100%;
          background: #111827; border: 1px solid #263041; color: #f1f5f9;
          padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 700;
          cursor: pointer; text-align: left;
        }
        .levelup-btn span { display: block; font-size: 11px; color: #94a3b8; font-weight: 400; margin-top: 2px; }
        .levelup-btn.equipped { border-color: #00a884; box-shadow: 0 0 0 1px #00a884 inset; }
        .levelup-btn:disabled { opacity: 0.35; cursor: not-allowed; }
      `}</style>

      <div className="rpg-screen">
        <div className="rpg-header">
          <button className="rpg-btn" onClick={gameState === "menu" ? onBack : () => setGameState("menu")}>
            Voltar
          </button>
          {gameState !== "menu" && (
            <div className="rpg-title-badge">
              Fase {levelIndex + 1}/{LEVELS.length} · {level.name}
            </div>
          )}
          <div style={{ display: "flex", gap: 6 }}>
            <button className="rpg-btn" onClick={toggleMusic}>
              {musicOn ? "🔊 Musica" : "🔈 Musica"}
            </button>
           {gameState === "playing" && (
  <button className="rpg-btn" onClick={() => loadLevel(levelIndex, true)}>
    Reiniciar
  </button>
)}
          </div>
        </div>

        <div className="rpg-body">
          {gameState === "menu" && (
            <div className="setup-container">
              <h1 className="setup-title">Lenda da Espada</h1>
              <p className="setup-subtitle">
                Explore 15 fases em mapas cada vez maiores, ganhe XP e evolua seus atributos,
                colete moedas e abra baus escondidos pelo caminho, desbloqueie novas armas
                secundarias (escudo, flecha, bola de fogo) encontrando-as em baus especiais,
                troque-as no inventario, e enfrente o dragao ancestral no final.
              </p>
              <button className="start-btn" onClick={startGame}>
                Iniciar Aventura
              </button>
              <div className="level-list">
                {LEVELS.map((l, i) => (
                  <div className="level-item" key={l.id}>
                    <span>
                      {i + 1}. {l.name}
                    </span>
                    <span style={{ color: l.isBoss ? "#ef4444" : "#64748b" }}>
                      {l.isBoss ? "Chefe" : `${l.enemies.length} inimigos`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(gameState === "playing" ||
            gameState === "levelClear" ||
            gameState === "gameOver" ||
            gameState === "victory") && (
            <div className="arena-wrap">
              <div
                className="world"
                style={{
                  left: `${-(camX / VIEWPORT_COLS) * 100}%`,
                  top: `${-(camY / VIEWPORT_ROWS) * 100}%`,
                  width: `${(level.cols / VIEWPORT_COLS) * 100}%`,
                  height: `${(level.rows / VIEWPORT_ROWS) * 100}%`,
                }}
              >
                {/* chao */}
                {visibleYs.map((y) =>
                  visibleXs.map((x) => {
                    const isWall = level.walls.some(([wx, wy]) => wx === x && wy === y);
                    const isWater = level.water.some(([wx, wy]) => wx === x && wy === y);
                    let bg = (x + y) % 2 === 0 ? "#1a2620" : "#182420";
                    if (isWall) bg = "#233326";
                    if (isWater) bg = "#123a4a";
                    return (
                      <div
                        key={`${x}-${y}`}
                        className="tile"
                        style={{
                          left: `${(x / level.cols) * 100}%`,
                          top: `${(y / level.rows) * 100}%`,
                          width: `${100 / level.cols}%`,
                          height: `${100 / level.rows}%`,
                          background: bg,
                          borderRadius: isWall ? 3 : 0,
                          boxShadow: isWall ? "inset 0 0 0 1px #16211c" : "none",
                        }}
                      />
                    );
                  })
                )}

                {/* porta */}
                <div
                  className="tile"
                  style={{
                    left: `${(level.door[0] / level.cols) * 100}%`,
                    top: `${(level.door[1] / level.rows) * 100}%`,
                    width: `${100 / level.cols}%`,
                    height: `${100 / level.rows}%`,
                    background: g.current.doorOpen ? "#00a884" : "#7f1d1d",
                    borderRadius: 4,
                    boxShadow: g.current.doorOpen ? "0 0 12px #00a884" : "none",
                    transition: "background 0.3s",
                  }}
                />

                {/* itens */}
                {g.current.items.map((it) => {
                  if (it.collected) return null;
                  const vis = ITEM_VISUALS[it.type];
                  return (
                    <div
                      key={it.id}
                      className="entity"
                      style={{
                        left: `${(it.x / level.cols) * 100}%`,
                        top: `${(it.y / level.rows) * 100}%`,
                        width: `${(100 / level.cols) * vis.scale}%`,
                        height: `${(100 / level.rows) * vis.scale}%`,
                        borderRadius: vis.radius,
                        background: vis.bg,
                        boxShadow: "0 0 8px rgba(255,255,255,0.4)",
                      }}
                    />
                  );
                })}

                {/* projeteis */}
                {g.current.projectiles.map((pr) => (
                  <div
                    key={pr.id}
                    className="entity"
                    style={{
                      left: `${(pr.x / level.cols) * 100}%`,
                      top: `${(pr.y / level.rows) * 100}%`,
                      width: `${(100 / level.cols) * 0.28 * pr.size}%`,
                      height: `${(100 / level.rows) * 0.28 * pr.size}%`,
                      borderRadius: "50%",
                      background: pr.color,
                      boxShadow: `0 0 ${6 * pr.size}px ${pr.color}`,
                    }}
                  />
                ))}

                {/* inimigos */}
                {g.current.enemies.map((en) => {
                  const shape = en.type === "slime" ? SLIME_SHAPE : en.type === "boss" ? BOSS_SHAPE : HUMANOID_SHAPE;
                  const dyingProgress = en.dying ? Math.min(1, (t - en.dying) / 400) : 0;
                  const sizeMul = en.type === "boss" ? 1.7 : 1;
                  return (
                    <div key={en.id} className="entity" style={{
                      left: `${(en.x / level.cols) * 100}%`,
                      top: `${(en.y / level.rows) * 100}%`,
                      width: `${(100 / level.cols) * 0.85 * sizeMul}%`,
                      height: `${(100 / level.rows) * 0.9 * sizeMul}%`,
                    }}>
                      {!en.dying && (
                        <div className="hp-bar-bg">
                          <div className="hp-bar-fg" style={{ width: `${Math.max(0, (en.hp / en.maxHp) * 100)}%` }} />
                        </div>
                      )}
                      <Pixels
                        shape={shape}
                        palette={PALETTES[en.type]}
                        flip={en.facing === "left"}
                        flash={t - en.flash < 120}
                        dyingProgress={dyingProgress}
                      />
                    </div>
                  );
                })}

                {/* jogador */}
                <div
                  className="entity"
                  style={{
                    left: `${(p.x / level.cols) * 100}%`,
                    top: `${(p.y / level.rows) * 100}%`,
                    width: `${(100 / level.cols) * 0.85}%`,
                    height: `${(100 / level.rows) * 0.9}%`,
                    opacity: !shielded && t < p.invulnUntil && Math.floor(t / 80) % 2 === 0 ? 0.4 : 1,
                  }}
                >
                  {shielded && (
                    <div
                      style={{
                        position: "absolute",
                        inset: "-25%",
                        borderRadius: "50%",
                        border: "2px solid #60a5fa",
                        boxShadow: "0 0 10px #60a5fa",
                      }}
                    />
                  )}
                  <Pixels shape={HUMANOID_SHAPE} palette={PALETTES.player} flip={p.facing === "left"} />
                  {t < p.attackUntil && (
                    <div
                      style={{
                        position: "absolute",
                        width: "70%",
                        height: "22%",
                        background: "rgba(255,255,255,0.85)",
                        borderRadius: 4,
                        top: p.facing === "up" ? "-40%" : p.facing === "down" ? "100%" : "40%",
                        left: p.facing === "left" ? "-70%" : p.facing === "right" ? "70%" : "15%",
                        transform: p.facing === "left" || p.facing === "right" ? "rotate(90deg)" : "none",
                        boxShadow: "0 0 10px #fff",
                      }}
                    />
                  )}
                </div>

                {/* textos flutuantes */}
                {g.current.floats.map((f) => {
                  const age = (t - f.born) / 900;
                  return (
                    <div
                      key={f.id}
                      className="float-text"
                      style={{
                        left: `${(f.x / level.cols) * 100}%`,
                        top: `${((f.y - age * 0.8) / level.rows) * 100}%`,
                        color: f.color,
                        opacity: 1 - age,
                      }}
                    >
                      {f.text}
                    </div>
                  );
                })}
              </div>

              {/* HUD (fora do world, fixo na tela) */}
              <div className="hud">
                <div className="hud-card">
                  <div style={{ fontWeight: 700 }}>{p.weaponName}</div>
                  <div style={{ color: "#64748b" }}>{p.armorName}</div>
                  <div className="hp-outer">
                    <div className="hp-inner" style={{ width: `${Math.max(0, (p.hp / p.maxHp) * 100)}%` }} />
                  </div>
                  <div style={{ marginTop: 2, color: "#94a3b8" }}>
                    {Math.max(0, Math.round(p.hp))}/{p.maxHp} HP
                  </div>
                  <div style={{ marginTop: 4, color: "#fbbf24", fontWeight: 700 }}>Nv. {p.level}</div>
                  <div className="hp-outer">
                    <div className="xp-inner" style={{ width: `${(p.xp / p.xpToNext) * 100}%` }} />
                  </div>
                </div>
                <div className="hud-card" style={{ textAlign: "right" }}>
                  <div>ATK {p.atk} · DEF {p.def}</div>
                  <div style={{ color: "#93c5fd" }}>Pocoes: {p.potions}</div>
                  <div style={{ color: "#facc15", fontWeight: 700 }}>💰 {p.gold}</div>
                  <div style={{ color: "#c4b5fd" }}>
                    {ABILITY_INFO[p.equippedAbility].icon} {ABILITY_INFO[p.equippedAbility].label}
                  </div>
                  <div style={{ color: g.current.doorOpen ? "#00a884" : "#f87171" }}>
                    {g.current.doorOpen ? "Saida aberta!" : `Inimigos: ${g.current.enemies.filter((e) => !e.dying).length}`}
                  </div>
                </div>
              </div>
              {gameState === "playing" && (
  <button className="inv-btn-arena" onClick={() => setInventoryOpen(true)}>
    🎒
  </button>
)}

              {toast && <div className="toast">{toast}</div>}

              {/* controles touch */}
              {gameState === "playing" && g.current.pendingLevelUps === 0 && !inventoryOpen && (
                <div className="controls">
                  <div
                    className="joy-base"
                    ref={joyBaseRef}
                    onPointerDown={onJoyDown}
                    onPointerMove={onJoyMove}
                    onPointerUp={onJoyUp}
                    onPointerCancel={onJoyUp}
                  >
                    <div
                      className="joy-stick"
                      style={{
                        transform: `translate(calc(-50% + ${g.current.joystick.dx * 26}px), calc(-50% + ${
                          g.current.joystick.dy * 26
                        }px))`,
                      }}
                    />
                  </div>
                  <div className="action-col">
                    <div className="action-row">
                      <button className="potion-btn" onClick={usePotion}>
                        <span style={{ fontSize: 15 }}>+</span>
                        <span>{p.potions}</span>
                      </button>
                      <button
                        className="special-btn"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          useAbility();
                        }}
                      >
                        {ABILITY_INFO[p.equippedAbility].icon}
                        {abilityFrac > 0 && (
                          <div
                            className="cooldown-mask"
                            style={{
                              background: `conic-gradient(rgba(0,0,0,0.65) ${abilityFrac * 360}deg, transparent 0deg)`,
                            }}
                          />
                        )}
                      </button>
                    </div>
                    <button
                      className="attack-btn"
                      onPointerDown={(e) => {
                        e.preventDefault();
                        doAttack();
                      }}
                    >
                      ⚔
                    </button>
                  </div>
                </div>
              )}

              {/* inventario / troca de arma secundaria */}
              {gameState === "playing" && inventoryOpen && (
                <div className="overlay-screen">
                  <div className="overlay-title" style={{ color: "#fcd34d" }}>Inventario</div>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>
                    💰 {p.gold} moedas · Escolha sua arma secundaria equipada
                  </p>
                  <div style={{ width: "100%", maxWidth: 320, display: "flex", flexDirection: "column", gap: 10 }}>
                    {(["dash", "shield", "arrow", "fireball"] as Ability[]).map((ab) => {
                      const unlocked = p.unlockedAbilities.includes(ab);
                      const equipped = p.equippedAbility === ab;
                      return (
                        <button
                          key={ab}
                          className={`levelup-btn${equipped ? " equipped" : ""}`}
                          disabled={!unlocked}
                          onClick={() => unlocked && equipAbility(ab)}
                        >
                          {ABILITY_INFO[ab].icon} {ABILITY_INFO[ab].label} {equipped ? "(equipado)" : ""}
                          <span>{unlocked ? ABILITY_INFO[ab].desc : "Bloqueado — encontre o bau desta habilidade em uma fase futura"}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button className="overlay-btn" onClick={() => setInventoryOpen(false)}>
                    Fechar
                  </button>
                </div>
              )}

              {/* subida de nivel */}
              {gameState === "playing" && g.current.pendingLevelUps > 0 && (
                <div className="overlay-screen">
                  <div className="overlay-title" style={{ color: "#fbbf24" }}>
                    Subiu de Nivel!
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>Escolha um atributo para evoluir</p>
                  <div style={{ width: "100%", maxWidth: 300, display: "flex", flexDirection: "column", gap: 10 }}>
                    <button className="levelup-btn" onClick={() => chooseLevelUp("hp")}>
                      + Vida Maxima
                      <span>+20 HP maximo (e cura 20 agora)</span>
                    </button>
                    <button className="levelup-btn" onClick={() => chooseLevelUp("atk")}>
                      + Ataque
                      <span>+3 de dano por golpe (e nas armas a distancia)</span>
                    </button>
                    <button className="levelup-btn" onClick={() => chooseLevelUp("def")}>
                      + Defesa
                      <span>+2 de reducao de dano recebido</span>
                    </button>
                  </div>
                </div>
              )}

              {/* overlays */}
              {gameState === "levelClear" && (
                <div className="overlay-screen">
                  <div className="overlay-title" style={{ color: "#00a884" }}>
                    Fase Concluida!
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>
                    Voce liberou {level.name}. Vida totalmente restaurada.
                  </p>
                  <button className="overlay-btn" onClick={nextLevel}>
                    Proxima Fase
                  </button>
                </div>
              )}

              {gameState === "gameOver" && (
                <div className="overlay-screen">
                  <div className="overlay-title" style={{ color: "#ef4444" }}>
                    Voce Morreu
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>
                    Sua jornada termina em {level.name}. Tente novamente!
                  </p>
                  <button className="overlay-btn" onClick={retryGame}>
                    Tentar Novamente
                  </button>
                </div>
              )}

              {gameState === "victory" && (
                <div className="overlay-screen">
                  <div className="overlay-title" style={{ color: "#fbbf24" }}>
                    Vitoria! 🐉
                  </div>
                  <p style={{ color: "#94a3b8", fontSize: 13 }}>
                    Voce derrotou o Dragao Ancestral e completou a Lenda da Espada!
                  </p>
                  <button className="overlay-btn" onClick={retryGame}>
                    Jogar Novamente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
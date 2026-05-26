import { useEffect, useRef, useState } from "react";
type Props = { onBack: () => void };

// ─── CELL SIZE & CANVAS ───────────────────────────────────────────────────────
const COLS = 11;
const ROWS = 13;
const CS   = 34;
const W    = COLS * CS;
const H    = ROWS * CS;

// ─── TOWER TYPES ─────────────────────────────────────────────────────────────
interface TowerType {
  id:string; name:string; emoji:string; color:string;
  cost:number; damage:number; range:number; fireRate:number;
  desc:string; special:string;
}
const TOWERS: TowerType[] = [
  { id:"cannon",  name:"Canhão",       emoji:"💣", color:"#f59e0b", cost:80,  damage:42,  range:2.5, fireRate:0.8, desc:"Dano alto",        special:"single" },
  { id:"machine", name:"Metralhadora", emoji:"🔫", color:"#6366f1", cost:60,  damage:11,  range:2.0, fireRate:4.2, desc:"Muito rápida",     special:"single" },
  { id:"ice",     name:"Gelo",         emoji:"❄️", color:"#22d3ee", cost:90,  damage:6,   range:2.3, fireRate:1.2, desc:"Congela 40%",      special:"slow"   },
  { id:"rocket",  name:"Foguete",      emoji:"🚀", color:"#ef4444", cost:140, damage:85,  range:3.0, fireRate:0.5, desc:"Dano em área",     special:"splash" },
  { id:"laser",   name:"Laser",        emoji:"⚡", color:"#a78bfa", cost:200, damage:26,  range:3.5, fireRate:6.0, desc:"Mira mais forte",  special:"strong" },
  { id:"mortar",  name:"Morteiro",     emoji:"🎯", color:"#f97316", cost:180, damage:130, range:4.5, fireRate:0.3, desc:"Área enorme",      special:"splash" },
];

// ─── ENEMY TYPES ─────────────────────────────────────────────────────────────
interface EnemyType {
  id:string; name:string; emoji:string;
  hp:number; speed:number; reward:number; size:number;
  color:string; armor:number;
}
const ETYPES: Record<string,EnemyType> = {
  soldier: { id:"soldier", name:"Soldado",  emoji:"🧟", hp:60,   speed:1.2, reward:8,  size:13, color:"#4ade80", armor:0    },
  runner:  { id:"runner",  name:"Corredor", emoji:"💨", hp:38,   speed:2.6, reward:6,  size:11, color:"#facc15", armor:0    },
  tank:    { id:"tank",    name:"Tanque",   emoji:"🛡️", hp:320,  speed:0.7, reward:22, size:17, color:"#94a3b8", armor:0.2  },
  armored: { id:"armored", name:"Blindado", emoji:"🤖", hp:520,  speed:0.9, reward:32, size:17, color:"#60a5fa", armor:0.35 },
  boss:    { id:"boss",    name:"Chefe",    emoji:"👹", hp:2200, speed:0.6, reward:100,size:21, color:"#f43f5e", armor:0.4  },
  swarm:   { id:"swarm",   name:"Enxame",  emoji:"🐝", hp:22,   speed:3.2, reward:3,  size:9,  color:"#fbbf24", armor:0    },
  ghost:   { id:"ghost",   name:"Fantasma",emoji:"👻", hp:160,  speed:1.9, reward:20, size:13, color:"#c4b5fd", armor:0.5  },
  brute:   { id:"brute",   name:"Brutão",  emoji:"🦍", hp:800,  speed:0.8, reward:45, size:19, color:"#fb923c", armor:0.3  },
  speeder: { id:"speeder", name:"Veloz",   emoji:"🏎️", hp:90,   speed:4.0, reward:12, size:11, color:"#34d399", armor:0    },
  titan:   { id:"titan",   name:"Titã",    emoji:"🗿", hp:5000, speed:0.4, reward:200,size:23, color:"#e879f9", armor:0.5  },
};

// ─── LEVEL DEFINITIONS ───────────────────────────────────────────────────────
interface WaveDef { type:string; count:number; interval:number }
interface LevelDef {
  name: string; bg: string; pathColor: string; pathEdge: string;
  path: [number,number][]; // [col,row]
  waves: WaveDef[][];
  startGold: number; bonusGold: number;
  description: string;
}

const LEVELS: LevelDef[] = [
// ── LEVEL 1 ── simple S-curve, 3 waves
{
  name:"Campos da Floresta", bg:"#0a1f0a", pathColor:"#2d4a1e", pathEdge:"#1a3010",
  startGold:120, bonusGold:30, description:"Aprenda a posicionar suas torres!",
  path:[
    [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],
    [10,2],[10,3],[10,4],[10,5],[10,6],
    [9,6],[8,6],[7,6],[6,6],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
    [0,7],[0,8],[0,9],[0,10],[0,11],
    [1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[10,12],
  ],
  waves:[
    [{type:"soldier",count:6,interval:1200}],
    [{type:"soldier",count:8,interval:1000},{type:"runner",count:3,interval:900}],
    [{type:"runner",count:10,interval:700},{type:"soldier",count:6,interval:900}],
  ],
},
// ── LEVEL 2 ── zigzag, 4 waves
{
  name:"Pântano Sombrio", bg:"#0d1a0d", pathColor:"#3a5c2a", pathEdge:"#253d1a",
  startGold:130, bonusGold:35, description:"Inimigos mais rápidos aparecem!",
  path:[
    [0,2],[1,2],[2,2],[3,2],[3,3],[3,4],[3,5],[3,6],
    [4,6],[5,6],[6,6],[6,5],[6,4],[6,3],[6,2],
    [7,2],[8,2],[9,2],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7],
    [9,7],[8,7],[7,7],[6,7],[5,7],[4,7],[3,7],[2,7],[1,7],[0,7],
    [0,8],[0,9],[0,10],[1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10],[10,11],[10,12],
  ],
  waves:[
    [{type:"runner",count:10,interval:700}],
    [{type:"soldier",count:12,interval:900},{type:"runner",count:6,interval:700}],
    [{type:"tank",count:3,interval:2000},{type:"soldier",count:8,interval:900}],
    [{type:"swarm",count:20,interval:350},{type:"runner",count:8,interval:600}],
  ],
},
// ── LEVEL 3 ── spiral, 4 waves
{
  name:"Ruínas Antigas", bg:"#1a1400", pathColor:"#5c4a10", pathEdge:"#3d3008",
  startGold:140, bonusGold:40, description:"Tanques chegam em força!",
  path:[
    [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],
    [10,5],[10,4],[10,3],[10,2],[10,1],
    [9,1],[8,1],[7,1],[6,1],[5,1],[4,1],[3,1],[2,1],[1,1],
    [1,2],[1,3],[1,4],[1,5],
    [2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],
    [9,4],[9,3],[9,2],
    [8,2],[7,2],[6,2],[5,2],[4,2],[3,2],[2,2],
    [2,3],[2,4],
    [3,4],[4,4],[5,4],[6,4],[7,4],[8,4],
    [8,3],[7,3],[6,3],[5,3],[4,3],[3,3],
    [3,7],[3,8],[3,9],[3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10],[10,11],[10,12],
  ],
  waves:[
    [{type:"tank",count:4,interval:2000}],
    [{type:"soldier",count:15,interval:800},{type:"tank",count:3,interval:2000}],
    [{type:"swarm",count:25,interval:300},{type:"tank",count:4,interval:1800}],
    [{type:"armored",count:3,interval:2200},{type:"runner",count:12,interval:700}],
  ],
},
// ── LEVEL 4 ── double loop, 5 waves
{
  name:"Deserto Vermelho", bg:"#1a0a00", pathColor:"#8b4513", pathEdge:"#5c2e08",
  startGold:150, bonusGold:45, description:"Blindados e fantasmas surgem!",
  path:[
    [0,1],[1,1],[2,1],[3,1],[4,1],[5,1],
    [5,2],[5,3],[5,4],[5,5],[5,6],
    [4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],[0,9],[0,10],[0,11],
    [1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],
    [10,10],[10,9],[10,8],[10,7],[10,6],
    [9,6],[8,6],[7,6],[6,6],
    [6,5],[6,4],[6,3],[6,2],[6,1],
    [7,1],[8,1],[9,1],[10,1],[10,2],[10,3],[10,4],[10,5],
    [9,5],[8,5],[7,5],
    [7,7],[7,8],[7,9],[7,10],[6,10],[5,10],[4,10],[3,10],[2,10],[1,10],[1,12],
  ],
  waves:[
    [{type:"armored",count:4,interval:2000}],
    [{type:"ghost",count:8,interval:1000}],
    [{type:"swarm",count:30,interval:280},{type:"armored",count:3,interval:2000}],
    [{type:"tank",count:6,interval:1600},{type:"ghost",count:6,interval:900}],
    [{type:"armored",count:5,interval:1800},{type:"ghost",count:8,interval:800}],
  ],
},
// ── LEVEL 5 ── diagonal-ish, 5 waves, BOSS
{
  name:"Montanha de Gelo", bg:"#050d1f", pathColor:"#2a4a6e", pathEdge:"#1a2f4a",
  startGold:160, bonusGold:50, description:"O primeiro Chefe aparece!",
  path:[
    [0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0],[10,0],
    [10,1],[10,2],[10,3],[10,4],
    [9,4],[8,4],[7,4],[6,4],[5,4],[4,4],[3,4],[2,4],[1,4],[0,4],
    [0,5],[0,6],[0,7],[0,8],
    [1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],
    [10,9],[10,10],[10,11],[10,12],
  ],
  waves:[
    [{type:"armored",count:5,interval:1800},{type:"runner",count:10,interval:700}],
    [{type:"ghost",count:10,interval:800},{type:"swarm",count:20,interval:350}],
    [{type:"brute",count:3,interval:2500}],
    [{type:"tank",count:6,interval:1500},{type:"armored",count:4,interval:2000}],
    [{type:"boss",count:1,interval:0}],
  ],
},
// ── LEVEL 6 ── comb/teeth pattern, 6 waves
{
  name:"Fábrica Abandonada", bg:"#0f0f0f", pathColor:"#3a3a3a", pathEdge:"#222",
  startGold:170, bonusGold:55, description:"Brutões e enxames gigantes!",
  path:[
    [0,12],[1,12],[2,12],[3,12],[4,12],[5,12],[6,12],[7,12],[8,12],[9,12],[10,12],
    [10,11],[10,10],[10,9],[10,8],[10,7],[10,6],[10,5],[10,4],[10,3],[10,2],[10,1],[10,0],
    [9,0],[8,0],[7,0],[6,0],[5,0],[4,0],[3,0],[2,0],[1,0],[0,0],
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],
    [1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],
    [9,7],[9,6],[9,5],[9,4],[9,3],[9,2],
    [8,2],[7,2],[6,2],[5,2],[4,2],[3,2],[2,2],[1,2],
    [1,3],[1,4],[1,5],[1,6],[1,7],
    [2,7],[3,7],[4,7],[5,7],[6,7],[7,7],
    [7,6],[7,5],[7,4],[7,3],
    [6,3],[5,3],[4,3],[3,3],[2,3],
    [2,4],[2,5],[2,6],
    [3,6],[4,6],[5,6],[6,6],
    [6,5],[6,4],[5,4],[4,4],[3,4],[3,5],[4,5],[5,5],
  ],
  waves:[
    [{type:"brute",count:4,interval:2200}],
    [{type:"swarm",count:40,interval:250},{type:"runner",count:12,interval:600}],
    [{type:"ghost",count:12,interval:800},{type:"brute",count:3,interval:2500}],
    [{type:"armored",count:7,interval:1600},{type:"tank",count:5,interval:1800}],
    [{type:"swarm",count:50,interval:200},{type:"brute",count:5,interval:2000}],
    [{type:"boss",count:1,interval:0},{type:"armored",count:6,interval:1500}],
  ],
},
// ── LEVEL 7 ── X-cross, 6 waves
{
  name:"Templo Proibido", bg:"#1a0020", pathColor:"#5a1a6e", pathEdge:"#3d1050",
  startGold:180, bonusGold:60, description:"Velocistas e fantasmas em massa!",
  path:[
    [0,6],[1,6],[2,6],[3,6],[3,5],[3,4],[3,3],[3,2],[3,1],[3,0],
    [4,0],[5,0],[6,0],[7,0],[7,1],[7,2],[7,3],[7,4],[7,5],[7,6],
    [8,6],[9,6],[10,6],[10,7],[10,8],[10,9],[10,10],[10,11],[10,12],
    [9,12],[8,12],[7,12],[7,11],[7,10],[7,9],[7,8],[7,7],
    [6,7],[5,7],[4,7],[3,7],[3,8],[3,9],[3,10],[3,11],[3,12],
    [2,12],[1,12],[0,12],[0,11],[0,10],[0,9],[0,8],[0,7],
    [1,7],[2,7],
  ],
  waves:[
    [{type:"speeder",count:15,interval:500}],
    [{type:"ghost",count:15,interval:700},{type:"speeder",count:10,interval:400}],
    [{type:"brute",count:5,interval:2000},{type:"tank",count:6,interval:1600}],
    [{type:"swarm",count:45,interval:220},{type:"ghost",count:12,interval:700}],
    [{type:"armored",count:8,interval:1500},{type:"speeder",count:15,interval:400}],
    [{type:"boss",count:2,interval:3000}],
  ],
},
// ── LEVEL 8 ── maze/labyrinth, 7 waves
{
  name:"Labirinto das Sombras", bg:"#0a0010", pathColor:"#1a0a3a", pathEdge:"#10061e",
  startGold:200, bonusGold:65, description:"O labirinto dificulta tudo!",
  path:[
    [0,0],[1,0],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],
    [3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
    [9,0],[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],[10,7],[10,8],[10,9],[10,10],
    [9,10],[8,10],[7,10],[6,10],[5,10],[4,10],[3,10],[2,10],[1,10],[0,10],
    [0,11],[0,12],[1,12],[2,12],[3,12],[4,12],[5,12],[6,12],[7,12],[8,12],[9,12],[10,12],
  ],
  waves:[
    [{type:"brute",count:5,interval:2000},{type:"speeder",count:12,interval:450}],
    [{type:"ghost",count:18,interval:650},{type:"swarm",count:35,interval:250}],
    [{type:"armored",count:8,interval:1500},{type:"brute",count:4,interval:2200}],
    [{type:"boss",count:1,interval:0},{type:"swarm",count:30,interval:300}],
    [{type:"speeder",count:25,interval:350},{type:"ghost",count:15,interval:650}],
    [{type:"armored",count:10,interval:1400},{type:"brute",count:6,interval:2000}],
    [{type:"boss",count:2,interval:3500},{type:"armored",count:8,interval:1400}],
  ],
},
// ── LEVEL 9 ── double helix, 7 waves
{
  name:"Fortaleza Vulcânica", bg:"#1a0500", pathColor:"#6e1a00", pathEdge:"#4a1000",
  startGold:220, bonusGold:70, description:"Titãs se aproximam!",
  path:[
    [5,0],[5,1],[5,2],[4,2],[3,2],[2,2],[1,2],[0,2],[0,3],[0,4],[0,5],[0,6],
    [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],
    [10,5],[10,4],[10,3],[10,2],[9,2],[8,2],[7,2],[6,2],[6,1],[6,0],
    [7,0],[8,0],[9,0],[10,0],[10,1],
    [9,1],[8,1],[7,1],
    [7,3],[7,4],[7,5],[8,5],[9,5],[9,4],[9,3],[8,3],[8,4],
    [6,4],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[1,4],[1,5],[2,5],[3,5],[4,5],[5,5],[5,4],[4,4],[3,4],[2,4],
    [0,7],[0,8],[0,9],[0,10],[1,10],[2,10],[3,10],[4,10],[5,10],[5,9],[5,8],[5,7],
    [6,7],[7,7],[8,7],[9,7],[10,7],[10,8],[10,9],[10,10],
    [9,10],[8,10],[7,10],[6,10],[6,9],[6,8],[7,8],[8,8],[9,8],[9,9],[8,9],[7,9],
    [4,9],[3,9],[2,9],[1,9],[1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[10,12],
  ],
  waves:[
    [{type:"titan",count:1,interval:0},{type:"swarm",count:30,interval:300}],
    [{type:"brute",count:8,interval:1800},{type:"speeder",count:20,interval:350}],
    [{type:"ghost",count:20,interval:600},{type:"armored",count:10,interval:1400}],
    [{type:"titan",count:1,interval:0},{type:"boss",count:1,interval:3000}],
    [{type:"swarm",count:60,interval:180},{type:"speeder",count:25,interval:300}],
    [{type:"armored",count:12,interval:1300},{type:"brute",count:8,interval:1800}],
    [{type:"titan",count:2,interval:4000},{type:"boss",count:2,interval:3000}],
  ],
},
// ── LEVEL 10 ── FINAL, all-in, 8 waves
{
  name:"🔥 FINAL: Núcleo do Caos", bg:"#0d0000", pathColor:"#6e0000", pathEdge:"#4a0000",
  startGold:250, bonusGold:80, description:"Tudo ao mesmo tempo. Boa sorte!",
  path:[
    [0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[5,5],[5,4],[5,3],[5,2],[5,1],[5,0],
    [6,0],[7,0],[8,0],[9,0],[10,0],[10,1],[10,2],[10,3],[10,4],[10,5],[10,6],
    [9,6],[8,6],[7,6],[6,6],[6,7],[6,8],[6,9],[6,10],[6,11],[6,12],
    [5,12],[4,12],[3,12],[2,12],[1,12],[0,12],[0,11],[0,10],[0,9],[0,8],[0,7],
    [1,7],[2,7],[3,7],[4,7],[4,8],[4,9],[4,10],[4,11],
    [5,11],[5,10],[5,9],[5,8],[5,7],
    [3,6],[3,5],[3,4],[3,3],[3,2],[3,1],[3,0],
    [2,0],[1,0],[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],
    [1,5],[2,5],[2,4],[2,3],[2,2],[2,1],
    [1,1],[1,2],[1,3],[1,4],
    [7,6],[7,7],[7,8],[7,9],[7,10],[7,11],[7,12],[8,12],[9,12],[10,12],
    [10,11],[10,10],[10,9],[10,8],[10,7],
    [9,7],[8,7],[8,8],[9,8],[9,9],[8,9],[8,10],[9,10],[9,11],[8,11],
  ],
  waves:[
    [{type:"boss",count:1,interval:0},{type:"armored",count:8,interval:1400}],
    [{type:"titan",count:1,interval:0},{type:"swarm",count:40,interval:220}],
    [{type:"brute",count:10,interval:1600},{type:"ghost",count:15,interval:650}],
    [{type:"speeder",count:30,interval:300},{type:"armored",count:12,interval:1200}],
    [{type:"boss",count:2,interval:2500},{type:"swarm",count:50,interval:200}],
    [{type:"titan",count:2,interval:3500},{type:"brute",count:10,interval:1500}],
    [{type:"armored",count:15,interval:1100},{type:"ghost",count:20,interval:550},{type:"speeder",count:20,interval:300}],
    [{type:"titan",count:3,interval:3000},{type:"boss",count:3,interval:2500},{type:"armored",count:15,interval:1000}],
  ],
},
];

// ─── INTERFACES ───────────────────────────────────────────────────────────────
interface Tower { id:number;col:number;row:number;type:TowerType;cooldown:number;angle:number;level:number }
interface Enemy { id:number;pathIdx:number;x:number;y:number;hp:number;maxHp:number;type:EnemyType;slow:number }
interface Proj  { id:number;x:number;y:number;tx:number;ty:number;dmg:number;spd:number;color:string;sz:number;special:string;eid:number;splash:number }
interface Float { id:number;x:number;y:number;text:string;color:string;life:number }
interface Boom  { id:number;x:number;y:number;r:number;maxR:number;life:number;color:string }

// ─── AUDIO ────────────────────────────────────────────────────────────────────
let _ac: AudioContext|null = null;
function ac(): AudioContext|null {
  if(_ac) return _ac;
  try { _ac=new (window.AudioContext||(window as any).webkitAudioContext)(); return _ac; }
  catch { return null; }
}

function noise(dur:number, freq:number, vol:number, decay:number) {
  const a=ac(); if(!a) return;
  const buf=a.createBuffer(1,a.sampleRate*dur,a.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++){const t=i/a.sampleRate;d[i]=(Math.random()*2-1)*Math.exp(-t*decay);}
  const s=a.createBufferSource(); s.buffer=buf;
  const f=a.createBiquadFilter(); f.type="lowpass"; f.frequency.value=freq;
  const g=a.createGain(); g.gain.value=vol;
  s.connect(f); f.connect(g); g.connect(a.destination); s.start();
}
function tone(freq:number, dur:number, vol:number, type:OscillatorType="square") {
  const a=ac(); if(!a) return;
  const o=a.createOscillator(); o.type=type; o.frequency.value=freq;
  const g=a.createGain();
  g.gain.setValueAtTime(vol,a.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001,a.currentTime+dur);
  o.connect(g); g.connect(a.destination);
  o.start(); o.stop(a.currentTime+dur);
}

let musicGain: GainNode|null = null;
let musicPlaying = false;
let musicTimeouts: ReturnType<typeof setTimeout>[] = [];

function startMusic(vol:number=0.18) {
  const a=ac(); if(!a||musicPlaying) return;
  musicPlaying=true;
  const master=a.createGain(); master.gain.value=vol; master.connect(a.destination);
  musicGain=master;

  // Better music: pentatonic arpeggio + bass + rhythm
  const scale=[220,261,294,330,392,440,523,587,659,784];
  const bassNotes=[110,110,98,110,87,87,98,110];
  const tempo=0.38;

  function scheduleBar(startT:number, bar:number){
    if(!musicPlaying) return;
    // bass line
    for(let i=0;i<8;i++){
      const o=a.createOscillator(); o.type="triangle";
      o.frequency.value=bassNotes[i];
      const g=a.createGain();
      const t=startT+i*tempo;
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.55,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,t+tempo*0.85);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t+tempo*0.85);
    }
    // melody arpeggio
    const pattern=[0,2,4,6,4,2,0,3,5,7,5,3,1,4,6,5];
    for(let i=0;i<pattern.length;i++){
      const o=a.createOscillator(); o.type="sine";
      const note=scale[(pattern[i]+(bar*3))%scale.length]*((bar%2===0)?1:1.5);
      o.frequency.value=note;
      const g=a.createGain();
      const t=startT+i*(tempo/2);
      g.gain.setValueAtTime(0,t);
      g.gain.linearRampToValueAtTime(0.2,t+0.015);
      g.gain.exponentialRampToValueAtTime(0.001,t+tempo*0.4);
      o.connect(g); g.connect(master);
      o.start(t); o.stop(t+tempo*0.4);
    }
    // hi-hat
    for(let i=0;i<16;i++){
      const buf=a.createBuffer(1,a.sampleRate*0.04,a.sampleRate);
      const data=buf.getChannelData(0);
      for(let j=0;j<data.length;j++){const tt=j/a.sampleRate;data[j]=(Math.random()*2-1)*Math.exp(-tt*80);}
      const s=a.createBufferSource(); s.buffer=buf;
      const g=a.createGain(); g.gain.value=i%2===0?0.15:0.07;
      const hp=a.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=4000;
      s.connect(hp); hp.connect(g); g.connect(master);
      s.start(startT+i*(tempo/2));
    }
    // kick on beats 1&3
    for(const beat of [0,4]){
      const buf=a.createBuffer(1,a.sampleRate*0.2,a.sampleRate);
      const data=buf.getChannelData(0);
      for(let j=0;j<data.length;j++){const tt=j/a.sampleRate;data[j]=(Math.random()*2-1)*Math.exp(-tt*18)+Math.sin(2*Math.PI*60*tt)*Math.exp(-tt*12);}
      const s=a.createBufferSource(); s.buffer=buf;
      const g=a.createGain(); g.gain.value=0.4;
      const lp=a.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=250;
      s.connect(lp); lp.connect(g); g.connect(master);
      s.start(startT+beat*tempo);
    }
    const barLen=8*tempo;
    const tid=setTimeout(()=>scheduleBar(a.currentTime+0.05, bar+1), barLen*1000-150);
    musicTimeouts.push(tid);
  }
  scheduleBar(a.currentTime+0.1, 0);
}
function stopMusic(){
  musicPlaying=false;
  musicTimeouts.forEach(t=>clearTimeout(t));
  musicTimeouts=[];
  if(musicGain){ try{musicGain.disconnect();}catch{} musicGain=null; }
}
function setMusicVol(v:number){
  if(musicGain) musicGain.gain.setTargetAtTime(v,ac()!.currentTime,0.1);
}

function sfxShoot(id:string){
  if(id==="machine") tone(900,0.05,0.06,"sawtooth");
  else if(id==="cannon") noise(0.15,600,0.28,18);
  else if(id==="ice") tone(1100,0.09,0.06,"triangle");
  else if(id==="rocket"){ noise(0.18,800,0.22,12); tone(200,0.1,0.1,"sawtooth"); }
  else if(id==="laser") tone(1600,0.06,0.07,"sine");
  else if(id==="mortar") noise(0.22,500,0.32,10);
}
function sfxBoom(big:boolean){ noise(big?0.7:0.3, big?500:900, big?0.5:0.28, big?5:10); }
function sfxLife(){ tone(120,0.3,0.3,"sawtooth"); }
function sfxWave(){
  const a=ac(); if(!a) return;
  [0,0.1,0.2].forEach((dt,i)=>{
    const o=a.createOscillator(); o.frequency.value=[440,550,660][i];
    const g=a.createGain();
    const t=a.currentTime+dt;
    g.gain.setValueAtTime(0.14,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.18);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t+0.18);
  });
}
function sfxVictory(){
  const a=ac(); if(!a) return;
  [523,659,784,1047,1319].forEach((fr,i)=>{
    const o=a.createOscillator(); o.frequency.value=fr;
    const g=a.createGain();
    const t=a.currentTime+i*0.13;
    g.gain.setValueAtTime(0.16,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.28);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t+0.28);
  });
}

// ─── DRAW HELPERS ─────────────────────────────────────────────────────────────
function drawScene(
  ctx:CanvasRenderingContext2D, lvl:LevelDef,
  pathSet:Set<string>, waypoints:{x:number;y:number}[],
  towers:Tower[], enemies:Enemy[], projs:Proj[],
  floats:Float[], booms:Boom[]
){
  // background
  ctx.fillStyle=lvl.bg; ctx.fillRect(0,0,W,H);
  // grid dots
  ctx.fillStyle="rgba(255,255,255,0.04)";
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(!pathSet.has(`${c},${r}`)) ctx.fillRect(c*CS+CS/2-1,r*CS+CS/2-1,2,2);
  }
  // path glow underlay
  ctx.lineCap="round"; ctx.lineJoin="round";
  ctx.strokeStyle=lvl.pathColor+"55"; ctx.lineWidth=CS+2;
  ctx.beginPath();
  waypoints.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.stroke();
  // path body
  ctx.strokeStyle=lvl.pathColor; ctx.lineWidth=CS-4;
  ctx.beginPath();
  waypoints.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.stroke();
  // path edge
  ctx.strokeStyle=lvl.pathEdge; ctx.lineWidth=CS-8;
  ctx.beginPath();
  waypoints.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
  ctx.stroke();
  // start/end
  ctx.font="bold 11px monospace"; ctx.textAlign="center"; ctx.textBaseline="middle";
  ctx.fillStyle="#00e676"; ctx.fillText("▶",waypoints[0].x,waypoints[0].y);
  ctx.fillStyle="#ef4444"; ctx.fillText("⚑",waypoints[waypoints.length-1].x,waypoints[waypoints.length-1].y);

  // explosions behind enemies
  booms.forEach(b=>{
    ctx.save(); ctx.globalAlpha=b.life/20;
    const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
    g.addColorStop(0,b.color+"ff"); g.addColorStop(0.5,b.color+"88"); g.addColorStop(1,"transparent");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
    ctx.restore();
  });

  // towers
  towers.forEach(t=>{
    const cx=t.col*CS+CS/2, cy=t.row*CS+CS/2;
    ctx.save();
    ctx.shadowColor=t.type.color; ctx.shadowBlur=6;
    ctx.fillStyle=t.type.color+"28";
    ctx.beginPath(); ctx.roundRect(cx-CS*0.44,cy-CS*0.44,CS*0.88,CS*0.88,5); ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle=t.type.color+"60";
    ctx.beginPath(); ctx.roundRect(cx-CS*0.33,cy-CS*0.33,CS*0.66,CS*0.66,3); ctx.fill();
    // barrel
    ctx.translate(cx,cy); ctx.rotate(t.angle);
    ctx.fillStyle=t.type.color; ctx.beginPath(); ctx.roundRect(1,-2.5,CS*0.33,5,2); ctx.fill();
    ctx.restore();
    // level stars
    for(let i=0;i<t.level;i++){
      ctx.fillStyle="#ffd700"; ctx.beginPath();
      ctx.arc(cx-5+i*5,cy+CS*0.3,2,0,Math.PI*2); ctx.fill();
    }
    ctx.font=`${CS*0.37}px sans-serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(t.type.emoji,cx,cy);
  });

  // enemies
  enemies.forEach(e=>{
    const sz=e.type.size;
    ctx.save();
    if(e.slow>0){ ctx.strokeStyle="#22d3ee"; ctx.lineWidth=2; ctx.globalAlpha=0.55; ctx.beginPath(); ctx.arc(e.x,e.y,sz+4,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; }
    ctx.fillStyle=e.type.color; ctx.beginPath(); ctx.arc(e.x,e.y,sz,0,Math.PI*2); ctx.fill();
    ctx.font=`${sz*1.15}px sans-serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(e.type.emoji,e.x,e.y+1);
    const bw=sz*2.2,bh=3,pct=e.hp/e.maxHp;
    ctx.fillStyle="rgba(0,0,0,0.7)"; ctx.fillRect(e.x-bw/2,e.y-sz-6,bw,bh+1);
    ctx.fillStyle=pct>0.5?"#4ade80":pct>0.25?"#facc15":"#ef4444";
    ctx.fillRect(e.x-bw/2,e.y-sz-6,bw*pct,bh);
    ctx.restore();
  });

  // projectiles
  projs.forEach(p=>{
    ctx.save(); ctx.fillStyle=p.color; ctx.shadowColor=p.color; ctx.shadowBlur=5;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.sz,0,Math.PI*2); ctx.fill(); ctx.restore();
  });

  // float texts
  floats.forEach(f=>{
    ctx.save(); ctx.globalAlpha=Math.min(1,f.life/20);
    ctx.fillStyle=f.color; ctx.font="bold 10px monospace";
    ctx.textAlign="center"; ctx.textBaseline="top";
    ctx.fillText(f.text,f.x,f.y); ctx.restore();
  });
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
let uid_=1; function uid(){ return uid_++; }

export default function TowerDefense({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);

  const [uiPhase,   setUiPhase]   = useState<"menu"|"levelSelect"|"playing"|"between"|"win"|"lose">("menu");
  const [uiLvlIdx,  setUiLvlIdx]  = useState(0);
  const [uiGold,    setUiGold]    = useState(120);
  const [uiLives,   setUiLives]   = useState(20);
  const [uiWave,    setUiWave]    = useState(0);
  const [uiScore,   setUiScore]   = useState(0);
  const [uiSpeed,   setUiSpeed]   = useState(1);
  const [uiSelTow,  setUiSelTow]  = useState(TOWERS[0]);
  const [uiSelMap,  setUiSelMap]  = useState<Tower|null>(null);
  const [uiWaveRdy, setUiWaveRdy] = useState(true);
  const [uiMusicOn, setUiMusicOn] = useState(true);
  const [uiWaveActive, setUiWaveActive] = useState(false);
  const [totalWaves, setTotalWaves] = useState(3);

  const selTowRef = useRef(TOWERS[0]);

  const G = useRef({
    towers:[]as Tower[], enemies:[]as Enemy[], projs:[]as Proj[],
    floats:[]as Float[], booms:[]as Boom[],
    gold:120, lives:20, score:0, lvlIdx:0, wave:0,
    speed:1, waveActive:false,
    queue:[]as{type:EnemyType;delay:number}[],
    spawnT:0, phase:"playing" as "playing"|"win"|"lose",
    pathSet:new Set<string>(), waypoints:[]as{x:number;y:number}[],
  });

  // canvas sizing
  const vw = typeof window!=="undefined"?window.innerWidth:390;
  const dispW = Math.min(vw, W);
  const dispH = dispW * H / W;

  // resize listener
  useEffect(()=>{
    const onResize=()=>{ /* force re-render */ setUiGold(g=>g); };
    window.addEventListener("resize",onResize);
    return ()=>window.removeEventListener("resize",onResize);
  },[]);

  // audio unlock
  useEffect(()=>{
    const u=()=>ac()?.resume();
    window.addEventListener("touchstart",u,{once:true});
    window.addEventListener("click",u,{once:true});
    return ()=>{ window.removeEventListener("touchstart",u); window.removeEventListener("click",u); };
  },[]);

  // ── GAME LOOP ────────────────────────────────────────────────────────────────
  useEffect(()=>{
    if(uiPhase!=="playing") return;
    const canvas=canvasRef.current!;
    const ctx=canvas.getContext("2d")!;
    let lastT=performance.now();

    if(uiMusicOn) startMusic();

    function tick(now:number){
      const rawDt=Math.min((now-lastT)/1000,0.05);
      lastT=now;
      const g=G.current;
      const dt=rawDt*g.speed;
      const lvl=LEVELS[g.lvlIdx];

      // spawn
      if(g.waveActive){
        g.spawnT-=dt;
        if(g.spawnT<=0 && g.queue.length>0){
          const entry=g.queue.shift()!;
          g.enemies.push({
            id:uid(), pathIdx:0,
            x:g.waypoints[0].x, y:g.waypoints[0].y,
            hp:entry.type.hp, maxHp:entry.type.hp,
            type:entry.type, slow:0,
          });
          g.spawnT=entry.delay;
        }
        if(g.queue.length===0 && g.enemies.length===0){
          g.waveActive=false;
          setUiWaveRdy(true);
          setUiWaveActive(false);
          if(g.wave>=lvl.waves.length){
            g.phase="win"; setUiPhase("between"); sfxVictory();
          }
        }
      }

      // move enemies
      const dead:number[]=[];
      g.enemies.forEach(e=>{
        if(e.slow>0) e.slow-=dt*60;
        const spd=(e.slow>0?e.type.speed*0.4:e.type.speed)*CS*dt;
        let rem=spd;
        while(rem>0 && e.pathIdx<g.waypoints.length-1){
          const wp=g.waypoints[e.pathIdx+1];
          const dx=wp.x-e.x, dy=wp.y-e.y, dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<=rem){ e.x=wp.x; e.y=wp.y; e.pathIdx++; rem-=dist; }
          else { e.x+=dx/dist*rem; e.y+=dy/dist*rem; rem=0; }
        }
        if(e.pathIdx>=g.waypoints.length-1){
          dead.push(e.id); g.lives=Math.max(0,g.lives-1); sfxLife();
          if(g.lives===0){ g.phase="lose"; setUiPhase("lose"); stopMusic(); }
        }
      });
      g.enemies=g.enemies.filter(e=>!dead.includes(e.id));

      // towers shoot
      g.towers.forEach(t=>{
        t.cooldown-=dt;
        if(t.cooldown>0) return;
        const rng=(t.type.range+t.level*0.3)*CS;
        const rng2=rng*rng;
        const cx=t.col*CS+CS/2, cy=t.row*CS+CS/2;
        let target:Enemy|null=null;
        if(t.type.special==="strong"){
          let best=0;
          g.enemies.forEach(e=>{ const dx=e.x-cx,dy=e.y-cy; if(dx*dx+dy*dy<=rng2&&e.hp>best){best=e.hp;target=e;} });
        } else {
          let best=-1;
          g.enemies.forEach(e=>{ const dx=e.x-cx,dy=e.y-cy; if(dx*dx+dy*dy<=rng2&&e.pathIdx>best){best=e.pathIdx;target=e;} });
        }
        if(!target) return;
        t.cooldown=1/t.type.fireRate;
        t.angle=Math.atan2(target.y-cy,target.x-cx);
        const armor=t.type.special==="splash"?target.type.armor*0.5:target.type.armor;
        const dmg=(t.type.damage+t.level*t.type.damage*0.3)*(1-armor);
        g.projs.push({
          id:uid(), x:cx, y:cy, tx:target.x, ty:target.y,
          dmg, spd:CS*9, color:t.type.color,
          sz:t.type.special==="splash"||t.type.special==="mortar"?5:3,
          special:t.type.special, eid:target.id,
          splash:t.type.special==="splash"?CS*1.5:0,
        });
        sfxShoot(t.type.id);
      });

      // move projectiles
      const hitP:number[]=[];
      g.projs.forEach(p=>{
        const dx=p.tx-p.x, dy=p.ty-p.y, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<=p.spd*dt){
          hitP.push(p.id);
          if(p.splash>0){
            const r2=p.splash*p.splash;
            g.enemies.forEach(e=>{ const ddx=e.x-p.x,ddy=e.y-p.y; if(ddx*ddx+ddy*ddy<=r2) e.hp-=p.dmg; });
            g.booms.push({id:uid(),x:p.x,y:p.y,r:4,maxR:p.splash,life:20,color:p.color});
            sfxBoom(p.splash>CS);
          } else {
            const e=g.enemies.find(e=>e.id===p.eid);
            if(e){ e.hp-=p.dmg; if(p.special==="slow") e.slow=90; }
          }
          const killed=g.enemies.filter(e=>e.hp<=0);
          killed.forEach(e=>{
            g.gold+=e.type.reward; g.score+=e.type.reward*10;
            g.floats.push({id:uid(),x:e.x,y:e.y-18,text:`+${e.type.reward}💰`,color:"#fbbf24",life:55});
            g.booms.push({id:uid(),x:e.x,y:e.y,r:4,maxR:e.type.size*2.2,life:14,color:e.type.color});
            if(e.type.id==="boss"||e.type.id==="titan") sfxBoom(true);
          });
          g.enemies=g.enemies.filter(e=>e.hp>0);
        } else {
          p.x+=dx/dist*p.spd*dt; p.y+=dy/dist*p.spd*dt;
          const e=g.enemies.find(e=>e.id===p.eid);
          if(e&&!p.splash){ p.tx=e.x; p.ty=e.y; }
        }
      });
      g.projs=g.projs.filter(p=>!hitP.includes(p.id));

      g.floats.forEach(f=>{ f.y-=0.4; f.life--; });
      g.floats=g.floats.filter(f=>f.life>0);
      g.booms.forEach(b=>{ b.r=Math.min(b.r+b.maxR/8,b.maxR); b.life--; });
      g.booms=g.booms.filter(b=>b.life>0);

      setUiGold(g.gold); setUiLives(g.lives); setUiScore(g.score);

      drawScene(ctx,lvl,g.pathSet,g.waypoints,g.towers,g.enemies,g.projs,g.floats,g.booms);
      rafRef.current=requestAnimationFrame(tick);
    }
    rafRef.current=requestAnimationFrame(tick);
    return ()=>{ cancelAnimationFrame(rafRef.current); stopMusic(); };
  },[uiPhase]);

  // ── HANDLERS ────────────────────────────────────────────────────────────────
  function handleCanvasClick(e:React.MouseEvent<HTMLCanvasElement>){
    if(G.current.phase!=="playing") return;
    const canvas=canvasRef.current!;
    const rect=canvas.getBoundingClientRect();
    const px=(e.clientX-rect.left)*(W/rect.width);
    const py=(e.clientY-rect.top)*(H/rect.height);
    const col=Math.floor(px/CS), row=Math.floor(py/CS);
    if(col<0||col>=COLS||row<0||row>=ROWS) return;
    const existing=G.current.towers.find(t=>t.col===col&&t.row===row);
    if(existing){ setUiSelMap({...existing}); return; }
    if(G.current.pathSet.has(`${col},${row}`)) return;
    const tt=selTowRef.current;
    if(G.current.gold<tt.cost) return;
    G.current.gold-=tt.cost;
    G.current.towers.push({id:uid(),col,row,type:tt,cooldown:0,angle:0,level:1});
    setUiSelMap(null);
  }

  function handleUpgrade(){
    if(!uiSelMap) return;
    const t=G.current.towers.find(t=>t.id===uiSelMap.id); if(!t||t.level>=3) return;
    const cost=t.type.cost*t.level;
    if(G.current.gold<cost) return;
    G.current.gold-=cost; t.level++;
    setUiSelMap({...t});
  }
  function handleSell(){
    if(!uiSelMap) return;
    const t=G.current.towers.find(t=>t.id===uiSelMap.id); if(!t) return;
    G.current.gold+=Math.floor(t.type.cost*0.5);
    G.current.towers=G.current.towers.filter(x=>x.id!==uiSelMap.id);
    setUiSelMap(null);
  }

  function sendWave(){
    const g=G.current; const lvl=LEVELS[g.lvlIdx];
    if(g.waveActive||g.wave>=lvl.waves.length) return;
    const entries=lvl.waves[g.wave]; g.wave++;
    setUiWave(g.wave);
    const q:{type:EnemyType;delay:number}[]=[];
    entries.forEach(en=>{ const et=ETYPES[en.type]; for(let i=0;i<en.count;i++) q.push({type:et,delay:en.interval/1000}); });
    q.sort(()=>Math.random()-0.5);
    g.queue=q; g.spawnT=0; g.waveActive=true;
    setUiWaveRdy(false); setUiWaveActive(true); sfxWave();
  }

  function toggleSpeed(){
    const ns=G.current.speed===1?2:G.current.speed===2?3:1;
    G.current.speed=ns; setUiSpeed(ns);
  }

  function toggleMusic(){
    if(uiMusicOn){ stopMusic(); setUiMusicOn(false); }
    else { startMusic(); setUiMusicOn(true); }
  }

  function startLevel(idx:number){
    uid_=1;
    const lvl=LEVELS[idx];
    const pathSet=new Set(lvl.path.map(([c,r])=>`${c},${r}`));
    const waypoints=lvl.path.map(([c,r])=>({x:c*CS+CS/2,y:r*CS+CS/2}));
    G.current={
      towers:[],enemies:[],projs:[],floats:[],booms:[],
      gold:lvl.startGold,lives:20,score:0,
      lvlIdx:idx,wave:0,speed:1,waveActive:false,queue:[],spawnT:0,
      phase:"playing",pathSet,waypoints,
    };
    setUiGold(lvl.startGold); setUiLives(20); setUiScore(0);
    setUiWave(0); setUiSpeed(1); setUiSelMap(null); setUiWaveRdy(true);
    setUiWaveActive(false); setUiLvlIdx(idx);
    setTotalWaves(lvl.waves.length);
    selTowRef.current=TOWERS[0]; setUiSelTow(TOWERS[0]);
    setUiPhase("playing");
  }

  const curVw = typeof window!=="undefined"?window.innerWidth:390;
  const cDispW = Math.min(curVw, W);
  const cDispH = cDispW * H / W;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@500;700&display=swap');
        :root{--bg:#0a0a12;--panel:#0f0f1e;--brd:rgba(255,255,255,0.07);--acc:#00e5ff;--gold:#f9a825;--green:#00e676;--red:#ef4444;--pur:#a78bfa;}
        *{box-sizing:border-box;margin:0;padding:0;}
        .td{width:100%;height:100dvh;display:flex;flex-direction:column;background:var(--bg);font-family:'Rajdhani',sans-serif;overflow:hidden;}

        /* scanlines */
        .td::before{content:'';position:fixed;inset:0;z-index:999;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px);}

        .hdr{display:flex;align-items:center;gap:5px;padding:0 7px;height:46px;min-height:46px;flex-shrink:0;background:rgba(0,0,0,0.55);border-bottom:1px solid var(--brd);backdrop-filter:blur(8px);}
        .hdr-back{background:none;border:none;color:rgba(255,255,255,0.38);cursor:pointer;padding:8px;display:flex;align-items:center;justify-content:center;border-radius:50%;-webkit-tap-highlight-color:transparent;}
        .hdr-back:hover{color:#fff;}
        .hdr-title{font-family:'Orbitron',monospace;color:#fff;font-size:12px;font-weight:900;flex:1;letter-spacing:2px;text-shadow:0 0 14px rgba(0,229,255,.6);}
        .stat{display:flex;flex-direction:column;align-items:center;padding:2px 6px;border-radius:5px;background:rgba(255,255,255,0.04);border:1px solid var(--brd);flex-shrink:0;}
        .stat-l{font-size:6.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,.3);}
        .stat-v{font-family:'Orbitron',monospace;font-size:12px;font-weight:700;line-height:1.2;}

        .canvas-row{flex-shrink:0;display:flex;justify-content:center;background:#050508;}
        canvas{display:block;cursor:crosshair;}

        .bottom{flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0;}

        /* wave bar */
        .wavebar{display:flex;align-items:center;gap:6px;padding:3px 8px;flex-shrink:0;border-bottom:1px solid var(--brd);}
        .wavebar-prog{flex:1;height:4px;background:rgba(255,255,255,0.06);border-radius:2px;overflow:hidden;}
        .wavebar-fill{height:100%;background:linear-gradient(90deg,var(--acc),var(--pur));border-radius:2px;transition:width .5s;}
        .wavebar-lbl{font-family:'Orbitron',monospace;font-size:9px;color:rgba(255,255,255,.45);}

        /* tower list */
        .towrow{display:flex;gap:4px;padding:5px 7px;overflow-x:auto;flex-shrink:0;border-bottom:1px solid var(--brd);}
        .towrow::-webkit-scrollbar{height:3px;}
        .towrow::-webkit-scrollbar-thumb{background:rgba(255,255,255,.14);border-radius:2px;}
        .towbtn{display:flex;flex-direction:column;align-items:center;gap:1px;padding:5px 6px;border-radius:7px;border:1px solid var(--brd);background:rgba(255,255,255,.03);cursor:pointer;-webkit-tap-highlight-color:transparent;min-width:54px;transition:all .12s;flex-shrink:0;}
        .towbtn.sel{background:rgba(0,229,255,.12);border-color:var(--acc);}
        .towbtn.poor{opacity:.3;}
        .towbtn-ico{font-size:18px;line-height:1;}
        .towbtn-nm{font-size:8px;font-weight:700;color:rgba(255,255,255,.55);letter-spacing:.3px;}
        .towbtn-cost{font-family:'Orbitron',monospace;font-size:8px;color:var(--gold);}

        /* action row */
        .actrow{display:flex;gap:5px;padding:5px 7px;flex-shrink:0;}
        .abtn{flex:1;padding:7px 3px;border-radius:7px;border:1px solid var(--brd);background:rgba(255,255,255,.04);color:#fff;font-family:'Rajdhani',sans-serif;font-size:12px;font-weight:700;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:all .1s;text-align:center;}
        .abtn.wave{background:linear-gradient(135deg,rgba(0,229,255,.18),rgba(0,100,200,.18));border-color:var(--acc);color:var(--acc);}
        .abtn.wave:active{background:rgba(0,229,255,.32);}
        .abtn.spd{border-color:var(--pur);color:var(--pur);}
        .abtn.mus{border-color:#6b7280;color:#9ca3af;font-size:16px;flex:0;padding:7px 10px;}
        .abtn:disabled{opacity:.3;cursor:default;}

        /* selected tower panel */
        .selpanel{background:rgba(0,229,255,.05);border-top:1px solid rgba(0,229,255,.18);padding:6px 10px;display:flex;align-items:center;gap:8px;flex-shrink:0;}
        .sel-info{flex:1;}
        .sel-name{color:var(--acc);font-family:'Orbitron',monospace;font-size:10px;font-weight:700;}
        .sel-lvl{color:rgba(255,255,255,.45);font-size:9px;margin-top:1px;}
        .sel-btns{display:flex;gap:5px;}
        .upg-btn{background:rgba(249,168,37,.14);border:1px solid var(--gold);color:var(--gold);font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;padding:5px 8px;border-radius:5px;cursor:pointer;-webkit-tap-highlight-color:transparent;}
        .upg-btn:disabled{opacity:.3;cursor:default;}
        .sell-btn{background:rgba(239,68,68,.1);border:1px solid var(--red);color:var(--red);font-family:'Rajdhani',sans-serif;font-size:11px;font-weight:700;padding:5px 8px;border-radius:5px;cursor:pointer;-webkit-tap-highlight-color:transparent;}
        .close-btn{background:rgba(255,255,255,.05);border:1px solid #444;color:#888;font-size:11px;padding:5px 7px;border-radius:5px;cursor:pointer;}

        .tip{color:rgba(255,255,255,.3);font-size:9.5px;text-align:center;padding:3px 8px;flex-shrink:0;}

        /* overlays */
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);display:flex;align-items:center;justify-content:center;z-index:50;backdrop-filter:blur(8px);}
        .card{background:linear-gradient(135deg,#0f0820,#08080f);border:1px solid rgba(255,255,255,.1);border-radius:22px;padding:28px 24px;display:flex;flex-direction:column;align-items:center;gap:14px;width:min(90%,320px);box-shadow:0 28px 70px rgba(0,0,0,.7);animation:cardIn .3s cubic-bezier(.34,1.4,.64,1);}
        @keyframes cardIn{from{opacity:0;transform:scale(.84)}to{opacity:1;transform:scale(1)}}
        .card-ico{font-size:50px;line-height:1;}
        .card-title{font-family:'Orbitron',monospace;color:#fff;font-size:20px;font-weight:900;letter-spacing:3px;text-align:center;}
        .card-sub{color:rgba(255,255,255,.4);font-size:12px;text-align:center;line-height:1.6;}
        .card-score{font-family:'Orbitron',monospace;color:var(--gold);font-size:40px;font-weight:900;line-height:1;}
        .play-btn{background:linear-gradient(135deg,#00b8d4,#006fa0);border:none;color:#fff;font-family:'Orbitron',monospace;font-size:13px;font-weight:700;letter-spacing:2px;padding:13px 0;border-radius:50px;cursor:pointer;width:100%;box-shadow:0 5px 22px rgba(0,200,255,.32);-webkit-tap-highlight-color:transparent;transition:transform .1s;}
        .play-btn:active{transform:scale(.95);}
        .play-btn.green{background:linear-gradient(135deg,#00c853,#007c2e);}
        .play-btn.red2{background:linear-gradient(135deg,#c53030,#7c0000);}

        /* level select */
        .lvl-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;width:100%;max-height:55vh;overflow-y:auto;padding:2px;}
        .lvl-grid::-webkit-scrollbar{width:3px;}
        .lvl-grid::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:2px;}
        .lvl-btn{background:rgba(255,255,255,.04);border:1px solid var(--brd);border-radius:10px;padding:10px 8px;cursor:pointer;text-align:center;-webkit-tap-highlight-color:transparent;transition:all .12s;}
        .lvl-btn:hover,.lvl-btn:active{background:rgba(0,229,255,.1);border-color:var(--acc);}
        .lvl-num{font-family:'Orbitron',monospace;font-size:11px;color:var(--acc);font-weight:700;}
        .lvl-name{font-size:11px;font-weight:700;color:#fff;margin-top:2px;}
        .lvl-waves{font-size:9px;color:rgba(255,255,255,.4);margin-top:1px;}
        .lvl-desc{font-size:9px;color:rgba(255,255,255,.3);margin-top:2px;}

        .between-card{gap:10px;}
        .nxt-btn{background:linear-gradient(135deg,#a855f7,#6d28d9);border:none;color:#fff;font-family:'Orbitron',monospace;font-size:12px;font-weight:700;letter-spacing:1px;padding:12px 0;border-radius:50px;cursor:pointer;width:100%;-webkit-tap-highlight-color:transparent;transition:transform .1s;}
        .nxt-btn:active{transform:scale(.95);}
      `}</style>

      <div className="td">
        <header className="hdr">
          <button className="hdr-back" onClick={()=>{ stopMusic(); onBack(); }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          </button>
          <span className="hdr-title">TOWER DEFENSE</span>
          <div className="stat"><span className="stat-l">VIDAS</span><span className="stat-v" style={{color:uiLives>10?"#4ade80":uiLives>5?"#facc15":"#ef4444"}}>❤️{uiLives}</span></div>
          <div className="stat"><span className="stat-l">OURO</span><span className="stat-v" style={{color:"#f9a825"}}>💰{uiGold}</span></div>
          <div className="stat"><span className="stat-l">SCORE</span><span className="stat-v" style={{color:"#a78bfa"}}>{uiScore}</span></div>
          {uiPhase==="playing"&&<div className="stat"><span className="stat-l">FASE</span><span className="stat-v" style={{color:"#00e5ff"}}>{uiLvlIdx+1}/10</span></div>}
        </header>

        {uiPhase==="playing" && (
          <>
            <div className="canvas-row">
              <canvas ref={canvasRef} width={W} height={H}
                style={{width:cDispW,height:cDispH}}
                onClick={handleCanvasClick}
              />
            </div>
            <div className="bottom">
              <div className="wavebar">
                <span className="wavebar-lbl">WAVE {uiWave}/{totalWaves}</span>
                <div className="wavebar-prog"><div className="wavebar-fill" style={{width:`${(uiWave/totalWaves)*100}%`}}/></div>
                <span className="wavebar-lbl" style={{color:"#a78bfa"}}>Fase {uiLvlIdx+1}</span>
              </div>
              <div className="towrow">
                {TOWERS.map(tt=>(
                  <div key={tt.id}
                    className={`towbtn${uiSelTow.id===tt.id?" sel":""}${uiGold<tt.cost?" poor":""}`}
                    onClick={()=>{ selTowRef.current=tt; setUiSelTow(tt); setUiSelMap(null); }}
                  >
                    <span className="towbtn-ico">{tt.emoji}</span>
                    <span className="towbtn-nm">{tt.name}</span>
                    <span className="towbtn-cost">💰{tt.cost}</span>
                  </div>
                ))}
              </div>
              {uiSelMap ? (
                <div className="selpanel">
                  <span style={{fontSize:22}}>{uiSelMap.type.emoji}</span>
                  <div className="sel-info">
                    <div className="sel-name">{uiSelMap.type.name}</div>
                    <div className="sel-lvl">{"⭐".repeat(uiSelMap.level)} Nível {uiSelMap.level}/3</div>
                  </div>
                  <div className="sel-btns">
                    {uiSelMap.level<3&&<button className="upg-btn" disabled={uiGold<uiSelMap.type.cost*uiSelMap.level} onClick={handleUpgrade}>⬆️ 💰{uiSelMap.type.cost*uiSelMap.level}</button>}
                    <button className="sell-btn" onClick={handleSell}>💸 Vender</button>
                    <button className="close-btn" onClick={()=>setUiSelMap(null)}>✕</button>
                  </div>
                </div>
              ) : (
                <div className="tip">{uiSelTow.emoji} {uiSelTow.name} · {uiSelTow.desc} · Toque no mapa para posicionar</div>
              )}
              <div className="actrow">
                <button className="abtn wave" disabled={!uiWaveRdy} onClick={sendWave}>
                  {uiWaveActive?"⏳ Wave ativa...":uiWave>=totalWaves?"✅ Fase completa!":uiWaveRdy?`▶ WAVE ${uiWave+1}`:"⏳ Inimigos..."}
                </button>
                <button className="abtn spd" onClick={toggleSpeed}>{uiSpeed}× Vel</button>
                <button className="abtn mus" onClick={toggleMusic} title={uiMusicOn?"Desligar música":"Ligar música"}>{uiMusicOn?"🎵":"🔇"}</button>
              </div>
            </div>
          </>
        )}

        {/* MENU */}
        {uiPhase==="menu"&&(
          <div className="overlay">
            <div className="card">
              <div className="card-ico">🏰</div>
              <div className="card-title">TOWER DEFENSE</div>
              <div className="card-sub">10 fases únicas · 6 torres · 10 tipos de inimigos<br/>Waves progressivas · Upgrades e vendas</div>
              <button className="play-btn" onClick={()=>setUiPhase("levelSelect")}>▶ ESCOLHER FASE</button>
              <button className="play-btn green" style={{fontSize:11,padding:"10px 0"}} onClick={()=>startLevel(0)}>▶ COMEÇAR DO INÍCIO</button>
            </div>
          </div>
        )}

        {/* LEVEL SELECT */}
        {uiPhase==="levelSelect"&&(
          <div className="overlay">
            <div className="card" style={{maxHeight:"90vh",overflowY:"hidden"}}>
              <div className="card-title" style={{fontSize:16}}>🗺️ ESCOLHA A FASE</div>
              <div className="lvl-grid">
                {LEVELS.map((lvl,i)=>(
                  <div key={i} className="lvl-btn" onClick={()=>startLevel(i)}>
                    <div className="lvl-num">FASE {i+1}</div>
                    <div className="lvl-name">{lvl.name}</div>
                    <div className="lvl-waves">{lvl.waves.length} waves</div>
                    <div className="lvl-desc">{lvl.description}</div>
                  </div>
                ))}
              </div>
              <button className="play-btn" style={{background:"rgba(255,255,255,.06)",fontSize:12}} onClick={()=>setUiPhase("menu")}>← Voltar</button>
            </div>
          </div>
        )}

        {/* BETWEEN LEVELS */}
        {uiPhase==="between"&&(()=>{
          const next=uiLvlIdx+1;
          const isLast=next>=LEVELS.length;
          return (
            <div className="overlay">
              <div className="card between-card">
                <div className="card-ico">🎖️</div>
                <div className="card-title" style={{fontSize:16}}>FASE {uiLvlIdx+1} COMPLETA!</div>
                <div className="card-score">{uiScore}</div>
                <div className="card-sub">💰 Bônus: +{LEVELS[uiLvlIdx].bonusGold} ouro para a próxima fase</div>
                {!isLast&&<div className="card-sub" style={{color:"#a78bfa",fontSize:11}}>Próxima: <b>Fase {next+1} — {LEVELS[next].name}</b></div>}
                {!isLast
                  ? <button className="nxt-btn" onClick={()=>startLevel(next)}>▶ PRÓXIMA FASE</button>
                  : <button className="play-btn green" onClick={()=>{ setUiPhase("win"); sfxVictory(); }}>🏆 VER RESULTADO FINAL</button>
                }
                <button className="play-btn" style={{background:"rgba(255,255,255,.05)",fontSize:11,padding:"9px 0"}} onClick={()=>setUiPhase("levelSelect")}>🗺️ Escolher Fase</button>
              </div>
            </div>
          );
        })()}

        {/* WIN */}
        {uiPhase==="win"&&(
          <div className="overlay">
            <div className="card">
              <div className="card-ico">🏆</div>
              <div className="card-title">VITÓRIA TOTAL!</div>
              <div className="card-score">{uiScore}</div>
              <div className="card-sub">Você completou todas as 10 fases!</div>
              <button className="play-btn green" onClick={()=>{ setUiPhase("menu"); stopMusic(); }}>↺ JOGAR NOVAMENTE</button>
            </div>
          </div>
        )}

        {/* LOSE */}
        {uiPhase==="lose"&&(
          <div className="overlay">
            <div className="card">
              <div className="card-ico">💀</div>
              <div className="card-title">DERROTA</div>
              <div className="card-score" style={{color:"#ef4444"}}>{uiScore}</div>
              <div className="card-sub">Fase {uiLvlIdx+1} · Wave {uiWave}/{totalWaves}</div>
              <button className="play-btn" onClick={()=>startLevel(uiLvlIdx)}>↺ TENTAR DE NOVO</button>
              <button className="play-btn" style={{background:"rgba(255,255,255,.05)",fontSize:11,padding:"9px 0"}} onClick={()=>setUiPhase("levelSelect")}>🗺️ Escolher Fase</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
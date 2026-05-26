import { useEffect, useRef, useState } from "react";
type Props = { onBack: () => void };

// ── Web Audio ─────────────────────────────────────────────────────────────
const SFX = (() => {
  let ctx: AudioContext | null = null;
  const ac = () => {
    if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  };
  const osc = (type: OscillatorType, freq: number, endFreq: number, dur: number, vol: number) => {
    try { const c=ac(),o=c.createOscillator(),g=c.createGain(); o.connect(g); g.connect(c.destination); o.type=type; o.frequency.setValueAtTime(freq,c.currentTime); o.frequency.exponentialRampToValueAtTime(endFreq,c.currentTime+dur); g.gain.setValueAtTime(vol,c.currentTime); g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur); o.start(); o.stop(c.currentTime+dur); } catch{}
  };
  const noise = (dur: number, vol: number) => {
    try { const c=ac(),buf=c.createBuffer(1,c.sampleRate*dur,c.sampleRate),d=buf.getChannelData(0); for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,.5); const src=c.createBufferSource(),g=c.createGain(); src.buffer=buf; src.connect(g); g.connect(c.destination); g.gain.setValueAtTime(vol,c.currentTime); src.start(); } catch{}
  };
  return {
    shoot:   () => osc("square",880,220,.08,.05),
    hit:     () => osc("square",440,110,.06,.08),
    explode: (big=false) => noise(big?.4:.2, big?.35:.18),
    pickup:  () => { osc("sine",440,880,.15,.1); },
    hurt:    () => osc("sawtooth",200,60,.22,.22),
    boss:    () => { osc("sawtooth",80,40,.5,.3); },
    levelUp: () => { [440,550,660,880].forEach((f,i)=>{ setTimeout(()=>osc("sine",f,f,.18,.12),i*90); }); },
    combo:   () => osc("sine",660,1320,.1,.08),
  };
})();

// ── Constantes ────────────────────────────────────────────────────────────
const W = 360, H = 600;
const rand = (a: number, b: number) => Math.random()*(b-a)+a;
const randInt = (a: number, b: number) => Math.floor(rand(a, b+1));

const STARS = Array.from({length:100}, () => ({
  x: rand(0,W), y: rand(0,H), spd: rand(.2,2.2), r: rand(.3,1.8), b: rand(.3,1),
  color: Math.random()<.05 ? "#ffeebb" : Math.random()<.05 ? "#bbddff" : "#ffffff",
}));

// ── Definição das waves por nível ─────────────────────────────────────────
// Cada nível tem N waves. Ao completar todas, avança nível (boss).
// kind: 0=ovni  1=nave  2=pesada  3=cobra  4=meteoro  5=boss
interface WaveDef { kinds: number[]; formation: "row"|"v"|"diagonal"|"circle"|"random"; count?: number }

const LEVEL_WAVES: WaveDef[][] = [
  // Nível 1 — tutorial
  [
    { kinds:[0,0,0,0], formation:"row" },
    { kinds:[0,0,0,0,0], formation:"v" },
    { kinds:[0,0,1,0,0], formation:"row" },
  ],
  // Nível 2
  [
    { kinds:[1,1,1,1], formation:"row" },
    { kinds:[0,0,0,1,1,0,0,0], formation:"v" },
    { kinds:[1,1,2,1,1], formation:"row" },
  ],
  // Nível 3
  [
    { kinds:[0,1,1,1,0], formation:"diagonal" },
    { kinds:[2,1,1,1,2], formation:"row" },
    { kinds:[3,1,1,1,3], formation:"v" },
  ],
  // Nível 4
  [
    { kinds:[1,2,2,2,1], formation:"circle" },
    { kinds:[3,3,1,1,3,3], formation:"v" },
    { kinds:[2,2,2,2,2], formation:"diagonal" },
  ],
  // Nível 5
  [
    { kinds:[3,2,3,2,3], formation:"circle" },
    { kinds:[1,1,2,2,1,1], formation:"diagonal" },
    { kinds:[4,2,2,4,2,2,4], formation:"row" },
  ],
  // Nível 6
  [
    { kinds:[2,3,2,3,2,3], formation:"circle" },
    { kinds:[1,2,3,2,1,2,3], formation:"diagonal" },
    { kinds:[2,2,2,2,2,2,2,2], formation:"v" },
  ],
  // Nível 7
  [
    { kinds:[3,3,3,3,3], formation:"circle" },
    { kinds:[2,3,2,3,2,3,2], formation:"row" },
    { kinds:[2,2,3,3,2,2,3,3], formation:"diagonal" },
  ],
  // Nível 8 — final
  [
    { kinds:[2,2,2,2,2,2,2,2,2], formation:"circle" },
    { kinds:[3,2,3,2,3,2,3,2,3], formation:"v" },
    { kinds:[2,3,2,3,2,3,2,3,2,3], formation:"diagonal" },
  ],
];

// ── Tipos ─────────────────────────────────────────────────────────────────
interface EBullet { x:number; y:number; vx:number; vy:number; r:number }
interface Enemy {
  x:number; y:number; vx:number; vy:number;
  hp:number; maxHp:number; kind:number;
  shootCd:number; shootInt:number;
  ebullets:EBullet[];
  frame:number; sinPhase:number;
  // formação
  targetX:number; targetY:number; arriving:boolean;
  // cobra
  segs?:{x:number;y:number}[];
  // boss
  phase?:number; phaseTimer?:number;
}
interface Bullet   { x:number; y:number; vy:number; vx:number; r:number; power:number }
interface Drop     { x:number; y:number; vy:number; kind:"hp"|"shield"|"multi"|"rapid"|"bomb"|"score" }
interface Particle { x:number; y:number; vx:number; vy:number; life:number; max:number; color:string; r:number }
interface FloatText { x:number; y:number; vy:number; life:number; max:number; text:string; color:string; size:number }

const DROP_COLOR: Record<Drop["kind"],string> = {
  hp:"#f87171", shield:"#60a5fa", multi:"#fbbf24", rapid:"#34d399", bomb:"#f97316", score:"#c084fc"
};
const DROP_ICON: Record<Drop["kind"],string> = {
  hp:"❤️", shield:"🛡", multi:"💥", rapid:"⚡", bomb:"💣", score:"⭐"
};

// ── Componente ────────────────────────────────────────────────────────────
export default function SpaceShooter({ onBack }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen,   setScreen]   = useState<"menu"|"playing"|"dead"|"win">("menu");
  const [scoreUI,  setScoreUI]  = useState(0);
  const [hpUI,     setHpUI]     = useState(3);
  const [levelUI,  setLevelUI]  = useState(1);
  const [waveUI,   setWaveUI]   = useState(1);
  const [comboUI,  setComboUI]  = useState(0);
  const [hiUI,     setHiUI]     = useState(()=>Number(localStorage.getItem("ss2_hi")||0));
  const [powerUI,  setPowerUI]  = useState({ shield:false, multi:1, rapid:false, bomb:1 });

  const G = useRef({
    ship: { x:W/2, y:H-80, hp:3, maxHp:3, inv:0, multi:1, rapid:0, shield:0, bomb:1 },
    bullets:   [] as Bullet[],
    enemies:   [] as Enemy[],
    drops:     [] as Drop[],
    particles: [] as Particle[],
    floats:    [] as FloatText[],
    score:0, level:1, waveIdx:0,
    waveState: "spawning" as "spawning"|"fighting"|"intermission",
    waveTimer:0, shotCd:0, t:0,
    combo:0, comboTimer:0,
    bossAlive:false,
  });
  const running = useRef(false);
  const keys    = useRef<Record<string,boolean>>({});
  const joyDir  = useRef({ x:0, y:0, active:false });
  const joyOrigin = useRef<{x:number;y:number}|null>(null);
  const joyId     = useRef<number|null>(null);

  // ── Helpers ───────────────────────────────────────────────────────────
  function burst(x:number, y:number, n:number, cols:string[], spd=4) {
    for(let i=0;i<n;i++){
      const a=rand(0,Math.PI*2), s=rand(1,spd);
      G.current.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:rand(18,45),max:45,color:cols[randInt(0,cols.length-1)],r:rand(2,5)});
    }
  }

  function floatText(x:number, y:number, text:string, color:string, size=14) {
    G.current.floats.push({x,y,vy:-1.5,life:55,max:55,text,color,size});
  }

  // ── Spawn de formação ─────────────────────────────────────────────────
  function spawnFormation(def: WaveDef) {
    const g = G.current; const lv = g.level;
    const kinds = def.kinds;
    const n = kinds.length;

    kinds.forEach((kind, i) => {
      let tx=0, ty=0;
      const margin = 40;
      const spacingX = (W - margin*2) / Math.max(n-1, 1);

      if(def.formation==="row") {
        tx = margin + i * spacingX; ty = 80 + randInt(0,20);
      } else if(def.formation==="v") {
        const mid = (n-1)/2;
        tx = margin + i * spacingX;
        ty = 60 + Math.abs(i - mid) * 22;
      } else if(def.formation==="diagonal") {
        tx = margin + i * spacingX;
        ty = 60 + i * 18;
      } else if(def.formation==="circle") {
        const ang = (i / n) * Math.PI * 2 - Math.PI/2;
        const rx = (W/2 - 50), ry = 60;
        tx = W/2 + Math.cos(ang)*rx*0.6;
        ty = 110 + Math.sin(ang)*ry;
      } else {
        tx = rand(margin, W-margin); ty = rand(60, 160);
      }

      // Entra pela topo
      const startY = -40 - i * 15;
      const hp = [1, 2, 5, 4, 1, lv*8][kind] || 1;
      const si = Math.max(60, 150 - lv*10);

      const e: Enemy = {
        x: tx, y: startY,
        vx: 0, vy: 1.5,
        hp, maxHp: hp, kind,
        shootCd: si + randInt(0, si),
        shootInt: si,
        ebullets: [], frame: 0, sinPhase: rand(0, Math.PI*2),
        targetX: tx, targetY: ty, arriving: true,
        phase: 0, phaseTimer: 200,
      };

      if(kind===3) {
        e.segs = Array.from({length:7}, (_,si2) => ({x:tx, y:startY - si2*16}));
      }

      // Boss
      if(kind===5) {
        e.x = W/2; e.y = -80; e.targetX=W/2; e.targetY=80;
        g.bossAlive = true;
      }

      g.enemies.push(e);
    });
  }

  function loadWave() {
    const g = G.current;
    const waves = LEVEL_WAVES[Math.min(g.level-1, LEVEL_WAVES.length-1)];
    if(!waves) return;
    const def = waves[g.waveIdx % waves.length];
    spawnFormation(def);
    g.waveState = "fighting";
    setWaveUI(g.waveIdx + 1);
  }

  // ── Drop ──────────────────────────────────────────────────────────────
  function tryDrop(x:number, y:number, kind:number) {
    const rate = kind===5 ? 1.0 : kind===2 ? .4 : .22;
    if(Math.random() > rate) return;
    const ks: Drop["kind"][] = kind===5
      ? ["hp","shield","multi","rapid","bomb","score"]
      : ["hp","shield","multi","rapid","bomb","score"];
    const ws = kind===5 ? [25,20,20,15,10,10] : [28,18,18,18,8,10];
    let r=rand(0,100), k: Drop["kind"]="hp", c=0;
    for(let i=0;i<ks.length;i++){c+=ws[i];if(r<c){k=ks[i];break;}}
    G.current.drops.push({x,y,vy:1.4,kind:k});
  }

  // ── Auto-fire ─────────────────────────────────────────────────────────
  function autoFire() {
    const g=G.current, s=g.ship;
    if(g.shotCd>0){g.shotCd--;return;}
    g.shotCd = s.rapid>0 ? 6 : 13;
    SFX.shoot();
    const r = 5; // raio bala maior
    const pow = s.multi;
    g.bullets.push({x:s.x, y:s.y-24, vy:-16, vx:0, r, power:pow});
    if(s.multi>=2){
      g.bullets.push({x:s.x-15, y:s.y-12, vy:-15, vx:-.3, r:r*.9, power:1});
      g.bullets.push({x:s.x+15, y:s.y-12, vy:-15, vx: .3, r:r*.9, power:1});
    }
    if(s.multi>=3){
      g.bullets.push({x:s.x, y:s.y-20, vy:-13, vx:-3, r:r*.8, power:1});
      g.bullets.push({x:s.x, y:s.y-20, vy:-13, vx: 3, r:r*.8, power:1});
    }
  }

  // ── Bomba ─────────────────────────────────────────────────────────────
  function useBomb() {
    const g=G.current, s=g.ship;
    if(s.bomb<=0) return;
    s.bomb--;
    g.enemies.forEach(e=>{
      const pts = [80,120,240,150,200,600][e.kind]||80;
      g.score += pts; setScoreUI(g.score);
      burst(e.x,e.y,14,["#ff8800","#ffdd00","#ff4444"]);
    });
    g.enemies=[];
    burst(W/2,H/2,50,["#00ffe1","#fff","#ffd700","#f97316"],10);
    SFX.explode(true);
    setPowerUI(p=>({...p,bomb:s.bomb}));
  }

  // ── Ferir nave ────────────────────────────────────────────────────────
  function hurtShip() {
    const g=G.current, s=g.ship;
    if(s.shield>0){ s.shield=0; burst(s.x,s.y,12,["#60a5fa","#fff"]); SFX.hurt(); setPowerUI(p=>({...p,shield:false})); return; }
    if(s.inv>0) return;
    s.hp=Math.max(0,s.hp-1); s.inv=130;
    setHpUI(s.hp); SFX.hurt();
    burst(s.x,s.y,10,["#ff4444","#ff8800"]);
    g.combo=0; g.comboTimer=0; setComboUI(0);
    if(s.hp<=0){
      burst(s.x,s.y,35,["#ff4444","#ff8800","#ffd700"]);
      SFX.explode(true); running.current=false;
      const hi=Math.max(g.score,hiUI);
      localStorage.setItem("ss2_hi",String(hi)); setHiUI(hi);
      setScreen("dead");
    }
  }

  // ── Iniciar ───────────────────────────────────────────────────────────
  function startGame() {
    G.current={
      ship:{x:W/2,y:H-80,hp:3,maxHp:3,inv:120,multi:1,rapid:0,shield:0,bomb:1},
      bullets:[],enemies:[],drops:[],particles:[],floats:[],
      score:0,level:1,waveIdx:0,
      waveState:"spawning",waveTimer:60,shotCd:0,t:0,
      combo:0,comboTimer:0,bossAlive:false,
    };
    setScoreUI(0);setHpUI(3);setLevelUI(1);setWaveUI(1);setComboUI(0);
    setPowerUI({shield:false,multi:1,rapid:false,bomb:1});
    running.current=true; setScreen("playing");
    loadWave();
  }

  // ── Game loop ─────────────────────────────────────────────────────────
  useEffect(()=>{
    const canvas=canvasRef.current!, ctx=canvas.getContext("2d")!;
    let raf=0;

    // ── DRAW ──────────────────────────────────────────────────────────

    function drawBg(t:number){
      // gradiente de fundo que muda sutilmente com o nível
      const lv=G.current.level;
      const topColor = lv<=2?"#020817":lv<=4?"#050a1f":lv<=6?"#0a0510":"#100510";
      ctx.fillStyle=topColor; ctx.fillRect(0,0,W,H);
      // nebulosa
      const nb=ctx.createRadialGradient(W*.3,H*.25,20,W*.3,H*.25,180);
      const nbColor = lv<=3?"rgba(50,0,100,.08)":lv<=5?"rgba(100,0,50,.1)":"rgba(80,0,30,.12)";
      nb.addColorStop(0,nbColor); nb.addColorStop(1,"transparent");
      ctx.fillStyle=nb; ctx.fillRect(0,0,W,H);
      STARS.forEach(s=>{
        s.y=(s.y+s.spd)%H;
        ctx.globalAlpha=s.b*(.5+Math.sin(t*.02+s.x)*.2);
        ctx.fillStyle=s.color; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      }); ctx.globalAlpha=1;
    }

    function drawShip(x:number,y:number,inv:number,shield:number,t:number,multi:number){
      if(inv>0&&Math.floor(t/5)%2===0) return;
      ctx.save(); ctx.translate(x,y);
      // chama principal
      const fl=ctx.createLinearGradient(0,10,0,32);
      fl.addColorStop(0,"#00ffe1"); fl.addColorStop(.4,"#0066ff"); fl.addColorStop(1,"transparent");
      ctx.fillStyle=fl;
      ctx.beginPath(); ctx.moveTo(-7,10); ctx.lineTo(7,10);
      ctx.lineTo(3+Math.sin(t*.5)*2,30); ctx.lineTo(-3-Math.sin(t*.5)*2,30);
      ctx.closePath(); ctx.fill();
      // chamas laterais multi
      if(multi>=2){
        [-14,14].forEach(ox=>{
          const fl2=ctx.createLinearGradient(0,8,0,22);
          fl2.addColorStop(0,"#0088ff"); fl2.addColorStop(1,"transparent");
          ctx.fillStyle=fl2;
          ctx.beginPath(); ctx.moveTo(ox-3,8); ctx.lineTo(ox+3,8);
          ctx.lineTo(ox+1+Math.sin(t*.6)*1,20); ctx.lineTo(ox-1-Math.sin(t*.6)*1,20);
          ctx.closePath(); ctx.fill();
        });
      }
      // asas
      ctx.fillStyle="#1e3a5a";
      ctx.beginPath(); ctx.moveTo(-6,-6); ctx.lineTo(-26,12); ctx.lineTo(-15,12); ctx.lineTo(-6,2); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(6,-6); ctx.lineTo(26,12); ctx.lineTo(15,12); ctx.lineTo(6,2); ctx.closePath(); ctx.fill();
      // detalhes asa
      ctx.fillStyle="#2a5080";
      ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(-20,10); ctx.lineTo(-14,10); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(8,0); ctx.lineTo(20,10); ctx.lineTo(14,10); ctx.closePath(); ctx.fill();
      // corpo
      const bg=ctx.createLinearGradient(-8,-22,8,12);
      bg.addColorStop(0,"#6abae8"); bg.addColorStop(1,"#1a4a8a");
      ctx.fillStyle=bg;
      ctx.beginPath(); ctx.moveTo(0,-24); ctx.lineTo(9,0); ctx.lineTo(7,12); ctx.lineTo(-7,12); ctx.lineTo(-9,0); ctx.closePath(); ctx.fill();
      // faixa
      ctx.fillStyle="#00ffe155"; ctx.fillRect(-4,-12,8,3);
      // cockpit
      const cg=ctx.createRadialGradient(-2,-12,1,0,-10,9);
      cg.addColorStop(0,"#d0f0ff"); cg.addColorStop(.5,"#4499cc"); cg.addColorStop(1,"#0044aa");
      ctx.fillStyle=cg; ctx.beginPath(); ctx.ellipse(0,-10,5.5,7.5,0,0,Math.PI*2); ctx.fill();
      // escudo
      if(shield>0){
        const alpha=.3+Math.sin(t*.18)*.2;
        ctx.strokeStyle=`rgba(80,180,255,${alpha})`; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.arc(0,-4,30,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle=`rgba(80,180,255,${alpha*.3})`; ctx.beginPath(); ctx.arc(0,-4,30,0,Math.PI*2); ctx.fill();
      }
      ctx.restore();
    }

    function drawBulletPlayer(b:Bullet){
      ctx.save();
      // glow externo
      const gr=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*2.5);
      gr.addColorStop(0,"rgba(0,255,225,.5)"); gr.addColorStop(1,"transparent");
      ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*2.5,0,Math.PI*2); ctx.fill();
      // núcleo branco
      ctx.fillStyle="#fff"; ctx.beginPath(); ctx.ellipse(b.x,b.y,b.r*.6,b.r*1.8,0,0,Math.PI*2); ctx.fill();
      // brilho ciano
      ctx.fillStyle="#00ffe1"; ctx.beginPath(); ctx.ellipse(b.x,b.y,b.r*.4,b.r*1.4,0,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    function drawBulletEnemy(b:EBullet){
      ctx.save();
      const gr=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r*2.2);
      gr.addColorStop(0,"rgba(255,80,80,.5)"); gr.addColorStop(1,"transparent");
      ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(b.x,b.y,b.r*2.2,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#ff4444"; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#ffaaaa"; ctx.beginPath(); ctx.arc(b.x-b.r*.3,b.y-b.r*.3,b.r*.4,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    function drawEnemy(e:Enemy, t:number){
      const {x,y,kind,hp,maxHp,frame} = e;

      // Cobra
      if(kind===3 && e.segs){
        e.segs.forEach((seg,si)=>{
          ctx.save(); ctx.translate(seg.x,seg.y);
          const sc=1-si*.06, r=11*sc;
          const g2=ctx.createRadialGradient(-r*.2,-r*.2,0,0,0,r);
          g2.addColorStop(0,"#44ee66"); g2.addColorStop(.6,"#22aa44"); g2.addColorStop(1,"#115522");
          ctx.fillStyle=g2; ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
          // escama
          ctx.strokeStyle="#116633"; ctx.lineWidth=.8;
          ctx.beginPath(); ctx.arc(0,0,r*.7,0,Math.PI*2); ctx.stroke();
          if(si===0){
            ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(-3.5,-2,2.8,0,Math.PI*2); ctx.fill();
            ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc( 3.5,-2,2.8,0,Math.PI*2); ctx.fill();
            ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc(-3.5,-2,1.4,0,Math.PI*2); ctx.fill();
            ctx.fillStyle="#000"; ctx.beginPath(); ctx.arc( 3.5,-2,1.4,0,Math.PI*2); ctx.fill();
            ctx.strokeStyle="#f55"; ctx.lineWidth=1.5;
            ctx.beginPath(); ctx.moveTo(-1.5,9); ctx.lineTo(-4,14); ctx.moveTo(-1.5,9); ctx.lineTo(1,14); ctx.stroke();
          }
          ctx.restore();
        });
        return;
      }

      // Meteoro
      if(kind===4){
        ctx.save(); ctx.translate(x,y); ctx.rotate(frame*.025);
        const r=22;
        const g2=ctx.createRadialGradient(-r*.2,-r*.2,2,0,0,r);
        g2.addColorStop(0,"#d4922a"); g2.addColorStop(.7,"#8a5010"); g2.addColorStop(1,"#3a2008");
        ctx.fillStyle=g2;
        ctx.beginPath();
        for(let i=0;i<9;i++){
          const a=i*Math.PI*2/9, rr=r*(.68+Math.sin(i*4.7)*.32);
          i===0?ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
        }
        ctx.closePath(); ctx.fill();
        ctx.fillStyle="rgba(255,200,100,.2)"; ctx.beginPath(); ctx.arc(-r*.25,-r*.25,r*.35,0,Math.PI*2); ctx.fill();
        // pontos flutuantes
        ctx.fillStyle="#ffd700"; ctx.font="bold 9px sans-serif";
        ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("💰",0,0);
        ctx.restore(); return;
      }

      // Boss (kind 5)
      if(kind===5){
        ctx.save(); ctx.translate(x,y);
        const pulse=.5+Math.sin(t*.06)*.5;
        // aura
        ctx.globalAlpha=.2+pulse*.15;
        ctx.fillStyle="#ff4400"; ctx.beginPath(); ctx.arc(0,0,55,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1;
        // casco
        ctx.fillStyle="#1a0005";
        ctx.beginPath(); ctx.moveTo(0,-44); ctx.lineTo(38,10); ctx.lineTo(28,32); ctx.lineTo(-28,32); ctx.lineTo(-38,10); ctx.closePath(); ctx.fill();
        // detalhe lateral
        ctx.fillStyle="#550015";
        ctx.beginPath(); ctx.moveTo(0,-44); ctx.lineTo(20,-8); ctx.lineTo(-20,-8); ctx.closePath(); ctx.fill();
        [-30,0,30].forEach((cx,i)=>{
          const clr=["#ff3300","#ff6600","#ff3300"][i];
          ctx.fillStyle=clr; ctx.fillRect(cx-5,14,10,16);
          ctx.globalAlpha=.4+Math.sin(t*.1+i)*.5;
          ctx.fillStyle=clr; ctx.beginPath(); ctx.arc(cx,30,7,0,Math.PI*2); ctx.fill();
        }); ctx.globalAlpha=1;
        // cockpit boss
        const cg=ctx.createRadialGradient(0,-14,2,0,-14,16);
        cg.addColorStop(0,"#ff8866"); cg.addColorStop(.6,"#cc2200"); cg.addColorStop(1,"#440000");
        ctx.fillStyle=cg; ctx.beginPath(); ctx.ellipse(0,-14,12,16,0,0,Math.PI*2); ctx.fill();
        // HP bar grande
        const bw=64; ctx.fillStyle="#222"; ctx.fillRect(-bw/2,-56,bw,8); ctx.strokeStyle="#444"; ctx.lineWidth=1; ctx.strokeRect(-bw/2,-56,bw,8);
        const hpFrac=hp/maxHp;
        const hpClr=hpFrac>.6?"#44ff44":hpFrac>.3?"#ffaa00":"#ff2200";
        ctx.fillStyle=hpClr; ctx.fillRect(-bw/2,-56,bw*hpFrac,8);
        ctx.restore(); return;
      }

      ctx.save(); ctx.translate(x,y);

      if(kind===0){
        // OVNI colorido
        ctx.fillStyle="#2a2a44"; ctx.beginPath(); ctx.ellipse(0,7,24,9,0,0,Math.PI*2); ctx.fill();
        const ug=ctx.createRadialGradient(0,-2,2,0,-2,14);
        ug.addColorStop(0,"#aabbff"); ug.addColorStop(.6,"#6677dd"); ug.addColorStop(1,"#334488");
        ctx.fillStyle=ug; ctx.beginPath(); ctx.ellipse(0,-1,13,13,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#ccddff33"; ctx.beginPath(); ctx.ellipse(-3,-4,7,7,-.3,0,Math.PI*2); ctx.fill();
        [-15,0,15].forEach((lx,i)=>{
          ctx.globalAlpha=.55+Math.sin(G.current.t*.09+i)*.4;
          ctx.fillStyle=["#ff5555","#ffee44","#55ff88"][i];
          ctx.beginPath(); ctx.arc(lx,7,3.5,0,Math.PI*2); ctx.fill();
        }); ctx.globalAlpha=1;

      } else if(kind===1){
        // Nave combate
        const bg2=ctx.createLinearGradient(0,-18,0,14);
        bg2.addColorStop(0,"#aa1111"); bg2.addColorStop(1,"#550000");
        ctx.fillStyle=bg2;
        ctx.beginPath(); ctx.moveTo(0,-18); ctx.lineTo(13,9); ctx.lineTo(0,3); ctx.lineTo(-13,9); ctx.closePath(); ctx.fill();
        ctx.fillStyle="#ff4444";
        ctx.beginPath(); ctx.moveTo(0,-18); ctx.lineTo(7,-2); ctx.lineTo(-7,-2); ctx.closePath(); ctx.fill();
        ctx.fillStyle="#ff222233"; ctx.beginPath(); ctx.ellipse(0,-6,5,7,0,0,Math.PI*2); ctx.fill();
        [-11,11].forEach(cx=>{ ctx.fillStyle="#880000"; ctx.fillRect(cx-2.5,6,5,10); });
        // motor
        ctx.globalAlpha=.6+Math.sin(G.current.t*.3)*.3;
        ctx.fillStyle="#ff6600"; ctx.beginPath(); ctx.arc(0,8,4,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha=1;

      } else if(kind===2){
        // Nave pesada
        const bg3=ctx.createLinearGradient(0,-26,0,18);
        bg3.addColorStop(0,"#220033"); bg3.addColorStop(1,"#110022");
        ctx.fillStyle=bg3;
        ctx.beginPath(); ctx.moveTo(0,-26); ctx.lineTo(22,8); ctx.lineTo(16,18); ctx.lineTo(-16,18); ctx.lineTo(-22,8); ctx.closePath(); ctx.fill();
        ctx.fillStyle="#7700bb";
        ctx.beginPath(); ctx.moveTo(0,-26); ctx.lineTo(12,-2); ctx.lineTo(-12,-2); ctx.closePath(); ctx.fill();
        ctx.fillStyle="#bb00ee33"; ctx.beginPath(); ctx.ellipse(0,-6,9,11,0,0,Math.PI*2); ctx.fill();
        [-17,0,17].forEach((cx,i)=>{
          ctx.fillStyle="#660099"; ctx.fillRect(cx-3.5,9,7,12);
          ctx.globalAlpha=.4+Math.sin(G.current.t*.12+i)*.45;
          ctx.fillStyle="#dd00ff"; ctx.beginPath(); ctx.arc(cx,21,5,0,Math.PI*2); ctx.fill();
        }); ctx.globalAlpha=1;
        const bw=42; ctx.fillStyle="#111"; ctx.fillRect(-bw/2,-34,bw,5);
        const hpClr=hp/maxHp>.5?"#aa00dd":"#ff4400";
        ctx.fillStyle=hpClr; ctx.fillRect(-bw/2,-34,bw*(hp/maxHp),5);
      }
      ctx.restore();
    }

    function drawDrop(d:Drop, t:number){
      ctx.save(); ctx.translate(d.x,d.y);
      const pulse=.85+Math.sin(t*.12)*.15;
      ctx.globalAlpha=pulse;
      const col=DROP_COLOR[d.kind];
      // glow
      const gr=ctx.createRadialGradient(0,0,4,0,0,18);
      gr.addColorStop(0,col+"44"); gr.addColorStop(1,"transparent");
      ctx.fillStyle=gr; ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fill();
      // anel
      ctx.strokeStyle=col; ctx.lineWidth=1.8;
      ctx.beginPath(); ctx.arc(0,0,13,0,Math.PI*2); ctx.stroke();
      ctx.fillStyle=col+"22"; ctx.beginPath(); ctx.arc(0,0,13,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=col; ctx.font="13px sans-serif";
      ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(DROP_ICON[d.kind],0,0);
      ctx.restore(); ctx.globalAlpha=1;
    }

    function drawHUD(t:number){
      const g=G.current;
      // Indicador de wave na parte superior
      if(g.waveState==="fighting" && g.enemies.length>0){
        const enemyLeft=g.enemies.length;
        ctx.save();
        ctx.fillStyle="rgba(0,0,0,.35)"; ctx.fillRect(W-80,6,74,20);
        ctx.fillStyle="#8888aa"; ctx.font="9px sans-serif";
        ctx.textAlign="right"; ctx.fillText(`INIMIGOS: ${enemyLeft}`,W-8,18);
        ctx.restore();
      }
      // Combo
      if(g.combo>=2){
        ctx.save();
        const alpha=Math.min(1,g.comboTimer/40);
        ctx.globalAlpha=alpha;
        const cx=W/2;
        ctx.fillStyle="#fbbf24"; ctx.font=`bold ${14+Math.min(g.combo,10)}px sans-serif`;
        ctx.textAlign="center"; ctx.fillText(`COMBO x${g.combo}!`,cx,H-16);
        ctx.restore(); ctx.globalAlpha=1;
      }
    }

    function drawFloats(){
      const g=G.current;
      g.floats.forEach(f=>{
        ctx.save();
        ctx.globalAlpha=Math.min(1,f.life/f.max);
        ctx.fillStyle=f.color; ctx.font=`bold ${f.size}px sans-serif`;
        ctx.textAlign="center"; ctx.fillText(f.text,f.x,f.y);
        ctx.restore();
      });
      ctx.globalAlpha=1;
    }

    // ── UPDATE ────────────────────────────────────────────────────────

    function update(){
      const g=G.current; const s=g.ship; g.t++;

      // Movimento
      const SPD=5.2;
      const K=keys.current; const J=joyDir.current;
      let dx=0,dy=0;
      if(K["ArrowLeft"]||K["a"])  dx=-1;
      if(K["ArrowRight"]||K["d"]) dx= 1;
      if(K["ArrowUp"]||K["w"])    dy=-1;
      if(K["ArrowDown"]||K["s"])  dy= 1;
      if(dx===0&&dy===0&&J.active){dx=J.x;dy=J.y;}
      s.x=Math.max(18,Math.min(W-18,s.x+dx*SPD));
      s.y=Math.max(40,Math.min(H-40,s.y+dy*SPD));

      autoFire();
      if(s.inv>0)   s.inv--;
      if(s.rapid>0) s.rapid--;
      if(s.shield>0) s.shield--;
      if(g.comboTimer>0){ g.comboTimer--; if(g.comboTimer===0){g.combo=0;setComboUI(0);} }

      // Wave state machine
      if(g.waveState==="fighting"){
        // Chegaram todos?
        const allArrived = g.enemies.every(e=>!e.arriving);
        // Wave limpa?
        if(g.enemies.length===0 && allArrived){
          g.waveState="intermission";
          g.waveTimer=90; // pausa entre waves
        }
      } else if(g.waveState==="intermission"){
        g.waveTimer--;
        if(g.waveTimer<=0){
          g.waveIdx++;
          const waves=LEVEL_WAVES[Math.min(g.level-1,LEVEL_WAVES.length-1)];
          if(g.waveIdx>=waves.length){
            // Nível completo
            g.level++; g.waveIdx=0;
            if(g.level>8){running.current=false;setScreen("win");return;}
            setLevelUI(g.level); SFX.levelUp();
            // Bonus de level
            s.hp=Math.min(s.hp+1,s.maxHp); setHpUI(s.hp);
            floatText(W/2,H/2-30,"NÍVEL "+g.level,"#ffd700",18);
            floatText(W/2,H/2+10,"+1 VIDA","#f87171",14);
          }
          loadWave();
        }
      }

      // Mover balas jogador
      g.bullets=g.bullets.filter(b=>b.y>-20&&b.x>-20&&b.x<W+20);
      g.bullets.forEach(b=>{b.y+=b.vy;b.x+=b.vx;});

      // Mover inimigos
      g.enemies.forEach(e=>{
        if(e.arriving){
          // Voa para posição de formação
          const dx2=e.targetX-e.x, dy2=e.targetY-e.y;
          const dist=Math.hypot(dx2,dy2);
          if(dist<4){ e.x=e.targetX; e.y=e.targetY; e.arriving=false; }
          else { e.x+=dx2/dist*3; e.y+=dy2/dist*3; }
          if(e.kind===3&&e.segs){
            for(let si=e.segs.length-1;si>0;si--) e.segs[si]={x:e.segs[si-1].x,y:e.segs[si-1].y};
            e.segs[0]={x:e.x,y:e.y};
          }
          return;
        }

        // Cobra
        if(e.kind===3&&e.segs){
          e.frame++;
          const hx=e.segs[0].x+Math.sin(e.frame*.04+e.sinPhase)*2.5;
          const hy=e.segs[0].y+(.7+g.level*.04);
          for(let si=e.segs.length-1;si>0;si--) e.segs[si]={x:e.segs[si-1].x,y:e.segs[si-1].y};
          e.segs[0]={x:Math.max(14,Math.min(W-14,hx)),y:hy};
          e.x=e.segs[0].x; e.y=e.segs[0].y; return;
        }

        // Meteoro
        if(e.kind===4){ e.y+=1.6+g.level*.05; e.x+=e.vx; return; }

        // Boss — padrão de movimento agressivo
        if(e.kind===5){
          e.phaseTimer=(e.phaseTimer||200)-1;
          if(e.phaseTimer<=0){ e.phase=(((e.phase||0)+1)%4); e.phaseTimer=160; }
          const ph=e.phase||0;
          if(ph===0){ e.x+=Math.sin(g.t*.02)*2.5; }
          if(ph===1){ e.x+=Math.sin(g.t*.04)*3; e.y+=Math.sin(g.t*.03)*1; }
          if(ph===2){ // rush para jogador X
            const dx3=s.x-e.x; e.x+=dx3*.015;
          }
          if(ph===3){ e.x+=Math.cos(g.t*.03)*3.5; }
          e.x=Math.max(50,Math.min(W-50,e.x));
          e.y=Math.max(60,Math.min(180,e.y));
        } else {
          // Outros: ondulação
          e.x+=e.vx+Math.sin(g.t*.035+e.sinPhase)*.5;
          e.y+=e.vy;
          if(e.x<18||e.x>W-18) e.vx*=-1;
        }

        // Tiro inimigo
        if(e.kind===1||e.kind===2||e.kind===5){
          e.shootCd--;
          if(e.shootCd<=0){
            e.shootCd=e.shootInt;
            const r2=4.5; // bala inimiga maior
            if(e.kind===5){
              // Boss: vários padrões
              const ph=e.phase||0;
              if(ph===0||ph===2){
                // leque de 5
                [-2,-1,0,1,2].forEach(dx4=>e.ebullets.push({x:e.x,y:e.y+30,vx:dx4*1.5,vy:3.5,r:r2}));
              } else {
                // espiral
                for(let k=0;k<8;k++){
                  const a=(k/8)*Math.PI*2+(g.t*.04);
                  e.ebullets.push({x:e.x,y:e.y+20,vx:Math.cos(a)*3,vy:Math.sin(a)*3+1,r:r2*.8});
                }
              }
              SFX.boss();
            } else if(e.kind===2){
              [-1.6,0,1.6].forEach(vx=>e.ebullets.push({x:e.x,y:e.y+16,vx,vy:3+g.level*.05,r:r2}));
            } else {
              e.ebullets.push({x:e.x,y:e.y+16,vx:0,vy:2.8+g.level*.04,r:r2*.85});
            }
          }
        }
        e.ebullets.forEach(b=>{b.x+=b.vx;b.y+=b.vy;});
        e.ebullets=e.ebullets.filter(b=>b.y<H+24&&b.x>-20&&b.x<W+20);
      });
      g.enemies=g.enemies.filter(e=>e.y<H+100);

      // Drops e partículas
      g.drops.forEach(d=>d.y+=d.vy);
      g.drops=g.drops.filter(d=>d.y<H+20);
      g.particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.93;p.vy*=.93;p.life--;});
      g.particles=g.particles.filter(p=>p.life>0);
      g.floats.forEach(f=>{f.y+=f.vy;f.life--;});
      g.floats=g.floats.filter(f=>f.life>0);

      // ── Colisões ────────────────────────────────────────────────
      const usedB=new Set<number>();
      g.enemies=g.enemies.filter(e=>{
        const hb=e.kind===3?10:e.kind===4?22:e.kind===5?40:e.kind===2?20:16;
        const px=e.kind===3?e.segs![0].x:e.x;
        const py=e.kind===3?e.segs![0].y:e.y;
        for(let bi=0;bi<g.bullets.length;bi++){
          if(usedB.has(bi)) continue;
          const b=g.bullets[bi];
          if(Math.hypot(b.x-px,b.y-py)<hb+b.r){
            usedB.add(bi);
            e.hp-=b.power;
            burst(b.x,b.y,4,["#ff8800","#ffd700","#fff"]);
            SFX.hit();
            if(e.hp<=0){
              burst(px,py,e.kind===5?40:e.kind===2?18:10,
                e.kind===5?["#ff4400","#ff8800","#ffd700","#fff"]:["#ff8800","#ffdd00","#ff4444"]);
              SFX.explode(e.kind===2||e.kind===5);
              const basePts=[80,130,260,160,220,800][e.kind]||80;
              // Combo
              g.combo++; g.comboTimer=80; setComboUI(g.combo);
              const comboPts = g.combo>=3 ? Math.floor(basePts*(1+g.combo*.15)) : basePts;
              g.score+=comboPts; setScoreUI(g.score);
              if(g.combo>=3){ SFX.combo(); floatText(px,py-10,`COMBO x${g.combo}!  +${comboPts}`,"#fbbf24",12); }
              else floatText(px,py-8,`+${comboPts}`,"#ffd700",11);
              tryDrop(px,py,e.kind);
              if(e.kind===5) g.bossAlive=false;
              return false;
            }
            return true;
          }
        }
        return true;
      });
      g.bullets=g.bullets.filter((_,i)=>!usedB.has(i));

      // Balas inimigas vs nave
      g.enemies.forEach(e=>{
        e.ebullets=e.ebullets.filter(b=>{
          if(Math.hypot(b.x-s.x,b.y-s.y)<18){hurtShip();return false;}
          return true;
        });
      });
      // Corpo inimigo vs nave
      g.enemies=g.enemies.filter(e=>{
        const px=e.kind===3?e.segs![0].x:e.x;
        const py=e.kind===3?e.segs![0].y:e.y;
        const hb=e.kind===5?36:e.kind===4?22:20;
        if(Math.hypot(px-s.x,py-s.y)<hb){
          hurtShip(); burst(px,py,8,["#ff8800","#ff4444"]);
          if(e.kind!==5) return false; return true;
        }
        return true;
      });

      // Pickup
      g.drops=g.drops.filter(d=>{
        if(Math.hypot(d.x-s.x,d.y-s.y)<24){
          SFX.pickup(); burst(d.x,d.y,8,[DROP_COLOR[d.kind]]);
          if(d.kind==="hp")    { s.hp=Math.min(s.hp+1,s.maxHp); setHpUI(s.hp); floatText(d.x,d.y-20,"+VIDA","#f87171"); }
          if(d.kind==="shield"){ s.shield=400; setPowerUI(p=>({...p,shield:true})); }
          if(d.kind==="multi") { s.multi=Math.min(s.multi+1,3); setPowerUI(p=>({...p,multi:s.multi})); floatText(d.x,d.y-20,"MULTI!","#fbbf24"); }
          if(d.kind==="rapid") { s.rapid=360; setPowerUI(p=>({...p,rapid:true})); floatText(d.x,d.y-20,"RÁPIDO!","#34d399"); }
          if(d.kind==="bomb")  { s.bomb=Math.min(s.bomb+1,4); setPowerUI(p=>({...p,bomb:s.bomb})); }
          if(d.kind==="score") { const pts=200*g.level; g.score+=pts; setScoreUI(g.score); floatText(d.x,d.y-20,`+${pts}`,"#c084fc"); }
          return false;
        }
        return true;
      });
    }

    // ── RENDER ────────────────────────────────────────────────────────
    function render(){
      const {ship,bullets,enemies,drops,particles,t}=G.current;
      drawBg(t);
      particles.forEach(p=>{
        ctx.save(); ctx.globalAlpha=p.life/p.max;
        ctx.fillStyle=p.color; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
        ctx.restore();
      });
      drops.forEach(d=>drawDrop(d,t));
      enemies.forEach(e=>{
        drawEnemy(e,t);
        e.ebullets?.forEach(b=>drawBulletEnemy(b));
      });
      bullets.forEach(b=>drawBulletPlayer(b));
      drawShip(ship.x,ship.y,ship.inv,ship.shield,t,ship.multi);
      drawFloats();
      drawHUD(t);
    }

    function loop(){ if(running.current) update(); render(); raf=requestAnimationFrame(loop); }
    raf=requestAnimationFrame(loop);
    return()=>cancelAnimationFrame(raf);
  },[]);

  // ── Teclado ───────────────────────────────────────────────────────────
  useEffect(()=>{
    const dn=(e:KeyboardEvent)=>{
      keys.current[e.key]=true;
      if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," ","x","b"].includes(e.key)) e.preventDefault();
      if(e.key===" "||e.key==="x"||e.key==="b") useBomb();
    };
    const up=(e:KeyboardEvent)=>{keys.current[e.key]=false;};
    window.addEventListener("keydown",dn,{passive:false});
    window.addEventListener("keyup",up);
    return()=>{window.removeEventListener("keydown",dn);window.removeEventListener("keyup",up);};
  },[]);

  // ── Touch joystick ────────────────────────────────────────────────────
  function onTS(e:React.TouchEvent){ e.preventDefault(); const t=e.changedTouches[0]; joyOrigin.current={x:t.clientX,y:t.clientY}; joyId.current=t.identifier; joyDir.current={x:0,y:0,active:true}; }
  function onTM(e:React.TouchEvent){ e.preventDefault(); for(let i=0;i<e.changedTouches.length;i++){ const t=e.changedTouches[i]; if(t.identifier===joyId.current&&joyOrigin.current){ const dx=t.clientX-joyOrigin.current.x,dy=t.clientY-joyOrigin.current.y; if(Math.hypot(dx,dy)<8){joyDir.current.x=0;joyDir.current.y=0;return;} const md=52; joyDir.current.x=Math.max(-1,Math.min(1,dx/md)); joyDir.current.y=Math.max(-1,Math.min(1,dy/md)); } } }
  function onTE(e:React.TouchEvent){ e.preventDefault(); joyDir.current={x:0,y:0,active:false}; joyOrigin.current=null; }

  const scale=typeof window!=="undefined"?Math.min(window.innerWidth/W,(window.innerHeight*.78)/H):1;
  const cw=Math.floor(W*scale), ch=Math.floor(H*scale);
  const pw=powerUI;

  return(
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        .ss-root{position:fixed;inset:0;width:100vw;height:100dvh;display:flex;flex-direction:column;background:#020817;overflow:hidden;font-family:-apple-system,'Helvetica Neue',sans-serif;-webkit-text-size-adjust:100%;}
        .ss-hdr{display:flex;align-items:center;gap:8px;padding:0 8px 0 4px;background:rgba(2,8,23,.96);border-bottom:1px solid #0f2040;height:46px;min-height:46px;flex-shrink:0;}
        .ss-back{background:none;border:1px solid #1a3060;color:#4299e1;padding:4px 10px;border-radius:8px;font-size:12px;cursor:pointer;white-space:nowrap;flex-shrink:0;font-family:inherit;-webkit-tap-highlight-color:transparent;}
        .ss-title{color:#00ffe1;font-size:13px;font-weight:800;letter-spacing:2px;flex:1;text-align:center;}
        .ss-score{color:#ffd700;font-size:13px;font-weight:800;white-space:nowrap;flex-shrink:0;}
        .ss-hud{display:flex;align-items:center;justify-content:space-between;padding:4px 10px;background:rgba(0,0,0,.6);flex-shrink:0;gap:6px;}
        .ss-left{display:flex;align-items:center;gap:6px;}
        .ss-hp{display:flex;gap:2px;}
        .ss-heart{font-size:14px;}
        .ss-lvl{color:#ffd700;font-size:11px;font-weight:700;letter-spacing:1px;}
        .ss-wave{color:#8888aa;font-size:10px;letter-spacing:1px;}
        .ss-right{display:flex;gap:4px;align-items:center;flex-wrap:wrap;justify-content:flex-end;}
        .ss-tag{font-size:10px;font-weight:700;padding:2px 6px;border-radius:8px;}
        .ss-canvas-wrap{flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;touch-action:none;}
        canvas{display:block;touch-action:none;}
        .ss-bot{display:flex;align-items:center;justify-content:space-between;padding:5px 14px;background:rgba(0,0,0,.65);flex-shrink:0;gap:8px;}
        .ss-bomb-btn{background:rgba(249,115,22,.18);border:1.5px solid #f97316;color:#f97316;font-size:12px;font-weight:800;padding:7px 18px;border-radius:20px;cursor:pointer;font-family:inherit;letter-spacing:1px;-webkit-tap-highlight-color:transparent;transition:background .1s;white-space:nowrap;}
        .ss-bomb-btn:active{background:rgba(249,115,22,.45);}
        .ss-hint{color:#1e3a5a;font-size:10px;text-align:right;line-height:1.5;flex:1;}
        .ss-ov{position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;z-index:50;backdrop-filter:blur(8px);}
        .ss-card{background:linear-gradient(160deg,#020817,#0f2040);border:1.5px solid #1e4080;border-radius:20px;padding:26px 22px;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:300px;width:88%;animation:cin .22s cubic-bezier(.2,.8,.3,1);}
        @keyframes cin{from{opacity:0;transform:scale(.88);}to{opacity:1;transform:scale(1);}}
        .ss-icon{font-size:50px;line-height:1;}
        .ss-ctitle{color:#00ffe1;font-size:19px;font-weight:900;letter-spacing:3px;text-align:center;}
        .ss-csc{color:#ffd700;font-size:28px;font-weight:900;}
        .ss-chi{color:#888;font-size:12px;}
        .ss-chint{color:#2a4466;font-size:11px;text-align:center;line-height:1.9;}
        .ss-btn{border:none;border-radius:28px;font-size:14px;font-weight:800;padding:12px 28px;cursor:pointer;font-family:inherit;letter-spacing:1px;transition:transform .1s;width:100%;-webkit-tap-highlight-color:transparent;}
        .ss-btn:active{transform:scale(.96);}
        .ss-bp{background:#00ffe1;color:#020817;}
        .ss-bs{background:#1a2a3a;color:#e9edef;margin-top:-4px;}
      `}</style>

      <div className="ss-root">
        <header className="ss-hdr">
          <button className="ss-back" onClick={onBack}>← Voltar</button>
          <span className="ss-title">SPACE SHOOTER</span>
          <span className="ss-score">⭐ {scoreUI.toLocaleString()}</span>
        </header>

        <div className="ss-hud">
          <div className="ss-left">
            <div className="ss-hp">
              {Array.from({length:3}).map((_,i)=>(
                <span key={i} className="ss-heart" style={{opacity:i<hpUI?1:.18}}>❤️</span>
              ))}
            </div>
            <span className="ss-lvl">LV{levelUI}</span>
            <span className="ss-wave">WAVE {waveUI}</span>
          </div>
          <div className="ss-right">
            {pw.shield&&<span className="ss-tag" style={{background:"#1e40af22",color:"#60a5fa",border:"1px solid #60a5fa44"}}>🛡</span>}
            {pw.multi>1&&<span className="ss-tag" style={{background:"#78350f22",color:"#fbbf24",border:"1px solid #fbbf2444"}}>💥{pw.multi}x</span>}
            {pw.rapid&&<span className="ss-tag" style={{background:"#05402022",color:"#34d399",border:"1px solid #34d39944"}}>⚡</span>}
            <span className="ss-tag" style={{background:"#43140722",color:"#f97316",border:"1px solid #f9731644"}}>
              💣{screen==="playing"?G.current.ship.bomb:1}
            </span>
            {comboUI>=2&&<span className="ss-tag" style={{background:"#fbbf2422",color:"#fbbf24",border:"1px solid #fbbf2444"}}>x{comboUI}</span>}
          </div>
        </div>

        <div className="ss-canvas-wrap">
          <canvas ref={canvasRef} width={W} height={H} style={{width:cw,height:ch}}
            onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onTE} onTouchCancel={onTE} />
        </div>

        {screen==="playing"&&(
          <div className="ss-bot">
            <button className="ss-bomb-btn"
              onTouchStart={e=>{e.preventDefault();useBomb();}}
              onClick={useBomb}>
              💣 BOMBA ({screen==="playing"?G.current.ship.bomb:1})
            </button>
            <span className="ss-hint">Arraste para mover<br/>Auto-fire · Espaço=bomba</span>
          </div>
        )}

        {screen==="menu"&&(
          <div className="ss-ov"><div className="ss-card">
            <div className="ss-icon">🚀</div>
            <div className="ss-ctitle">SPACE SHOOTER</div>
            <div className="ss-chint">
              Nave atira sozinha — só mova!{"\n"}
              🛸 OVNIs · 🚀 Naves · 🐍 Cobras · 💰 Bônus{"\n"}
              Boss ao final de cada nível!{"\n"}
              Combo mata seguida = mais pontos{"\n"}
              ❤️ vida · 🛡 escudo · 💥 multi · ⚡ rápido · 💣 bomba
            </div>
            {hiUI>0&&<div className="ss-chi">🏆 Recorde: {hiUI.toLocaleString()}</div>}
            <button className="ss-btn ss-bp" onClick={startGame}>🚀 INICIAR</button>
          </div></div>
        )}

        {screen==="dead"&&(
          <div className="ss-ov"><div className="ss-card">
            <div className="ss-icon">💥</div>
            <div className="ss-ctitle" style={{color:"#f87171"}}>GAME OVER</div>
            <div className="ss-csc">{scoreUI.toLocaleString()}</div>
            <div className="ss-chi">🏆 Recorde: {hiUI.toLocaleString()}</div>
            <button className="ss-btn ss-bp" onClick={startGame}>↺ Tentar de novo</button>
            <button className="ss-btn ss-bs" onClick={onBack}>← Voltar</button>
          </div></div>
        )}

        {screen==="win"&&(
          <div className="ss-ov"><div className="ss-card">
            <div className="ss-icon">🏆</div>
            <div className="ss-ctitle">VOCÊ VENCEU!</div>
            <div className="ss-csc">{scoreUI.toLocaleString()}</div>
            <button className="ss-btn ss-bp" onClick={startGame}>↺ Jogar de novo</button>
            <button className="ss-btn ss-bs" onClick={onBack}>← Voltar</button>
          </div></div>
        )}
      </div>
    </>
  );
}
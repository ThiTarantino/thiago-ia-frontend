import { useState, useRef, useEffect, useCallback } from "react";
type Props = { onBack: () => void };

const SIZE = 10;
type Cell = { shipId: number | null; hit: boolean; miss: boolean; splash?: boolean };
type Board = Cell[][];

interface ShipDef {
  id: number; name: string; length: number;
  placed: boolean; r: number; c: number; horiz: boolean; emoji: string;
}

const SHIPS_TEMPLATE: Omit<ShipDef,"placed"|"r"|"c"|"horiz">[] = [
  { id:1, name:"Porta-aviões", length:5, emoji:"✈️" },
  { id:2, name:"Couraçado",    length:4, emoji:"🚢" },
  { id:3, name:"Cruzador",     length:3, emoji:"⚓" },
  { id:4, name:"Submarino",    length:3, emoji:"🤿" },
  { id:5, name:"Destruidor",   length:2, emoji:"💣" },
];

// ── audio ────────────────────────────────────────────────────────────────────
function getAudioCtx(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch { return null; }
}

function playExplosion() {
  const ctx = getAudioCtx(); if (!ctx) return;
  // low boom + crackle
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.6, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / ctx.sampleRate;
    const env = Math.exp(-t * 8);
    data[i] = (Math.random() * 2 - 1) * env * (1 + Math.sin(t * 80) * 0.4);
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain(); gain.gain.value = 0.55;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass"; filter.frequency.value = 800;
  src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  src.start();
}

function playSplash() {
  const ctx = getAudioCtx(); if (!ctx) return;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t = i / ctx.sampleRate;
    const env = Math.exp(-t * 12) * (t < 0.02 ? t / 0.02 : 1);
    data[i] = (Math.random() * 2 - 1) * env * 0.6;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain(); gain.gain.value = 0.4;
  const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 1200;
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass";  lp.frequency.value = 4000;
  src.connect(hp); hp.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
  src.start();
}

// ── board helpers ─────────────────────────────────────────────────────────────
function freshShips(): ShipDef[] {
  return SHIPS_TEMPLATE.map(s => ({ ...s, placed:false, r:-1, c:-1, horiz:true }));
}
function emptyBoard(): Board {
  return Array.from({length:SIZE}, () =>
    Array.from({length:SIZE}, () => ({ shipId:null, hit:false, miss:false })));
}
function canPlace(board: Board, r:number, c:number, len:number, horiz:boolean, skipId?:number): boolean {
  for (let i=0;i<len;i++) {
    const nr=horiz?r:r+i, nc=horiz?c+i:c;
    if (nr<0||nr>=SIZE||nc<0||nc>=SIZE) return false;
    if (board[nr][nc].shipId!==null && board[nr][nc].shipId!==skipId) return false;
  }
  return true;
}
function placeOnBoard(board: Board, ship: ShipDef): Board {
  const b = board.map(row=>row.map(c=>({...c})));
  if (ship.placed) {
    for (let i=0;i<ship.length;i++) {
      const nr=ship.horiz?ship.r:ship.r+i, nc=ship.horiz?ship.c+i:ship.c;
      if (nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE) b[nr][nc].shipId=null;
    }
  }
  for (let i=0;i<ship.length;i++) {
    const nr=ship.horiz?ship.r:ship.r+i, nc=ship.horiz?ship.c+i:ship.c;
    b[nr][nc].shipId=ship.id;
  }
  return b;
}
function clearShipFromBoard(board: Board, ship: ShipDef): Board {
  const b = board.map(row=>row.map(c=>({...c})));
  if (!ship.placed) return b;
  for (let i=0;i<ship.length;i++) {
    const nr=ship.horiz?ship.r:ship.r+i, nc=ship.horiz?ship.c+i:ship.c;
    if (nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE) b[nr][nc].shipId=null;
  }
  return b;
}
function autoPlace(): { ships: ShipDef[]; board: Board } {
  let board = emptyBoard();
  const ships = freshShips();
  for (const ship of ships) {
    let ok=false, tries=0;
    while (!ok && tries<1000) {
      tries++;
      const horiz=Math.random()>0.5;
      const r=Math.floor(Math.random()*(SIZE-(horiz?0:ship.length-1)));
      const c=Math.floor(Math.random()*(SIZE-(horiz?ship.length-1:0)));
      if (canPlace(board,r,c,ship.length,horiz)) {
        ship.placed=true; ship.r=r; ship.c=c; ship.horiz=horiz;
        board=placeOnBoard(board,ship); ok=true;
      }
    }
  }
  return {ships,board};
}
function countAlive(board: Board, ships: ShipDef[]): number {
  return ships.filter(s=>{
    for (let i=0;i<s.length;i++) {
      const nr=s.horiz?s.r:s.r+i, nc=s.horiz?s.c+i:s.c;
      if (!board[nr][nc].hit) return true;
    }
    return false;
  }).length;
}
function isSunk(board: Board, ship: ShipDef): boolean {
  for (let i=0;i<ship.length;i++) {
    const nr=ship.horiz?ship.r:ship.r+i, nc=ship.horiz?ship.c+i:ship.c;
    if (!board[nr][nc].hit) return false;
  }
  return true;
}

// ── component ─────────────────────────────────────────────────────────────────
type Phase = "setup1"|"handoff1"|"setup2"|"handoff2"|"battle1"|"battle2"|"fim";

export default function BattleShip({ onBack }: Props) {
  const [phase, setPhase]       = useState<Phase>("setup1");
  const [board1, setBoard1]     = useState<Board>(emptyBoard());
  const [board2, setBoard2]     = useState<Board>(emptyBoard());
  const [ships1, setShips1]     = useState<ShipDef[]>(freshShips());
  const [ships2, setShips2]     = useState<ShipDef[]>(freshShips());
  const [vencedor, setVencedor] = useState("");
  const [lastHit, setLastHit]   = useState(false);
  const [hiddenBoard, setHiddenBoard] = useState(false);
  const [transitioning, setTransitioning] = useState(false); // locked during miss animation
  const [splashCell, setSplashCell] = useState<string|null>(null); // "r-c" that is splashing

  // setup interaction
  const [selectedShipId, setSelectedShipId] = useState<number|null>(null);
  const [hoverCell, setHoverCell] = useState<{r:number;c:number}|null>(null);

  // responsive cell size
  const gridWrapRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(32);

  useEffect(() => {
    function recalc() {
      // full viewport width minus horizontal padding (16px each side)
      const available = Math.min(window.innerWidth - 32, 420);
      // 10 cells + 9 gaps of 2px + 8px grid padding
      const cell = Math.floor((available - 9*2 - 8) / SIZE);
      setCellSize(Math.max(22, Math.min(cell, 42)));
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  // ── derived ──────────────────────────────────────────────────────────────────
  const isSetup   = phase==="setup1"||phase==="setup2";
  const isBattle  = phase==="battle1"||phase==="battle2";
  const isHandoff = phase==="handoff1"||phase==="handoff2";
  const cp        = phase==="setup1"||phase==="battle1" ? 1 : 2;
  const curShips  = cp===1 ? ships1 : ships2;
  const curBoard  = cp===1 ? board1 : board2;
  const attacker  = phase==="battle1" ? 1 : 2;
  const defBoard  = attacker===1 ? board2 : board1;
  const ownBoard  = attacker===1 ? board1 : board2;
  const ownShips  = attacker===1 ? ships1 : ships2;
  const defShips  = attacker===1 ? ships2 : ships1;
  const selShip   = selectedShipId!==null ? curShips.find(s=>s.id===selectedShipId)||null : null;

  // ── preview ───────────────────────────────────────────────────────────────────
  function getPreview(): { cells: Set<string>; valid: boolean } {
    const cells = new Set<string>();
    if (!selShip || !hoverCell) return { cells, valid:false };
    let valid = true;
    for (let i=0;i<selShip.length;i++) {
      const nr=selShip.horiz?hoverCell.r:hoverCell.r+i;
      const nc=selShip.horiz?hoverCell.c+i:hoverCell.c;
      cells.add(`${nr}-${nc}`);
      if (nr<0||nr>=SIZE||nc<0||nc>=SIZE) { valid=false; continue; }
      const cid = curBoard[nr][nc].shipId;
      if (cid!==null && cid!==selShip.id) valid=false;
    }
    return { cells, valid };
  }
  const { cells: preview, valid: previewValid } = getPreview();

  // ── setup actions ─────────────────────────────────────────────────────────────
  function handleCellTap(r:number, c:number) {
    const board=cp===1?board1:board2, ships=cp===1?ships1:ships2;
    if (selShip) {
      if (!canPlace(board,r,c,selShip.length,selShip.horiz,selShip.id)) return;
      const updated={...selShip,placed:true,r,c};
      const ns=ships.map(s=>s.id===selShip.id?updated:s);
      const nb=placeOnBoard(board,updated);
      cp===1?(setShips1(ns),setBoard1(nb)):(setShips2(ns),setBoard2(nb));
      setSelectedShipId(null); setHoverCell(null);
    } else if (board[r][c].shipId!==null) {
      const sid=board[r][c].shipId!;
      const ship=ships.find(s=>s.id===sid)!;
      const nb=clearShipFromBoard(board,ship);
      const ns=ships.map(s=>s.id===sid?{...s,placed:false,r:-1,c:-1}:s);
      cp===1?(setShips1(ns),setBoard1(nb)):(setShips2(ns),setBoard2(nb));
      setSelectedShipId(sid); setHoverCell(null);
    }
  }

  function rotateSelected() {
    if (!selShip) return;
    const ships=cp===1?ships1:ships2;
    const ns=ships.map(s=>s.id===selShip.id?{...s,horiz:!s.horiz}:s);
    cp===1?setShips1(ns):setShips2(ns);
  }

  function handleTrayTap(shipId:number) {
    const ships=cp===1?ships1:ships2, ship=ships.find(s=>s.id===shipId)!;
    if (selectedShipId===shipId) { setSelectedShipId(null); setHoverCell(null); return; }
    if (ship.placed) {
      const board=cp===1?board1:board2;
      const nb=clearShipFromBoard(board,ship);
      const ns=ships.map(s=>s.id===shipId?{...s,placed:false,r:-1,c:-1}:s);
      cp===1?(setShips1(ns),setBoard1(nb)):(setShips2(ns),setBoard2(nb));
    }
    setSelectedShipId(shipId); setHoverCell(null);
  }

  function handleAuto() {
    const {ships,board}=autoPlace();
    cp===1?(setShips1(ships),setBoard1(board)):(setShips2(ships),setBoard2(board));
    setSelectedShipId(null); setHoverCell(null);
  }

  function handleConfirm() {
    const ships=cp===1?ships1:ships2;
    if (ships.some(s=>!s.placed)) return;
    setSelectedShipId(null); setHoverCell(null);
    setPhase(phase==="setup1"?"handoff1":"handoff2");
  }

  function handleHandoff() {
    setPhase(phase==="handoff1"?"setup2":"battle1");
  }

  // ── attack ────────────────────────────────────────────────────────────────────
  function atacar(r:number, c:number) {
    if (transitioning) return;
    if (defBoard[r][c].hit||defBoard[r][c].miss) return;

    const nb=defBoard.map(row=>row.map(c=>({...c})));

    if (nb[r][c].shipId!==null) {
      // HIT
      nb[r][c].hit=true;
      attacker===1?setBoard2(nb):setBoard1(nb);
      playExplosion();
      const alive=countAlive(nb,defShips);
      if (alive===0) { setVencedor(`Jogador ${attacker}`); setPhase("fim"); return; }
      setLastHit(true);
    } else {
      // MISS — animate then hand off
      nb[r][c].miss=true;
      attacker===1?setBoard2(nb):setBoard1(nb);
      playSplash();
      setSplashCell(`${r}-${c}`);
      setLastHit(false);
      setTransitioning(true);

      setTimeout(()=>{
        setSplashCell(null);
        setTransitioning(false);
        setPhase(phase==="battle1"?"battle2":"battle1");
        setHiddenBoard(true);
      }, 1400);
    }
  }

  function reiniciar() {
    setBoard1(emptyBoard()); setBoard2(emptyBoard());
    setShips1(freshShips()); setShips2(freshShips());
    setPhase("setup1"); setVencedor(""); setLastHit(false);
    setHiddenBoard(false); setSelectedShipId(null); setHoverCell(null);
    setSplashCell(null); setTransitioning(false);
  }

  // ── cell size & grid width ────────────────────────────────────────────────────
  const C = cellSize; // shorthand
  const GRID_PX = C*SIZE + 2*(SIZE-1) + 8; // cells + gaps + padding

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@400;600;700&display=swap');
        :root {
          --ocean:#0a1628; --ocean-mid:#0d2040; --water:#1a3a5c;
          --accent:#00d4ff; --hit:#ff3b3b; --miss:#2d4a6a;
          --ship:#4fc3f7; --ship-sunk:#334; --green:#00e676;
          --text:#e0f4ff; --text-dim:#7bacc4;
        }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .bs-root { width:100%; height:100dvh; display:flex; flex-direction:column; background:var(--ocean); font-family:'Exo 2',sans-serif; overflow:hidden; position:relative; }

        /* header */
        .bs-hdr { display:flex; align-items:center; gap:10px; padding:0 12px; height:50px; min-height:50px; flex-shrink:0; background:var(--ocean-mid); border-bottom:1px solid #1a4a6e; }
        .bs-back { background:none; border:1px solid var(--accent); color:var(--accent); font-size:13px; padding:4px 10px; border-radius:4px; cursor:pointer; font-family:'Exo 2',sans-serif; -webkit-tap-highlight-color:transparent; }
        .bs-title { font-family:'Orbitron',sans-serif; color:var(--accent); font-size:15px; flex:1; letter-spacing:2px; text-shadow:0 0 16px rgba(0,212,255,0.5); }
        .bs-hdr-tag { color:var(--text-dim); font-size:11px; font-family:'Orbitron',sans-serif; }

        /* scrollable body */
        .bs-body { flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; padding:8px 8px 80px; overflow-y:auto; }

        /* text */
        .bs-msg { color:var(--accent); font-family:'Orbitron',sans-serif; font-size:11px; letter-spacing:1px; text-align:center; text-transform:uppercase; }
        .bs-sub { color:var(--text-dim); font-size:11px; text-align:center; }

        /* grid */
        .bs-col-labels { display:flex; gap:2px; padding:0 4px; margin-bottom:1px; }
        .bs-lbl { text-align:center; color:var(--text-dim); font-size:9px; font-family:'Orbitron',sans-serif; }
        .bs-grid { display:grid; gap:2px; background:var(--ocean-mid); padding:4px; border-radius:6px; border:1px solid #1a4a6e; }

        /* cells */
        .bs-cell { border-radius:3px; display:flex; align-items:center; justify-content:center; position:relative; user-select:none; -webkit-tap-highlight-color:transparent; cursor:pointer; transition:filter 0.1s; overflow:hidden; }
        .bs-cell:active { filter:brightness(1.35); }
        .bs-cell.water     { background:var(--water); border:1px solid #1a3a5c; }
        .bs-cell.ship-on   { background:var(--ship);  border:1px solid #7be0ff; }
        .bs-cell.ship-sunk { background:var(--ship-sunk); border:1px solid #556; }
        .bs-cell.hit       { background:var(--hit);   border:1px solid #ff7777; }
        .bs-cell.miss      { background:var(--miss);  border:1px solid #3a5a7a; }
        .bs-cell.prv-ok    { background:rgba(0,212,255,0.32)!important; border:1px solid var(--accent)!important; }
        .bs-cell.prv-bad   { background:rgba(255,59,59,0.32)!important; border:1px solid var(--hit)!important; }
        .bs-cell.atk:hover:not(.hit):not(.miss) { background:#1e5a8a!important; border-color:#3a8aaa!important; }
        .bs-cell.locked { cursor:default; pointer-events:none; }

        /* splash animation */
        .bs-cell.splashing { animation: splashPulse 1.4s ease forwards; }
        @keyframes splashPulse {
          0%   { background: #2d4a6a; }
          15%  { background: #66ccff; box-shadow: 0 0 12px #00d4ff; }
          40%  { background: #44aaee; }
          100% { background: var(--miss); }
        }
        /* ripple inside splash cell */
        .bs-ripple {
          position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
          font-size:inherit; animation: rippleIn 1.4s ease forwards; pointer-events:none;
        }
        @keyframes rippleIn {
          0%   { opacity:0; transform:scale(0.2); }
          20%  { opacity:1; transform:scale(1.3); }
          45%  { opacity:1; transform:scale(0.9); }
          100% { opacity:0.6; transform:scale(1); }
        }

        /* hit pulse */
        .bs-cell.hit { animation: hitFlash 0.4s ease; }
        @keyframes hitFlash {
          0%,100% { background:var(--hit); }
          50%     { background:#ff8888; box-shadow:0 0 14px #ff3b3b; }
        }

        /* miss turn banner */
        .bs-miss-banner {
          position:fixed; top:54px; left:0; right:0; z-index:40;
          background:linear-gradient(90deg,#001a3a,#002a5a,#001a3a);
          border-bottom:1px solid var(--accent);
          padding:10px 16px; text-align:center;
          color:var(--accent); font-family:'Orbitron',sans-serif; font-size:12px; letter-spacing:1px;
          animation: bannerIn 0.3s ease;
        }
        @keyframes bannerIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }

        /* hit msg */
        .bs-hit-msg { color:var(--hit); font-family:'Orbitron',sans-serif; font-size:13px; letter-spacing:1px; animation:pulse 0.6s ease infinite alternate; }
        @keyframes pulse { from{opacity:1} to{opacity:0.5} }

        /* tray */
        .bs-tray { display:flex; flex-direction:column; gap:5px; width:100%; }
        .bs-tray-lbl { color:var(--text-dim); font-size:10px; letter-spacing:1px; text-transform:uppercase; text-align:center; }
        .bs-ship { display:flex; align-items:center; gap:6px; background:var(--ocean-mid); border-radius:8px; padding:7px 10px; border:1px solid #1a4a6e; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:border-color 0.15s, background 0.15s; }
        .bs-ship.sel  { border-color:var(--accent); background:rgba(0,212,255,0.08); }
        .bs-ship.done { border-color:#2a5a3a; }
        .bs-ship-sqs  { display:flex; gap:2px; }
        .bs-sq { width:17px; height:17px; border-radius:3px; background:var(--ship); border:1px solid #7be0ff; }
        .bs-sq.placed { background:var(--ship-sunk); border-color:#778; }
        .bs-ship-name { color:var(--text); font-size:11px; flex:1; }
        .bs-ship-tag  { font-size:10px; color:var(--text-dim); }

        /* ── FLOATING EDIT BAR ──────────────────────────────
           Fixed at bottom, over the content, never pushes grid */
        .bs-edit-bar {
          position:fixed; bottom:0; left:0; right:0; z-index:50;
          display:flex; align-items:center; gap:8px;
          background:linear-gradient(0deg, rgba(10,22,40,0.98) 0%, rgba(13,32,64,0.95) 100%);
          border-top:1px solid var(--accent);
          padding:10px 14px 12px;
          backdrop-filter:blur(12px);
          animation:slideUp 0.2s ease;
        }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        .bs-edit-icon { font-size:20px; }
        .bs-edit-info { flex:1; }
        .bs-edit-name { color:var(--accent); font-family:'Orbitron',sans-serif; font-size:12px; }
        .bs-edit-hint { color:var(--text-dim); font-size:10px; margin-top:2px; }
        .bs-edit-btns { display:flex; gap:6px; }

        /* buttons */
        .bs-btn { background:transparent; border:2px solid var(--accent); color:var(--accent); font-family:'Orbitron',sans-serif; font-size:11px; letter-spacing:1px; padding:8px 14px; border-radius:4px; cursor:pointer; transition:all 0.15s; text-transform:uppercase; -webkit-tap-highlight-color:transparent; white-space:nowrap; }
        .bs-btn:hover, .bs-btn:active { background:var(--accent); color:var(--ocean); }
        .bs-btn.primary { background:var(--accent); color:var(--ocean); }
        .bs-btn.red { border-color:var(--hit); color:var(--hit); }
        .bs-btn.red:hover, .bs-btn.red:active { background:var(--hit); color:#fff; }
        .bs-btn:disabled { opacity:0.3; cursor:default; pointer-events:none; }
        .bs-btns { display:flex; gap:8px; flex-wrap:wrap; justify-content:center; }

        /* mini board */
        .bs-mini { display:grid; gap:1px; background:var(--ocean-mid); padding:2px; border-radius:4px; border:1px solid #1a4a6e; }
        .bs-mini-cell { border-radius:2px; }

        /* handoff / fim center screens */
        .bs-mid { display:flex; flex-direction:column; align-items:center; gap:20px; padding:32px 20px; text-align:center; flex:1; justify-content:center; }
        .bs-mid-title { font-family:'Orbitron',sans-serif; color:var(--accent); font-size:20px; }
        .bs-mid-sub { color:var(--text-dim); font-size:13px; line-height:1.6; max-width:280px; }
        .bs-winner { font-family:'Orbitron',sans-serif; font-size:26px; color:var(--green); }
      `}</style>

      <div className="bs-root">
        {/* HEADER */}
        <div className="bs-hdr">
          <button className="bs-back" onClick={onBack}>← VOLTAR</button>
          <span className="bs-title">⚓ BATALHA NAVAL</span>
          {isBattle && <span className="bs-hdr-tag">J{attacker} ataca</span>}
        </div>

        {/* miss banner (shown while animating miss + waiting to hand off) */}
        {transitioning && (
          <div className="bs-miss-banner">💧 ÁGUA! Passando a vez…</div>
        )}

        <div className="bs-body">

          {/* ── HANDOFF ── */}
          {isHandoff && (
            <div className="bs-mid">
              <div style={{fontSize:52}}>{phase==="handoff1"?"🔄":"⚔️"}</div>
              <div className="bs-mid-title">{phase==="handoff1"?"Passe ao Jogador 2":"Prontos!"}</div>
              <div className="bs-mid-sub">
                {phase==="handoff1"
                  ? "Jogador 1 confirmou. Passe o aparelho para o Jogador 2 posicionar seus navios."
                  : "Ambos prontos. Jogador 1 começa o ataque!"}
              </div>
              <button className="bs-btn primary" onClick={handleHandoff}>
                {phase==="handoff1"?"Jogador 2 →":"⚔️ Iniciar Batalha"}
              </button>
            </div>
          )}

          {/* ── SETUP ── */}
          {isSetup && (()=>{
            const allPlaced = curShips.every(s=>s.placed);
            return (
              <>
                <div className="bs-msg">Jogador {cp} — Posicione seus navios</div>
                {!selShip && <div className="bs-sub">Toque em um navio abaixo para selecioná-lo</div>}

                {/* GRID */}
                <div ref={gridWrapRef}>
                  <div className="bs-col-labels" style={{paddingLeft:4}}>
                    {Array.from({length:SIZE},(_,i)=>(
                      <div key={i} className="bs-lbl" style={{width:C}}>{String.fromCharCode(65+i)}</div>
                    ))}
                  </div>
                  <div className="bs-grid" style={{gridTemplateColumns:`repeat(${SIZE},${C}px)`}}>
                    {Array.from({length:SIZE},(_,r)=>Array.from({length:SIZE},(_,c)=>{
                      const cell=curBoard[r][c];
                      const key=`${r}-${c}`;
                      const inPrev=preview.has(key);
                      let cls="bs-cell water";
                      if (inPrev) cls=`bs-cell ${previewValid?"prv-ok":"prv-bad"}`;
                      else if (cell.shipId!==null) {
                        const ship=curShips.find(s=>s.id===cell.shipId);
                        cls=ship&&isSunk(curBoard,ship)?"bs-cell ship-sunk":"bs-cell ship-on";
                      }
                      return (
                        <div key={key} className={cls}
                          style={{width:C,height:C}}
                          data-r={r} data-dc={c}
                          onMouseEnter={()=>selShip&&setHoverCell({r,c})}
                          onMouseLeave={()=>selShip&&setHoverCell(null)}
                          onTouchMove={e=>{
                            if (!selShip) return; e.preventDefault();
                            const t=e.touches[0];
                            const el=document.elementFromPoint(t.clientX,t.clientY);
                            const dr=el?.getAttribute("data-r"), dc=el?.getAttribute("data-dc");
                            if (dr&&dc) setHoverCell({r:+dr,c:+dc});
                          }}
                          onClick={()=>handleCellTap(r,c)}
                        />
                      );
                    }))}
                  </div>
                </div>

                {/* SHIP TRAY */}
                <div className="bs-tray">
                  <div className="bs-tray-lbl">Navios — toque para selecionar</div>
                  {curShips.map(ship=>(
                    <div key={ship.id}
                      className={`bs-ship${selectedShipId===ship.id?" sel":""}${ship.placed&&selectedShipId!==ship.id?" done":""}`}
                      onClick={()=>handleTrayTap(ship.id)}
                    >
                      <span style={{fontSize:16}}>{ship.emoji}</span>
                      <div className="bs-ship-sqs">
                        {Array.from({length:ship.length},(_,i)=>(
                          <div key={i} className={`bs-sq${ship.placed&&selectedShipId!==ship.id?" placed":""}`}/>
                        ))}
                      </div>
                      <span className="bs-ship-name">{ship.name}</span>
                      <span className="bs-ship-tag">{selectedShipId===ship.id?"✏️":ship.placed?"✅":"—"}</span>
                    </div>
                  ))}
                </div>

                <div className="bs-btns" style={{marginBottom:8}}>
                  <button className="bs-btn" onClick={handleAuto}>🎲 Aleatório</button>
                  <button className="bs-btn primary" disabled={!allPlaced} onClick={handleConfirm}>✓ Confirmar</button>
                </div>
              </>
            );
          })()}

          {/* ── BATTLE HIDDEN ── */}
          {isBattle && hiddenBoard && (
            <div className="bs-mid">
              <div style={{fontSize:52}}>🎯</div>
              <div className="bs-mid-title">Vez do Jogador {attacker}</div>
              <div className="bs-mid-sub">Passe o aparelho. Quando pronto, revele o tabuleiro.</div>
              <button className="bs-btn primary" onClick={()=>setHiddenBoard(false)}>👁️ Revelar</button>
            </div>
          )}

          {/* ── BATTLE ACTIVE ── */}
          {isBattle && !hiddenBoard && (
            <>
              {lastHit
                ? <div className="bs-hit-msg">💥 ACERTOU! Ataque novamente!</div>
                : <div className="bs-msg">Jogador {attacker} — escolha um alvo</div>
              }

              {/* Attack grid */}
              <div>
                <div className="bs-sub" style={{marginBottom:3}}>Tabuleiro inimigo</div>
                <div className="bs-col-labels" style={{paddingLeft:4}}>
                  {Array.from({length:SIZE},(_,i)=>(
                    <div key={i} className="bs-lbl" style={{width:C}}>{String.fromCharCode(65+i)}</div>
                  ))}
                </div>
                <div className="bs-grid" style={{gridTemplateColumns:`repeat(${SIZE},${C}px)`}}>
                  {Array.from({length:SIZE},(_,r)=>Array.from({length:SIZE},(_,c)=>{
                    const cell=defBoard[r][c];
                    const key=`${r}-${c}`;
                    const isSplash=splashCell===key;
                    let cls="bs-cell water atk";
                    let content:React.ReactNode="";
                    if (cell.hit)       { cls="bs-cell hit";  content="💥"; }
                    else if (cell.miss) { cls=`bs-cell miss${isSplash?" splashing":""}`; content=isSplash?<span className="bs-ripple">💧</span>:"•"; }
                    if (transitioning)  cls+=" locked";
                    return (
                      <div key={key} className={cls}
                        style={{width:C,height:C,fontSize:C>28?12:9}}
                        onClick={()=>atacar(r,c)}
                      >{content}</div>
                    );
                  }))}
                </div>
              </div>

              {/* Own mini board */}
              <div>
                <div className="bs-sub" style={{marginBottom:3}}>Seu tabuleiro</div>
                <div className="bs-mini" style={{gridTemplateColumns:`repeat(${SIZE},16px)`}}>
                  {Array.from({length:SIZE},(_,r)=>Array.from({length:SIZE},(_,c)=>{
                    const cell=ownBoard[r][c];
                    const ship=ownShips.find(s=>s.id===cell.shipId);
                    let bg="var(--water)";
                    if (cell.hit) bg="var(--hit)";
                    else if (cell.miss) bg="var(--miss)";
                    else if (cell.shipId!==null)
                      bg=ship&&isSunk(ownBoard,ship)?"var(--ship-sunk)":"var(--ship)";
                    return <div key={`m${r}-${c}`} className="bs-mini-cell"
                      style={{width:16,height:16,background:bg,border:"1px solid #0a1628"}}/>;
                  }))}
                </div>
              </div>
            </>
          )}

          {/* ── FIM ── */}
          {phase==="fim" && (
            <div className="bs-mid">
              <div style={{fontSize:60}}>🏆</div>
              <div className="bs-winner">{vencedor} VENCEU!</div>
              <div className="bs-mid-sub">Todos os navios inimigos foram afundados!</div>
              <button className="bs-btn primary" onClick={reiniciar}>↺ Jogar Novamente</button>
            </div>
          )}
        </div>

        {/* ── FLOATING EDIT BAR (appears when ship selected in setup) ── */}
        {isSetup && selShip && (
          <div className="bs-edit-bar">
            <span className="bs-edit-icon">{selShip.emoji}</span>
            <div className="bs-edit-info">
              <div className="bs-edit-name">{selShip.name} (×{selShip.length})</div>
              <div className="bs-edit-hint">
                {selShip.horiz?"→ Horizontal":"↓ Vertical"} · Toque no mapa para posicionar
              </div>
            </div>
            <div className="bs-edit-btns">
              <button className="bs-btn" style={{padding:"8px 12px",fontSize:18}} onClick={rotateSelected} title="Rotacionar">↻</button>
              <button className="bs-btn red" style={{padding:"8px 10px",fontSize:13}}
                onClick={()=>{setSelectedShipId(null);setHoverCell(null);}}>✕</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
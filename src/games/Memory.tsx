import { useState, useEffect, useRef, useCallback } from "react";
type Props = { onBack: () => void };

// ── emoji sets ─────────────────────────────────────────
const POOL = [
  "🍎","🍌","🍇","🍓","🍒","🥝","🍑","🍍",
  "🌸","🌊","🔥","⚡","🎯","🎸","🚀","🦋",
  "🐉","💎","🌙","⭐","🎪","🏆","🎭","🦄",
];

// ── difficulty config ──────────────────────────────────
const DIFFICULTIES = {
  easy:   { cols: 4, rows: 4, pairs: 8,  label: "Fácil",   time: 90  },
  medium: { cols: 4, rows: 5, pairs: 10, label: "Médio",   time: 75  },
  hard:   { cols: 5, rows: 6, pairs: 15, label: "Difícil", time: 60  },
} as const;
type Diff = keyof typeof DIFFICULTIES;

interface Card {
  id: number; emoji: string;
  flipped: boolean; matched: boolean; shaking: boolean;
}

function makeCards(pairs: number): Card[] {
  const emojis = POOL.slice(0, pairs);
  return [...emojis, ...emojis]
    .sort(() => Math.random() - 0.5)
    .map((emoji, id) => ({ id, emoji, flipped: false, matched: false, shaking: false }));
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

// ── component ──────────────────────────────────────────
export default function Memory({ onBack }: Props) {
  const [diff, setDiff] = useState<Diff>("easy");
  const [phase, setPhase] = useState<"menu" | "playing" | "win" | "lose">("menu");
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [matchedCount, setMatchedCount] = useState(0);
  const [floats, setFloats] = useState<{ id: number; text: string; color: string }[]>([]);
  const [bestScores, setBestScores] = useState<Record<Diff, number>>({ easy: 0, medium: 0, hard: 0 });
  const [showCombo, setShowCombo] = useState(false);

  const lockRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const floatId = useRef(0);

  function addFloat(text: string, color: string) {
    const id = floatId.current++;
    setFloats(f => [...f, { id, text, color }]);
    setTimeout(() => setFloats(f => f.filter(x => x.id !== id)), 1200);
  }

  function startGame(d: Diff) {
    const cfg = DIFFICULTIES[d];
    setDiff(d);
    setCards(makeCards(cfg.pairs));
    setSelected([]);
    setMoves(0);
    setCombo(0);
    setMaxCombo(0);
    setScore(0);
    setTimeLeft(cfg.time);
    setMatchedCount(0);
    setFloats([]);
    setPhase("playing");
    lockRef.current = false;
  }

  // timer
  useEffect(() => {
    if (phase !== "playing") { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { setPhase("lose"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // check win
  useEffect(() => {
    const cfg = DIFFICULTIES[diff];
    if (phase === "playing" && matchedCount === cfg.pairs) {
      setTimeout(() => {
        setPhase("win");
        const final = score + timeLeft * 5;
        setScore(final);
        setBestScores(b => ({ ...b, [diff]: Math.max(b[diff], final) }));
      }, 400);
    }
  }, [matchedCount, phase]);

  const flip = useCallback((idx: number) => {
    if (phase !== "playing") return;
    if (lockRef.current) return;
    const card = cards[idx];
    if (card.flipped || card.matched) return;
    if (selected.length === 1 && selected[0] === idx) return;

    const newSelected = [...selected, idx];
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, flipped: true } : c));
    setSelected(newSelected);

    if (newSelected.length === 2) {
      lockRef.current = true;
      setMoves(m => m + 1);
      const [a, b] = newSelected;

      setTimeout(() => {
        const ca = cards[a], cb = cards[b];
        if (ca.emoji === cb.emoji) {
          // match!
          const newCombo = combo + 1;
          setCombo(newCombo);
          setMaxCombo(mc => Math.max(mc, newCombo));
          const pts = 100 + newCombo * 50;
          setScore(s => s + pts);
          setMatchedCount(mc => mc + 1);
          addFloat(`+${pts}${newCombo > 1 ? " 🔥COMBO x" + newCombo : ""}`, newCombo > 1 ? "#ff8c00" : "#00e676");
          if (newCombo >= 2) setShowCombo(true);
          setTimeout(() => setShowCombo(false), 1000);
          setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
        } else {
          // no match
          setCombo(0);
          setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, flipped: false, shaking: true } : c
          ));
          addFloat("✗ Errou", "#ef4444");
          setTimeout(() => setCards(prev => prev.map((c, i) =>
            i === a || i === b ? { ...c, shaking: false } : c
          )), 500);
        }
        setSelected([]);
        lockRef.current = false;
      }, 750);
    }
  }, [cards, selected, combo, phase]);

  const cfg = DIFFICULTIES[diff];
  const totalPairs = cfg.pairs;
  const timerPct = timeLeft / cfg.time;
  const timerColor = timerPct > 0.5 ? "#00e676" : timerPct > 0.25 ? "#f9a825" : "#ef4444";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Nunito:wght@700;800;900&display=swap');
        :root {
          --bg:#08080f; --panel:#0f0f1e; --border:rgba(255,255,255,0.07);
          --purple:#c724f0; --cyan:#00e5ff; --gold:#f9a825; --green:#00e676; --red:#ef4444;
        }
        *{box-sizing:border-box;margin:0;padding:0;}

        .mem-root {
          width:100%; height:100dvh;
          display:flex; flex-direction:column;
          background:var(--bg);
          font-family:'Nunito',sans-serif;
          overflow:hidden;
          background-image:
            radial-gradient(ellipse 80% 50% at 20% 10%, rgba(199,36,240,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,229,255,0.06) 0%, transparent 60%);
        }
        /* scanlines */
        .mem-root::before {
          content:''; position:fixed; inset:0; z-index:999; pointer-events:none;
          background:repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px);
        }

        /* ── HEADER ── */
        .mem-header {
          display:flex; align-items:center; gap:8px;
          padding:0 8px 0 4px; height:52px; min-height:52px; flex-shrink:0;
          background:rgba(0,0,0,0.4); border-bottom:1px solid var(--border);
          backdrop-filter:blur(10px);
        }
        .mem-back { background:none; border:none; color:rgba(255,255,255,0.4); cursor:pointer; padding:10px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:color .15s; -webkit-tap-highlight-color:transparent; flex-shrink:0; }
        .mem-back:hover { color:#fff; }
        .mem-title { font-family:'Orbitron',monospace; color:#fff; font-size:14px; font-weight:900; flex:1; letter-spacing:2px; text-shadow:0 0 20px rgba(199,36,240,0.6); }
        .mem-hud { display:flex; gap:5px; flex-shrink:0; }
        .mem-stat { background:rgba(255,255,255,0.04); border:1px solid var(--border); border-radius:8px; padding:3px 9px; text-align:center; }
        .mem-stat-lbl { color:rgba(255,255,255,0.3); font-size:8px; font-weight:800; letter-spacing:1.5px; text-transform:uppercase; }
        .mem-stat-val { color:#e9edef; font-size:14px; font-weight:800; font-family:'Orbitron',monospace; line-height:1.2; }

        /* ── TIMER BAR ── */
        .mem-timer-wrap { height:3px; background:rgba(255,255,255,0.06); flex-shrink:0; }
        .mem-timer-fill { height:100%; transition:width .9s linear, background .5s; }

        /* ── BODY ── */
        .mem-body {
          flex:1; display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:10px; padding:10px 8px; overflow:hidden; position:relative;
        }

        /* ── GRID ── */
        .mem-grid { display:grid; gap:8px; width:100%; max-width:420px; }

        /* ── CARD FLIP ── */
        .mem-card-wrap {
          perspective:600px;
          aspect-ratio:1;
          cursor:pointer;
          -webkit-tap-highlight-color:transparent;
        }
        .mem-card-inner {
          width:100%; height:100%;
          position:relative;
          transform-style:preserve-3d;
          transition:transform 0.38s cubic-bezier(0.34,1.3,0.64,1);
          border-radius:12px;
        }
        .mem-card-wrap.flipped .mem-card-inner,
        .mem-card-wrap.matched .mem-card-inner { transform:rotateY(180deg); }

        .mem-card-face {
          position:absolute; inset:0;
          border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          backface-visibility:hidden;
          -webkit-backface-visibility:hidden;
        }
        /* BACK */
        .mem-card-back {
          background:linear-gradient(135deg, #1a0a2e, #2d0a4e);
          border:1px solid rgba(199,36,240,0.25);
          box-shadow:inset 0 0 20px rgba(199,36,240,0.08);
        }
        .mem-card-back::after {
          content:'';
          position:absolute; inset:4px; border-radius:8px;
          background:
            repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(255,255,255,0.025) 6px, rgba(255,255,255,0.025) 7px);
          border:1px solid rgba(255,255,255,0.05);
        }
        .mem-card-back-icon { font-size:22px; opacity:0.25; position:relative; z-index:1; }

        /* FRONT */
        .mem-card-front {
          transform:rotateY(180deg);
          background:linear-gradient(135deg, #1f0940, #0a1a40);
          border:1px solid rgba(0,229,255,0.3);
          box-shadow:0 0 18px rgba(0,229,255,0.12), inset 0 0 10px rgba(0,0,0,0.3);
          font-size:clamp(20px, 5vw, 32px);
        }
        .mem-card-front::after {
          content:'';
          position:absolute; inset:0; border-radius:12px;
          background:linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
        }
        .mem-card-wrap.matched .mem-card-front {
          background:linear-gradient(135deg, #0a2a18, #0a3a28);
          border-color:rgba(0,230,118,0.5);
          box-shadow:0 0 24px rgba(0,230,118,0.2);
        }

        /* shake */
        .mem-card-wrap.shaking { animation:shake 0.4s ease; }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }

        /* ── COMBO banner ── */
        .mem-combo {
          position:absolute; top:10px; left:50%; transform:translateX(-50%);
          background:linear-gradient(135deg, #c724f0, #ff6b35);
          color:#fff; font-family:'Orbitron',monospace; font-size:13px; font-weight:900; letter-spacing:2px;
          padding:6px 20px; border-radius:24px;
          box-shadow:0 4px 20px rgba(199,36,240,0.5);
          animation:comboIn .3s cubic-bezier(0.34,1.6,0.64,1);
          white-space:nowrap; z-index:10;
        }
        @keyframes comboIn { from{opacity:0;transform:translateX(-50%) scale(0.7)} to{opacity:1;transform:translateX(-50%) scale(1)} }

        /* ── Float texts ── */
        .mem-floats { position:absolute; top:10px; right:12px; display:flex; flex-direction:column; gap:4px; pointer-events:none; z-index:10; }
        .mem-float { font-family:'Orbitron',monospace; font-size:12px; font-weight:700; padding:3px 10px; border-radius:12px; background:rgba(0,0,0,0.5); animation:floatUp .9s ease forwards; white-space:nowrap; }
        @keyframes floatUp { 0%{opacity:1;transform:translateY(0)} 70%{opacity:1} 100%{opacity:0;transform:translateY(-28px)} }

        /* ── Progress bar ── */
        .mem-progress { width:100%; max-width:420px; }
        .mem-progress-bar { height:5px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden; }
        .mem-progress-fill { height:100%; background:linear-gradient(90deg,var(--purple),var(--cyan)); border-radius:3px; transition:width .4s ease; }
        .mem-progress-label { color:rgba(255,255,255,0.35); font-size:10px; font-weight:700; letter-spacing:1px; margin-bottom:4px; }

        /* ── OVERLAYS ── */
        .mem-overlay {
          position:fixed; inset:0; background:rgba(0,0,0,0.8);
          display:flex; align-items:center; justify-content:center; z-index:50;
          backdrop-filter:blur(8px);
        }
        .mem-card-ui {
          background:linear-gradient(135deg,#0f0820,#08080f);
          border:1px solid rgba(255,255,255,0.1); border-radius:24px;
          padding:28px 24px; display:flex; flex-direction:column;
          align-items:center; gap:16px;
          max-width:320px; width:92%;
          box-shadow:0 32px 80px rgba(0,0,0,0.7);
          animation:cardIn .3s cubic-bezier(0.34,1.4,0.64,1);
        }
        @keyframes cardIn { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }

        .mem-ui-icon { font-size:52px; line-height:1; }
        .mem-ui-title { font-family:'Orbitron',monospace; color:#fff; font-size:20px; font-weight:900; letter-spacing:3px; text-shadow:0 0 30px rgba(199,36,240,0.7); }
        .mem-ui-score { font-family:'Orbitron',monospace; color:var(--gold); font-size:52px; font-weight:900; line-height:1; text-shadow:0 4px 20px rgba(249,168,37,0.4); }
        .mem-ui-sub { color:rgba(255,255,255,0.45); font-size:12px; font-weight:700; letter-spacing:1px; text-align:center; line-height:1.6; }
        .mem-ui-best { color:var(--gold); }

        /* diff selector */
        .mem-diff-row { display:flex; gap:8px; width:100%; }
        .mem-diff-btn {
          flex:1; padding:10px 4px; border-radius:10px; border:1px solid var(--border);
          background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.6);
          font-family:'Nunito',sans-serif; font-size:13px; font-weight:800;
          cursor:pointer; transition:all .15s; text-align:center;
          -webkit-tap-highlight-color:transparent;
        }
        .mem-diff-btn.active { background:rgba(199,36,240,0.2); border-color:rgba(199,36,240,0.5); color:#fff; box-shadow:0 0 16px rgba(199,36,240,0.2); }

        .mem-play-btn {
          background:linear-gradient(135deg,var(--purple),#7b2ff7);
          border:none; color:#fff; font-family:'Orbitron',monospace;
          font-size:14px; font-weight:700; letter-spacing:2px;
          padding:14px 36px; border-radius:50px; cursor:pointer; width:100%;
          box-shadow:0 6px 24px rgba(199,36,240,0.45);
          transition:transform .12s; -webkit-tap-highlight-color:transparent;
        }
        .mem-play-btn:active { transform:scale(0.95); }
        .mem-play-btn.green { background:linear-gradient(135deg,#00c853,#007c2e); box-shadow:0 6px 24px rgba(0,200,83,0.4); }

        /* diff info row */
        .mem-diff-info { display:flex; gap:16px; }
        .mem-info-item { text-align:center; }
        .mem-info-val { font-family:'Orbitron',monospace; font-size:18px; font-weight:900; color:var(--cyan); }
        .mem-info-lbl { color:rgba(255,255,255,0.35); font-size:10px; font-weight:700; letter-spacing:1px; }

        /* win sparkles */
        @keyframes sparkle { 0%,100%{transform:scale(1) rotate(0deg)} 50%{transform:scale(1.2) rotate(10deg)} }
        .mem-ui-icon.win { animation:sparkle .6s ease-in-out infinite; }
      `}</style>

      <div className="mem-root">
        {/* HEADER */}
        <header className="mem-header">
          <button className="mem-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <span className="mem-title">MEMÓRIA</span>
          {phase === "playing" && (
            <div className="mem-hud">
              <div className="mem-stat">
                <div className="mem-stat-lbl">SCORE</div>
                <div className="mem-stat-val">{score}</div>
              </div>
              <div className="mem-stat">
                <div className="mem-stat-lbl">JOGADAS</div>
                <div className="mem-stat-val">{moves}</div>
              </div>
              <div className="mem-stat">
                <div className="mem-stat-lbl">TEMPO</div>
                <div className="mem-stat-val" style={{ color: timerColor }}>{fmtTime(timeLeft)}</div>
              </div>
            </div>
          )}
        </header>

        {/* TIMER BAR */}
        {phase === "playing" && (
          <div className="mem-timer-wrap">
            <div className="mem-timer-fill" style={{ width: `${timerPct * 100}%`, background: timerColor }} />
          </div>
        )}

        {/* BODY */}
        <div className="mem-body">

          {/* COMBO banner */}
          {showCombo && combo >= 2 && (
            <div className="mem-combo">🔥 COMBO ×{combo}</div>
          )}

          {/* FLOAT texts */}
          <div className="mem-floats">
            {floats.map(f => (
              <div key={f.id} className="mem-float" style={{ color: f.color }}>{f.text}</div>
            ))}
          </div>

          {phase === "playing" && (
            <>
              {/* progress */}
              <div className="mem-progress">
                <div className="mem-progress-label">{matchedCount} / {totalPairs} PARES</div>
                <div className="mem-progress-bar">
                  <div className="mem-progress-fill" style={{ width: `${(matchedCount / totalPairs) * 100}%` }} />
                </div>
              </div>

              {/* grid */}
              <div className="mem-grid" style={{ gridTemplateColumns: `repeat(${cfg.cols}, 1fr)` }}>
                {cards.map((card, i) => (
                  <div
                    key={card.id}
                    className={`mem-card-wrap${card.flipped || card.matched ? " flipped" : ""}${card.matched ? " matched" : ""}${card.shaking ? " shaking" : ""}`}
                    onClick={() => flip(i)}
                  >
                    <div className="mem-card-inner">
                      <div className="mem-card-face mem-card-back">
                        <span className="mem-card-back-icon">❓</span>
                      </div>
                      <div className="mem-card-face mem-card-front">
                        {card.emoji}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── MENU ── */}
        {phase === "menu" && (
          <div className="mem-overlay">
            <div className="mem-card-ui">
              <div className="mem-ui-icon">🧠</div>
              <div className="mem-ui-title">MEMÓRIA</div>

              <div className="mem-diff-row">
                {(Object.keys(DIFFICULTIES) as Diff[]).map(d => (
                  <button
                    key={d}
                    className={`mem-diff-btn${diff === d ? " active" : ""}`}
                    onClick={() => setDiff(d)}
                  >
                    {DIFFICULTIES[d].label}
                    <br />
                    <span style={{ fontSize: 10, opacity: 0.6 }}>
                      {DIFFICULTIES[d].cols}×{DIFFICULTIES[d].rows}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mem-diff-info">
                <div className="mem-info-item">
                  <div className="mem-info-val">{cfg.pairs}</div>
                  <div className="mem-info-lbl">PARES</div>
                </div>
                <div className="mem-info-item">
                  <div className="mem-info-val">{fmtTime(cfg.time)}</div>
                  <div className="mem-info-lbl">TEMPO</div>
                </div>
                {bestScores[diff] > 0 && (
                  <div className="mem-info-item">
                    <div className="mem-info-val" style={{ color: "var(--gold)" }}>{bestScores[diff]}</div>
                    <div className="mem-info-lbl">RECORDE</div>
                  </div>
                )}
              </div>

              <button className="mem-play-btn" onClick={() => startGame(diff)}>JOGAR</button>
            </div>
          </div>
        )}

        {/* ── WIN ── */}
        {phase === "win" && (
          <div className="mem-overlay">
            <div className="mem-card-ui">
              <div className="mem-ui-icon win">🏆</div>
              <div className="mem-ui-title">VITÓRIA!</div>
              <div className="mem-ui-score">{score}</div>
              <div className="mem-ui-sub">
                {moves} jogadas · Combo máx ×{maxCombo}
                {bestScores[diff] > 0 && <><br /><span className="mem-ui-best">🥇 Recorde: {bestScores[diff]}</span></>}
              </div>
              <div className="mem-diff-row">
                {(Object.keys(DIFFICULTIES) as Diff[]).map(d => (
                  <button
                    key={d}
                    className={`mem-diff-btn${diff === d ? " active" : ""}`}
                    onClick={() => setDiff(d)}
                  >
                    {DIFFICULTIES[d].label}
                  </button>
                ))}
              </div>
              <button className="mem-play-btn green" onClick={() => startGame(diff)}>↺ JOGAR NOVAMENTE</button>
            </div>
          </div>
        )}

        {/* ── LOSE ── */}
        {phase === "lose" && (
          <div className="mem-overlay">
            <div className="mem-card-ui">
              <div className="mem-ui-icon">⏰</div>
              <div className="mem-ui-title">TEMPO!</div>
              <div className="mem-ui-score" style={{ fontSize: 40, color: "#ef4444" }}>{matchedCount}/{totalPairs}</div>
              <div className="mem-ui-sub">
                {moves} jogadas · {matchedCount} pares encontrados
              </div>
              <div className="mem-diff-row">
                {(Object.keys(DIFFICULTIES) as Diff[]).map(d => (
                  <button
                    key={d}
                    className={`mem-diff-btn${diff === d ? " active" : ""}`}
                    onClick={() => setDiff(d)}
                  >
                    {DIFFICULTIES[d].label}
                  </button>
                ))}
              </div>
              <button className="mem-play-btn" onClick={() => startGame(diff)}>↺ TENTAR DE NOVO</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
import { useEffect, useRef, useState } from "react";
type Props = { onBack: () => void };

const ROUNDS = 3; const ROUND_TIME = 30;

export default function Boxing({ onBack }: Props) {
  const [hps, setHps] = useState({ p1: 100, p2: 100 });
  const [round, setRound] = useState(1);
  const [timer, setTimer] = useState(ROUND_TIME);
  const [rodando, setRodando] = useState(false);
  const [vencedor, setVencedor] = useState("");
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [flash, setFlash] = useState("");
  const hpsRef = useRef({ p1: 100, p2: 100 });
  const cooldown = useRef({ p1: 0, p2: 0 });
  const intervalRef = useRef(0);

  function iniciar() {
    hpsRef.current = { p1: 100, p2: 100 };
    setHps({ p1: 100, p2: 100 }); setRound(1); setTimer(ROUND_TIME);
    setVencedor(""); setScores({ p1: 0, p2: 0 }); setFlash(""); setRodando(true);
    cooldown.current = { p1: 0, p2: 0 };
  }

  useEffect(() => {
    if (!rodando) return;
    intervalRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setRound(r => {
            if (r >= ROUNDS) {
              setVencedor(hpsRef.current.p1 > hpsRef.current.p2 ? "Jogador 1" : hpsRef.current.p2 > hpsRef.current.p1 ? "Jogador 2" : "Empate");
              setRodando(false); clearInterval(intervalRef.current);
            } else {
              hpsRef.current = { p1: 100, p2: 100 };
              setHps({ p1: 100, p2: 100 });
            }
            return r + 1;
          });
          return ROUND_TIME;
        }
        return t - 1;
      });
      if (cooldown.current.p1 > 0) cooldown.current.p1--;
      if (cooldown.current.p2 > 0) cooldown.current.p2--;
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [rodando]);

  function atacar(atacante: "p1"|"p2") {
    if (!rodando || cooldown.current[atacante] > 0) return;
    const defensor: "p1"|"p2" = atacante === "p1" ? "p2" : "p1";
    const dano = Math.floor(Math.random() * 15) + 8;
    cooldown.current[atacante] = 2;
    hpsRef.current[defensor] = Math.max(0, hpsRef.current[defensor] - dano);
    setHps({ ...hpsRef.current });
    setFlash(defensor);
    setTimeout(() => setFlash(""), 200);
    setScores(s => ({ ...s, [atacante]: s[atacante] + dano }));
    if (hpsRef.current[defensor] <= 0) {
      setVencedor(`Jogador ${atacante === "p1" ? 1 : 2} (KO!)`);
      setRodando(false); clearInterval(intervalRef.current);
    }
  }

  return (
    <>
      <style>{`
        .game-screen{width:100%;height:100dvh;display:flex;flex-direction:column;background:#111b21}
        .game-header{display:flex;align-items:center;gap:16px;padding:14px 16px;background:#202c33}
        .back-btn{background:none;border:none;color:#00a884;font-size:22px;cursor:pointer}
        .game-title{color:#e9edef;font-size:18px;font-weight:700;flex:1}
        .game-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:16px}
        .round-info{color:#8696a0;font-size:14px;text-align:center}
        .round-num{color:#e9edef;font-size:20px;font-weight:700}
        .timer{font-size:48px;font-weight:800;color:#ffd700;font-variant-numeric:tabular-nums}
        .fighters{display:flex;align-items:flex-end;justify-content:center;gap:16px;width:100%}
        .fighter{display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;max-width:140px}
        .fighter-name{font-size:13px;color:#8696a0}
        .fighter-emoji{font-size:56px;transition:transform 0.1s}
        .fighter-emoji.hit{transform:translateX(10px)}
        .hp-bar-wrap{width:100%}
        .hp-bar{height:16px;border-radius:8px;background:#1f2c34;overflow:hidden}
        .hp-fill{height:100%;border-radius:8px;transition:width 0.3s}
        .hp-val{font-size:12px;color:#8696a0;text-align:center;margin-top:2px}
        .vs{font-size:24px;font-weight:800;color:#374045;padding-bottom:20px}
        .punch-btn{border:none;border-radius:20px;font-size:18px;font-weight:700;padding:16px 0;cursor:pointer;width:100%;max-width:140px;transition:transform 0.1s;user-select:none}
        .punch-btn:active{transform:scale(0.92)}
        .punch-btns{display:flex;gap:16px;width:100%;justify-content:center}
        .scores-row{display:flex;gap:32px}
        .score-item{text-align:center;color:#8696a0;font-size:12px}
        .score-item span{display:block;font-size:18px;font-weight:700;color:#e9edef}
        .venc{font-size:22px;font-weight:700;text-align:center}
        .restart-btn{background:#00a884;border:none;color:#fff;padding:12px 32px;border-radius:24px;font-size:16px;cursor:pointer}
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">🥊 Boxe</span>
        </div>
        <div className="game-body">
          {vencedor ? <>
            <div className="venc" style={{color:"#ffd700"}}>🏆 {vencedor} venceu!</div>
            <div className="scores-row">
              <div className="score-item"><span style={{color:"#00a884"}}>{scores.p1}</span>J1 dano total</div>
              <div className="score-item"><span style={{color:"#ef4444"}}>{scores.p2}</span>J2 dano total</div>
            </div>
            <button className="restart-btn" onClick={iniciar}>Jogar de novo</button>
          </> : <>
            <div className="round-info">
              <div className="round-num">Round {Math.min(round, ROUNDS)} / {ROUNDS}</div>
            </div>
            <div className="timer">{String(timer).padStart(2,"0")}s</div>
            <div className="fighters">
              <div className="fighter">
                <div className="fighter-name">Jogador 1</div>
                <div className={`fighter-emoji ${flash==="p1"?"hit":""}`}>🥊</div>
                <div className="hp-bar-wrap">
                  <div className="hp-bar"><div className="hp-fill" style={{width:`${hps.p1}%`,background:"#00a884"}} /></div>
                  <div className="hp-val">{hps.p1} HP</div>
                </div>
              </div>
              <div className="vs">VS</div>
              <div className="fighter">
                <div className="fighter-name">Jogador 2</div>
                <div className={`fighter-emoji ${flash==="p2"?"hit":""}`}>🥊</div>
                <div className="hp-bar-wrap">
                  <div className="hp-bar"><div className="hp-fill" style={{width:`${hps.p2}%`,background:"#ef4444"}} /></div>
                  <div className="hp-val">{hps.p2} HP</div>
                </div>
              </div>
            </div>
            <div className="punch-btns">
              <button className="punch-btn" style={{background:"#00a884",color:"#fff"}}
                onClick={() => atacar("p1")}
                onTouchStart={e=>{e.preventDefault();atacar("p1")}}
              >🥊 J1 Socar!</button>
              <button className="punch-btn" style={{background:"#ef4444",color:"#fff"}}
                onClick={() => atacar("p2")}
                onTouchStart={e=>{e.preventDefault();atacar("p2")}}
              >🥊 J2 Socar!</button>
            </div>
            {!rodando && !vencedor && <button className="restart-btn" onClick={iniciar}>Iniciar</button>}
          </>}
        </div>
      </div>
    </>
  );
}
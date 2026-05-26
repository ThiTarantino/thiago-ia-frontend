import { useState } from "react";
type Props = { onBack: () => void };

function pinLayout() { return Array(10).fill(true); }

export default function Bowling({ onBack }: Props) {
  const [jogador, setJogador] = useState(1);
  const [scores, setScores] = useState([0, 0]);
  const [pins, setPins] = useState(pinLayout());
  const [lancamento, setLancamento] = useState(1);
  const [power, setPower] = useState(50);
  const [angle, setAngle] = useState(50);
  const [msg, setMsg] = useState("");
  const [fim, setFim] = useState(false);

  function jogar() {
    const acerto = Math.floor((power/100) * (1-Math.abs(angle-50)/100) * 10 * Math.random() + Math.random()*2);
    const novos = [...pins];
    let count = 0;
    novos.forEach((p,i) => { if (p && Math.random()*100 < acerto*10) { novos[i]=false; count++; } });
    setPins(novos);
    const newScores = [...scores];
    newScores[jogador-1] += count;
    setScores(newScores);

    if (lancamento === 1) {
      if (count === 10) { setMsg(`🎳 Strike! +10 pts`); proximoJogador(newScores); }
      else { setMsg(`${count} pinos derrubados!`); setLancamento(2); }
    } else {
      setMsg(`${count} pinos derrubados!`);
      proximoJogador(newScores);
    }
  }

  function proximoJogador(sc: number[]) {
    if (jogador === 1) { setJogador(2); setPins(pinLayout()); setLancamento(1); setPower(50); setAngle(50); }
    else {
      const rodadas = sc[0] > 0 || sc[1] > 0;
      if (rodadas) setFim(true);
      else { setJogador(1); setPins(pinLayout()); setLancamento(1); }
    }
  }

  function reiniciar() { setJogador(1); setScores([0,0]); setPins(pinLayout()); setLancamento(1); setPower(50); setAngle(50); setMsg(""); setFim(false); }

  const PIN_POS = [[4],[3,5],[2,4,6],[1,3,5,7]].reverse();

  return (
    <>
      <style>{`
        .game-screen{width:100%;height:100dvh;display:flex;flex-direction:column;background:#111b21}
        .game-header{display:flex;align-items:center;gap:16px;padding:14px 16px;background:#202c33}
        .back-btn{background:none;border:none;color:#00a884;font-size:22px;cursor:pointer}
        .game-title{color:#e9edef;font-size:18px;font-weight:700;flex:1}
        .game-body{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:16px;overflow-y:auto}
        .scores{display:flex;gap:32px}
        .score-box{text-align:center;padding:12px 24px;border-radius:12px;background:#202c33}
        .score-box.ativo{border:2px solid #00a884}
        .score-name{color:#8696a0;font-size:12px}
        .score-num{color:#e9edef;font-size:28px;font-weight:800}
        .pinos{display:flex;flex-direction:column;align-items:center;gap:8px;background:#0b141a;padding:20px;border-radius:12px;width:180px}
        .pino-row{display:flex;gap:8px}
        .pino{width:28px;height:28px;border-radius:50%;border:2px solid #374045;display:flex;align-items:center;justify-content:center;font-size:14px}
        .pino.em-pe{background:#e9edef}
        .pino.caido{background:transparent}
        .slider-group{width:100%;max-width:300px}
        .slider-label{color:#8696a0;font-size:13px;margin-bottom:4px;display:block}
        .slider{width:100%;accent-color:#00a884}
        .jogar-btn{background:#00a884;border:none;color:#fff;padding:14px 40px;border-radius:24px;font-size:18px;cursor:pointer}
        .msg{color:#e9edef;font-size:16px;font-weight:600;text-align:center}
        .restart-btn{background:#00a884;border:none;color:#fff;padding:12px 32px;border-radius:24px;font-size:16px;cursor:pointer}
        .fim-msg{font-size:22px;font-weight:700;text-align:center}
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">🎳 Boliche</span>
        </div>
        <div className="game-body">
          <div className="scores">
            <div className={`score-box ${jogador===1?"ativo":""}`}><div className="score-name">Jogador 1</div><div className="score-num">{scores[0]}</div></div>
            <div className={`score-box ${jogador===2?"ativo":""}`}><div className="score-name">Jogador 2</div><div className="score-num">{scores[1]}</div></div>
          </div>
          {fim ? <>
            <div className="fim-msg" style={{color: scores[0]>scores[1]?"#00a884":scores[1]>scores[0]?"#ef4444":"#f59e0b"}}>
              {scores[0]>scores[1]?"🏆 Jogador 1 venceu!":scores[1]>scores[0]?"🏆 Jogador 2 venceu!":"😅 Empate!"}
            </div>
            <div className="msg">{scores[0]} x {scores[1]}</div>
            <button className="restart-btn" onClick={reiniciar}>Jogar de novo</button>
          </> : <>
            <div style={{color:"#00a884",fontWeight:700}}>Jogador {jogador} — Lançamento {lancamento}</div>
            <div className="pinos">
              {[3,2,1,0].map(row => (
                <div key={row} className="pino-row">
                  {[0,1,2,3].filter((_,i) => i <= row).map((_, i) => {
                    const idx = [0,1,2,3,4,5,6,7,8,9][[0,1,3,6][row]+i];
                    return <div key={i} className={`pino ${pins[idx]?"em-pe":"caido"}`}>{pins[idx]?"🎳":""}</div>;
                  })}
                </div>
              ))}
            </div>
            {msg && <div className="msg">{msg}</div>}
            <div className="slider-group"><label className="slider-label">Força: {power}%</label><input type="range" className="slider" min={10} max={100} value={power} onChange={e=>setPower(+e.target.value)} /></div>
            <div className="slider-group"><label className="slider-label">Direção: {angle < 40?"← Esquerda": angle > 60?"Direita →":"Centro"}</label><input type="range" className="slider" min={0} max={100} value={angle} onChange={e=>setAngle(+e.target.value)} /></div>
            <button className="jogar-btn" onClick={jogar}>🎳 Lançar!</button>
          </>}
        </div>
      </div>
    </>
  );
}
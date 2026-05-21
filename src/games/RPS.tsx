import { useState } from "react";

type Props = { onBack: () => void };
const OPCOES = ["✊","✋","✌️"];

export default function RPS({ onBack }: Props) {
  const [p1, setP1] = useState<string | null>(null);
  const [p2, setP2] = useState<string | null>(null);
  const [fase, setFase] = useState<1 | 2 | 3>(1);
  const [resultado, setResultado] = useState("");

  function escolher(opcao: string) {
    if (fase === 1) { setP1(opcao); setFase(2); }
    else if (fase === 2) {
      setP2(opcao);
      const res = calcular(p1!, opcao);
      setResultado(res);
      setFase(3);
    }
  }

  function calcular(a: string, b: string) {
    if (a === b) return "😅 Empate!";
    if ((a === "✊" && b === "✌️") || (a === "✋" && b === "✊") || (a === "✌️" && b === "✋")) return "🏆 Jogador 1 venceu!";
    return "🏆 Jogador 2 venceu!";
  }

  function reiniciar() { setP1(null); setP2(null); setFase(1); setResultado(""); }

  return (
    <>
      <style>{`
        .game-screen { width:100%; height:100dvh; display:flex; flex-direction:column; background:#111b21; }
        .game-header { display:flex; align-items:center; gap:16px; padding:14px 16px; background:#202c33; }
        .back-btn { background:none; border:none; color:#00a884; font-size:22px; cursor:pointer; }
        .game-title { color:#e9edef; font-size:18px; font-weight:700; }
        .game-body { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; padding:16px; }
        .rps-title { color:#e9edef; font-size:20px; font-weight:700; text-align:center; }
        .rps-sub { color:#8696a0; font-size:14px; text-align:center; }
        .rps-opts { display:flex; gap:16px; }
        .rps-btn { background:#202c33; border:2px solid #1f2c34; border-radius:16px; font-size:48px; padding:16px 20px; cursor:pointer; transition:all 0.15s; }
        .rps-btn:hover { border-color:#00a884; background:#2a3942; transform:scale(1.05); }
        .rps-result { font-size:52px; display:flex; gap:24px; }
        .rps-winner { color:#00a884; font-size:22px; font-weight:700; }
        .restart-btn { background:#00a884; border:none; color:#fff; padding:12px 32px; border-radius:24px; font-size:16px; cursor:pointer; }
        .hidden-choice { font-size:52px; filter:blur(12px); }
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">✂️ Pedra Papel Tesoura</span>
        </div>
        <div className="game-body">
          {fase === 1 && <>
            <div className="rps-title">Jogador 1</div>
            <div className="rps-sub">Escolha sem o outro ver!</div>
            <div className="rps-opts">{OPCOES.map(o => <button key={o} className="rps-btn" onClick={() => escolher(o)}>{o}</button>)}</div>
          </>}
          {fase === 2 && <>
            <div className="rps-title">Jogador 2</div>
            <div className="rps-sub">Jogador 1 já escolheu! Sua vez:</div>
            <div className="rps-opts">{OPCOES.map(o => <button key={o} className="rps-btn" onClick={() => escolher(o)}>{o}</button>)}</div>
          </>}
          {fase === 3 && <>
            <div className="rps-title">Resultado!</div>
            <div className="rps-result"><span>{p1}</span><span style={{color:"#8696a0",fontSize:"24px",alignSelf:"center"}}>vs</span><span>{p2}</span></div>
            <div className="rps-winner">{resultado}</div>
            <button className="restart-btn" onClick={reiniciar}>Jogar de novo</button>
          </>}
        </div>
      </div>
    </>
  );
}
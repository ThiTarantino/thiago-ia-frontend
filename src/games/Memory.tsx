import { useState, useEffect } from "react";

const EMOJIS = ["🍎","🍌","🍇","🍓","🍒","🥝","🍑","🍍"];
const CARDS = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e, virado: false, matched: false }));

type Props = { onBack: () => void };

export default function Memory({ onBack }: Props) {
  const [cards, setCards] = useState(CARDS);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [ganhou, setGanhou] = useState(false);

  useEffect(() => {
    if (selecionados.length === 2) {
      const [a, b] = selecionados;
      if (cards[a].emoji === cards[b].emoji) {
        setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, matched: true } : c));
      } else {
        setTimeout(() => setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, virado: false } : c)), 800);
      }
      setSelecionados([]);
      setMoves(m => m + 1);
    }
  }, [selecionados]);

  useEffect(() => {
    if (cards.every(c => c.matched)) setGanhou(true);
  }, [cards]);

  function clicar(idx: number) {
    if (selecionados.length === 2 || cards[idx].virado || cards[idx].matched) return;
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, virado: true } : c));
    setSelecionados(prev => [...prev, idx]);
  }

  function reiniciar() {
    setCards([...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5).map((e, i) => ({ id: i, emoji: e, virado: false, matched: false })));
    setSelecionados([]);
    setMoves(0);
    setGanhou(false);
  }

  return (
    <>
      <style>{`
        .game-screen { width:100%; height:100dvh; display:flex; flex-direction:column; background:#111b21; }
        .game-header { display:flex; align-items:center; gap:16px; padding:14px 16px; background:#202c33; }
        .back-btn { background:none; border:none; color:#00a884; font-size:22px; cursor:pointer; }
        .game-title { color:#e9edef; font-size:18px; font-weight:700; flex:1; }
        .game-score { color:#8696a0; font-size:14px; }
        .game-body { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:16px; gap:16px; }
        .memory-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; width:100%; max-width:340px; }
        .memory-card { aspect-ratio:1; background:#202c33; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:28px; cursor:pointer; border:2px solid #1f2c34; transition:all 0.2s; }
        .memory-card.virado { background:#005c4b; border-color:#00a884; }
        .memory-card.matched { background:#1a3a2a; border-color:#00a88466; opacity:0.6; }
        .win-msg { color:#00a884; font-size:22px; font-weight:700; text-align:center; }
        .restart-btn { background:#00a884; border:none; color:#fff; padding:12px 32px; border-radius:24px; font-size:16px; cursor:pointer; }
      `}</style>
      <div className="game-screen">
        <div className="game-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="game-title">🧠 Jogo da Memória</span>
          <span className="game-score">{moves} jogadas</span>
        </div>
        <div className="game-body">
          {ganhou ? (
            <>
              <div className="win-msg">🎉 Você ganhou em {moves} jogadas!</div>
              <button className="restart-btn" onClick={reiniciar}>Jogar de novo</button>
            </>
          ) : (
            <div className="memory-grid">
              {cards.map((card, i) => (
                <div key={card.id} className={`memory-card ${card.virado ? "virado" : ""} ${card.matched ? "matched" : ""}`} onClick={() => clicar(i)}>
                  {card.virado || card.matched ? card.emoji : ""}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
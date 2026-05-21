import { useState } from "react";
import Memory from "./games/Memory";
import Snake from "./games/Snake";
import Tetris from "./games/Tetris";
import AngryBirds from "./games/AngryBirds";
import TicTacToe from "./games/TicTacToe";
import RPS from "./games/RPS";
import Pong from "./games/Pong";

const JOGOS = [
  { id: "memory",    nome: "Jogo da Memória", emoji: "🧠", tipo: "1 jogador" },
  { id: "snake",     nome: "Snake",           emoji: "🐍", tipo: "1 jogador" },
  { id: "tetris",    nome: "Tetris",          emoji: "🟦", tipo: "1 jogador" },
  { id: "birds",     nome: "Angry Birds",     emoji: "🐦", tipo: "1 jogador" },
  { id: "tictactoe", nome: "Jogo da Velha",   emoji: "⭕", tipo: "2 jogadores" },
  { id: "rps",       nome: "Pedra Papel Tesoura", emoji: "✂️", tipo: "2 jogadores" },
  { id: "pong",      nome: "Pong",            emoji: "🏓", tipo: "2 jogadores" },
];

type Props = { onBack: () => void };

export default function GameHub({ onBack }: Props) {
  const [jogoAtivo, setJogoAtivo] = useState<string | null>(null);

  function renderJogo() {
    const voltar = () => setJogoAtivo(null);
    switch (jogoAtivo) {
      case "memory":    return <Memory onBack={voltar} />;
      case "snake":     return <Snake onBack={voltar} />;
      case "tetris":    return <Tetris onBack={voltar} />;
      case "birds":     return <AngryBirds onBack={voltar} />;
      case "tictactoe": return <TicTacToe onBack={voltar} />;
      case "rps":       return <RPS onBack={voltar} />;
      case "pong":      return <Pong onBack={voltar} />;
      default:          return null;
    }
  }

  if (jogoAtivo) return renderJogo();

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #111b21; }
        .hub { width: 100%; height: 100dvh; display: flex; flex-direction: column; background: #111b21; }
        .hub-header { display: flex; align-items: center; gap: 16px; padding: 14px 16px; background: #202c33; min-height: 56px; }
        .back-btn { background: none; border: none; color: #00a884; font-size: 22px; cursor: pointer; }
        .hub-title { color: #e9edef; font-size: 18px; font-weight: 700; }
        .hub-body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .section-label { color: #8696a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 8px 0 4px; }
        .game-card { background: #202c33; border-radius: 12px; padding: 18px 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: background 0.15s; }
        .game-card:active { background: #2a3942; }
        .game-emoji { font-size: 36px; }
        .game-info { flex: 1; }
        .game-nome { color: #e9edef; font-size: 16px; font-weight: 600; }
        .game-tipo { color: #8696a0; font-size: 13px; margin-top: 2px; }
        .game-arrow { color: #8696a0; font-size: 20px; }
      `}</style>
      <div className="hub">
        <div className="hub-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="hub-title">🎮 Jogos</span>
        </div>
        <div className="hub-body">
          <div className="section-label">1 Jogador</div>
          {JOGOS.filter(j => j.tipo === "1 jogador").map(j => (
            <div key={j.id} className="game-card" onClick={() => setJogoAtivo(j.id)}>
              <span className="game-emoji">{j.emoji}</span>
              <div className="game-info">
                <div className="game-nome">{j.nome}</div>
                <div className="game-tipo">{j.tipo}</div>
              </div>
              <span className="game-arrow">›</span>
            </div>
          ))}
          <div className="section-label">2 Jogadores</div>
          {JOGOS.filter(j => j.tipo === "2 jogadores").map(j => (
            <div key={j.id} className="game-card" onClick={() => setJogoAtivo(j.id)}>
              <span className="game-emoji">{j.emoji}</span>
              <div className="game-info">
                <div className="game-nome">{j.nome}</div>
                <div className="game-tipo">{j.tipo}</div>
              </div>
              <span className="game-arrow">›</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
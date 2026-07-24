import { useState } from "react";
import Memory from "./games/Memory";
import Snake from "./games/Snake";
import Tetris from "./games/Tetris";
import FlappyBird from "./games/AngryBirds";
import TicTacToe from "./games/TicTacToe";
import RPS from "./games/RPS";
import Pong from "./games/Pong";
import Archery from "./games/Archery.tsx";
import Surf from "./games/Surf.tsx";
import Minesweeper from "./games/Minesweeper.tsx";
import Game2048 from "./games/Game2048.tsx";
import Bowling from "./games/Bowling.tsx";
import BattleShip from "./games/BattleShip";
import BlockBreaker from "./games/Connect_4.tsx";
import SwordDuel from "./games/SwordDuel.tsx";
import Boxing from "./games/Boxing.tsx";

const JOGOS = [
  { id: "memory",     nome: "Memória",        emoji: "🧠", tipo: "solo" },
  { id: "snake",      nome: "Snake",           emoji: "🐍", tipo: "solo" },
  { id: "tetris",     nome: "Tetris",          emoji: "🟦", tipo: "solo" },
  { id: "birds",      nome: "RPG",     emoji: "🧟‍♂️🤺", tipo: "solo" },
  { id: "archery",    nome: "Space",   emoji: "🚀", tipo: "solo" },
  { id: "surf",       nome: "Surf",            emoji: "🌊", tipo: "solo" },
  { id: "mines",      nome: "Defense",    emoji: "🏰", tipo: "solo" },
  { id: "2048",       nome: "Wester Sort",            emoji: "🧪", tipo: "solo" },
  { id: "tictactoe",  nome: "Jogo da Velha",   emoji: "⭕", tipo: "duo" },
  { id: "rps",        nome: "Pedra Papel...",  emoji: "✂️", tipo: "duo" },
  { id: "pong",       nome: "Ligue os Pontos",   emoji: "🖇", tipo: "duo" },
  { id: "bowling",    nome: "Boliche",         emoji: "🎳", tipo: "duo" },
  { id: "battleship", nome: "Batalha Naval",   emoji: "🚢", tipo: "duo" },
  { id: "blocks",     nome: "Connect 4",   emoji: "💿", tipo: "duo" },
  { id: "sword",      nome: "Forca",   emoji: "⛓", tipo: "duo" },
  { id: "boxing",     nome: "Tank",            emoji: "🚔", tipo: "duo" },
];

type Props = { onBack: () => void };

export default function GameHub({ onBack }: Props) {
  const [jogoAtivo, setJogoAtivo] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "solo" | "duo">("todos");

  function renderJogo() {
    const voltar = () => setJogoAtivo(null);
    switch (jogoAtivo) {
      case "memory":     return <Memory onBack={voltar} />;
      case "snake":      return <Snake onBack={voltar} />;
      case "tetris":     return <Tetris onBack={voltar} />;
      case "birds":      return <FlappyBird onBack={voltar} />;
      case "archery":    return <Archery onBack={voltar} />;
      case "surf":       return <Surf onBack={voltar} />;
      case "mines":      return <Minesweeper onBack={voltar} />;
      case "2048":       return <Game2048 onBack={voltar} />;
      case "tictactoe":  return <TicTacToe onBack={voltar} />;
      case "rps":        return <RPS onBack={voltar} />;
      case "pong":       return <Pong onBack={voltar} />;
      case "bowling":    return <Bowling onBack={voltar} />;
      case "battleship": return <BattleShip onBack={voltar} />;
      case "blocks":     return <BlockBreaker onBack={voltar} />;
      case "sword":      return <SwordDuel onBack={voltar} />;
      case "boxing":     return <Boxing onBack={voltar} />;
      default:           return null;
    }
  }

  if (jogoAtivo) return renderJogo();

  const jogosFiltrados = JOGOS.filter(j =>
    filtro === "todos" ? true : j.tipo === filtro
  );
  const solo = jogosFiltrados.filter(j => j.tipo === "solo");
  const duo  = jogosFiltrados.filter(j => j.tipo === "duo");

  return (
    <>
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }

        /* ─── SHELL ───────────────────────────────────────────────── */
        .gh-root {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: #0b141a;
          font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
          overflow: hidden;
          -webkit-text-size-adjust: 100%;
        }

        /* ─── HEADER ──────────────────────────────────────────────── */
        .gh-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 8px 0 4px;
          background: #1f2c34;
          height: 58px;
          min-height: 58px;
          flex-shrink: 0;
          box-shadow: 0 1px 0 rgba(0,0,0,.35);
          z-index: 10;
        }
        .gh-back {
          background: none;
          border: none;
          color: #aebac1;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .15s, color .15s;
          flex-shrink: 0;
          -webkit-tap-highlight-color: transparent;
        }
        .gh-back:hover  { background: rgba(255,255,255,.07); color: #e9edef; }
        .gh-back:active { background: rgba(255,255,255,.12); }
        .gh-back svg { display: block; }

        .gh-header-info { flex: 1; min-width: 0; }
        .gh-title {
          color: #e9edef;
          font-size: 17px;
          font-weight: 600;
          letter-spacing: -0.1px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .gh-subtitle {
          color: #8696a0;
          font-size: 12.5px;
          display: block;
          margin-top: 1px;
        }

        /* ─── FILTROS ─────────────────────────────────────────────── */
        .gh-filters {
          display: flex;
          gap: 8px;
          padding: 10px 14px;
          background: #111b21;
          border-bottom: 1px solid rgba(255,255,255,.05);
          flex-shrink: 0;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .gh-filters::-webkit-scrollbar { display: none; }

        .gh-filter-btn {
          background: #202c33;
          border: 1.5px solid transparent;
          color: #8696a0;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
          white-space: nowrap;
          transition: all .15s;
          -webkit-tap-highlight-color: transparent;
          flex-shrink: 0;
        }
        .gh-filter-btn:hover { color: #e9edef; background: #2a3942; }
        .gh-filter-btn.ativo {
          background: #00a88420;
          border-color: #00a884;
          color: #00a884;
        }

        /* ─── BODY ────────────────────────────────────────────────── */
        .gh-body {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 12px 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          -webkit-overflow-scrolling: touch;
        }
        .gh-body::-webkit-scrollbar { width: 4px; }
        .gh-body::-webkit-scrollbar-track { background: transparent; }
        .gh-body::-webkit-scrollbar-thumb { background: #2a3942; border-radius: 2px; }

        /* ─── SECTION LABEL ───────────────────────────────────────── */
        .gh-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 2px 8px;
        }
        .gh-section-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,.07);
        }
        .gh-section-label {
          color: #8696a0;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          white-space: nowrap;
        }
        .gh-section-badge {
          background: #202c33;
          color: #8696a0;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 10px;
        }

        /* ─── GRID ────────────────────────────────────────────────── */
        .gh-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        /* ─── CARD ────────────────────────────────────────────────── */
        .gh-card {
          background: #202c33;
          border-radius: 14px;
          padding: 14px 8px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: background .15s, border-color .15s, transform .1s;
          -webkit-tap-highlight-color: transparent;
          text-align: center;
          aspect-ratio: 1 / 1;
          position: relative;
          overflow: hidden;
        }
        .gh-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(255,255,255,.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .gh-card:hover {
          background: #2a3942;
          border-color: rgba(0,168,132,.3);
          transform: scale(1.03);
        }
        .gh-card:active {
          background: #2d4150;
          transform: scale(0.97);
          border-color: #00a884;
        }

        .gh-card-emoji {
          font-size: 26px;
          line-height: 1;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,.4));
        }
        .gh-card-nome {
          color: #e9edef;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.25;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          width: 100%;
        }

        /* ─── EMPTY STATE ─────────────────────────────────────────── */
        .gh-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 48px 24px;
          color: #8696a0;
          font-size: 14px;
          text-align: center;
        }
        .gh-empty-icon { font-size: 40px; opacity: .5; }

        /* ─── RESPONSIVO ──────────────────────────────────────────── */

        /* Telas pequenas — 3 colunas */
        @media (max-width: 360px) {
          .gh-grid { grid-template-columns: repeat(3, 1fr); gap: 7px; }
          .gh-card  { border-radius: 12px; padding: 12px 6px 10px; }
          .gh-card-emoji { font-size: 22px; }
          .gh-card-nome  { font-size: 10px; }
          .gh-title { font-size: 15px; }
        }

        /* Telas médias 361–480px — 4 colunas (padrão) */

        /* Tablets (≥ 600px) — 5 colunas */
        @media (min-width: 600px) {
          .gh-grid { grid-template-columns: repeat(5, 1fr); gap: 10px; }
          .gh-card-emoji { font-size: 28px; }
          .gh-card-nome  { font-size: 12px; }
        }

        /* Desktop (≥ 900px) — preview mobile centralizado */
        @media (min-width: 900px) {
          .gh-root {
            position: relative;
            width: 100%;
            height: 100dvh;
          }
          .gh-grid { grid-template-columns: repeat(4, 1fr); }
        }

        @keyframes ghIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .gh-card { animation: ghIn .18s ease both; }
        ${JOGOS.map((_, i) => `.gh-card:nth-child(${i+1}) { animation-delay: ${i * 18}ms; }`).join('\n')}
      `}</style>

      <div className="gh-root">

        {/* HEADER */}
        <header className="gh-header">
          <button className="gh-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="gh-header-info">
            <span className="gh-title">🎮 Jogos</span>
            <span className="gh-subtitle">{JOGOS.length} jogos disponíveis</span>
          </div>
        </header>

        {/* FILTROS */}
        <div className="gh-filters">
          {(["todos", "solo", "duo"] as const).map(f => (
            <button
              key={f}
              className={`gh-filter-btn${filtro === f ? " ativo" : ""}`}
              onClick={() => setFiltro(f)}
            >
              {f === "todos" ? "🎯 Todos" : f === "solo" ? "👤 1 Jogador" : "👥 2 Jogadores"}
            </button>
          ))}
        </div>

        {/* BODY */}
        <div className="gh-body">

          {/* Seção 1 Jogador */}
          {solo.length > 0 && (filtro === "todos" || filtro === "solo") && (
            <>
              <div className="gh-section">
                <div className="gh-section-line" />
                <span className="gh-section-label">👤 1 Jogador</span>
                <span className="gh-section-badge">{solo.length}</span>
                <div className="gh-section-line" />
              </div>
              <div className="gh-grid">
                {solo.map(j => (
                  <div key={j.id} className="gh-card" onClick={() => setJogoAtivo(j.id)}>
                    <span className="gh-card-emoji">{j.emoji}</span>
                    <span className="gh-card-nome">{j.nome}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Seção 2 Jogadores */}
          {duo.length > 0 && (filtro === "todos" || filtro === "duo") && (
            <>
              <div className="gh-section">
                <div className="gh-section-line" />
                <span className="gh-section-label">👥 2 Jogadores</span>
                <span className="gh-section-badge">{duo.length}</span>
                <div className="gh-section-line" />
              </div>
              <div className="gh-grid">
                {duo.map(j => (
                  <div key={j.id} className="gh-card" onClick={() => setJogoAtivo(j.id)}>
                    <span className="gh-card-emoji">{j.emoji}</span>
                    <span className="gh-card-nome">{j.nome}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {solo.length === 0 && duo.length === 0 && (
            <div className="gh-empty">
              <span className="gh-empty-icon">🎮</span>
              Nenhum jogo encontrado
            </div>
          )}

        </div>
      </div>
    </>
  );
}
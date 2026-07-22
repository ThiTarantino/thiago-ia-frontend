import { useState } from "react";

type Props = {
  onClose: () => void;
};

export default function LocalizacaoPainel({ onClose }: Props) {
  const [isExiting, setIsExiting] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const dispararPaneSistema = () => {
    if (isGlitching) return;
    setIsGlitching(true);
    
    // Duração do efeito mais intenso (2 segundos)
    setTimeout(() => {
      setIsGlitching(false);
    }, 2000);
  };

  return (
    <div className={`wa-real-loc-wrapper ${isExiting ? "exit" : ""}`}>
      {/* Header oficial estilo WhatsApp escuro */}
      <div className="wa-real-header">
        <button className="wa-real-back-btn" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <h2>Amor ❤️</h2>
      </div>

      {/* Área do Mapa */}
      <div className={`wa-real-map-container ${isGlitching ? "glitch-active" : ""}`}>
        
        {/* Renderização das ruas */}
        <div className="wa-real-map-canvas" />

        {/* Camada de Linhas e Textos - AGORA TOTALMENTE FICTÍCIOS E SEGUROS */}
        <div className="wa-map-labels-overlay">
          <div className="rua-principal f-av-ipiranga">Av. das Nações</div>
          <div className="rua f-r-albion">R. das Acácias</div>
          <div className="rua f-r-saldanha">Av. Central</div>
          <div className="rua f-r-primeiro-marco">R. Sete de Setembro</div>
          <div className="rua f-r-vinte-seis">R. dos Pinheiros</div>
          <div className="rua f-r-nove-junho">R. da Matriz</div>
          <div className="rua f-r-clemente">R. Belo Horizonte</div>
          <div className="rua f-r-dona-firmina">R. Primavera</div>

          {/* Pontos de Interesse (POIs) Fictícios */}
          <div className="poi f-carboni">
            <span className="poi-icon icon-cart">🛒</span>
            <span className="poi-text">Mercado Express</span>
          </div>
        </div>

        {/* Botão flutuante de GPS */}
        <div className="wa-map-gps-btn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="7"></circle>
            <circle cx="12" cy="12" r="1" fill="currentColor"></circle>
            <line x1="12" y1="1" x2="12" y2="4"></line>
            <line x1="12" y1="20" x2="12" y2="23"></line>
            <line x1="1" y1="12" x2="4" y2="12"></line>
            <line x1="20" y1="12" x2="23" y2="12"></line>
          </svg>
        </div>

        {/* Avatar Você */}
        <div className="wa-real-avatar av-voce">
          <img src="/imagens/foto1.jpg" alt="Você" onError={(e) => e.currentTarget.src="https://via.placeholder.com/50"} />
        </div>

        {/* Avatar Amor */}
        <div className="wa-real-avatar av-amor">
          <img src="/imagens/foto_isabela.jpg" alt="Amor" onError={(e) => e.currentTarget.src="https://via.placeholder.com/50"} />
        </div>

        {/* EFEITOS MACABROS DA PANE DE SISTEMA */}
        {isGlitching && (
          <>
            {/* Camada que corta a tela com estática e blocos pretos */}
            <div className="macabre-static-overlay" />
            
            {/* Palavra solta e desalinhada bem no centro do mapa */}
            <div className="macabre-word-center" data-text="sinclair_crown">
                @sinclair_crown
            </div>

          </>
        )}
      </div>

      {/* Lista Inferior Estilo WhatsApp */}
      <div className="wa-real-list-container">
        
        {/* 1. Item do Usuário Atual (Você) */}
        <div className="wa-real-row">
          <div className="wa-row-avatar">
            <img src="/imagens/foto_isabela.jpg" alt="Você" onError={(e) => e.currentTarget.src="https://via.placeholder.com/40"} />
          </div>
          <div className="wa-row-info">
            <div className="wa-row-title-line">
              <span className="title-main">Você</span>
              <span className="action-red" onClick={(e) => { e.stopPropagation(); handleClose(); }}>
                Parar de compartilhar
              </span>
            </div>
            <span className="sub-text">1 h 0 min restante</span>
          </div>
        </div>

        {/* 2. Item do Contato (Amor) */}
        <div className="wa-real-row">
          <div className="wa-row-avatar">
            <img src="/imagens/foto1.jpg" alt="Amor" onError={(e) => e.currentTarget.src="https://via.placeholder.com/40"} />
          </div>
          <div className="wa-row-info">
            <div className="wa-row-title-line">
              <span className="title-main">Amor ❤️</span>
            </div>
            <span className="sub-text">Atualizada agora mesmo</span>
          </div>
        </div>

        {/* 3. Item Oculto que Dispara o Enigma */}
        <div className="wa-real-row clickable-glitch-row" onClick={dispararPaneSistema}>
          <div className="wa-row-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="wa-row-info">
            <div className="wa-row-title-line">
              <span className="title-main">Locais comerciais próximos</span>
            </div>
            <span className="sub-text">Buscar estabelecimentos</span>
          </div>
        </div>

      </div>

      <style>{`
        .wa-real-loc-wrapper {
          position: fixed;
          inset: 0;
          background: #0b141a;
          z-index: 100;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
          animation: slideUp 0.2s ease-out forwards;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .wa-real-loc-wrapper.exit {
          animation: slideDown 0.2s ease-in forwards;
        }

        @keyframes slideDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }

        /* --- HEADER --- */
        .wa-real-header {
          height: 60px;
          background: #111b21;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 18px;
          flex-shrink: 0;
        }

        .wa-real-back-btn {
          background: none;
          border: none;
          color: #e9edef;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .wa-real-header h2 {
          color: #e9edef;
          font-size: 18px;
          font-weight: 500;
          margin: 0;
        }

        /* --- CONTAINER DO MAPA (AZUL MARINHO REAL DO SEU PRINT) --- */
        .wa-real-map-container {
          height: 62%;
          position: relative;
          background: #1c2431;
          overflow: hidden;
          transition: filter 0.1s;
        }

        .wa-real-map-canvas {
          position: absolute;
          inset: 0;
          background-image: url('https://b.basemaps.cartocdn.com/dark_all/14/4918/6071.png');
          background-size: cover;
          background-position: center;
          filter: hue-rotate(15deg) brightness(0.85) contrast(1.1) saturate(1.2);
          opacity: 0.25;
        }

        /* --- TEXTOS E RUAS --- */
        .wa-map-labels-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .rua {
          position: absolute;
          color: #607080;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
        }

        .rua-principal {
          position: absolute;
          color: #cca570;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .f-av-ipiranga { top: 15%; left: 35%; }
        .f-r-albion { top: 19%; left: 42%; transform: rotate(85deg); font-size: 10px; }
        .f-r-saldanha { top: 43%; left: 38%; transform: rotate(-8deg); }
        .f-r-primeiro-marco { top: 56%; left: 10%; transform: rotate(-5deg); }
        .f-r-vinte-seis { top: 66%; left: 12%; transform: rotate(-6deg); font-size: 10px; }
        .f-r-nove-junho { top: 68%; left: 66%; transform: rotate(82deg); }
        .f-r-clemente { top: 74%; left: 42%; transform: rotate(-8deg); }
        .f-r-dona-firmina { top: 72%; left: 8%; transform: rotate(80deg); font-size: 10px; }

        .poi {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        
        .poi-text { font-size: 11px; font-weight: 500; }
        .poi-icon {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: white;
          font-weight: bold;
        }

        .icon-cart { background: #1e88e5; font-size: 10px; }

        .f-saude { top: 25%; left: 48%; color: #cc785c; }
        .f-carrefour { top: 31%; left: 8%; color: #cc785c; flex-direction: row-reverse; }
        .f-carboni { top: 34%; left: 32%; color: #cc785c; flex-direction: row-reverse; }

        .wa-map-gps-btn {
          position: absolute;
          top: 105px;
          right: 14px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #ffffff;
          color: #111b21;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          z-index: 5;
        }

        /* AVATARES DO MAPA */
        .wa-real-avatar {
          position: absolute;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #111b21;
          padding: 2px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          transform: translate(-50%, -50%);
          z-index: 4;
        }
        .wa-real-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }
        .av-voce { top: 21%; left: 16%; border: 2px solid #00a884; }
        .av-amor { top: 62%; left: 83%; border: 2px solid #054638; }

        /* --- LISTA INFERIOR --- */
        .wa-real-list-container {
          flex: 1;
          background: #0b141a;
          display: flex;
          flex-direction: column;
        }

        .wa-real-row {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          gap: 14px;
          border-bottom: 1px solid #1f2c34;
        }

        .clickable-glitch-row { cursor: pointer; }
        .clickable-glitch-row:active { background: #1a252c; }

        .wa-row-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        .wa-row-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .wa-row-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #232d36;
          color: #8696a0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .wa-row-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .wa-row-title-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .title-main { color: #e9edef; font-size: 16px; }
        .action-red { color: #f15c6d; font-size: 14px; cursor: pointer; }
        .sub-text { color: #8696a0; font-size: 13px; }

        /* =======================================================
           EFEITO DE PANE SISTÊMICA AVANÇADO (MACABRO)
           ======================================================= */
        
        /* Força distorções rápidas de posição no container do mapa */
        .glitch-active {
          animation: mapDeform 0.28s infinite;
        }

        @keyframes mapDeform {
          0% { filter: contrast(1) brightness(1); }
          20% { transform: skewX(-3deg) scale(1.01); filter: contrast(1.5) hue-rotate(180deg); }
          40% { transform: skewX(4deg) translateY(-2px); }
          60% { filter: brightness(0.4) invert(0.1); }
          80% { transform: translateX(3px) skewY(1deg); }
          100% { filter: contrast(1.2); }
        }

        /* Camada agressiva que fica piscando linhas de estática de TV antiga */
        .macabre-static-overlay {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8),
            rgba(0, 0, 0, 0.8) 4px,
            rgba(255, 255, 255, 0.1) 4px,
            rgba(255, 255, 255, 0.1) 8px
          );
          z-index: 30;
          animation: staticBlink 0.08s infinite;
        }

        @keyframes staticBlink {
          0%, 100% { opacity: 0.9; background-color: #000000; }
          33% { opacity: 0.4; background-color: rgba(14, 2, 2, 0.9); }
          66% { opacity: 0.7; background-color: #0b141a; }
        }

        /* A palavra solta centralizada com efeito clássico de aberração cromática */
        .macabre-word-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #ffffff;
          font-family: 'Courier New', Courier, monospace;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 6px;
          z-index: 35;
          text-shadow: 3px 0px 0px #ff0055, -3px 0px 0px #00ffc4;
          animation: wordGlitch 0.2s infinite, wordPulse 0.4s infinite alternate;
        }

        @keyframes wordGlitch {
          0% { text-shadow: 3px 0px 0px #ff0055, -3px 0px 0px #00ffc4; transform: translate(-52%, -48%) skewX(4deg); }
          50% { text-shadow: -3px 0px 0px #ff0055, 3px 0px 0px #00ffc4; transform: translate(-47%, -53%) skewX(-6deg); }
          100% { text-shadow: 2px -1px 0px #ff0055, -2px 1px 0px #00ffc4; transform: translate(-50%, -50%) scale(1.05); }
        }

        @keyframes wordPulse {
          from { opacity: 1; filter: blur(0px); }
          to { opacity: 0.2; filter: blur(1px); }
        }

        /* Painel com o log técnico de erro na parte inferior do mapa */
        .map-secret-reveal {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(17, 27, 33, 0.95);
          border: 1px solid #ff0055;
          padding: 6px 14px;
          border-radius: 4px;
          z-index: 36;
          box-shadow: 0 0 10px rgba(255, 0, 85, 0.4);
        }

        .revealed-code {
          color: #ff0055;
          font-family: monospace;
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
        }
      `}</style>
    </div>
  );
}
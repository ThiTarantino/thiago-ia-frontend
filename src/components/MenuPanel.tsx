import React, { useState, useEffect, useRef } from "react";
import DispositivosConectados from "../DispositivosConectados";
import MensagensFavoritas from "../MensagensFavoritas";

type Props = { 
  onClose: () => void;
  onSelectAction?: (action: string) => void;
};

const OPCOES = [
  { label: "Novo grupo" },
  { label: "Dispositivos conectados" },
  { label: "Mensagens favoritas" },
  { label: "Limpar conversa" },
  { label: "Silenciar notificações" },
  { label: "Denunciar", danger: true },
];

const FRASES_SILENCIAR = [
  "Não faça isso, por favor! Eu amo falar com você😢",
  "Nao me deixe mudo por favorrrr 😭😭",
];

export default function MenuPanel({ onClose, onSelectAction }: Props) {
  const [verDispositivos, setVerDispositivos] = useState(false);
  const [verFavoritas, setVerFavoritas] = useState(false);
  
  // Estados de animação e aviso
  const [avisoSilenciar, setAvisoSilenciar] = useState(false);
  const [indexFrase, setIndexFrase] = useState(0);
  const [animaPato, setAnimaPato] = useState(false);

  // Referências para o Canvas do efeito de pintura
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const posicaoPatoRef = useRef({ x: 0, y: 0 });
  const [posicaoPatoDOM, setPosicaoPatoDOM] = useState({ x: 0, y: 0 });

  const handleItemClick = (label: string) => {
    if (label === "Dispositivos conectados") {
      setVerDispositivos(true);
    } else if (label === "Mensagens favoritas") {
      setVerFavoritas(true);
    } else if (label === "Silenciar notificações") {
      setAvisoSilenciar(true);
      setIndexFrase((prevIndex) => (prevIndex === 0 ? 1 : 0));
    } else if (label === "Limpar conversa") {
      // Inicia a brincadeira do patinho destruidor
      posicaoPatoRef.current = { x: window.innerWidth + 50, y: window.innerHeight / 2 };
      setPosicaoPatoDOM({ x: window.innerWidth + 50, y: window.innerHeight / 2 });
      setAnimaPato(true);
    } else {
      if (onSelectAction) onSelectAction(label);
      onClose();
    }
  };

  // Efeito para fechar o Toast de silenciar automaticamente
  useEffect(() => {
    if (avisoSilenciar) {
      const timer = setTimeout(() => {
        setAvisoSilenciar(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [avisoSilenciar]);

  // Lógica de animação e rastro do Pato Goose
  useEffect(() => {
    if (!animaPato) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Ajusta tamanho do canvas para a tela toda
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let idAnimacao: number;
    let passos = 0;

    const atualizarCena = () => {
      passos += 0.05;
      
      // Movimento do patinho andando da direita para a esquerda em zigue-zague
      const antigaX = posicaoPatoRef.current.x;
      const antigaY = posicaoPatoRef.current.y;

      const novaX = antigaX - 2.5; // Velocidade horizontal
      const novaY = (window.innerHeight / 2) + Math.sin(passos) * 120; // Ondulação vertical

      posicaoPatoRef.current = { x: novaX, y: novaY };
      setPosicaoPatoDOM({ x: novaX, y: novaY });

      // Desenha o rastro branco simulando o apagador/corretivo
      ctx.beginPath();
      ctx.moveTo(antigaX, antigaY);
      ctx.lineTo(novaX, novaY);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 75; // Espessura da "pintura branca"
      ctx.lineCap = "round";
      ctx.stroke();

      // Se o patinho sair totalmente da tela à esquerda, reinicia do lado direito
      if (novaX < -100) {
        posicaoPatoRef.current.x = window.innerWidth + 50;
      }

      idAnimacao = requestAnimationFrame(atualizarCena);
    };

    idAnimacao = requestAnimationFrame(atualizarCena);

    return () => {
      cancelAnimationFrame(idAnimacao);
    };
  }, [animaPato]);

  if (verDispositivos) {
    return <DispositivosConectados onBack={() => { setVerDispositivos(false); onClose(); }} />;
  }

  if (verFavoritas) {
    return <MensagensFavoritas onBack={() => { setVerFavoritas(false); onClose(); }} />;
  }

  return (
    <div className="mp-container-relative">
      {/* Menu principal do WhatsApp */}
      <div className="mp-panel">
        {OPCOES.map((op, i) => (
          <button
            key={i}
            className={`mp-item${op.danger ? " danger" : ""}`}
            onClick={() => handleItemClick(op.label)}
          >
            {op.label}
          </button>
        ))}
      </div>

      {/* Toast de notificações silenciadas */}
      {avisoSilenciar && (
        <div className="wa-toast-silenciar">
          <span>{FRASES_SILENCIAR[indexFrase]}</span>
        </div>
      )}

      {/* Camada interativa do Pato Pintor (Renderizada apenas se ativada) */}
      {animaPato && (
        <div className="goose-overlay">
          {/* Canvas onde o rastro branco é desenhado */}
          <canvas ref={canvasRef} className="goose-canvas" />

          {/* Elemento visual do Patinho Goose flutuando */}
          <div 
            className="goose-sprite"
            style={{ transform: `translate(${posicaoPatoDOM.x}px, ${posicaoPatoDOM.y}px)` }}
          >
            🦆 <span className="goose-honk">HONK!</span>
          </div>

          {/* Botão X para fechar e desfazer a bagunça */}
          <button className="goose-close-btn" onClick={() => setAnimaPato(false)}>
            ✕ Desfazer
          </button>
        </div>
      )}

      <style>{`
        .mp-container-relative {
          position: absolute; top: 58px; right: 6px; z-index: 200;
        }
        .mp-panel {
          background: #233138; border-radius: 4px; min-width: 200px;
          box-shadow: 0 4px 20px rgba(0,0,0,.5); overflow: hidden;
          animation: menuFadeIn 0.15s ease;
        }
        @keyframes menuFadeIn {
          from { opacity: 0; transform: scale(.95) translateY(-6px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        .mp-item {
          display: block; width: 100%; padding: 14px 20px;
          background: none; border: none; color: #e9edef;
          font-size: 15px; text-align: left; cursor: pointer;
          transition: background 0.12s; white-space: nowrap;
          font-family: inherit;
        }
        .mp-item:hover  { background: rgba(255,255,255,.06); }
        .mp-item:active { background: rgba(255,255,255,.1); }
        .mp-item.danger { color: #ff6b6b; }

        .wa-toast-silenciar {
          position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
          background: #222e35; color: #e1e7ea; padding: 12px 20px;
          border-radius: 20px; font-size: 13.5px; line-height: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 400;
          width: 85%; max-width: 320px; text-align: center;
          animation: toastFade 0.2s ease-out;
        }

        /* Estilos do efeito do Pato Goose */
        .goose-overlay {
          position: fixed; inset: 0; z-index: 9999;
          pointer-events: none;
        }
        .goose-canvas {
          position: absolute; inset: 0;
          pointer-events: none;
        }
        .goose-sprite {
          position: absolute; top: -30px; left: -30px;
          font-size: 40px; pointer-events: none;
          display: flex; flex-direction: column; align-items: center;
          transition: transform 0.016s linear;
          will-change: transform;
        }
        .goose-honk {
          font-size: 10px; background: #fff; color: #000;
          padding: 2px 5px; border-radius: 6px; border: 1px solid #000;
          font-weight: bold; margin-top: -5px;
          animation: honkScale 0.5s infinite alternate;
        }
        @keyframes honkScale {
          from { transform: scale(0.9); } to { transform: scale(1.1); }
        }
        .goose-close-btn {
          position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
          background: #ff6b6b; color: white; border: none;
          padding: 10px 20px; border-radius: 20px; font-size: 14px;
          font-weight: bold; cursor: pointer; pointer-events: auto;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        .goose-close-btn:hover { background: #fa5252; }
      `}</style>
    </div>
  );
}
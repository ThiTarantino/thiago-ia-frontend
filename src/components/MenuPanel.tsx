import { useState, useEffect } from "react";
import DispositivosConectados from "../DispositivosConectados";
import MensagensFavoritas from "../MensagensFavoritas";
import DenunciarPopup from "../DenunciarPopup.tsx";
import LimparConversaPopup from "../LimparConversaPopup";
import NovoGrupoCaptcha from "../NovoGrupoCaptcha.tsx";

type Props = {
  onClose: () => void;
  onSelectAction?: (action: string) => void;
  numeroContato?: string;
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

export default function MenuPanel({ onClose, onSelectAction, numeroContato = "Thiago 2.0" }: Props) {
  const [verDispositivos, setVerDispositivos] = useState(false);
  const [verFavoritas, setVerFavoritas] = useState(false);
  const [verDenunciar, setVerDenunciar] = useState(false);
  const [verLimpar, setVerLimpar] = useState(false);
  const [verNovoGrupo, setVerNovoGrupo] = useState(false);

  // Estados de animação e aviso
  const [avisoSilenciar, setAvisoSilenciar] = useState(false);
  const [indexFrase, setIndexFrase] = useState(0);

  const handleItemClick = (label: string) => {
    if (label === "Novo grupo") {
      setVerNovoGrupo(true);
    } else if (label === "Dispositivos conectados") {
      setVerDispositivos(true);
    } else if (label === "Mensagens favoritas") {
      setVerFavoritas(true);
    } else if (label === "Silenciar notificações") {
      setAvisoSilenciar(true);
      setIndexFrase((prevIndex) => (prevIndex === 0 ? 1 : 0));
    } else if (label === "Denunciar") {
      setVerDenunciar(true);
    } else if (label === "Limpar conversa") {
      setVerLimpar(true);
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

  if (verDispositivos) {
    return <DispositivosConectados onBack={() => { setVerDispositivos(false); onClose(); }} />;
  }

  if (verFavoritas) {
    return <MensagensFavoritas onBack={() => { setVerFavoritas(false); onClose(); }} />;
  }

  if (verDenunciar) {
    return (
      <DenunciarPopup
        numero={numeroContato}
        onCancelar={() => { setVerDenunciar(false); onClose(); }}
        onDenunciar={(bloquear) => {
          if (onSelectAction) onSelectAction(bloquear ? "Denunciar+Bloquear" : "Denunciar");
          setVerDenunciar(false);
          onClose();
        }}
      />
    );
  }

  if (verLimpar) {
    return (
      <LimparConversaPopup
        onFechar={() => { setVerLimpar(false); onClose(); }}
      />
    );
  }

  if (verNovoGrupo) {
    return (
      <NovoGrupoCaptcha
        onFechar={() => { setVerNovoGrupo(false); onClose(); }}
      />
    );
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
      `}</style>
    </div>
  );
}
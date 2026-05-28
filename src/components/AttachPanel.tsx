import CameraQuebrada from "../CameraQuebrada";
import SpotifyPlayer from "../SpotifyPlayer";
import DocumentosPainel from "../DocumentosPainel";
import ContatosPainel from "../ContatosPainel"; 
import GaleriaPainel from "../GaleriaPainel";
import LocalizacaoPainel from "../LocalizacaoPainel";
import { useState } from "react";

type AttachOpcao = {
  label: string;
  corIcone: string;
  icon: React.ReactNode;
};

const ATTACH_OPCOES: AttachOpcao[] = [
  {
    label: "Galeria",
    corIcone: "#29b6f6",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>
      </svg>
    )
  },
  {
    label: "Câmera",
    corIcone: "#ff2d55",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="3.2"/>
        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
      </svg>
    )
  },
  {
    label: "Localização",
    corIcone: "#1ebd5b",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    )
  },
  {
    label: "Contato",
    corIcone: "#00a79d",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    )
  },
  {
    label: "Documento",
    corIcone: "#7f66ff",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    )
  },
  {
    label: "Áudio",
    corIcone: "#ff9500",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    )
  }
];

type Props = { onClose: () => void };

export default function AttachPanel({ onClose }: Props) {
  const [showCamera, setShowCamera] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [showDocumentos, setShowDocumentos] = useState(false);
  const [showContatos, setShowContatos] = useState(false); 
  const [showGaleria, setShowGaleria] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showLocalizacao, setShowLocalizacao] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (showCamera) return <CameraQuebrada onClose={() => setShowCamera(false)} />;
  if (showSpotify) return <SpotifyPlayer onClose={() => setShowSpotify(false)} />;
  if (showDocumentos) return <DocumentosPainel onClose={() => setShowDocumentos(false)} />;
  if (showContatos) return <ContatosPainel onClose={() => setShowContatos(false)} />;
  if (showGaleria) return <GaleriaPainel onClose={() => setShowGaleria(false)} />;
  if (showLocalizacao) return <LocalizacaoPainel onClose={() => setShowLocalizacao(false)} />;

  return (
    <>
      <div className={`wa-attach-backdrop ${isExiting ? "exit" : ""}`} onClick={handleClose} />

      <div className={`wa-attach-panel ${isExiting ? "exit" : ""}`}>
        <div className="wa-attach-grid">
          {ATTACH_OPCOES.map((op, i) => (
            <div
              key={i}
              className="wa-attach-item"
              onClick={() => {
                if (op.label === "Galeria") {
                  setShowGaleria(true);
                  return;
                }
                if (op.label === "Documento") {
                  setShowDocumentos(true);
                  return;
                }
                if (op.label === "Câmera") {
                  setShowCamera(true);
                  return;
                }
                if (op.label === "Áudio") {
                  setShowSpotify(true);
                  return;
                }
                if (op.label === "Contato") {
                  setShowContatos(true);
                  return;
                }
                if (op.label === "Localização") {
                  setShowLocalizacao(true);
                  return;
                  }
                handleClose();
              }}
            >
              <div className="wa-attach-icon-box" style={{ color: op.corIcone }}>
                {op.icon}
              </div>
              <span className="wa-attach-label">{op.label}</span>
            </div>
          ))}
        </div>

        <style>{`
          .wa-attach-backdrop {
            position: fixed;
            inset: 0;
            z-index: 50;
            background: transparent;
            transition: opacity 0.2s ease;
          }

          .wa-attach-panel {
            position: absolute;
            bottom: 74px;
            left: 10px;
            right: 10px;
            z-index: 51;
            background: #0b141a; 
            padding: 24px 10px 20px 10px;
            border-radius: 28px; 
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
            animation: panelSlideUp 0.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          }

          .wa-attach-panel.exit {
            animation: panelSlideDown 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
          }

          @keyframes panelSlideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
          }

          @keyframes panelSlideDown {
            from { transform: translateY(0); opacity: 1; }
            to   { transform: translateY(100%); opacity: 0; }
          }

          .wa-attach-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            row-gap: 20px;
            column-gap: 4px;
            justify-items: center;
          }

          .wa-attach-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 4px;
            cursor: pointer;
            border: none;
            background: none;
            outline: none;
            -webkit-tap-highlight-color: transparent;
          }

          .wa-attach-icon-box {
            width: 60px;
            height: 60px;
            background: #1a242a; 
            border-radius: 20px; 
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.1s ease, transform 0.08s ease;
          }

          .wa-attach-item:active .wa-attach-icon-box {
            background: #222d34;
            transform: scale(0.95);
          }

          .wa-attach-label {
            color: #8696a0; 
            font-size: 13px;
            font-weight: 400;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            white-space: nowrap;
          }
        `}</style>
      </div>
    </>
  );
}
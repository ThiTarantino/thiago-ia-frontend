import { useState } from "react";
import { resolveCloudAssetSrc } from "../cloudAssets";

type Props = {
  onClose: () => void;
};

const FOTOS_MOCK = [
  { id: 1, url: resolveCloudAssetSrc("/imagens/enigma1.jpg") },
  { id: 2, url: resolveCloudAssetSrc("/imagens/enigma2.jpg") },
  { id: 3, url: resolveCloudAssetSrc("/imagens/enigma3.jpg") },
  { id: 4, url: resolveCloudAssetSrc("/imagens/enigma4.jpg") },
  { id: 5, url: resolveCloudAssetSrc("/imagens/enigma5.jpg") },
  { id: 6, url: resolveCloudAssetSrc("/imagens/enigma6.jpg") },
];

export default function GaleriaPainel({ onClose }: Props) {
  const [isExiting, setIsExiting] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState<string | null>(null);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div className={`wa-galeria-wrapper ${isExiting ? "exit" : ""}`}>
      {/* Cabeçalho padrão WhatsApp */}
      <div className="wa-galeria-header">
        <button className="wa-galeria-back-btn" onClick={handleClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>
        <h2>Fotos e vídeos</h2>
      </div>

      {/* Grid de Fotos */}
      <div className="wa-galeria-content">
        <div className="wa-galeria-grid">
          {FOTOS_MOCK.map((foto) => (
            <div 
              key={foto.id} 
              className="wa-galeria-item"
              onClick={() => setFotoSelecionada(foto.url)}
            >
              <img src={foto.url} alt="Mídia da galeria" loading="lazy" />
              <div className="wa-galeria-hover-overlay" />
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Visualização da Foto (Apenas Visualização) */}
      {fotoSelecionada && (
        <div className="wa-preview-overlay" onClick={() => setFotoSelecionada(null)}>
          <div className="wa-preview-header">
            <button className="wa-preview-close" onClick={() => setFotoSelecionada(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          
          <div className="wa-preview-body">
            {/* O stopPropagation evita que o clique na imagem feche o modal acidentalmente */}
            <img src={fotoSelecionada} alt="Preview" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}

      <style>{`
        .wa-galeria-wrapper {
          position: fixed;
          inset: 0;
          background: #0b141a; 
          z-index: 100;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          animation: galeriaSlideUp 0.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        .wa-galeria-wrapper.exit {
          animation: galeriaSlideDown 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes galeriaSlideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }

        @keyframes galeriaSlideDown {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }

        .wa-galeria-header {
          height: 60px;
          background: #111b21;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 20px;
          border-bottom: 1px solid #222d34;
        }

        .wa-galeria-back-btn {
          background: none;
          border: none;
          color: #aebac1;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 50%;
        }

        .wa-galeria-header h2 {
          color: #e9edef;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .wa-galeria-content {
          flex: 1;
          overflow-y: auto;
          padding: 4px;
        }

        .wa-galeria-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }

        .wa-galeria-item {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #111b21;
          cursor: pointer;
          overflow: hidden;
        }

        .wa-galeria-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s ease;
        }

        .wa-galeria-item:hover img {
          transform: scale(1.03);
        }

        .wa-galeria-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          transition: background 0.2s;
        }

        .wa-galeria-item:active .wa-galeria-hover-overlay {
          background: rgba(0, 0, 0, 0.3);
        }

        /* --- Preview Overlay (Sem o rodapé de envio) --- */
        .wa-preview-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.95); /* Fundo escuro focado na imagem */
          z-index: 110;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.15s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .wa-preview-header {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 16px;
          z-index: 120;
        }

        .wa-preview-close {
          background: none;
          border: none;
          color: #aebac1;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
        }
        
        .wa-preview-close:active {
          background: rgba(255, 255, 255, 0.1);
        }

        .wa-preview-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          margin-top: -60px; /* Centraliza a foto considerando a altura do header */
        }

        .wa-preview-body img {
          max-width: 100%;
          max-height: 85vh;
          object-fit: contain;
          box-shadow: 0 4px 20px rgba(0,0,0,0.8);
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from "react";

type Props = {
  onFechar: () => void;
};

type Etapa = "checkout" | "processando" | "revelado";

export default function LimparConversaPopup({ onFechar }: Props) {
  const [etapa, setEtapa] = useState<Etapa>("checkout");

  useEffect(() => {
    if (etapa === "processando") {
      const timer = setTimeout(() => setEtapa("revelado"), 2400);
      return () => clearTimeout(timer);
    }
  }, [etapa]);

  return (
    <div className="gp-overlay">
      {etapa === "checkout" && (
        <div className="gp-sheet">
          <button className="gp-close" onClick={onFechar} aria-label="Fechar">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#e8eaed" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>

          <div className="gp-header">
            <span className="gp-brand">Google Play</span>
            <span className="gp-points">
              <svg viewBox="0 0 24 24" width="15" height="15">
                <path d="M12 2l4 10-4 10-4-10z" fill="#ea4335" />
                <path d="M12 2l4 10H12z" fill="#4285f4" />
                <path d="M12 22l-4-10H12z" fill="#34a853" />
              </svg>
              0 · Bronze
            </span>
          </div>

          <div className="gp-item">
            <div className="gp-item-icon">🧹</div>
            <div className="gp-item-info">
              <span className="gp-item-title">Limpeza de Histórico (Premium / Chat)</span>
            </div>
            <span className="gp-item-price">R$ 81.060,23</span>
          </div>

          <div className="gp-divider" />

          <div className="gp-oferta">
            <span className="gp-oferta-icon">🎁</span>
            <div className="gp-oferta-texto">
              <span className="gp-oferta-titulo">Desconto de R$ 9 do Google Play</span>
              <span className="gp-oferta-desc">
                Aproveite a oferta na compra de um app, jogo ou item no app acima de R$ 9.
                Aproveite a oferta agora, ou ela vai expirar 7 dias depois de disponibilizada.{" "}
                <span className="gp-link">Confira os termos</span>
              </span>
            </div>
            <span className="gp-link gp-aplicar">Aplicar</span>
          </div>

          <div className="gp-divider" />

          <div className="gp-pontos">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M12 2l4 10-4 10-4-10z" fill="#ea4335" />
              <path d="M12 2l4 10H12z" fill="#4285f4" />
              <path d="M12 22l-4-10H12z" fill="#34a853" />
            </svg>
            <div className="gp-pontos-texto">
              <span className="gp-pontos-titulo">Pontos do Play Points · Bronze</span>
              <span className="gp-pontos-sub">Mais 12 pontos</span>
            </div>
          </div>

          <div className="gp-divider" />

          <div className="gp-pagamento-row">
            <div className="gp-cartao-icon">💳</div>
            <span className="gp-pagamento-texto">Mastercard-1234</span>
            <span className="gp-check">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="12" fill="#8ab4f8" />
                <path d="M7 12.5l3 3 7-7" fill="none" stroke="#001d35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <div className="gp-pagamento-sub-row">Saldo do Google Play: R$ 0,77</div>

          <div className="gp-pagamento-row">
            <div className="gp-pix-icon">◈</div>
            <span className="gp-pagamento-texto">Pix</span>
          </div>

          <div className="gp-pagamento-row">
            <div className="gp-cartao-icon">💳</div>
            <span className="gp-pagamento-texto gp-link">Confira todas as formas de pagamento.</span>
          </div>

          <div className="gp-divider" />

          <p className="gp-disclaimer">
            Toque em "Comprar com 1 clique" para concluir a compra.
          </p>
          <p className="gp-disclaimer">
            Variações cambiais e cobranças bancárias podem afetar o valor final cobrado
          </p>
          <p className="gp-disclaimer-small">inclui impostos ⓘ</p>

          <button className="gp-comprar-btn" onClick={() => setEtapa("processando")}>
            Comprar com 1 clique
          </button>
        </div>
      )}

      {etapa === "processando" && (
        <div className="gp-sheet gp-sheet-center">
          <div className="gp-spinner">
            <svg viewBox="0 0 50 50" width="44" height="44">
              <circle cx="25" cy="25" r="20" fill="none" stroke="#4285f4" strokeWidth="4" strokeDasharray="31.4 94.2" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite" />
              </circle>
              <circle cx="25" cy="25" r="20" fill="none" stroke="#34a853" strokeWidth="4" strokeDasharray="15 110.6" strokeDashoffset="-31.4" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          <p className="gp-processando-texto">Processando pagamento...</p>
          <p className="gp-processando-sub">Não feche esta janela</p>
        </div>
      )}

      {etapa === "revelado" && (
        <div className="gp-sheet gp-sheet-center">
          <p className="gp-revelado-texto">Para de brincadeira, você é POBRE! KSKSKSKSKSSKSKSKS</p>
          <button className="gp-comprar-btn gp-fechar-btn" onClick={onFechar}>
            Fechar
          </button>
        </div>
      )}

      <style>{`
        .gp-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(0,0,0,.6);
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
          animation: gpFadeIn .15s ease;
        }
        @keyframes gpFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .gp-sheet {
          position: relative;
          background: #131313; border-radius: 16px;
          width: 100%; max-width: 320px; max-height: 88vh;
          overflow-y: auto;
          padding: 16px 16px 18px;
          box-shadow: 0 12px 40px rgba(0,0,0,.6);
          animation: gpPopIn .18s ease;
          font-family: inherit;
        }
        .gp-sheet::-webkit-scrollbar { width: 0; }
        .gp-sheet-center {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; justify-content: center;
          padding: 40px 22px; max-height: none;
        }
        @keyframes gpPopIn {
          from { opacity: 0; transform: scale(.94); }
          to   { opacity: 1; transform: scale(1); }
        }

        .gp-close {
          position: absolute; top: 12px; right: 12px;
          background: none; border: none; cursor: pointer;
          padding: 4px; line-height: 0;
        }

        .gp-header {
          display: flex; align-items: center; justify-content: space-between;
          margin: 4px 30px 18px 2px;
        }
        .gp-brand { color: #9aa0a6; font-size: 15px; }
        .gp-points {
          display: flex; align-items: center; gap: 5px;
          color: #e8eaed; font-size: 12px;
        }

        .gp-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
        .gp-item-icon {
          width: 40px; height: 40px; border-radius: 8px; background: #232323;
          display: flex; align-items: center; justify-content: center; font-size: 18px;
          flex-shrink: 0;
        }
        .gp-item-info { flex: 1; min-width: 0; }
        .gp-item-title { color: #ffffff; font-size: 14px; line-height: 18px; }
        .gp-item-price { color: #ffffff; font-size: 14px; font-weight: 700; white-space: nowrap; }

        .gp-divider { height: 1px; background: #2a2a2a; margin: 12px 0; }

        .gp-oferta { display: flex; align-items: flex-start; gap: 12px; }
        .gp-oferta-icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .gp-oferta-texto { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .gp-oferta-titulo { color: #e8eaed; font-size: 13px; }
        .gp-oferta-desc { color: #9aa0a6; font-size: 11.5px; line-height: 15.5px; }
        .gp-link { color: #8ab4f8; }
        .gp-aplicar { font-size: 13px; flex-shrink: 0; align-self: flex-start; margin-top: 1px; }

        .gp-pontos { display: flex; align-items: center; gap: 12px; }
        .gp-pontos-texto { display: flex; flex-direction: column; gap: 2px; }
        .gp-pontos-titulo { color: #e8eaed; font-size: 12.5px; }
        .gp-pontos-sub { color: #e8eaed; font-size: 13.5px; }

        .gp-pagamento-row {
          display: flex; align-items: center; gap: 12px; padding: 7px 0;
        }
        .gp-cartao-icon, .gp-pix-icon {
          width: 24px; text-align: center; font-size: 16px; flex-shrink: 0;
        }
        .gp-pix-icon { color: #32bcad; }
        .gp-pagamento-texto { color: #e8eaed; font-size: 13.5px; flex: 1; }
        .gp-check { margin-left: auto; flex-shrink: 0; }
        .gp-pagamento-sub-row { color: #9aa0a6; font-size: 12px; margin: -2px 0 4px 36px; }

        .gp-disclaimer { color: #9aa0a6; font-size: 11px; line-height: 15px; margin: 0 0 8px; }
        .gp-disclaimer-small { color: #9aa0a6; font-size: 10.5px; margin: 0 0 14px; }

        .gp-comprar-btn {
          width: 100%; background: #aecbfa; color: #001d35;
          border: none; border-radius: 24px; padding: 12px 4px;
          font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;
        }
        .gp-comprar-btn:active { background: #9ab8ea; }
        .gp-fechar-btn { width: auto; padding: 10px 26px; margin-top: 4px; }

        .gp-spinner { margin-bottom: 16px; }
        .gp-processando-texto { color: #e8eaed; font-size: 14.5px; font-weight: 500; margin: 0 0 4px; }
        .gp-processando-sub { color: #9aa0a6; font-size: 11.5px; margin: 0; }

        .gp-revelado-texto {
          color: #e8eaed; font-size: 15px; font-weight: 500;
          line-height: 21px; margin: 0 0 18px;
        }
      `}</style>
    </div>
  );
}
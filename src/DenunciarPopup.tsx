import { useState } from "react";

type Props = {
  numero: string;
  onCancelar: () => void;
  onDenunciar: (bloquear: boolean) => void;
};

export default function DenunciarPopup({ numero, onCancelar, onDenunciar }: Props) {
  const [bloquear, setBloquear] = useState(false);

  return (
    <div className="dn-overlay">
      <div className="dn-card">
        <div className="dn-icon">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#8696a0" strokeWidth="1.6">
            <path
              transform="rotate(180 12 12)"
              d="M14 9V5a2 2 0 0 0-2-2 1 1 0 0 0-1 1v.4a3 3 0 0 1-.4 1.5L8 11v10h9.3a2 2 0 0 0 2-1.7l1.1-7A2 2 0 0 0 18.4 10H14z"
            />
            <path
              transform="rotate(180 12 12)"
              d="M4 11H2v10h2a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2z"
            />
          </svg>
        </div>

        <h2 className="dn-title">Denunciar ao WhatsApp</h2>

        <p className="dn-desc">
          As últimas cinco mensagens da conversa serão encaminhadas para o WhatsApp.
          A pessoa não saberá que foi bloqueada ou denunciada por você.{" "}
          <span className="dn-link">Saiba mais</span>
        </p>

        <label className="dn-checkbox-row">
          <input
            type="checkbox"
            checked={bloquear}
            onChange={(e) => setBloquear(e.target.checked)}
          />
          <span className="dn-checkbox-box">
            {bloquear && (
              <svg viewBox="0 0 16 16" width="11" height="11">
                <path d="M13.5 3.5 6 11 2.5 7.5" fill="none" stroke="#111b21" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <div className="dn-checkbox-text">
            <span className="dn-checkbox-title">Bloquear {numero}</span>
            <span className="dn-checkbox-sub">
              Essa pessoa não poderá mais fazer ligações nem enviar mensagens para você.
            </span>
          </div>
        </label>

        <div className="dn-actions">
          <button className="dn-btn" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="dn-btn" onClick={() => onDenunciar(bloquear)}>
            Denunciar
          </button>
        </div>
      </div>

      <style>{`
        .dn-overlay {
          position: fixed; inset: 0; z-index: 500;
          background: rgba(0,0,0,.55);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: dnFadeIn .15s ease;
        }
        @keyframes dnFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        .dn-card {
          background: #233138; border-radius: 10px;
          width: 100%; max-width: 280px;
          padding: 20px 18px 14px;
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
          box-shadow: 0 8px 30px rgba(0,0,0,.5);
          animation: dnPopIn .18s ease;
        }
        @keyframes dnPopIn {
          from { opacity: 0; transform: scale(.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .dn-icon { margin-bottom: 10px; }
        .dn-title {
          color: #e9edef; font-size: 17px; font-weight: 500;
          margin: 0 0 10px;
        }
        .dn-desc {
          color: #8696a0; font-size: 12.5px; line-height: 17px;
          margin: 0 0 16px;
        }
        .dn-link { color: #00a884; cursor: pointer; }
        .dn-checkbox-row {
          display: flex; align-items: flex-start; gap: 10px;
          text-align: left; margin-bottom: 16px; cursor: pointer;
          width: 100%;
        }
        .dn-checkbox-row input {
          position: absolute; width: 1px; height: 1px;
          opacity: 0; pointer-events: none;
        }
        .dn-checkbox-box {
          width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;
          border: 1.6px solid #8696a0; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          transition: background .12s, border-color .12s;
        }
        .dn-checkbox-row input:checked + .dn-checkbox-box {
          background: #00a884; border-color: #00a884;
        }
        .dn-checkbox-text { display: flex; flex-direction: column; gap: 3px; }
        .dn-checkbox-title { color: #e9edef; font-size: 13px; }
        .dn-checkbox-sub { color: #8696a0; font-size: 11.5px; line-height: 15px; }
        .dn-actions {
          display: flex; justify-content: center; gap: 32px;
          width: 100%;
        }
        .dn-btn {
          background: none; border: none; color: #00a884;
          font-size: 13.5px; font-weight: 600; cursor: pointer;
          padding: 6px 4px; font-family: inherit;
        }
        .dn-btn:active { opacity: .7; }
      `}</style>
    </div>
  );
}
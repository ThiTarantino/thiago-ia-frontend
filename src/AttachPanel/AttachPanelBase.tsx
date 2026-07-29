import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// AttachPanelBase — versão padronizada/reutilizável do AttachPanel.
// A UI (grade, animação, backdrop) é a mesma para todos os chats. Cada chat
// define sua própria lista de opções (ícone, cor, label e ação) e passa aqui.
//
// Diferente do AttachPanel original, este componente NÃO decide o que cada
// ícone abre — isso é responsabilidade de cada AttachPanelX (ex: AttachPanelMae),
// que passa um `onClick` próprio pra cada opção.
// ─────────────────────────────────────────────────────────────────────────────

export type AttachOpcao = {
  label: string;
  corIcone: string;
  icon: React.ReactNode;
  onClick: () => void;
};

type Props = {
  opcoes: AttachOpcao[];
  onClose: () => void;
};

export default function AttachPanelBase({ opcoes, onClose }: Props) {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <>
      <div className={`wa-attach-backdrop ${isExiting ? "exit" : ""}`} onClick={handleClose} />

      <div className={`wa-attach-panel ${isExiting ? "exit" : ""}`}>
        <div className="wa-attach-grid">
          {opcoes.map((op, i) => (
            <div
              key={i}
              className="wa-attach-item"
              onClick={() => {
                op.onClick();
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
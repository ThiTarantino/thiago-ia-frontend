type Props = { onClose: () => void };

const OPCOES = [
  { label: "Novo grupo" },
  { label: "Dispositivos conectados" },
  { label: "Mensagens favoritas" },
  { label: "Limpar conversa" },
  { label: "Silenciar notificações" },
  { label: "Denunciar", danger: true },
];

export default function MenuPanel({ onClose }: Props) {
  return (
    <div className="mp-panel">
      {OPCOES.map((op, i) => (
        <button
          key={i}
          className={`mp-item${op.danger ? " danger" : ""}`}
          onClick={onClose}
        >
          {op.label}
        </button>
      ))}

      <style>{`
        .mp-panel {
          position: absolute; top: 58px; right: 6px; z-index: 200;
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
      `}</style>
    </div>
  );
}
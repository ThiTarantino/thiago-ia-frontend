import { useState } from "react";

type ConfiguracoesProps = {
  onBack: () => void;
};

export default function Configuracoes({ onBack }: ConfiguracoesProps) {
  const [modalAberto, setModalAberto] = useState(false);

  const opcoes = [
    { title: "Conta", desc: "Notificações de segurança, mudança de número" },
    { title: "Privacidade", desc: "Bloqueio de contatos, mensagens temporárias" },
    { title: "Conversas", desc: "Tema, papéis de parede, histórico de conversas" },
    { title: "Notificações", desc: "Tons de mensagens, grupos e chamadas" },
    { title: "Armazenamento e dados", desc: "Uso de rede, download automático" },
    { title: "Idioma do aplicativo", desc: "Português (Brasil)" },
    { title: "Ajuda", desc: "Central de ajuda, fale conosco, política de privacidade" },
  ];

  return (
    <div className="wa-screen-std">
      <div className="wa-std-header">
        <button className="wa-std-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2>Configurações</h2>
      </div>

      <div className="wa-std-container">
        {/* Perfil */}
        <div className="wa-std-profile-row" onClick={() => setModalAberto(true)}>
          <div className="wa-std-avatar-lg">U</div>
          <div className="wa-std-item-info">
            <span className="wa-std-title">Usuário</span>
            <span className="wa-std-sub">Disponível</span>
          </div>
        </div>

        <div className="wa-std-divider" />

        {/* Lista de Opções */}
        {opcoes.map((opt, i) => (
          <div key={i} className="wa-std-item-row" onClick={() => setModalAberto(true)}>
            <div className="wa-std-item-info">
              <span className="wa-std-title">{opt.title}</span>
              <span className="wa-std-sub">{opt.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Padrão */}
      {modalAberto && (
        <div className="wa-modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="wa-modal-content" onClick={(e) => e.stopPropagation()}>
            <h4 className="wa-modal-title">Configurações</h4>
            <p className="wa-modal-text">As alterações nessa seção foram salvas com sucesso.</p>
            <div className="wa-modal-actions">
              <button className="wa-modal-btn cancel" onClick={() => setModalAberto(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .wa-screen-std {
          position: fixed; inset: 0; background: #0b141a; color: #e9edef;
          z-index: 300; display: flex; flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
        }
        .wa-std-header {
          height: 60px; background: #202c33; display: flex; align-items: center;
          padding: 0 16px; gap: 24px;
        }
        .wa-std-back-btn {
          background: none; border: none; color: #e9edef; cursor: pointer;
          display: flex; align-items: center; padding: 4px;
        }
        .wa-std-header h2 { font-size: 19px; font-weight: 500; margin: 0; color: #e9edef; }

        .wa-std-container { flex: 1; overflow-y: auto; padding: 12px 0; }
        
        .wa-std-profile-row {
          display: flex; align-items: center; gap: 16px; padding: 12px 16px; cursor: pointer;
        }
        .wa-std-avatar-lg {
          width: 58px; height: 58px; border-radius: 50%; background: #6b7c85;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; font-size: 22px; color: #fff;
        }

        .wa-std-divider { height: 1px; background: #202c33; margin: 8px 0; }

        .wa-std-item-row {
          display: flex; align-items: center; gap: 16px; padding: 14px 16px; cursor: pointer;
        }
        .wa-std-item-row:active { background: #202c33; }
        .wa-std-item-info { display: flex; flex-direction: column; gap: 2px; }
        .wa-std-title { font-size: 16px; color: #e9edef; font-weight: 400; }
        .wa-std-sub { font-size: 13.5px; color: #8696a0; }

        .wa-modal-overlay {
          position: fixed; inset: 0; background: rgba(0, 0, 0, 0.52);
          display: flex; align-items: center; justify-content: center; z-index: 500;
        }
        .wa-modal-content {
          background: #222e35; border-radius: 14px; width: 85%; max-width: 320px;
          padding: 22px 24px 16px 24px; box-shadow: 0 10px 24px rgba(0,0,0,0.5);
        }
        .wa-modal-title { font-size: 17.5px; font-weight: 500; color: #e9edef; margin: 0 0 10px 0; }
        .wa-modal-text { font-size: 14.5px; color: #8696a0; margin: 0 0 28px 0; }
        .wa-modal-actions { display: flex; justify-content: flex-end; }
        .wa-modal-btn { background: none; border: none; font-size: 14px; font-weight: 600; cursor: pointer; }
        .wa-modal-btn.cancel { color: #00a884; }
      `}</style>
    </div>
  );
}
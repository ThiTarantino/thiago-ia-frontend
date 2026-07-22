type FavoritasProps = {
  onBack: () => void;
};

// Mensagens marcadas como favoritas da conversa com o Thiago 2.0 sobre a Bella
const MENSAGENS_FAVORITAS = [
  {
    id: 1,
    remetente: "Thiago 2.0",
    conteudo: "CASA COMIGO AGORAAAAAAAAAAAAA",
    horario: "14:22",
  },
  {
    id: 2,
    remetente: "Thiago 2.0",
    conteudo: "Seu sorriso é a melhor parte do meu dia. Sempre.",
    horario: "18:05",
  },
  {
    id: 3,
    remetente: "Thiago 2.0",
    conteudo: "Tava aqui pensando em você... Dorme bem, tá? 🥰",
    horario: "21:40",
  },
];

export default function MensagensFavoritas({ onBack }: FavoritasProps) {
  return (
    <div className="wa-fav-screen">
      {/* Cabeçalho padrão do WhatsApp */}
      <div className="wa-fav-header">
        <button className="wa-fav-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2>Mensagens favoritas</h2>
      </div>

      {/* Container das Mensagens com o fundo clássico */}
      <div className="wa-fav-container">
        {MENSAGENS_FAVORITAS.map((msg) => (
          <div key={msg.id} className="wa-fav-card">
            {/* Nome do Remetente (Verde padrão do WhatsApp para contatos) */}
            <div className="wa-fav-meta">
              <span className="wa-fav-sender">{msg.remetente}</span>
            </div>
            
            {/* Balão da Mensagem */}
            <div className="wa-fav-bubble">
              <p className="wa-fav-text">{msg.conteudo}</p>
              <div className="wa-fav-footer">
                {/* Ícone de Estrela do WhatsApp */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#8696a0" style={{ marginRight: "5px" }}>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                <span>{msg.horario}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .wa-fav-screen {
          position: fixed; inset: 0; background: #0b141a;
          color: #e9edef; z-index: 300; display: flex; flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .wa-fav-header {
          height: 60px; background: #202c33; display: flex;
          align-items: center; padding: 0 16px; gap: 24px;
          flex-shrink: 0;
        }
        .wa-fav-back-btn {
          background: none; border: none; color: #e9edef;
          cursor: pointer; display: flex; align-items: center; padding: 4px;
        }
        .wa-fav-header h2 { font-size: 19px; font-weight: 500; margin: 0; color: #e9edef; }
        
        .wa-fav-container {
          flex: 1; overflow-y: auto; padding: 20px 16px;
          display: flex; flex-direction: column; gap: 14px;
          /* Mantém o padrão escuro com textura sutil se necessário */
          background-color: #0b141a;
        }

        /* Estrutura do Card de Favoritas do WhatsApp */
        .wa-fav-card {
          display: flex;
          flex-direction: column;
          background: #111b21;
          border-radius: 8px;
          padding: 10px 12px;
          border: 1px solid #202c33;
          max-width: 85%;
          align-self: flex-start;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .wa-fav-meta {
          margin-bottom: 5px;
        }

        .wa-fav-sender {
          font-size: 13.5px;
          color: #00a884; /* Cor clássica do remetente */
          font-weight: 600;
        }

        .wa-fav-bubble {
          display: flex;
          flex-direction: column;
        }

        .wa-fav-text {
          font-size: 14.5px;
          line-height: 19px;
          color: #e9edef;
          margin: 0 0 4px 0;
          word-break: break-word;
        }

        .wa-fav-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 11px;
          color: #8696a0;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from "react";

type DispositivosProps = {
  onBack: () => void;
};

export default function DispositivosConectados({ onBack }: DispositivosProps) {
  // Estado para controlar a exibição do Toast de falha
  const [avisoFalha, setAvisoFalha] = useState(false);
  
  // Estado para controlar qual dispositivo abriu o modal de desconexão (null = fechado)
  const [dispositivoSelecionado, setDispositivoSelecionado] = useState<string | null>(null);

  const handleConectarClick = () => {
    setAvisoFalha(true);
  };

  const handleDispositivoClick = (nomeDispositivo: string) => {
    setDispositivoSelecionado(nomeDispositivo);
  };

  const handleFecharModal = () => {
    setDispositivoSelecionado(null);
  };

  const handleDesconectarConfirmado = () => {
    setDispositivoSelecionado(null);
  };

  // Controla o tempo de exibição do Toast visual
  useEffect(() => {
    if (avisoFalha) {
      const timer = setTimeout(() => setAvisoFalha(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [avisoFalha]);

  return (
    <div className="wa-disp-screen">
      {/* Cabeçalho do WhatsApp */}
      <div className="wa-disp-header">
        <button className="wa-disp-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h2>Dispositivos conectados</h2>
      </div>

      {/* Conteúdo Centralizado */}
      <div className="wa-disp-container">
        <div className="wa-disp-art">
          <svg width="130" height="90" viewBox="0 0 120 90" fill="none">
            <rect x="15" y="15" width="28" height="55" rx="5" fill="#111b21" stroke="#00a884" strokeWidth="2"/>
            <rect x="25" y="25" width="8" height="6" rx="1" fill="#8696a0" opacity="0.3"/>
            <rect x="23" y="38" width="12" height="10" rx="2" fill="#00a884"/>
            <rect x="52" y="20" width="55" height="38" rx="4" fill="#00a884"/>
            <path d="M45 58h70l4 10H41l4-10z" fill="#202c33"/>
          </svg>
        </div>

        <p className="wa-disp-info-text">
          Você pode conectar mais dispositivos a essa conta. <span className="wa-blue-link">Saiba mais</span>
        </p>

        <button className="wa-disp-action-btn" onClick={handleConectarClick}>
          Conectar dispositivo
        </button>

        {/* Divisor Ajustado para evitar Scroll Lateral */}
        <div className="wa-disp-divider" />

        {/* Status das Sessões Ativas */}
        <div className="wa-disp-status-section">
          <h3>STATUS DO DISPOSITIVO</h3>
          <p className="wa-disp-instruction">Toque em um dispositivo para desconectá-lo.</p>

          {/* Sessão Única Suspeita */}
          <div 
            className="wa-disp-row" 
            onClick={() => handleDispositivoClick("IP 192.0_ _._ (Desconhecido)")}
          >
            <div className="wa-disp-icon-hacker">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e9edef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h20" />
                <path d="M20 12a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4" />
                <path d="M6 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
                <path d="M14 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
                <path d="M10 16h4" />
                <path d="M12 8v-4h4" />
              </svg>
            </div>
            <div className="wa-disp-details">
              <span className="wa-disp-title">IP 192.0_ _._ (Desconhecido)</span>
              <span className="wa-disp-time">Última sessão ativa hoje às 03:39</span>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="wa-disp-footer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2" style={{ marginTop: "2px" }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <p>
            Suas mensagens pessoais são protegidas com a <span className="wa-green-link">criptografia de ponta a ponta</span> em todos os seus dispositivos.
          </p>
        </div>
      </div>

      {/* Janela de Confirmação Típica do WhatsApp (Modal Overlay) */}
      {dispositivoSelecionado && (
        <div className="wa-modal-overlay" onClick={handleFecharModal}>
          <div className="wa-modal-content" onClick={(e) => e.stopPropagation()}>
            <h4 className="wa-modal-title">{dispositivoSelecionado}</h4>
            <p className="wa-modal-text">Status: Ativo</p>
            
            <div className="wa-modal-actions">
              <button className="wa-modal-btn cancel" onClick={handleFecharModal}>
                Cancelar
              </button>
              <button className="wa-modal-btn disconnect" onClick={handleDesconectarConfirmado}>
                Desconectar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bolha de Aviso Visual (Toast) */}
      {avisoFalha && (
        <div className="wa-toast-aviso">
          <span>Falha na conexão: Não foi possível emparelhar um novo dispositivo.</span>
        </div>
      )}

      <style>{`
        .wa-disp-screen {
          position: fixed; inset: 0; background: #0b141a;
          color: #e9edef; z-index: 300; display: flex; flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden; /* Garante que nada escape horizontalmente */
        }
        .wa-disp-header {
          height: 60px; background: #202c33; display: flex;
          align-items: center; padding: 0 16px; gap: 24px;
        }
        .wa-disp-back-btn {
          background: none; border: none; color: #e9edef;
          cursor: pointer; display: flex; align-items: center; padding: 4px;
        }
        .wa-disp-header h2 { font-size: 19px; font-weight: 500; margin: 0; color: #e9edef; }
        
        .wa-disp-container {
          flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column;
          align-items: center; padding: 30px 24px;
        }
        .wa-disp-art { margin: 16px 0 24px 0; }
        .wa-disp-info-text {
          font-size: 14.2px; color: #8696a0; text-align: center;
          line-height: 20px; max-width: 300px; margin: 0 0 26px 0;
        }
        .wa-blue-link { color: #53bdeb; cursor: pointer; }
        .wa-green-link { color: #00a884; }
        
        .wa-disp-action-btn {
          background: #00a884; color: #111b21; border: none;
          width: 100%; max-width: 340px; padding: 11px; font-weight: 600;
          border-radius: 24px; font-size: 14px; cursor: pointer; margin-bottom: 30px;
        }
        .wa-disp-action-btn:active { background: #008f72; }
        
        /* CORREÇÃO DO SCROLL: width alterado para 100% + calc() baseado nas paddings laterais */
        .wa-disp-divider {
          width: calc(100% + 48px); 
          height: 10px; 
          background: #111b21; 
          margin-bottom: 16px;
          margin-left: -24px;
          margin-right: -24px;
        }
        
        .wa-disp-status-section { width: 100%; max-width: 360px; text-align: left; }
        .wa-disp-status-section h3 {
          font-size: 12.5px; color: #8696a0; font-weight: 600; margin: 0 0 6px 0; letter-spacing: 0.5px;
        }
        .wa-disp-instruction { font-size: 13.5px; color: #8696a0; margin: 0 0 18px 0; }
        
        .wa-disp-row {
          display: flex; align-items: center; gap: 16px; padding: 14px 0;
          border-bottom: 1px solid #202c33; cursor: pointer;
        }
        .wa-disp-row:active { background: #202c33; }
        
        .wa-disp-icon-hacker {
          width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; 
          justify-content: center; background: #202c33; border: 1px solid #3b4a54;
        }
        
        .wa-disp-details { display: flex; flex-direction: column; gap: 2px; }
        .wa-disp-title { font-size: 16px; color: #ff6b6b; font-weight: 500; }
        .wa-disp-time { font-size: 13.5px; color: #8696a0; }
        
        .wa-disp-footer {
          margin-top: auto; display: flex; gap: 10px; align-items: flex-start;
          text-align: left; font-size: 12.5px; color: #8696a0; line-height: 17px;
          padding: 40px 10px 10px 10px; max-width: 350px;
        }
        .wa-disp-footer p { margin: 0; }

        .wa-toast-aviso {
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: #222e35;
          color: #e1e7ea;
          padding: 12px 20px;
          border-radius: 20px;
          font-size: 13.5px;
          line-height: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          z-index: 400;
          width: 85%;
          max-width: 320px;
          text-align: center;
          animation: toastFade 0.2s ease-out;
        }

        .wa-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.52);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 500;
          animation: fadeIn 0.15s ease-out;
        }

        .wa-modal-content {
          background: #222e35;
          border-radius: 14px;
          width: 85%;
          max-width: 320px;
          padding: 22px 24px 16px 24px;
          box-shadow: 0 10px 24px rgba(0,0,0,0.5);
          animation: scaleUp 0.18s cubic-bezier(0.1, 0.8, 0.3, 1);
        }

        .wa-modal-title {
          font-size: 17.5px;
          font-weight: 500;
          color: #e9edef;
          margin: 0 0 10px 0;
        }

        .wa-modal-text {
          font-size: 14.5px;
          color: #8696a0;
          margin: 0 0 28px 0;
        }

        .wa-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 24px;
        }

        .wa-modal-btn {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 4px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .wa-modal-btn.cancel { color: #00a884; }
        .wa-modal-btn.disconnect { color: #f15c6d; }

        @keyframes toastFade {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
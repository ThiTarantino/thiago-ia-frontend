import { useState, useEffect } from "react";
import { ArrowLeft, Lock, Smartphone, ShieldAlert } from "lucide-react";

type DispositivosProps = {
  onBack: () => void;
};

interface Dispositivo {
  id: string;
  nome: string;
  localizacao: string;
  ultimaAtividade: string;
  tipo: "android" | "suspeito";
  ativoAgora?: boolean;
}

export default function DispositivosConectados({ onBack }: DispositivosProps) {
  const [mensagemToast, setMensagemToast] = useState<string | null>(null);

  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([
    {
      id: "1",
      nome: "As21 (Android)",
      localizacao: "Rio Grande Do Sul, Brasil",
      ultimaAtividade: "Ativo agora",
      tipo: "android",
      ativoAgora: true,
    },
    {
      id: "2",
      nome: "Sessão Desconhecida (IP 192.0_ _._)", // Agora em uma linha só para a lista
      localizacao: "Localização não identificada",
      ultimaAtividade: "Hoje às 03:39",
      tipo: "suspeito",
      ativoAgora: false,
    },
  ]);

  const [dispositivoSelecionado, setDispositivoSelecionado] = useState<Dispositivo | null>(null);

  const handleConectarClick = () => {
    exibirToast("Falha na conexão: Não foi possível emparelhar um novo dispositivo.");
  };

  const handleDesconectarConfirmado = () => {
    if (dispositivoSelecionado) {
      setDispositivos((prev) => prev.filter((d) => d.id !== dispositivoSelecionado.id));
      exibirToast("Sessão desconectada com sucesso.");
      setDispositivoSelecionado(null);
    }
  };

  const exibirToast = (msg: string) => {
    setMensagemToast(msg);
  };

  useEffect(() => {
    if (mensagemToast) {
      const timer = setTimeout(() => setMensagemToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagemToast]);

  return (
    <div className="wa-disp-screen">
      {/* Cabeçalho */}
      <div className="wa-disp-header">
        <button className="wa-disp-back-btn" onClick={onBack}>
          <ArrowLeft size={22} />
        </button>
        <h2>Dispositivos conectados</h2>
      </div>

      {/* Conteúdo Principal */}
      <div className="wa-disp-container wa-scrollable">
        {/* Arte SVG */}
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
          Conectar um dispositivo
        </button>

        <div className="wa-disp-divider" />

        {/* Status das Sessões */}
        <div className="wa-disp-status-section">
          <h3>STATUS DO DISPOSITIVO</h3>
          <p className="wa-disp-instruction">Toque em um dispositivo para desconectá-lo.</p>

          <div className="wa-disp-list">
            {dispositivos.map((disp) => (
              <div
                key={disp.id}
                className="wa-disp-row"
                onClick={() => setDispositivoSelecionado(disp)}
              >
                <div
                  className={`wa-disp-icon ${
                    disp.tipo === "suspeito" ? "suspeito" : ""
                  }`}
                >
                  {disp.tipo === "suspeito" ? (
                    <ShieldAlert size={22} color="#ff6b6b" />
                  ) : (
                    <Smartphone size={22} color="#e9edef" />
                  )}
                </div>

                <div className="wa-disp-details">
                  <span
                    className={`wa-disp-title ${
                      disp.tipo === "suspeito" ? "danger" : ""
                    }`}
                  >
                    {disp.nome}
                  </span>
                  <span className="wa-disp-time">
                    {disp.ativoAgora ? (
                      <strong style={{ color: "#00a884" }}>{disp.ultimaAtividade}</strong>
                    ) : (
                      `Última sessão: ${disp.ultimaAtividade}`
                    )}
                  </span>
                </div>
              </div>
            ))}

            {dispositivos.length === 0 && (
              <div style={{ padding: "20px 0", textAlign: "center", color: "#8696a0", fontSize: 14 }}>
                Nenhum dispositivo conectado no momento.
              </div>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="wa-disp-footer">
          <Lock size={16} color="#8696a0" style={{ flexShrink: 0, marginTop: 2 }} />
          <p>
            Suas mensagens pessoais são protegidas com a{" "}
            <span className="wa-green-link">criptografia de ponta a ponta</span> em todos os seus dispositivos.
          </p>
        </div>
      </div>

      {/* Modal / Caixinha de Desconexão */}
      {dispositivoSelecionado && (
        <div className="wa-modal-overlay" onClick={() => setDispositivoSelecionado(null)}>
          <div className="wa-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="wa-modal-header-row">
              {dispositivoSelecionado.tipo === "suspeito" && (
                <ShieldAlert size={22} color="#ff6b6b" style={{ flexShrink: 0 }} />
              )}
              
              {/* Título com quebra de linha apenas dentro do modal */}
              <h4 className="wa-modal-title">
                {dispositivoSelecionado.nome.includes(" (") ? (
                  <>
                    {dispositivoSelecionado.nome.split(" (")[0]}
                    <br />
                    ({dispositivoSelecionado.nome.split(" (")[1]}
                  </>
                ) : (
                  dispositivoSelecionado.nome
                )}
              </h4>
            </div>

            <p className="wa-modal-text">
              {dispositivoSelecionado.localizacao} <br />
              <span style={{ fontSize: 13, color: "#8696a0" }}>
                Status: {dispositivoSelecionado.ativoAgora ? "Ativo" : "Sessão Aberta"}
              </span>
            </p>

            <div className="wa-modal-actions">
              <button
                className="wa-modal-btn cancel"
                onClick={() => setDispositivoSelecionado(null)}
              >
                Cancelar
              </button>
              <button
                className="wa-modal-btn disconnect"
                onClick={handleDesconectarConfirmado}
              >
                Desconectar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Aviso */}
      {mensagemToast && (
        <div className="wa-toast-aviso">
          <span>{mensagemToast}</span>
        </div>
      )}

      {/* Estilos CSS */}
      <style>{`
        .wa-disp-screen {
          position: fixed;
          inset: 0;
          background: #0b141a;
          color: #e9edef;
          z-index: 300;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
          WebkitTapHighlightColor: transparent;
        }

        .wa-disp-header {
          height: 60px;
          background: #0b141a;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 20px;
          border-bottom: 1px solid #1f2c34;
          flex-shrink: 0;
        }

        .wa-disp-back-btn {
          background: none;
          border: none;
          color: #aebac1;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .wa-disp-header h2 {
          font-size: 19px;
          font-weight: 500;
          margin: 0;
          color: #e9edef;
        }

        .wa-disp-container {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 20px;
          box-sizing: border-box;
          width: 100%;
        }

        .wa-scrollable::-webkit-scrollbar {
          width: 6px;
        }
        .wa-scrollable::-webkit-scrollbar-thumb {
          background-color: rgba(134, 150, 160, 0.2);
          border-radius: 3px;
        }

        .wa-disp-art {
          margin: 12px 0 20px 0;
          display: flex;
          justify-content: center;
        }

        .wa-disp-info-text {
          font-size: 14px;
          color: #8696a0;
          text-align: center;
          line-height: 1.4;
          max-width: 320px;
          margin: 0 0 24px 0;
        }

        .wa-blue-link { color: #53bdeb; cursor: pointer; }
        .wa-green-link { color: #00a884; cursor: pointer; }

        .wa-disp-action-btn {
          background: #00a884;
          color: #111b21;
          border: none;
          width: 100%;
          max-width: 340px;
          padding: 12px;
          font-weight: 600;
          border-radius: 24px;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 24px;
          transition: background-color 0.2s;
        }
        .wa-disp-action-btn:active { background: #008f72; }

        .wa-disp-divider {
          width: 100%;
          height: 8px;
          background: #111b21;
          margin-bottom: 20px;
          border-top: 1px solid #1f2c34;
          border-bottom: 1px solid #1f2c34;
        }

        .wa-disp-status-section {
          width: 100%;
          max-width: 360px;
          text-align: left;
        }

        .wa-disp-status-section h3 {
          font-size: 12px;
          color: #8696a0;
          font-weight: 600;
          margin: 0 0 4px 0;
          letter-spacing: 0.5px;
        }

        .wa-disp-instruction {
          font-size: 13px;
          color: #8696a0;
          margin: 0 0 16px 0;
        }

        .wa-disp-list {
          display: flex;
          flex-direction: column;
        }

        .wa-disp-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #1f2c34;
          cursor: pointer;
        }
        .wa-disp-row:last-child {
          border-bottom: none;
        }
        .wa-disp-row:active {
          opacity: 0.8;
        }

        .wa-disp-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #202c33;
          flex-shrink: 0;
        }

        .wa-disp-icon.suspeito {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.3);
        }

        .wa-disp-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow: hidden;
        }

        .wa-disp-title {
          font-size: 15px;
          color: #e9edef;
          font-weight: 400;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .wa-disp-title.danger {
          color: #ff6b6b;
          font-weight: 500;
        }

        .wa-disp-time {
          font-size: 13px;
          color: #8696a0;
        }

        .wa-disp-footer {
          margin-top: auto;
          display: flex;
          gap: 12px;
          align-items: flex-start;
          text-align: left;
          font-size: 12px;
          color: #8696a0;
          line-height: 1.4;
          padding-top: 32px;
          max-width: 350px;
          width: 100%;
        }
        .wa-disp-footer p { margin: 0; }

        .wa-toast-aviso {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          background: #222e35;
          color: #e1e7ea;
          padding: 12px 20px;
          border-radius: 20px;
          font-size: 13.5px;
          line-height: 18px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          z-index: 400;
          width: 85%;
          max-width: 320px;
          text-align: center;
          animation: toastFade 0.2s ease-out;
        }

        .wa-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
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
          box-sizing: border-box;
        }

        .wa-modal-header-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }

        .wa-modal-title {
          font-size: 16px;
          font-weight: 500;
          color: #e9edef;
          margin: 0;
          line-height: 1.3;
          word-break: break-word;
        }

        .wa-modal-text {
          font-size: 14px;
          color: #e9edef;
          margin: 0 0 24px 0;
          line-height: 1.4;
        }

        .wa-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 20px;
        }

        .wa-modal-btn {
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 6px 4px;
        }

        .wa-modal-btn.cancel { color: #00a884; }
        .wa-modal-btn.disconnect { color: #ff6b6b; }

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
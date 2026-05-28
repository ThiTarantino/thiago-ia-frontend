import { useState, useEffect, useRef } from "react";

type Contato = {
  id: number;
  nome: string;
  subtitulo?: string;
  corAvatar: string;
  iniciais: string;
};

const CONTATOS_MOCK: Contato[] = [
  { id: 1, nome: "Jon Snow", subtitulo: "No inverno...", corAvatar: "#9c27b0", iniciais: "JS" },
  { id: 2, nome: "Bella", subtitulo: "Disponível", corAvatar: "#00bcd4", iniciais: "B" },
  { id: 3, nome: "Desconhecido", corAvatar: "#607d8b", iniciais: "?" },
  { id: 4, nome: "Edward Cullen", corAvatar: "#ff9800", iniciais: "EC" },
  { id: 5, nome: "Anastasia Steele", subtitulo: "Baby", corAvatar: "#e91e63", iniciais: "AS" },
];

type Props = { onClose: () => void };

export default function ContatosPainel({ onClose }: Props) {
  const [isExiting, setIsExiting] = useState(false);
  const [avisoSemSinal, setAvisoSemSinal] = useState(false);
  
  // Estados da chamada
  const [emChamada, setEmChamada] = useState(false);
  const [statusChamada, setStatusChamada] = useState("Chamando...");
  const [segundos, setSegundos] = useState(0);
  const [chamadaConectada, setChamadaConectada] = useState(false);

  // Referências para os elementos de áudio
  const audioAjudaRef = useRef<HTMLAudioElement | null>(null);
  const audioChamandoRef = useRef<HTMLAudioElement | null>(null);
  
  // Referência do cronômetro
  const cronometroRef = useRef<number | null>(null);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleContatoClick = (contato: Contato) => {
    if (contato.nome === "Desconhecido") {
      setEmChamada(true);
      setStatusChamada("Chamando...");
      setSegundos(0);
      setChamadaConectada(false);
    } else {
      setAvisoSemSinal(true);
    }
  };

  // Controla o fluxo dos áudios (Interface de Ligação)
  useEffect(() => {
    let conexaoTimeout: number;

    if (emChamada) {
      // 1. Assim que clica, começa a tocar o som de "Chamando..." em loop
      if (audioChamandoRef.current) {
        audioChamandoRef.current.currentTime = 0;
        audioChamandoRef.current.play().catch((err) => {
          console.log("Erro ao tocar som de discagem:", err);
        });
      }

      // 2. Após 2.5 segundos, a chamada "atende"
      conexaoTimeout = window.setTimeout(() => {
        // Para o som de "Chamando..."
        if (audioChamandoRef.current) {
          audioChamandoRef.current.pause();
        }

        // Ativa o cronômetro e inicia o áudio principal
        setChamadaConectada(true);
        
        if (audioAjudaRef.current) {
          audioAjudaRef.current.currentTime = 0;
          audioAjudaRef.current.play().catch((err) => {
            console.log("Erro ao reproduzir o áudio de ajuda:", err);
          });
        }
      }, 2500); // Ajustei para 2.5s para dar tempo do som de ligação soar natural
    }

    return () => {
      window.clearTimeout(conexaoTimeout);
      if (cronometroRef.current) window.clearInterval(cronometroRef.current);
      
      // Força a parada de ambos se o componente desmontar ou desligar
      if (audioChamandoRef.current) audioChamandoRef.current.pause();
      if (audioAjudaRef.current) audioAjudaRef.current.pause();
    };
  }, [emChamada]);

  // Cronômetro ativo pós-conexão
  useEffect(() => {
    if (emChamada && chamadaConectada) {
      cronometroRef.current = window.setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (cronometroRef.current) {
        window.clearInterval(cronometroRef.current);
        cronometroRef.current = null;
      }
    };
  }, [emChamada, chamadaConectada]);

  // Formata os segundos em formato MM:SS
  const formatarTempo = (totalSegundos: number) => {
    const minutos = Math.floor(totalSegundos / 60);
    const tabsSegundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${tabsSegundos.toString().padStart(2, "0")}`;
  };

  // Desliga automaticamente quando o ajuda.mp3 terminar
  const handleAudioFim = () => {
    if (cronometroRef.current) window.clearInterval(cronometroRef.current);
    setStatusChamada("Chamada encerrada");
    setChamadaConectada(false);
    
    setTimeout(() => {
      setEmChamada(false);
    }, 2200);
  };

  // Controla o Toast do aviso de sem sinal
  useEffect(() => {
    if (avisoSemSinal) {
      const timer = setTimeout(() => setAvisoSemSinal(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [avisoSemSinal]);

  return (
    <div className={`wa-contatos-screen ${isExiting ? "exit" : ""}`}>
      {/* SEUS DOIS ÁUDIOS CONFIGURADOS */}
      <audio 
        ref={audioChamandoRef} 
        src="/audios/chamando.mp3" 
        loop 
      />
      <audio 
        ref={audioAjudaRef} 
        src="/audios/ajuda.mp3" 
        onEnded={handleAudioFim}
      />

      {/* Interface Principal da Lista de Contatos */}
      {!emChamada ? (
        <>
          <div className="wa-contatos-header">
            <button className="wa-back-btn" onClick={handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
              </svg>
            </button>
            <div className="wa-header-info">
              <h2>Contatos</h2>
              <span>0 selecionado</span>
            </div>
            <button className="wa-search-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
          </div>

          <div className="wa-contatos-lista">
            {CONTATOS_MOCK.map((contato) => (
              <div 
                key={contato.id} 
                className="wa-contato-item"
                onClick={() => handleContatoClick(contato)}
              >
                {contato.nome === "Desconhecido" ? (
                  <div className="wa-contato-avatar Padrao">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                ) : (
                  <div className="wa-contato-avatar" style={{ backgroundColor: contato.corAvatar }}>
                    {contato.iniciais}
                  </div>
                )}
                <div className="wa-contato-dados">
                  <span className="wa-contato-nome">{contato.nome}</span>
                  {contato.subtitulo && <span className="wa-contato-sub">{contato.subtitulo}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="wa-fab-container">
            <button className="wa-fab-btn" onClick={handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        /* Tela de Chamada Ativa */
        <div className="wa-call-screen">
          <div className="wa-call-top">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="wa-call-lock">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span>Criptografia de ponta a ponta</span>
          </div>

          <div className="wa-call-main">
            <div className="wa-call-avatar-container">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <h1 className="wa-call-name">Desconhecido</h1>
            <p className="wa-call-status">
              {chamadaConectada ? formatarTempo(segundos) : statusChamada}
            </p>
          </div>

          <div className="wa-call-bottom-bar">
            <div className="wa-call-action-btn passive">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            </div>
            <div className="wa-call-action-btn passive">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            </div>
            <div className="wa-call-action-btn passive">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/></svg>
            </div>
            
            {/* Botão de desligar interrompe qualquer áudio ativo */}
            <div className="wa-call-action-btn hangup" onClick={() => {
              if (audioChamandoRef.current) audioChamandoRef.current.pause();
              if (audioAjudaRef.current) audioAjudaRef.current.pause();
              setEmChamada(false);
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 9c-2.2 0-4.3.3-6.2.9v4c0 .5.3.9.7 1.1l2.5 1.2c.3.1.6.1.9-.1l1.9-1.9c.2-.2.3-.5.3-.8v-3.5c1.4-.4 2.8-.4 4.2 0v3.5c0 .3.1.6.3.8l1.9 1.9c.3.2.6.2.9.1l2.5-1.2c.4-.2.7-.6.7-1.1v-4c-1.9-.6-4-1-6.2-.9z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Aviso básico de Sem Sinal */}
      {avisoSemSinal && (
        <div className="wa-toast-aviso">
          <span>Sem sinal de rede no momento...</span>
        </div>
      )}

      <style>{`
        /* Mantendo os estilos idênticos para consistência visual */
        .wa-contatos-screen {
          position: fixed;
          inset: 0;
          background: #0b141a;
          z-index: 100;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          animation: screenSlideIn 0.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        .wa-contatos-screen.exit {
          animation: screenSlideOut 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        @keyframes screenSlideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes screenSlideOut { from { transform: translateX(0); } to { transform: translateX(100%); } }

        .wa-contatos-header {
          height: 60px;
          background: #0b141a;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .wa-back-btn, .wa-search-btn {
          background: none;
          border: none;
          color: #e9edef;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wa-header-info { flex: 1; display: flex; flex-direction: column; }
        .wa-header-info h2 { color: #e9edef; font-size: 18px; font-weight: 500; margin: 0; }
        .wa-header-info span { color: #8696a0; font-size: 13px; margin-top: 1px; }

        .wa-contatos-lista { flex: 1; overflow-y: auto; padding-top: 8px; }
        .wa-contato-item { display: flex; align-items: center; padding: 12px 16px; gap: 14px; cursor: pointer; }
        .wa-contato-item:active { background: #202c33; }

        .wa-contato-avatar {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 600;
          font-size: 16px;
        }
        .wa-contato-avatar.Padrao { background: #657786; color: #e9edef; }

        .wa-contato-dados { flex: 1; display: flex; flex-direction: column; }
        .wa-contato-nome { color: #e9edef; font-size: 16px; }
        .wa-contato-sub { color: #8696a0; font-size: 13px; margin-top: 2px; }

        .wa-fab-container { position: absolute; bottom: 28px; right: 20px; }
        .wa-fab-btn {
          width: 56px;
          height: 56px;
          background: #00a884;
          border: none;
          border-radius: 16px;
          color: #0b141a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          cursor: pointer;
        }

        .wa-toast-aviso {
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          background: #222e35;
          color: #e1e7ea;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          z-index: 110;
          animation: toastFade 0.2s ease-out;
        }

        @keyframes toastFade {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .wa-call-screen {
          position: fixed;
          inset: 0;
          background: #0e1b21;
          z-index: 120;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 40px 24px 60px 24px;
          color: #fff;
        }

        .wa-call-top {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #8696a0;
          font-size: 12px;
        }

        .wa-call-main {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          justify-content: center;
          margin-bottom: 80px;
        }

        .wa-call-avatar-container {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: #657786;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 0 0 8px rgba(255, 255, 255, 0.03);
        }

        .wa-call-name { font-size: 24px; font-weight: 500; margin: 0 0 8px 0; color: #e9edef; }
        .wa-call-status { font-size: 15px; color: #8696a0; margin: 0; min-width: 45px; text-align: center; }

        .wa-call-bottom-bar {
          width: 100%;
          max-width: 320px;
          background: #1c2d35;
          padding: 14px 24px;
          border-radius: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        .wa-call-action-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .wa-call-action-btn.passive { color: #aebac1; }
        .wa-call-action-btn.passive:active { background: rgba(255,255,255,0.08); }

        .wa-call-action-btn.hangup {
          background: #ea0038;
          color: #fff;
          transform: rotate(135deg);
        }
        .wa-call-action-btn.hangup:active { background: #c2002f; }
      `}</style>
    </div>
  );
}
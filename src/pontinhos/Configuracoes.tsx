import { useState } from "react";
import { 
  Search, 
  Key, 
  Lock, 
  MessageSquare, 
  Bell, 
  HardDrive, 
  Globe, 
  HelpCircle,
  QrCode
} from "lucide-react";
import { resolveCloudAssetSrc } from "../cloudAssets";

type ConfiguracoesProps = {
  onBack: () => void;
};

interface OpcaoConfiguracao {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const FOTO_PERFIL_USUARIO = resolveCloudAssetSrc("/imagens/foto_isabela.jpg");

export default function Configuracoes({ onBack }: ConfiguracoesProps) {
  const [modalAberto, setModalAberto] = useState(false);
  const [erroImagem, setErroImagem] = useState(false);

  // Estados do Header e Pesquisa Padronizada
  const [campoBuscaAberto, setCampoBuscaAberto] = useState(false);
  const [busca, setBusca] = useState("");

  const opcoes: OpcaoConfiguracao[] = [
    { 
      id: "conta",
      title: "Conta", 
      desc: "Notificações de segurança, mudança de número",
      icon: <Key size={20} color="#8696a0" /> 
    },
    { 
      id: "privacidade",
      title: "Privacidade", 
      desc: "Bloqueio de contatos, mensagens temporárias",
      icon: <Lock size={20} color="#8696a0" /> 
    },
    { 
      id: "conversas",
      title: "Conversas", 
      desc: "Tema, papéis de parede, histórico de conversas",
      icon: <MessageSquare size={20} color="#8696a0" /> 
    },
    { 
      id: "notificacoes",
      title: "Notificações", 
      desc: "Tons de mensagens, grupos e chamadas",
      icon: <Bell size={20} color="#8696a0" /> 
    },
    { 
      id: "armazenamento",
      title: "Armazenamento e dados", 
      desc: "Uso de rede, download automático",
      icon: <HardDrive size={20} color="#8696a0" /> 
    },
    { 
      id: "idioma",
      title: "Idioma do aplicativo", 
      desc: "Português (Brasil)",
      icon: <Globe size={20} color="#8696a0" /> 
    },
    { 
      id: "ajuda",
      title: "Ajuda", 
      desc: "Central de ajuda, fale conosco, política de privacidade",
      icon: <HelpCircle size={20} color="#8696a0" /> 
    },
  ];

  // Filtro de Busca
  const opcoesFiltradas = opcoes.filter((opt) =>
    opt.title.toLowerCase().includes(busca.toLowerCase()) ||
    opt.desc.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="wa-screen-std">
      {/* 1. Header Dinâmico Padronizado */}
      <div className="wa-std-header">
        {campoBuscaAberto ? (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 10 }}>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                backgroundColor: '#202c33',
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                color: '#e9edef',
                fontSize: 15,
                outline: 'none'
              }}
            />
            <span 
              onClick={() => { setCampoBuscaAberto(false); setBusca(''); }}
              style={{ color: '#00a884', cursor: 'pointer', fontSize: 14, fontWeight: '500', whiteSpace: 'nowrap' }}
            >
              Cancelar
            </span>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button className="wa-std-back-btn" onClick={onBack}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <h2>Configurações</h2>
            </div>
            <Search 
              size={22} 
              color="#aebac1" 
              style={{ cursor: 'pointer' }} 
              onClick={() => setCampoBuscaAberto(true)} 
            />
          </>
        )}
      </div>

      {/* 2. Conteúdo da Página */}
      <div className="wa-std-container">
        {/* Perfil do Usuário (Oculta ao pesquisar) */}
        {!busca && (
          <>
            <div className="wa-std-profile-row" onClick={() => setModalAberto(true)}>
              <div className="wa-std-avatar-lg">
                {!erroImagem ? (
                  <img
                    src={FOTO_PERFIL_USUARIO}
                    alt="Usuário"
                    onError={() => setErroImagem(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  "VC"
                )}
              </div>
              <div className="wa-std-item-info" style={{ flex: 1 }}>
                <span className="wa-std-title" style={{ fontSize: 17, fontWeight: '500' }}>Você</span>
                <span className="wa-std-sub">Disponível</span>
              </div>
              <QrCode size={22} color="#00a884" style={{ cursor: 'pointer' }} />
            </div>

            <div className="wa-std-divider" />
          </>
        )}

        {/* Lista de Opções Filtradas */}
        {opcoesFiltradas.length > 0 ? (
          opcoesFiltradas.map((opt) => (
            <div key={opt.id} className="wa-std-item-row" onClick={() => setModalAberto(true)}>
              <div className="wa-std-icon-container">
                {opt.icon}
              </div>
              <div className="wa-std-item-info">
                <span className="wa-std-title">{opt.title}</span>
                <span className="wa-std-sub">{opt.desc}</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 24, textAlign: 'center', color: '#8696a0', fontSize: 14 }}>
            Nenhuma opção encontrada
          </div>
        )}
      </div>

      {/* 3. Modal Informativo Padrão */}
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

      {/* Estilização CSS Interna */}
      <style>{`
        .wa-screen-std {
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
        .wa-std-header {
          height: 60px; 
          background: #0b141a; 
          display: flex; 
          align-items: center;
          justify-content: space-between;
          padding: 0 16px; 
          box-sizing: border-box;
          border-bottom: 1px solid #1f2c34;
        }
        .wa-std-back-btn {
          background: none; 
          border: none; 
          color: #aebac1; 
          cursor: pointer;
          display: flex; 
          align-items: center; 
          padding: 0;
        }
        .wa-std-header h2 { 
          font-size: 19px; 
          font-weight: 500; 
          margin: 0; 
          color: #e9edef; 
        }

        .wa-std-container { 
          flex: 1; 
          overflow-y: auto; 
          padding: 8px 0; 
        }
        
        .wa-std-profile-row {
          display: flex; 
          align-items: center; 
          gap: 16px; 
          padding: 12px 16px; 
          cursor: pointer;
        }
        .wa-std-profile-row:active {
          background-color: #202c33;
        }
        .wa-std-avatar-lg {
          width: 58px; 
          height: 58px; 
          border-radius: 50%; 
          background: #202c33;
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-weight: 600; 
          font-size: 20px; 
          color: #e9edef;
          overflow: hidden;
          flex-shrink: 0;
        }

        .wa-std-divider { 
          height: 1px; 
          background: #1f2c34; 
          margin: 4px 0; 
        }

        .wa-std-item-row {
          display: flex; 
          align-items: center; 
          gap: 20px; 
          padding: 16px; 
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .wa-std-item-row:active { 
          background: #202c33; 
        }
        .wa-std-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          flex-shrink: 0;
        }
        .wa-std-item-info { 
          display: flex; 
          flex-direction: column; 
          gap: 2px; 
        }
        .wa-std-title { 
          font-size: 16px; 
          color: #e9edef; 
          font-weight: 400; 
        }
        .wa-std-sub { 
          font-size: 13.5px; 
          color: #8696a0; 
          line-height: 1.3;
        }

        .wa-modal-overlay {
          position: fixed; 
          inset: 0; 
          background: rgba(0, 0, 0, 0.65);
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 500;
        }
        .wa-modal-content {
          background: #222e35; 
          border-radius: 14px; 
          width: 85%; 
          max-width: 320px;
          padding: 22px 24px 16px 24px; 
          box-shadow: 0 10px 24px rgba(0,0,0,0.5);
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
        }
        .wa-modal-btn { 
          background: none; 
          border: none; 
          font-size: 14px; 
          font-weight: 600; 
          cursor: pointer; 
        }
        .wa-modal-btn.cancel { 
          color: #00a884; 
        }
      `}</style>
    </div>
  );
}
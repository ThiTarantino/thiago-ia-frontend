import { useState } from "react";
import { Search, MoreVertical, ArrowLeft, Star } from "lucide-react";
import { resolveCloudAssetSrc } from "./cloudAssets";

type FavoritasProps = {
  onBack: () => void;
};

interface MensagemFavorita {
  id: number;
  remetente: string;
  avatar?: string;
  conteudo: string;
  data: string;
  horario: string;
  minhaMensagem?: boolean;
}

// 9 Mensagens marcadas como favoritas da conversa
const MENSAGENS_FAVORITAS: MensagemFavorita[] = [
  {
    id: 1,
    remetente: "Thiago 2.0",
    avatar: resolveCloudAssetSrc("/imagens/foto1.jpg"),
    conteudo: "CASA COMIGO AGORAAAAAAAAAAAAA",
    data: "12 de maio",
    horario: "14:22",
    minhaMensagem: false,
  },
  {
    id: 2,
    remetente: "Carly Shay",
    avatar: resolveCloudAssetSrc("/imagens/carly5.jfif"),
    conteudo: "Aquece o meu coração só de ouvir a sua voz! 💖",
    data: "28 de julho",
    horario: "09:30",
    minhaMensagem: false,
  },
  {
    id: 3,
    remetente: "Thiago 2.0",
    avatar: resolveCloudAssetSrc("/imagens/foto1.jpg"),
    conteudo: "Tava aqui pensando em você... Dorme bem, tá? 🥰",
    data: "Ontem",
    horario: "21:40",
    minhaMensagem: false,
  },
  {
    id: 4,
    remetente: "Elena",
    avatar: resolveCloudAssetSrc("/imagens/elena.jfif"),
    conteudo: "Comprei os seus doces favoritos pra levar quando a gente se ver! 🍫",
    data: "22 de julho",
    horario: "16:15",
    minhaMensagem: false,
  },
  {
    id: 5,
    remetente: "Você",
    avatar: resolveCloudAssetSrc("/imagens/foto_isabela.jpg"),
    conteudo: "Mal posso esperar pelo nosso próximo final de semana juntos ✨",
    data: "25 de julho",
    horario: "11:08",
    minhaMensagem: true,
  },
  {
    id: 6,
    remetente: "Carly Shay",
    avatar: resolveCloudAssetSrc("/imagens/carly5.jfif"),
    conteudo: "Você me faz querer ser alguém melhor a cada segundo.",
    data: "27 de julho",
    horario: "23:50",
    minhaMensagem: false,
  },
  {
    id: 7,
    remetente: "Thiago 2.0",
    avatar: resolveCloudAssetSrc("/imagens/foto1.jpg"),
    conteudo: "Seu sorriso é a melhor parte do meu dia. Sempre.",
    data: "18 de junho",
    horario: "18:05",
    minhaMensagem: false,
  },
  {
    id: 8,
    remetente: "Você",
    avatar: resolveCloudAssetSrc("/imagens/foto_isabela.jpg"),
    conteudo: "Promete que nunca vai esquecer desse momento?",
    data: "Ontem",
    horario: "19:12",
    minhaMensagem: true,
  },
  {
    id: 9,
    remetente: "Sam Puckett",
    avatar: resolveCloudAssetSrc("/imagens/sam.jfif"),
    conteudo: "Eu prometo pra sempre. Você é inesquecível.",
    data: "Hoje",
    horario: "00:05",
    minhaMensagem: false,
  },
];

export default function MensagensFavoritas({ onBack }: FavoritasProps) {
  // Estados do Header e Pesquisa Padronizada
  const [campoBuscaAberto, setCampoBuscaAberto] = useState(false);
  const [busca, setBusca] = useState("");

  // Filtro de Busca pelas Mensagens
  const mensagensFiltradas = MENSAGENS_FAVORITAS.filter(
    (msg) =>
      msg.conteudo.toLowerCase().includes(busca.toLowerCase()) ||
      msg.remetente.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="wa-fav-screen">
      {/* 1. Header Dinâmico Padronizado */}
      <div className="wa-fav-header">
        {campoBuscaAberto ? (
          <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 10 }}>
            <input
              type="text"
              placeholder="Pesquisar mensagens..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                backgroundColor: "#202c33",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                color: "#e9edef",
                fontSize: 15,
                outline: "none",
              }}
            />
            <span
              onClick={() => {
                setCampoBuscaAberto(false);
                setBusca("");
              }}
              style={{ color: "#00a884", cursor: "pointer", fontSize: 14, fontWeight: "500", whiteSpace: "nowrap" }}
            >
              Cancelar
            </span>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button className="wa-fav-back-btn" onClick={onBack}>
                <ArrowLeft size={22} />
              </button>
              <h2>Mensagens favoritas</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20, color: "#aebac1" }}>
              <Search
                size={22}
                style={{ cursor: "pointer" }}
                onClick={() => setCampoBuscaAberto(true)}
              />
              <MoreVertical size={22} style={{ cursor: "pointer" }} />
            </div>
          </>
        )}
      </div>

      {/* 2. Container das Mensagens com Scroll */}
      <div className="wa-fav-container wa-scrollable">
        {mensagensFiltradas.length > 0 ? (
          mensagensFiltradas.map((msg) => (
            <div key={msg.id} className="wa-fav-card-group">
              {/* Header do Card (Contato e Data) */}
              <div className="wa-fav-card-header">
                <div className="wa-fav-sender-info">
                  <div className="wa-fav-avatar">
                    {msg.avatar ? (
                      <img src={msg.avatar} alt={msg.remetente} />
                    ) : (
                      msg.remetente.charAt(0)
                    )}
                  </div>
                  <span className="wa-fav-sender-name">{msg.remetente}</span>
                </div>
                <span className="wa-fav-date">{msg.data}</span>
              </div>

              {/* Balão da Mensagem */}
              <div className={`wa-fav-bubble ${msg.minhaMensagem ? "sent" : "received"}`}>
                <p className="wa-fav-text">{msg.conteudo}</p>
                <div className="wa-fav-footer">
                  <Star size={12} fill="#e9edef" color="#e9edef" style={{ marginRight: 4 }} />
                  <span>{msg.horario}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: 32, textAlign: "center", color: "#8696a0", fontSize: 14 }}>
            Nenhuma mensagem favorita encontrada
          </div>
        )}
      </div>

      {/* Estilização CSS Interna */}
      <style>{`
        .wa-fav-screen {
          position: fixed;
          inset: 0;
          background: #0b141a;
          color: #e9edef;
          z-index: 300;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          WebkitTapHighlightColor: transparent;
        }

        .wa-fav-header {
          height: 60px;
          background: #0b141a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          box-sizing: border-box;
          border-bottom: 1px solid #1f2c34;
          flex-shrink: 0;
        }

        .wa-fav-back-btn {
          background: none;
          border: none;
          color: #aebac1;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }

        .wa-fav-header h2 {
          font-size: 19px;
          font-weight: 500;
          margin: 0;
          color: #e9edef;
        }

        .wa-fav-container {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background-color: #0b141a;
        }

        /* Estilização da Barra de Scroll */
        .wa-scrollable::-webkit-scrollbar {
          width: 6px;
        }
        .wa-scrollable::-webkit-scrollbar-thumb {
          background-color: rgba(134, 150, 160, 0.2);
          border-radius: 3px;
        }
        .wa-scrollable::-webkit-scrollbar-track {
          background: transparent;
        }

        .wa-fav-card-group {
          display: flex;
          flex-direction: column;
          background: #111b21;
          border-radius: 10px;
          padding: 12px;
          border: 1px solid #1f2c34;
        }

        .wa-fav-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .wa-fav-sender-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .wa-fav-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #202c33;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
          color: #e9edef;
          overflow: hidden;
          flex-shrink: 0;
        }

        .wa-fav-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .wa-fav-sender-name {
          font-size: 14px;
          color: #e9edef;
          font-weight: 500;
        }

        .wa-fav-date {
          font-size: 12px;
          color: #8696a0;
        }

        .wa-fav-bubble {
          display: flex;
          flex-direction: column;
          padding: 8px 12px;
          border-radius: 8px;
          max-width: 90%;
          position: relative;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .wa-fav-bubble.received {
          background: #202c33;
          align-self: flex-start;
          border-top-left-radius: 2px;
        }

        .wa-fav-bubble.sent {
          background: #005c4b;
          align-self: flex-end;
          border-top-right-radius: 2px;
        }

        .wa-fav-text {
          font-size: 14.5px;
          line-height: 1.4;
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
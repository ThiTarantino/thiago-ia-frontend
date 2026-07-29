import { useState, useEffect, useRef } from "react";
import type { ChatMeta } from "./chats";
import AtualizacoesPage from "../Telainicial/AtualizacoesPage";
import ComunidadesPage from "../Telainicial/ComunidadesPage";
import LigacoesPage from "../Telainicial/LigacoesPage";
import "./HomeChatList.css";

// --- Ícones ---
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
  </svg>
);
const IconMore = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);
const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </svg>
);
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
    <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
  </svg>
);
const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
  </svg>
);
const IconStatus = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
  </svg>
);
const IconCommunities = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);
const IconCall = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
  </svg>
);
const IconGameController = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H9v2H7v-2H5v-2h2V9h2v2h2v2zm4.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
  </svg>
);
const IconMusic = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

export type ItemLista = ChatMeta & {
  ultimaMensagem: string;
  hora: string;
  naoLidas?: number;
  favorito?: boolean;
};

type NavTab = "conversas" | "atualizacoes" | "comunidades" | "ligacoes";

interface HomeChatListProps {
  chats: ItemLista[];
  onAbrir: (id: string) => void;
  onAbrirGameHub?: () => void;
  onAbrirSpotify?: () => void;
  onNavegar: (pagina: string) => void;
}

export default function HomeChatList({
  chats,
  onAbrir,
  onAbrirGameHub,
  onAbrirSpotify,
  onNavegar,
}: HomeChatListProps) {
  const [abaFiltro, setAbaFiltro] = useState<"todas" | "nao-lidas" | "favoritos">("todas");
  const [navAtiva, setNavAtiva] = useState<NavTab>("conversas");
  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o menu de 3 pontinhos ao clicar em qualquer lugar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    }
    if (menuAberto) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuAberto]);

  const handleOpcaoMenu = (pagina: string) => {
    setMenuAberto(false);
    onNavegar(pagina);
  };

  const chatsFiltrados = chats.filter((chat) => {
    const bateuBusca = chat.nome.toLowerCase().includes(busca.toLowerCase());
    if (!bateuBusca) return false;
    if (abaFiltro === "nao-lidas") return (chat.naoLidas ?? 0) > 0;
    if (abaFiltro === "favoritos") return Boolean(chat.favorito);
    return true;
  });

  const ordenados = [...chatsFiltrados].sort((a, b) => Number(b.fixado) - Number(a.fixado));

  return (
    <div className="wa-home">
      {/* Header Superior */}
      <header className="wa-home-header">
        <span className="wa-home-title">WhatsApp</span>
        <div className="wa-home-header-actions" ref={menuRef}>
          {/* Câmera navega para a tela CameraQuebrada */}
          <button className="wa-icon-btn" onClick={() => onNavegar("camera-quebrada")}>
            <IconCamera />
          </button>
          <button className="wa-icon-btn" onClick={() => setMenuAberto(!menuAberto)}>
            <IconMore />
          </button>

          {/* Menu Dropdown */}
          {menuAberto && (
            <div className="wa-dropdown-menu">
              <div className="wa-dropdown-item" onClick={() => handleOpcaoMenu("novo-grupo")}>
                Novo grupo
              </div>
              <div className="wa-dropdown-item" onClick={() => handleOpcaoMenu("nova-transmissao")}>
                Nova transmissão
              </div>
              <div className="wa-dropdown-item" onClick={() => handleOpcaoMenu("dispositivos")}>
                Dispositivos conectados
              </div>
              <div className="wa-dropdown-item" onClick={() => handleOpcaoMenu("favoritas")}>
                Mensagens favoritas
              </div>
              <div className="wa-dropdown-item" onClick={() => handleOpcaoMenu("configuracoes")}>
                Configurações
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo da Aba Selecionada */}
      {navAtiva === "conversas" && (
        <>
          <div className="wa-home-search">
            <IconSearch />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "#e9edef",
                outline: "none",
                width: "100%",
                fontSize: "14px",
              }}
            />
          </div>

          <div className="wa-home-tabs">
            <button
              className={`wa-home-tab ${abaFiltro === "todas" ? "active" : ""}`}
              onClick={() => setAbaFiltro("todas")}
            >
              Todas
            </button>
            <button
              className={`wa-home-tab ${abaFiltro === "nao-lidas" ? "active" : ""}`}
              onClick={() => setAbaFiltro("nao-lidas")}
            >
              Não lidas
            </button>
            <button
              className={`wa-home-tab ${abaFiltro === "favoritos" ? "active" : ""}`}
              onClick={() => setAbaFiltro("favoritos")}
            >
              Favoritos
            </button>
            <button className="wa-home-tab-add">+</button>
          </div>

          <div className="wa-home-scroll">
            {ordenados.length === 0 ? (
              <div className="wa-home-empty-page">Nenhuma conversa encontrada</div>
            ) : (
              ordenados.map((chat) => (
                <div key={chat.id} className="wa-home-item" onClick={() => onAbrir(chat.id)}>
                  <div className="wa-home-avatar">
                    <img src={chat.avatar} alt={chat.nome} />
                  </div>
                  <div className="wa-home-info">
                    <div className="wa-home-row-top">
                      <span className="wa-home-nome">{chat.nome}</span>
                      <span className={`wa-home-hora ${(chat.naoLidas ?? 0) > 0 ? "unread" : ""}`}>
                        {chat.hora}
                      </span>
                    </div>
                    <div className="wa-home-row-bottom">
                      <span className="wa-home-preview">{chat.ultimaMensagem}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {chat.fixado && <IconPin />}
                        {(chat.naoLidas ?? 0) > 0 && (
                          <span className="wa-home-badge">{chat.naoLidas}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Botões Flutuantes (FABs) */}
          <div className="wa-fab-container">
            <button
              className="wa-fab-gamehub"
              title="Abrir GameHub"
              onClick={onAbrirGameHub}
            >
              <IconGameController />
            </button>
            <button
              className="wa-fab-spotify"
              title="Abrir Spotify"
              onClick={onAbrirSpotify}
            >
              <IconMusic />
            </button>
          </div>
        </>
      )}

      {navAtiva === "atualizacoes" && <AtualizacoesPage />}
      {navAtiva === "comunidades" && <ComunidadesPage />}
      {navAtiva === "ligacoes" && <LigacoesPage />}

      {/* Navegação Inferior */}
      <nav className="wa-home-bottomnav">
        <div
          className={`wa-home-navitem ${navAtiva === "conversas" ? "active" : ""}`}
          onClick={() => setNavAtiva("conversas")}
        >
          <IconChat />
          <span>Conversas</span>
        </div>
        <div
          className={`wa-home-navitem ${navAtiva === "atualizacoes" ? "active" : ""}`}
          onClick={() => setNavAtiva("atualizacoes")}
        >
          <IconStatus />
          <span>Atualizações</span>
        </div>
        <div
          className={`wa-home-navitem ${navAtiva === "comunidades" ? "active" : ""}`}
          onClick={() => setNavAtiva("comunidades")}
        >
          <IconCommunities />
          <span>Comunidades</span>
        </div>
        <div
          className={`wa-home-navitem ${navAtiva === "ligacoes" ? "active" : ""}`}
          onClick={() => setNavAtiva("ligacoes")}
        >
          <IconCall />
          <span>Ligações</span>
        </div>
      </nav>
    </div>
  );
}
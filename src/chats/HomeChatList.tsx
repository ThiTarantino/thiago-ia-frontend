import { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  MoreVertical, 
  Search, 
  Pin, 
  MessageSquare, 
  CircleDot, 
  Users, 
  Phone, 
  Gamepad2,
  Music,
  Plus, 
  VolumeX,
  CheckCheck
} from "lucide-react";
import type { ChatMeta } from "./chats";
import AtualizacoesPage from "../Telainicial/AtualizacoesPage";
import ComunidadesPage from "../Telainicial/ComunidadesPage";
import LigacoesPage from "../Telainicial/LigacoesPage";

// IMPORTE AS DUAS TELAS (Ajuste o caminho relativo se necessário)
import GameHub from "../GameHub";
import SpotifyPlayer from "../AttachPanelApp/SpotifyPlayer";

import "./HomeChatList.css";

export type ItemLista = ChatMeta & {
  ultimaMensagem: string;
  hora: string;
  naoLidas?: number;
  favorito?: boolean;
  silenciado?: boolean;
  enviadoPorMim?: boolean;
  letter?: string;
  bg?: string;
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
  
  // ESTADO PARA ABRIR O GAME HUB OU SPOTIFY DIRECTAMENTE
  const [subTela, setSubTela] = useState<"nenhuma" | "gameHub" | "spotify">("nenhuma");

  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const totalNaoLidas = chats.reduce((acc, curr) => acc + (curr.naoLidas || 0), 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAberto(false);
      }
    }
    if (menuAberto) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuAberto]);

  const handleOpcaoMenu = (pagina: string) => {
    setMenuAberto(false);
    onNavegar(pagina);
  };

  // HANDLERS PARA ABRIR AS TELAS
  const handleAbreGameHub = () => {
    if (onAbrirGameHub) {
      onAbrirGameHub();
    } else {
      setSubTela("gameHub");
    }
  };

  const handleAbreSpotify = () => {
    if (onAbrirSpotify) {
      onAbrirSpotify();
    } else {
      setSubTela("spotify");
    }
  };

  // RENDERIZAÇÃO CONDICIONAL DAS SUBTELAS (SE ABERTAS)
  // RENDERIZAÇÃO CONDICIONAL DAS SUBTELAS (SE ABERTAS)
  if (subTela === "gameHub") {
    return <GameHub onBack={() => setSubTela("nenhuma")} />;
  }

  if (subTela === "spotify") {
    return <SpotifyPlayer onClose={() => setSubTela("nenhuma")} />;
  }

  const chatsFiltrados = chats.filter((chat) => {
    const bateuBusca = chat.nome.toLowerCase().includes(busca.toLowerCase());
    if (!bateuBusca) return false;
    if (abaFiltro === "nao-lidas") return (chat.naoLidas ?? 0) > 0;
    if (abaFiltro === "favoritos") return Boolean(chat.favorito);
    return true;
  });

  const ordenados = [...chatsFiltrados].sort((a, b) => Number(b.fixado) - Number(a.fixado));

  return (
    <div className="home-container">

      {/* --- HEADER SUPERIOR --- */}
      {navAtiva === "conversas" && (
        <header className="home-header">
          <h1 className="home-header-title">WhatsApp</h1>
          <div className="home-header-actions" ref={menuRef}>
            <Camera size={22} className="header-icon" onClick={() => onNavegar("camera-quebrada")} />
            <MoreVertical size={22} className="header-icon" onClick={() => setMenuAberto(!menuAberto)} />

            {menuAberto && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => handleOpcaoMenu("novo-grupo")}>Novo grupo</div>
                <div className="dropdown-item" onClick={() => handleOpcaoMenu("nova-transmissao")}>Nova transmissão</div>
                <div className="dropdown-item" onClick={() => handleOpcaoMenu("dispositivos")}>Dispositivos conectados</div>
                <div className="dropdown-item" onClick={() => handleOpcaoMenu("favoritas")}>Mensagens favoritas</div>
                <div className="dropdown-item" onClick={() => handleOpcaoMenu("configuracoes")}>Configurações</div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* --- CONTEÚDO PRINCIPAL --- */}
      {navAtiva === "conversas" && (
        <div className="home-content">
          
          {/* BARRA DE PESQUISA */}
          <div className="search-bar-container">
            <div className="search-bar-wrapper">
              <Search size={18} color="#8696a0" />
              <input
                type="text"
                className="search-input"
                placeholder="Pergunte à Meta AI ou pesquise"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          {/* CHIPS DE FILTRO */}
          <div className="chips-container">
            <button
              onClick={() => setAbaFiltro("todas")}
              className={`chip ${abaFiltro === "todas" ? "active" : "inactive"}`}
            >
              Todas
            </button>
            <button
              onClick={() => setAbaFiltro("nao-lidas")}
              className={`chip ${abaFiltro === "nao-lidas" ? "active" : "inactive"}`}
            >
              Não lidas {totalNaoLidas > 0 && <span>{totalNaoLidas}</span>}
            </button>
            <button
              onClick={() => setAbaFiltro("favoritos")}
              className={`chip ${abaFiltro === "favoritos" ? "active" : "inactive"}`}
            >
              Favoritos
            </button>
            <button className="chip-add-btn">
              <Plus size={16} />
            </button>
          </div>

          {/* LISTA DE CONVERSAS */}
          <div className="chat-list">
            {ordenados.length === 0 ? (
              <div className="chat-empty-state">
                Nenhuma conversa encontrada
              </div>
            ) : (
              ordenados.map((chat) => (
                <div
                  key={chat.id}
                  className="chat-item"
                  onClick={() => onAbrir(chat.id)}
                >
                  {/* AVATAR */}
                  <div 
                    className="chat-avatar" 
                    style={{ backgroundColor: chat.bg || "#2a3942" }}
                  >
                    {chat.avatar ? (
                      <img src={chat.avatar} alt={chat.nome} className="chat-avatar-img" />
                    ) : (
                      chat.letter || chat.nome.substring(0, 2).toUpperCase()
                    )}
                  </div>

                  {/* INFO CONVERSA */}
                  <div className="chat-info">
                    <div className="chat-info-top">
                      <span className="chat-name">{chat.nome}</span>
                      <span className={`chat-time ${(chat.naoLidas ?? 0) > 0 ? "unread" : ""}`}>
                        {chat.hora}
                      </span>
                    </div>

                    <div className="chat-info-bottom">
                      <div className="chat-message-preview">
                        {chat.enviadoPorMim && <CheckCheck size={16} color="#53bdeb" />}
                        <span className="chat-last-msg">{chat.ultimaMensagem}</span>
                      </div>

                      <div className="chat-meta-icons">
                        {chat.silenciado && <VolumeX size={15} color="#8696a0" />}
                        {chat.fixado && <Pin size={15} color="#8696a0" className="pin-icon" />}
                        {(chat.naoLidas ?? 0) > 0 && (
                          <span className="unread-badge">{chat.naoLidas}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- OUTRAS PÁGINAS --- */}
      {navAtiva === "atualizacoes" && <AtualizacoesPage />}
      {navAtiva === "comunidades" && <ComunidadesPage />}
      {navAtiva === "ligacoes" && <LigacoesPage />}

      {/* --- FLOATING ACTION BUTTONS --- */}
      {navAtiva === "conversas" && (
        <div className="fabs-container">
          {/* Botão Superior: Hub de Jogos */}
          <button 
            className="fab-secondary" 
            onClick={handleAbreGameHub}
            title="Hub de Jogos"
          >
            <Gamepad2 size={20} color="#00a884" />
          </button>

          {/* Botão Inferior Principal: Spotify */}
          <button 
            className="fab-primary" 
            onClick={handleAbreSpotify}
            title="Spotify"
          >
            <Music size={26} color="#111b21" />
          </button>
        </div>
      )}

      {/* --- BOTTOM NAVIGATION --- */}
      <nav className="bottom-nav">
        <div className="nav-item" onClick={() => setNavAtiva("conversas")}>
          <div className={`nav-icon-wrapper ${navAtiva === "conversas" ? "active" : ""}`}>
            <MessageSquare size={20} color={navAtiva === "conversas" ? "#25d366" : "#8696a0"} />
            {totalNaoLidas > 0 && <span className="nav-badge">{totalNaoLidas}</span>}
          </div>
          <span className={`nav-label ${navAtiva === "conversas" ? "active" : ""}`}>Conversas</span>
        </div>

        <div className="nav-item" onClick={() => setNavAtiva("atualizacoes")}>
          <div className={`nav-icon-wrapper ${navAtiva === "atualizacoes" ? "active" : ""}`}>
            <CircleDot size={20} color={navAtiva === "atualizacoes" ? "#25d366" : "#8696a0"} />
          </div>
          <span className={`nav-label ${navAtiva === "atualizacoes" ? "active" : ""}`}>Atualizações</span>
        </div>

        <div className="nav-item" onClick={() => setNavAtiva("comunidades")}>
          <div className={`nav-icon-wrapper ${navAtiva === "comunidades" ? "active" : ""}`}>
            <Users size={20} color={navAtiva === "comunidades" ? "#25d366" : "#8696a0"} />
          </div>
          <span className={`nav-label ${navAtiva === "comunidades" ? "active" : ""}`}>Comunidades</span>
        </div>

        <div className="nav-item" onClick={() => setNavAtiva("ligacoes")}>
          <div className={`nav-icon-wrapper ${navAtiva === "ligacoes" ? "active" : ""}`}>
            <Phone size={20} color={navAtiva === "ligacoes" ? "#25d366" : "#8696a0"} />
          </div>
          <span className={`nav-label ${navAtiva === "ligacoes" ? "active" : ""}`}>Ligações</span>
        </div>
      </nav>
    </div>
  );
}
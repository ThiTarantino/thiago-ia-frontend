import { useState } from "react";
import HomeChatList from "./chats/HomeChatList";
import DispositivosConectados from "./DispositivosConectados";
import CameraQuebrada from "./AttachPanelApp/CameraQuebrada";

// Importações dos 3 pontinhos
import NovoGrupo from "./pontinhos/NovoGrupo";
import NovaTransmissao from "./pontinhos/NovaTransmissao";
import MensagensFavoritas from "./MensagensFavoritas";
import Configuracoes from "./pontinhos/Configuracoes";

// Componentes dos Chats Individuais
import App from "./chats/App"; // O Thiago 2.0 é o seu App.tsx
import ChatDrake from "./chats/Chatdrake";
import ChatMae from "./chats/ChatMae";
import ChatMariana from "./chats/ChatMariana";
import ChatEu from "./chats/ChatEu"; // Chat de anotações (sem respostas)

import { LISTA_CHATS_MOCK } from "./chats/chats";
import ChatCarly from "./chats/ChatCarly";

export default function Root() {
  const [paginaAtiva, setPaginaAtiva] = useState<string>("home");
  const [chatAbertoId, setChatAbertoId] = useState<string | null>(null);

  // Renderiza o chat específico aberto
  if (chatAbertoId) {
    switch (chatAbertoId) {
      case "thiago-2.0":
        // O Thiago 2.0 abre a aplicação principal (App.tsx)
       return <App onBack={() => setChatAbertoId(null)} />;
      case "eu-voce":
        return <ChatEu onBack={() => setChatAbertoId(null)} />;
      case "drake":
        return <ChatDrake onBack={() => setChatAbertoId(null)} />;
      case "mae":
        return <ChatMae onBack={() => setChatAbertoId(null)} />;
        case "carly":
        return <ChatCarly onBack={() => setChatAbertoId(null)} />;
      case "mariana":
        return <ChatMariana onBack={() => setChatAbertoId(null)} />;
      default:
        break;
    }
  }

  // Navegação entre as telas secundárias / Home
  const renderPagina = () => {
    switch (paginaAtiva) {
      case "camera-quebrada":
        return <CameraQuebrada onClose={() => setPaginaAtiva("home")} />;
      case "dispositivos":
        return <DispositivosConectados onBack={() => setPaginaAtiva("home")} />;
      case "novo-grupo":
        return <NovoGrupo onBack={() => setPaginaAtiva("home")} />;
      case "nova-transmissao":
        return <NovaTransmissao onBack={() => setPaginaAtiva("home")} />;
      case "favoritas":
        return <MensagensFavoritas onBack={() => setPaginaAtiva("home")} />;
      case "configuracoes":
        return <Configuracoes onBack={() => setPaginaAtiva("home")} />;
      default:
        return (
          <HomeChatList
            chats={LISTA_CHATS_MOCK}
            onAbrir={(id) => setChatAbertoId(id)}
            onNavegar={(pagina) => setPaginaAtiva(pagina)}
          />
        );
    }
  };

  return <>{renderPagina()}</>;
}
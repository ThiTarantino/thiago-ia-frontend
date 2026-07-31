import { resolveCloudAssetSrc } from "../cloudAssets";
export interface ChatMeta {
  id: string;
  nome: string;
  avatar: string;
  fixado?: boolean;
  naoLidas?: number;
  ultimaMensagem: string;
  hora: string;
  favorito?: boolean;
}

export const LISTA_CHATS_MOCK: ChatMeta[] = [
  {
    id: "thiago-2.0",
    nome: "Thiago 2.0",
    avatar: resolveCloudAssetSrc("/imagens/foto1.jpg"), // substitua pela foto desejada
    fixado: true,
    naoLidas: 1,
    ultimaMensagem: "Oi! Sou o Thiago 2.0, um clone digital...",
    hora: "agora",
    favorito: true,
  },
  {
    id: "eu-voce",
    nome: "Eu (Você)",
    avatar: resolveCloudAssetSrc("/imagens/foto_isabela.jpg"),
    fixado: true,
    naoLidas: 0,
    ultimaMensagem: "Eu sou muito chata",
    hora: "23:53",
    favorito: true,
  },
  {
    id: "elena",
    nome: "Elena",
    avatar: resolveCloudAssetSrc("/imagens/elena.jfif"),
    fixado: false,
    naoLidas: 0,
    ultimaMensagem: "Oi vampirinha, tudo bem?",
    hora: "23:50",
  },
  {
    id: "desconhecido",
    nome: "Desconhecido",
    avatar: resolveCloudAssetSrc("/imagens/desconhecido.jfif"),
    fixado: false,
    naoLidas: 0,
    ultimaMensagem: "Oi",
    hora: "agora",
  },
  {
    id: "carly",
    nome: "Carly",
    avatar: resolveCloudAssetSrc("/imagens/carly5.jfif"),
    fixado: false,
    naoLidas: 0,
    ultimaMensagem: "E aí! Bom te ver por aqui",
    hora: "agora",
  },
  {
    id: "Sam",
    nome: "Sam",
    avatar: resolveCloudAssetSrc("/imagens/sam.jfif"),
    fixado: false,
    naoLidas: 0,
    ultimaMensagem: "E aí! Bom te ver por aqui",
    hora: "agora",
  },
  {
    id: "drake",
    nome: "Timão & Pumba",
    avatar: resolveCloudAssetSrc("/imagens/timao.jfif"),
    fixado: false,
    naoLidas: 0,
    ultimaMensagem: "E aí! Bom te ver por aqui",
    hora: "agora",
  },
  
  
];
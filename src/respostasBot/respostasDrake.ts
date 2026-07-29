import { criarRespostaLocal, type GrupoResposta } from "./respostasLocais";


const BANCO: GrupoResposta[] = [
  {
    frases: ["oi", "oii", "oiii", "e ai", "eae", "eaí", "e aí", "salve", "opa", "bom dia", "boa tarde", "boa noite"],
    palavras: ["oi", "oii", "eai", "salve", "opa"],
    respostas: ["E aí! Bom te ver por aqui 👋", "Fala aí!", "Salve salve!", "Eaí, beleza?", "Opa, tudo certo?"],
  },
  {
    frases: ["tudo bem", "tudo bom", "como você tá", "como voce ta", "como vai"],
    palavras: ["tudo bem", "tudo bom", "como vai"],
    respostas: ["To de boa, e você?", "Tudo certo por aqui, e contigo?", "Suave, na correria mas de boa 😄"],
  },
  {
    frases: ["vamos jogar", "bora jogar", "partida", "cs", "valorant", "lol"],
    palavras: ["jogar", "partida"],
    respostas: ["Bora! To on daqui a pouco 🎮", "Manda o horário que eu entro", "Sempre pronto pra uma partida"],
  },
  {
    frases: ["bora sair", "rolê", "role", "fim de semana"],
    palavras: ["rolê", "role", "sair"],
    respostas: ["Bora marcar aquele rolê esse fim de semana", "To dentro! Só me avisa o horário", "Faz tempo que a gente não sai"],
  },
  {
    frases: ["kkk", "kkkk", "kkkkk", "haha", "hahaha", "rsrs"],
    palavras: ["kkk", "haha", "rs"],
    respostas: ["kkkkk boa essa", "kkkkkk verdade", "haha imagina"],
  },
  {
    frases: ["falou", "flw", "tchau", "até mais", "ate mais"],
    palavras: ["falou", "flw", "tchau"],
    respostas: ["Falou, qualquer coisa me chama!", "Falou! Até mais", "Fechou, até já"],
  },
];

const GENERICAS = [
  "Boa, manda mais",
  "Kkkk verdade",
  "Depois te conto uma coisa",
  "Show!",
  "Pode falar",
  "Tamo junto",
];

export const respostasDrake = criarRespostaLocal(BANCO, GENERICAS);

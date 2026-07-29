import { criarRespostaLocal, type GrupoResposta } from "./respostasLocais";

const BANCO: GrupoResposta[] = [
  {
    frases: ["oi", "oii", "bom dia", "boa tarde", "boa noite", "e ai", "eai"],
    palavras: ["oi", "oii", "bom dia", "boa tarde"],
    respostas: ["Oi! Tudo certo por aí?", "Oii, bom dia!", "Fala, tudo bem?"],
  },
  {
    frases: ["reunião", "reuniao", "call", "meeting"],
    palavras: ["reunião", "reuniao", "call"],
    respostas: ["Vi sua mensagem, te respondo em instantes", "Tô numa reunião agora, já te retorno", "Depois da call eu te chamo"],
  },
  {
    frases: ["arquivo", "documento", "planilha", "relatório", "relatorio"],
    palavras: ["arquivo", "planilha", "relatório"],
    respostas: ["Depois me manda aquele arquivo, por favor", "Vou revisar e te retorno ainda hoje", "Pode deixar, cuido disso"],
  },
  {
    frases: ["prazo", "deadline", "entrega"],
    palavras: ["prazo", "deadline"],
    respostas: ["O prazo tá apertado mas dá pra fazer", "Vamos conseguir entregar a tempo"],
  },
  {
    frases: ["combinado", "fechado", "ok", "beleza"],
    palavras: ["combinado", "fechado"],
    respostas: ["Combinado então!", "Fechado, qualquer coisa te chamo", "Perfeito, obrigada!"],
  },
];

const GENERICAS = [
  "Certo, anotado aqui",
  "Vou verificar e te aviso",
  "Combinado!",
  "Pode contar comigo",
  "Depois a gente alinha melhor",
];

export const respostaMariana = criarRespostaLocal(BANCO, GENERICAS);

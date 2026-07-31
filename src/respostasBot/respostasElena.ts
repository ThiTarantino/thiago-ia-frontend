import { criarRespostaLocal, type GrupoResposta } from "./respostasLocais";

const BANCO: GrupoResposta[] = [
  {
    frases: ["oi mãe", "oi mae", "oi", "bom dia", "boa tarde", "boa noite"],
    palavras: ["oi", "bom dia", "boa tarde"],
    respostas: ["Oi meu filho, tudo bem?", "Oii meu amor", "Bom dia, filho! Dormiu bem?"],
  },
  {
    frases: ["já almocei", "ja almocei", "almoço", "almoco", "comi"],
    palavras: ["almoço", "almoco", "comi"],
    respostas: ["Já almoçou?", "Que bom que comeu direitinho", "Não esquece de se alimentar bem, viu"],
  },
  {
    frases: ["saudade", "com saudade", "tenho saudade"],
    palavras: ["saudade"],
    respostas: ["Também tô com saudade, meu filho", "Vem me visitar esse fim de semana"],
  },
  {
    frases: ["te amo", "amo você", "amo voce", "amo vc"],
    palavras: ["te amo", "amo você"],
    respostas: ["Te amo, um beijo!", "Te amo mais, filho 💕", "Você é a razão do meu orgulho"],
  },
  {
    frases: ["pai", "papai"],
    palavras: ["pai", "papai"],
    respostas: ["Não esquece de ligar pro seu pai", "Seu pai perguntou de você hoje"],
  },
];

const GENERICAS = [
  "Se cuida, viu meu filho",
  "Qualquer coisa me liga",
  "To pensando em você",
  "Vem almoçar aqui um dia desses",
  "Um beijo grande",
];

export const respostaMae = criarRespostaLocal(BANCO, GENERICAS);

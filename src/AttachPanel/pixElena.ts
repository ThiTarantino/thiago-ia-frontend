import type { TransacaoPix, ComprovantePix } from "./PixPainelBase";

// ─────────────────────────────────────────────────────────────────────────────
// Transações Pix do chat da Mãe. Troque pelos dados reais.
//
// IMPORTANTE: apenas a transação no índice PIX_INDICE_COMPROVANTE_MAE (0-based)
// realmente abre o comprovante — as outras mostram o toast de "falha ao
// carregar". Por padrão está configurado pra ser a do MEIO (índice 1).
// ─────────────────────────────────────────────────────────────────────────────

export const PIX_TRANSACOES_MAE: TransacaoPix[] = [
  {
    id: "px1",
    nome: "Mercado São José",
    avatarLetra: "MS",
    valor: "R$ 87,40",
    data: "24/07",
    hora: "14:12",
    tipo: "enviado",
  },
  {
    id: "px2",
    nome: "Elena",
    avatarLetra: "E",
    valor: "R$ 150,00",
    data: "25/07",
    hora: "09:31",
    tipo: "recebido",
  },
  {
    id: "px3",
    nome: "Farmácia Popular",
    avatarLetra: "FP",
    valor: "R$ 32,90",
    data: "26/07",
    hora: "18:47",
    tipo: "enviado",
  },
];

// Índice (0-based) de qual transação acima realmente abre o comprovante.
// 1 = a do meio (Elena), como pedido.
export const PIX_INDICE_COMPROVANTE_MAE = 1;

export const PIX_COMPROVANTE_MAE: ComprovantePix = {
  valor: "R$ 150,00",
  data: "25/07/2026",
  hora: "09:31",
  idTransacao: "E00000000202607250931TROQUEISSO",
  pagador: {
    nome: "Elena",
    instituicao: "Banco Exemplo S.A.",
    chave: "elena@exemplo.com",
  },
  recebedor: {
    nome: "TROQUE PELO NOME REAL",
    instituicao: "Banco Exemplo S.A.",
    chave: "troque@exemplo.com",
  },
  descricao: "Troque esse texto pela pista/descrição real do comprovante.",
};
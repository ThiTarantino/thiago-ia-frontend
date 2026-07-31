import type { ItemPedido } from "./PedidosPainelBase";

// ─────────────────────────────────────────────────────────────────────────────
// Itens do pedido do chat da Mãe. Troque pelos 3 itens reais — lembre que a
// combinação deles (nomes, quantidades etc.) é a pista do enigma.
// ─────────────────────────────────────────────────────────────────────────────
export const PEDIDOS_MAE: ItemPedido[] = [
  {
    id: "pd1",
    produto: "Item 1 — troque pelo produto real",
    variacao: "Variação / tamanho",
    preco: "R$ 0,00",
    quantidade: 1,
    loja: "Nome da loja",
    data: "Pedido entregue em 00/00/2026",
    status: "Pedido entregue",
  },
  {
    id: "pd2",
    produto: "Item 2 — troque pelo produto real",
    variacao: "Variação / tamanho",
    preco: "R$ 0,00",
    quantidade: 1,
    loja: "Nome da loja",
    data: "Pedido entregue em 00/00/2026",
    status: "Pedido entregue",
  },
  {
    id: "pd3",
    produto: "Item 3 — troque pelo produto real",
    variacao: "Variação / tamanho",
    preco: "R$ 0,00",
    quantidade: 1,
    loja: "Nome da loja",
    data: "Pedido entregue em 00/00/2026",
    status: "Pedido entregue",
  },
];
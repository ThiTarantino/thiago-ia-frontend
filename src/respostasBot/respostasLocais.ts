// ─────────────────────────────────────────────────────────────────────────────
// Motor genérico de "resposta local" por palavra-chave — mesma ideia do
// respostaModoOffline() do Thiago 2.0 (src/respostas.ts), só que reaproveitável:
// cada chat novo importa criarRespostaLocal(BANCO_DO_PERSONAGEM) e pronto.
// ─────────────────────────────────────────────────────────────────────────────
export type GrupoResposta = { frases: string[]; palavras: string[]; respostas: string[] };

export function criarRespostaLocal(banco: GrupoResposta[], genericas: string[]) {
  return function respostaLocal(mensagem: string): string {
    const texto = mensagem.toLowerCase().trim();

    const matchesFrase = banco.filter((grupo) =>
      grupo.frases.some((f) => texto === f || texto.includes(f))
    );
    if (matchesFrase.length > 0) {
      const grupo = matchesFrase[Math.floor(Math.random() * matchesFrase.length)];
      return grupo.respostas[Math.floor(Math.random() * grupo.respostas.length)];
    }

    const matchesPalavra = banco.filter((grupo) =>
      grupo.palavras.some((p) => texto.includes(p))
    );
    if (matchesPalavra.length > 0) {
      const grupo = matchesPalavra[Math.floor(Math.random() * matchesPalavra.length)];
      return grupo.respostas[Math.floor(Math.random() * grupo.respostas.length)];
    }

    return genericas[Math.floor(Math.random() * genericas.length)];
  };
}

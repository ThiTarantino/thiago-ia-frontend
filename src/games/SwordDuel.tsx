import { useState, useMemo } from "react";

type Props = { onBack: () => void };

export default function JogoDaForca({ onBack }: Props) {
  const [tela, setTela] = useState<"config" | "jogando" | "fim">("config");
  const [palavraSecreta, setPalavraSecreta] = useState("");
  const [dica, setDica] = useState("");
  const [letrasTentadas, setLetrasTentadas] = useState<string[]>([]);
  const [revelarPalavra, setRevelarPalavra] = useState(false);

  // Normaliza o texto para comparar facilmente sem quebrar por acentos
  const removerAcentos = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Filtra apenas as letras válidas da palavra (ignora espaços/hífens)
  const letrasValidasDaPalavra = useMemo(() => {
    const limpa = removerAcentos(palavraSecreta).toUpperCase();
    return Array.from(limpa).filter((char) => char >= "A" && char <= "Z");
  }, [palavraSecreta]);

  // Calcula o total de erros cometidos até agora
  const erros = useMemo(() => {
    return letrasTentadas.filter((letra) => {
      const palavraNormalizada = removerAcentos(palavraSecreta).toUpperCase();
      return !palavraNormalizada.includes(letra);
    }).length;
  }, [letrasTentadas, palavraSecreta]);

  const maxErros = 6;

  const ganhou =
    letrasValidasDaPalavra.length > 0 &&
    letrasValidasDaPalavra.every((l) => letrasTentadas.includes(l));
  const perdeu = erros >= maxErros;

  const iniciarJogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!palavraSecreta.trim()) return;
    setLetrasTentadas([]);
    setTela("jogando");
  };

  const tentarLetra = (letra: string) => {
    if (letrasTentadas.includes(letra) || ganhou || perdeu) return;

    const novasTentativas = [...letrasTentadas, letra];
    setLetrasTentadas(novasTentativas);

    const palavraNormalizada = removerAcentos(palavraSecreta).toUpperCase();
    const novasLetrasValidas = Array.from(palavraNormalizada).filter(
      (char) => char >= "A" && char <= "Z"
    );
    const tudoCerto = novasLetrasValidas.every((l) => novasTentativas.includes(l));
    const novosErros = novasTentativas.filter((l) => !palavraNormalizada.includes(l)).length;

    if (tudoCerto || novosErros >= maxErros) {
      setTela("fim");
    }
  };

  const reiniciarTudo = () => {
    setPalavraSecreta("");
    setDica("");
    setLetrasTentadas([]);
    setRevelarPalavra(false);
    setTela("config");
  };

  const alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const letrasErradasOcoladas = letrasTentadas.filter((letra) => {
    return !removerAcentos(palavraSecreta).toUpperCase().includes(letra);
  });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #0b0f19; color: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; }
        .wrapper { min-height: 100dvh; display: flex; flex-direction: column; background: #0b0f19; padding: 20px; }
        
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; width: 100%; max-width: 460px; margin-left: auto; margin-right: auto; }
        .btn-back { background: transparent; border: 1px solid #334155; color: #94a3b8; font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .btn-back:hover { background: #1e293b; color: #f1f5f9; border-color: #475569; }
        
        .conteudo { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; max-width: 460px; margin: 0 auto; gap: 28px; }
        
        /* Form de Configuração */
        .card-setup { width: 100%; display: flex; flex-direction: column; gap: 24px; }
        .bloco-titulo { display: flex; flex-direction: column; gap: 12px; text-align: center; margin-bottom: 8px; }
        .titulo { font-size: 28px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.5px; line-height: 1.2; }
        .subtitulo { font-size: 14px; color: #64748b; line-height: 1.5; }
        
        .campo { display: flex; flex-direction: column; gap: 8px; position: relative; }
        .campo label { font-size: 12px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
        
        /* Input com Olho Mágico */
        .input-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
        .campo input { width: 100%; background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 14px; padding-right: 48px; font-size: 16px; color: #fff; transition: all 0.2s; outline: none; }
        .campo input:focus { border-color: #3b82f6; background: #111827; }
        
        .btn-olho { position: absolute; right: 4px; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: #64748b; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 6px; transition: color 0.2s; }
        .btn-olho:hover { color: #94a3b8; }

        .btn-primary { background: #f1f5f9; color: #0b0f19; border: none; border-radius: 8px; padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: center; }
        .btn-primary:hover { background: #ffffff; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        /* Área do Jogo */
        .area-forca { height: 150px; display: flex; align-items: center; justify-content: center; }
        .painel-dica { font-size: 14px; color: #64748b; font-weight: 500; text-align: center; border-left: 2px solid #334155; padding-left: 10px; }
        
        /* Display da Palavra */
        .palavra-display { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin: 12px 0; max-width: 100%; }
        .letra-bloco { width: 32px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 600; border-bottom: 2px solid #334155; color: #475569; text-transform: uppercase; transition: all 0.2s; }
        .letra-bloco.revelada { border-bottom-color: #f1f5f9; color: #f1f5f9; animation: pop 0.2s ease; }
        .letra-bloco.espaco { border-bottom: none; width: 14px; }

        /* Letras Descartadas */
        .descartadas-container { display: flex; flex-direction: column; align-items: center; gap: 8px; min-height: 50px; }
        .descartadas-titulo { font-size: 11px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
        .descartadas-lista { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
        .letra-errada { background: #111827; border: 1px solid #1f2937; color: #64748b; font-size: 13px; font-weight: 500; padding: 4px 10px; border-radius: 4px; text-decoration: line-through; opacity: 0.6; }

        /* Teclado */
        .teclado { display: grid; grid-template-columns: repeat(7, 1fr); gap: 8px; width: 100%; margin-top: auto; }
        .btn-teclado { background: #111827; border: 1px solid #1f2937; color: #94a3b8; border-radius: 6px; padding: 14px 0; font-size: 15px; font-weight: 600; cursor: pointer; user-select: none; transition: all 0.15s; }
        @media(max-width: 380px) { .btn-teclado { padding: 11px 0; font-size: 14px; } }
        .btn-teclado:hover:not(:disabled) { background: #1f2937; color: #f1f5f9; border-color: #334155; }
        .btn-teclado:active:not(:disabled) { transform: scale(0.95); }
        .btn-teclado:disabled { opacity: 0.15; cursor: not-allowed; background: transparent; border-color: transparent; }

        /* Telas de Fim de Jogo */
        .overlay-fim { position: fixed; inset: 0; background: rgba(11, 15, 25, 0.95); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 10; }
        .modal-fim { width: 100%; max-width: 360px; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; animation: pop 0.25s ease-out; }
        .fim-status { font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
        .status-ganhou { color: #f1f5f9; }
        .status-perdeu { color: #64748b; }
        .revelacao-palavra { font-size: 14px; color: #64748b; margin-top: 4px; }
        .revelacao-palavra strong { color: #f1f5f9; font-size: 20px; display: block; margin-top: 6px; font-weight: 600; letter-spacing: 0.5px; }

        @keyframes pop { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div className="wrapper">
        <div className="header">
          <button className="btn-back" onClick={onBack}>Voltar</button>
          {tela === "jogando" && <button className="btn-back" style={{ color: "#64748b", borderColor: "transparent" }} onClick={reiniciarTudo}>Desistir</button>}
        </div>

        <div className="conteudo">
          {/* TELA 1: CONFIGURAÇÃO / ENTRADA DA PALAVRA */}
          {tela === "config" && (
            <form className="card-setup" onSubmit={iniciarJogo}>
              <div className="bloco-titulo">
                <h1 className="titulo">Jogo da Forca</h1>
                <p className="subtitulo">Insira a palavra secreta e passe o dispositivo para o próximo jogador.</p>
              </div>

              <div className="campo">
                <label>Palavra Secreta</label>
                <div className="input-wrapper">
                  <input
                    type={revelarPalavra ? "text" : "password"}
                    placeholder="Digite a palavra aqui"
                    required
                    value={palavraSecreta}
                    onChange={(e) => setPalavraSecreta(e.target.value.replace(/[^a-zA-Z\s-]/g, ""))}
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="btn-olho"
                    onClick={() => setRevelarPalavra(!revelarPalavra)}
                    title={revelarPalavra ? "Ocultar palavra" : "Visualizar palavra"}
                  >
                    {/* Ícone SVG do Olho Mágico */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {revelarPalavra ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="campo">
                <label>Dica (Opcional)</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Deixe uma pista sobre a palavra"
                    value={dica}
                    onChange={(e) => setDica(e.target.value)}
                    maxLength={40}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary">
                Iniciar Jogo
              </button>
            </form>
          )}

          {/* TELA 2: PARTIDA EM ANDAMENTO */}
          {(tela === "jogando" || tela === "fim") && (
            <>
              {/* Forca em SVG minimalista */}
              <div className="area-forca">
                <svg width="120" height="130" viewBox="0 0 120 130" style={{ overflow: "visible" }}>
                  {/* Estrutura da Forca */}
                  <path d="M 15 120 L 55 120 M 35 120 L 35 15 L 85 15 L 85 35" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" fill="none" />

                  {/* Partes do personagem */}
                  {erros >= 1 && <circle cx="85" cy="45" r="10" stroke="#94a3b8" strokeWidth="2.5" fill="none" />}
                  {erros >= 2 && <line x1="85" y1="55" x2="85" y2="85" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />}
                  {erros >= 3 && <line x1="85" y1="62" x2="68" y2="74" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />}
                  {erros >= 4 && <line x1="85" y1="62" x2="102" y2="74" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />}
                  {erros >= 5 && <line x1="85" y1="85" x2="70" y2="108" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />}
                  {erros >= 6 && <line x1="85" y1="85" x2="100" y2="108" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />}
                </svg>
              </div>

              {/* Painel da Dica */}
              {dica.trim() && <div className="painel-dica">Dica: {dica}</div>}

              {/* Linhas da Palavra Secreta */}
              <div className="palavra-display">
                {Array.from(palavraSecreta).map((char, index) => {
                  const charNormalizado = removerAcentos(char).toUpperCase();
                  const eLetra = charNormalizado >= "A" && charNormalizado <= "Z";
                  const jaDescoberta = letrasTentadas.includes(charNormalizado);

                  if (!eLetra) {
                    return <div key={index} className={`letra-bloco ${char === " " ? "espaco" : ""}`}>{char}</div>;
                  }

                  return (
                    <div key={index} className={`letra-bloco ${jaDescoberta ? "revelada" : ""}`}>
                      {jaDescoberta ? char.toUpperCase() : ""}
                    </div>
                  );
                })}
              </div>

              {/* Bloco de Letras Descartadas / Isoladas */}
              <div className="descartadas-container">
                {letrasErradasOcoladas.length > 0 && (
                  <>
                    <span className="descartadas-titulo">Letras Descartadas</span>
                    <div className="descartadas-lista">
                      {letrasErradasOcoladas.map((l) => (
                        <span key={l} className="letra-errada">{l}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Teclado Virtual */}
              <div className="teclado">
                {alfabeto.map((letra) => {
                  const jaFoi = letrasTentadas.includes(letra);
                  return (
                    <button
                      key={letra}
                      className="btn-teclado"
                      disabled={jaFoi || tela === "fim"}
                      onClick={() => tentarLetra(letra)}
                    >
                      {letra}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* TELA 3: RESULTADO FINAL */}
        {tela === "fim" && (
          <div className="overlay-fim">
            <div className="modal-fim">
              {ganhou ? (
                <>
                  <h2 className="fim-status status-ganhou">Palavra Descoberta</h2>
                  <p style={{ color: "#64748b", fontSize: 14 }}>O oponente decifrou o código antes que a estrutura se completasse.</p>
                </>
              ) : (
                <>
                  <h2 className="fim-status status-perdeu">Tentativas Esgotadas</h2>
                  <p style={{ color: "#64748b", fontSize: 14 }}>A estrutura foi preenchida por completo.</p>
                </>
              )}

              <div className="revelacao-palavra">
                A palavra correta era:
                <strong>{palavraSecreta.toUpperCase()}</strong>
              </div>

              <button className="btn-primary" style={{ width: "100%", marginTop: 12 }} onClick={reiniciarTudo}>
                Jogar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
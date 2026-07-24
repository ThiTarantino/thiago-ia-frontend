import { useState } from "react";

type Props = { onBack: () => void };

type Peca = {
  jogador: "R" | "B";
  dama: boolean;
};

type TabuleiroType = (Peca | null)[][];

export default function JogoDeDama({ onBack }: Props) {
  const criarTabuleiroInicial = (): TabuleiroType => {
    const tabuleiro: TabuleiroType = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          tabuleiro[r][c] = { jogador: "R", dama: false };
        }
      }
    }

    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) {
          tabuleiro[r][c] = { jogador: "B", dama: false };
        }
      }
    }

    return tabuleiro;
  };

  const [tabuleiro, setTabuleiro] = useState<TabuleiroType>(criarTabuleiroInicial);
  const [turno, setTurno] = useState<"R" | "B">("B");
  const [selecionada, setSelecionada] = useState<{ r: number; c: number } | null>(null);
  const [vencedor, setVencedor] = useState<"R" | "B" | null>(null);
  const [deveContinuarComendo, setDeveContinuarComendo] = useState<{ r: number; c: number } | null>(null);

  const reiniciarTudo = () => {
    setTabuleiro(criarTabuleiroInicial());
    setTurno("B");
    setSelecionada(null);
    setVencedor(null);
    setDeveContinuarComendo(null);
  };

  const temCapturaDisponivelParaPeca = (tab: TabuleiroType, r: number, c: number): boolean => {
    const peca = tab[r][c];
    if (!peca) return false;

    const direcoes = [
      { dr: -1, dc: -1 },
      { dr: -1, dc: 1 },
      { dr: 1, dc: -1 },
      { dr: 1, dc: 1 },
    ];

    for (const d of direcoes) {
      if (peca.dama) {
        let stepR = r + d.dr;
        let stepC = c + d.dc;
        let encontrouInimiga = false;

        while (stepR >= 0 && stepR < 8 && stepC >= 0 && stepC < 8) {
          const atual = tab[stepR][stepC];
          if (atual === null) {
            if (encontrouInimiga) return true;
          } else {
            if (atual.jogador === peca.jogador) break;
            if (encontrouInimiga) break;
            encontrouInimiga = true;
          }
          stepR += d.dr;
          stepC += d.dc;
        }
      } else {
        const meioR = r + d.dr;
        const meioC = c + d.dc;
        const destinoR = r + d.dr * 2;
        const destinoC = c + d.dc * 2;

        if (destinoR >= 0 && destinoR < 8 && destinoC >= 0 && destinoC < 8) {
          const meio = tab[meioR][meioC];
          const destino = tab[destinoR][destinoC];
          if (meio && meio.jogador !== peca.jogador && destino === null) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const handleCasaClick = (r: number, c: number) => {
    if (vencedor) return;

    const peca = tabuleiro[r][c];

    if (deveContinuarComendo) {
      if (deveContinuarComendo.r === r && deveContinuarComendo.c === c) {
        return;
      }
    }

    if (peca && peca.jogador === turno) {
      if (deveContinuarComendo && (deveContinuarComendo.r !== r || deveContinuarComendo.c !== c)) {
        return;
      }
      setSelecionada({ r, c });
      return;
    }

    if (selecionada && !peca) {
      const { r: sr, c: sc } = selecionada;
      const pecaMovendo = tabuleiro[sr][sc];
      if (!pecaMovendo) return;

      const diffR = r - sr;
      const diffC = c - sc;
      const absDiffR = Math.abs(diffR);
      const absDiffC = Math.abs(diffC);

      let movimentoValido = false;
      let capturada: { r: number; c: number } | null = null;

      if (pecaMovendo.dama) {
        if (absDiffR === absDiffC && absDiffR > 0) {
          const stepR = diffR > 0 ? 1 : -1;
          const stepC = diffC > 0 ? 1 : -1;
          
          let pecasInimigasEncontradas = 0;
          let posInimigaTemp = { r: 0, c: 0 };
          let currR = sr + stepR;
          let currC = sc + stepC;
          let caminhoLivre = true;

          while (currR !== r && currC !== c) {
            const atual = tabuleiro[currR][currC];
            if (atual !== null) {
              if (atual.jogador === pecaMovendo.jogador) {
                caminhoLivre = false;
                break;
              } else {
                pecasInimigasEncontradas++;
                posInimigaTemp = { r: currR, c: currC };
                if (pecasInimigasEncontradas > 1) {
                  caminhoLivre = false;
                  break;
                }
              }
            }
            currR += stepR;
            currC += stepC;
          }

          if (caminhoLivre) {
            if (pecasInimigasEncontradas === 0 && !deveContinuarComendo) {
              movimentoValido = true;
            } else if (pecasInimigasEncontradas === 1) {
              movimentoValido = true;
              capturada = posInimigaTemp;
            }
          }
        }
      } else {
        if (!deveContinuarComendo) {
          if (absDiffR === 1 && absDiffC === 1) {
            if (pecaMovendo.jogador === "B" && diffR === -1) movimentoValido = true;
            if (pecaMovendo.jogador === "R" && diffR === 1) movimentoValido = true;
          }
        }

        if (absDiffR === 2 && absDiffC === 2) {
          const meioR = (sr + r) / 2;
          const meioC = (sc + c) / 2;
          const pecaMeio = tabuleiro[meioR][meioC];

          if (pecaMeio && pecaMeio.jogador !== pecaMovendo.jogador) {
            if (pecaMovendo.jogador === "B" && (diffR === -2 || diffR === 2)) {
              movimentoValido = true;
              capturada = { r: meioR, c: meioC };
            }
            if (pecaMovendo.jogador === "R" && (diffR === 2 || diffR === -2)) {
              movimentoValido = true;
              capturada = { r: meioR, c: meioC };
            }
          }
        }
      }

      if (movimentoValido) {
        const novoTabuleiro = tabuleiro.map((row) => [...row]);
        novoTabuleiro[r][c] = { ...pecaMovendo };

        if (pecaMovendo.jogador === "B" && r === 0) novoTabuleiro[r][c]!.dama = true;
        if (pecaMovendo.jogador === "R" && r === 7) novoTabuleiro[r][c]!.dama = true;

        novoTabuleiro[sr][sc] = null;

        if (capturada) {
          novoTabuleiro[capturada.r][capturada.c] = null;
        }

        let podeContinuar = false;
        if (capturada) {
          podeContinuar = temCapturaDisponivelParaPeca(novoTabuleiro, r, c);
        }

        setTabuleiro(novoTabuleiro);

        let temR = false;
        let temB = false;
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (novoTabuleiro[i][j]?.jogador === "R") temR = true;
            if (novoTabuleiro[i][j]?.jogador === "B") temB = true;
          }
        }

        if (!temR) {
          setVencedor("B");
        } else if (!temB) {
          setVencedor("R");
        } else if (podeContinuar && !novoTabuleiro[r][c]?.dama) { 
          setSelecionada({ r, c });
          setDeveContinuarComendo({ r, c });
        } else {
          setTurno(turno === "B" ? "R" : "B");
          setSelecionada(null);
          setDeveContinuarComendo(null);
        }
      }
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #0b0f19; color: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; }
        
        .wrapper { 
          min-height: 100dvh; 
          display: flex; 
          flex-direction: column; 
          background: #0b0f19; 
          padding: 8px 16px; 
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
        }
        
        .header { 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          width: 100%; 
          max-width: 480px; 
        }
        
        .btn-back { 
          background: transparent; 
          border: 1px solid #334155; 
          color: #94a3b8; 
          font-size: 13px; 
          font-weight: 500; 
          padding: 6px 14px; 
          border-radius: 6px; 
          cursor: pointer; 
          transition: all 0.2s; 
        }
        .btn-back:hover { background: #1e293b; color: #f1f5f9; border-color: #475569; }
        
        .conteudo { 
          flex: 1; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          width: 100%; 
          max-width: 480px; 
          margin: 0 auto; 
          gap: 8px; 
        }
        
        .bloco-titulo { display: flex; flex-direction: column; gap: 2px; text-align: center; }
        .titulo { font-size: 20px; font-weight: 700; color: #f1f5f9; letter-spacing: -0.5px; }
        .subtitulo { font-size: 12px; color: #64748b; }
        
        .turno-badge { display: flex; align-items: center; gap: 8px; background: #111827; border: 1px solid #1f2937; padding: 4px 12px; border-radius: 20px; font-size: 12px; color: #94a3b8; }
        .ponto { width: 8px; height: 8px; border-radius: 50%; }
        .ponto-branco { background: #f1f5f9; }
        .ponto-vermelho { background: #ef4444; }

        .board-container { 
          display: grid; 
          grid-template-columns: repeat(8, 1fr); 
          grid-template-rows: repeat(8, 1fr); 
          width: 100%; 
          max-width: min(88vw, 88vh, 440px); 
          aspect-ratio: 1 / 1; 
          border: 3px solid #1f2937; 
          border-radius: 8px; 
          overflow: hidden; 
          background: #111827; 
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
        }
        
        .casa { display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; width: 100%; height: 100%; }
        .casa-clara { background: #cbd5e1; }
        .casa-escura { background: #334155; }
        .casa.selecionada { background: #475569; outline: 2px solid #3b82f6; z-index: 2; }

        .peca { width: 78%; height: 78%; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3); transition: transform 0.15s; position: relative; }
        .peca:hover { transform: scale(1.08); }
        .peca-branco { background: #f1f5f9; border: 2px solid #cbd5e1; }
        .peca-vermelho { background: #ef4444; border: 2px solid #b91c1c; }
        .peca.dama::after { content: "★"; font-size: 14px; position: absolute; color: #fbbf24; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }

        .overlay-fim { position: fixed; inset: 0; background: rgba(11, 15, 25, 0.95); display: flex; align-items: center; justify-content: center; padding: 24px; z-index: 10; }
        .modal-fim { width: 100%; max-width: 360px; display: flex; flex-direction: column; align-items: center; gap: 20px; text-align: center; animation: pop 0.25s ease-out; }
        .fim-status { font-size: 24px; font-weight: 700; color: #f1f5f9; }
        
        .btn-primary { background: #f1f5f9; color: #0b0f19; border: none; border-radius: 8px; padding: 14px; font-size: 15px; font-weight: 600; cursor: pointer; width: 100%; transition: all 0.2s; }
        .btn-primary:hover { background: #ffffff; }

        @keyframes pop { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        /* Ajustes específicos para o modo paisagem (celular deitado) */
        @media (orientation: landscape) {
          .bloco-titulo {
            display: none;
          }
          .wrapper {
            padding: 6px 16px;
            justify-content: flex-start;
          }
          .conteudo {
            gap: 4px;
            flex: none;
          }
          .board-container {
            max-width: min(72vw, 72vh, 320px);
            transform: rotate(90deg);
            margin: 10px 0;
          }
          /* Faz com que as peças fiquem orientadas corretamente após rotacionar o tabuleiro */
          .peca {
            transform: rotate(-90deg);
          }
          .peca:hover {
            transform: rotate(-90deg) scale(1.08);
          }
        }
      `}</style>

      <div className="wrapper">
        <div className="header">
          <button className="btn-back" onClick={onBack}>Voltar</button>
          
          <div className="turno-badge">
            <div className={`ponto ${turno === "R" ? "ponto-vermelho" : "ponto-branco"}`} />
            <span>Turno: <strong>{turno === "R" ? "Vermelho" : "Branco"}</strong></span>
          </div>

          <button className="btn-back" onClick={reiniciarTudo}>Reiniciar</button>
        </div>

        <div className="conteudo">
          <div className="bloco-titulo">
            <h1 className="titulo">Jogo de Dama</h1>
            <p className="subtitulo">Duelo estratégico para 2 jogadores</p>
          </div>

          <div className="board-container">
            {tabuleiro.map((row, r) =>
              row.map((peca, c) => {
                const eEscura = (r + c) % 2 === 1;
                const estaSelecionada = selecionada?.r === r && selecionada?.c === c;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`casa ${eEscura ? "casa-escura" : "casa-clara"} ${estaSelecionada ? "selecionada" : ""}`}
                    onClick={() => handleCasaClick(r, c)}
                  >
                    {peca && (
                      <div
                        className={`peca ${peca.jogador === "R" ? "peca-vermelho" : "peca-branco"} ${peca.dama ? "dama" : ""}`}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {vencedor && (
          <div className="overlay-fim">
            <div className="modal-fim">
              <h2 className="fim-status">Fim de Jogo!</h2>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                O Jogador <strong>{vencedor === "R" ? "Vermelho" : "Branco"}</strong> venceu a partida!
              </p>
              <button className="btn-primary" onClick={reiniciarTudo}>
                Jogar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
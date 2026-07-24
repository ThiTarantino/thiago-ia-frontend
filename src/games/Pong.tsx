import { useState } from "react";

type GameConfig = {
  label: string;
  boxRows: number;
  boxCols: number;
  desc: string;
};

const GAME_MODES: GameConfig[] = [
  { label: "3x3", boxRows: 3, boxCols: 3, desc: "9 Quadrados" },
  { label: "5x4", boxRows: 5, boxCols: 4, desc: "20 Quadrados" },
  { label: "7x4", boxRows: 7, boxCols: 4, desc: "28 Quadrados" },
];

export default function DotsAndBoxes({ onBack }: { onBack: () => void }) {
  // Configuração ativa
  const [activeConfig, setActiveConfig] = useState<GameConfig | null>(null);

  // Estados do Jogo
  const [hLines, setHLines] = useState<boolean[][]>([]);
  const [vLines, setVLines] = useState<boolean[][]>([]);
  const [boxes, setBoxes] = useState<(number | null)[][]>([]);

  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [winner, setWinner] = useState<string | null>(null);

  // Iniciar jogo dinamicamente com base nas linhas e colunas selecionadas
  const startGame = (config: GameConfig) => {
    const dotRows = config.boxRows + 1;
    const dotCols = config.boxCols + 1;

    setActiveConfig(config);
    setHLines(
      Array(dotRows).fill(null).map(() => Array(dotCols - 1).fill(false))
    );
    setVLines(
      Array(dotRows - 1).fill(null).map(() => Array(dotCols).fill(false))
    );
    setBoxes(
      Array(config.boxRows).fill(null).map(() => Array(config.boxCols).fill(null))
    );
    setCurrentPlayer(1);
    setScores({ p1: 0, p2: 0 });
    setWinner(null);
  };

  const restartGame = () => {
    if (activeConfig) startGame(activeConfig);
  };

  const checkBoxes = (
    newH: boolean[][],
    newV: boolean[][]
  ): { count: number; updatedBoxes: (number | null)[][] } => {
    if (!activeConfig) return { count: 0, updatedBoxes: boxes };
    let completedCount = 0;
    const updated = boxes.map((row) => [...row]);

    for (let r = 0; r < activeConfig.boxRows; r++) {
      for (let c = 0; c < activeConfig.boxCols; c++) {
        if (updated[r][c] === null) {
          const top = newH[r][c];
          const bottom = newH[r + 1][c];
          const left = newV[r][c];
          const right = newV[r][c + 1];

          if (top && bottom && left && right) {
            updated[r][c] = currentPlayer;
            completedCount++;
          }
        }
      }
    }

    return { count: completedCount, updatedBoxes: updated };
  };

  const handleLineClick = (type: "h" | "v", r: number, c: number) => {
    if (winner || !activeConfig) return;

    if (type === "h") {
      if (hLines[r][c]) return;
      const newH = hLines.map((row, ri) =>
        row.map((val, ci) => (ri === r && ci === c ? true : val))
      );
      setHLines(newH);

      const { count, updatedBoxes } = checkBoxes(newH, vLines);
      processTurn(count, updatedBoxes);
    } else {
      if (vLines[r][c]) return;
      const newV = vLines.map((row, ri) =>
        row.map((val, ci) => (ri === r && ci === c ? true : val))
      );
      setVLines(newV);

      const { count, updatedBoxes } = checkBoxes(hLines, newV);
      processTurn(count, updatedBoxes);
    }
  };

  const processTurn = (
    newBoxesCount: number,
    updatedBoxes: (number | null)[][]
  ) => {
    if (!activeConfig) return;

    if (newBoxesCount > 0) {
      setBoxes(updatedBoxes);
      const newP1Score = scores.p1 + (currentPlayer === 1 ? newBoxesCount : 0);
      const newP2Score = scores.p2 + (currentPlayer === 2 ? newBoxesCount : 0);

      setScores({ p1: newP1Score, p2: newP2Score });

      const totalBoxes = activeConfig.boxRows * activeConfig.boxCols;
      if (newP1Score + newP2Score === totalBoxes) {
        if (newP1Score > newP2Score) setWinner("Jogador 1 Venceu!");
        else if (newP2Score > newP1Score) setWinner("Jogador 2 Venceu!");
        else setWinner("Empate!");
      }
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  };

  const dotRows = activeConfig ? activeConfig.boxRows + 1 : 0;
  const dotCols = activeConfig ? activeConfig.boxCols + 1 : 0;

 return (
    <>
      <style>{`
        .game-screen {
          width: 100%;
          height: 100dvh;
          display: flex;
          flex-direction: column;
          background: #0b1014;
          color: #f1f5f9;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          user-select: none;
        }

        .game-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #0b1014;
          width: 100%;
          box-sizing: border-box;
        }

        .header-btn {
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .header-btn:active {
          background: #334155;
          color: #fff;
        }

        .game-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          gap: 16px;
          overflow-y: auto;
        }

        /* MENU INICIAL */
        .setup-container {
          width: 100%;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 24px;
        }

        .setup-title {
          font-size: 26px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }

        .setup-subtitle {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.5;
          margin-top: -16px;
        }

        .option-group {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .option-label {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          text-align: left;
        }

        .option-btn {
          width: 100%;
          background: #111827;
          border: 1px solid #1f2937;
          color: #e2e8f0;
          padding: 16px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.2s;
        }

        .option-btn:active {
          background: #1f2937;
          border-color: #00a884;
        }

        .option-btn-desc {
          font-size: 12px;
          color: #64748b;
          font-weight: 400;
        }

        /* TELA DE JOGO */
        .dots-scores {
          display: flex;
          gap: 40px;
          align-items: center;
          background: #111827;
          padding: 12px 28px;
          border-radius: 16px;
          border: 1px solid #1f2937;
        }

        .dots-score {
          text-align: center;
        }

        .dots-score-num {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        .dots-score-name {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          margin-top: 4px;
          font-weight: 600;
        }

        .turn-badge {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 16px;
          background: #111827;
          border-radius: 20px;
          border: 1px solid #1f2937;
        }

        /* TABULEIRO DINÂMICO */
        .board-container {
          background: #090d11;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid #1f2937;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
        }

        .grid-row-nodes {
          display: flex;
          align-items: center;
        }

        .dot-node {
          width: 12px;
          height: 12px;
          background-color: #e2e8f0;
          border-radius: 50%;
          z-index: 3;
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
        }

        .h-line-slot {
          width: 48px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .h-line {
          width: 100%;
          height: 5px;
          background-color: #1f2937;
          border-radius: 3px;
          transition: background 0.15s;
        }

        .h-line-slot:hover .h-line {
          background-color: #374151;
        }

        .h-line.active {
          background-color: #00a884 !important;
          box-shadow: 0 0 10px rgba(0, 168, 132, 0.5);
        }

        .grid-row-cells {
          display: flex;
          align-items: center;
        }

        .v-line-slot {
          width: 12px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .v-line {
          width: 5px;
          height: 100%;
          background-color: #1f2937;
          border-radius: 3px;
          transition: background 0.15s;
        }

        .v-line-slot:hover .v-line {
          background-color: #374151;
        }

        .v-line.active {
          background-color: #00a884 !important;
          box-shadow: 0 0 10px rgba(0, 168, 132, 0.5);
        }

        .box-cell {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .box-p1 {
          background-color: rgba(0, 168, 132, 0.18);
          color: #00a884;
        }

        .box-p2 {
          background-color: rgba(239, 68, 68, 0.18);
          color: #ef4444;
        }
      `}</style>

      <div className="game-screen">
        {/* Header Responsivo */}
        <div className="game-header">
          <button
            className="header-btn"
            onClick={activeConfig ? () => setActiveConfig(null) : onBack}
          >
            Voltar
          </button>

          {activeConfig && (
            <button className="header-btn" onClick={restartGame}>
              Reiniciar
            </button>
          )}
        </div>

        <div className="game-body">
          {!activeConfig ? (
            /* --- MENU DE SELEÇÃO --- */
            <div className="setup-container">
              <h1 className="setup-title">Jogo dos Pontinhos</h1>
              <p className="setup-subtitle">
                Escolha o tamanho do tabuleiro para começar a disputa.
              </p>

              <div className="option-group">
                <span className="option-label">Tamanho do Mapa</span>
                {GAME_MODES.map((mode) => (
                  <button
                    key={mode.label}
                    className="option-btn"
                    onClick={() => startGame(mode)}
                  >
                    <span>{mode.label}</span>
                    <span className="option-btn-desc">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* --- TELA DO JOGO --- */
            <>
              {/* Placar */}
              <div className="dots-scores">
                <div className="dots-score">
                  <div className="dots-score-num" style={{ color: "#00a884" }}>
                    {scores.p1}
                  </div>
                  <div className="dots-score-name">Jogador 1</div>
                </div>
                <div style={{ color: "#334155", fontWeight: 700, fontSize: 13 }}>
                  VS
                </div>
                <div className="dots-score">
                  <div className="dots-score-num" style={{ color: "#ef4444" }}>
                    {scores.p2}
                  </div>
                  <div className="dots-score-name">Jogador 2</div>
                </div>
              </div>

              {/* Status do Turno */}
              <div className="turn-badge">
                {winner ? (
                  <span style={{ color: "#00a884" }}>{winner}</span>
                ) : (
                  <span>
                    Vez do:{" "}
                    <strong
                      style={{
                        color: currentPlayer === 1 ? "#00a884" : "#ef4444",
                      }}
                    >
                      Jogador {currentPlayer}
                    </strong>
                  </span>
                )}
              </div>

              {/* Tabuleiro com dimensões 100% dinâmicas */}
              <div className="board-container">
                {Array(dotRows)
                  .fill(null)
                  .map((_, r) => (
                    <div key={`row-group-${r}`}>
                      <div className="grid-row-nodes">
                        {Array(dotCols)
                          .fill(null)
                          .map((_, c) => (
                            <div
                              key={`node-${r}-${c}`}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <div className="dot-node" />
                              {c < dotCols - 1 && (
                                <div
                                  className="h-line-slot"
                                  onClick={() => handleLineClick("h", r, c)}
                                >
                                  <div
                                    className={`h-line ${
                                      hLines[r]?.[c] ? "active" : ""
                                    }`}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                      </div>

                      {r < dotRows - 1 && (
                        <div className="grid-row-cells">
                          {Array(dotCols)
                            .fill(null)
                            .map((_, c) => (
                              <div
                                key={`cell-${r}-${c}`}
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                <div
                                  className="v-line-slot"
                                  onClick={() => handleLineClick("v", r, c)}
                                >
                                  <div
                                    className={`v-line ${
                                      vLines[r]?.[c] ? "active" : ""
                                    }`}
                                  />
                                </div>
                                {c < dotCols - 1 && (
                                  <div
                                    className={`box-cell ${
                                      boxes[r]?.[c] === 1
                                        ? "box-p1"
                                        : boxes[r]?.[c] === 2
                                        ? "box-p2"
                                        : ""
                                    }`}
                                  >
                                    {boxes[r]?.[c] ? `J${boxes[r][c]}` : ""}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
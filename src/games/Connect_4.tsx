import { useState } from "react";

type BoardConfig = {
  label: string;
  rows: number;
  cols: number;
  desc: string;
};

const GAME_MODES: BoardConfig[] = [
  { label: "Padrão (7x6)", rows: 6, cols: 7, desc: "O clássico Connect 4" },
  { label: "Largo (10x6)", rows: 6, cols: 10, desc: "Para jogar deitado" },
  { label: "Super Largo (12x7)", rows: 7, cols: 12, desc: "Partidas estendidas" },
];

export default function ConnectFour({ onBack }: { onBack: () => void }) {
  const [activeConfig, setActiveConfig] = useState<BoardConfig | null>(null);
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [winner, setWinner] = useState<number | "draw" | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);

  const startGame = (config: BoardConfig) => {
    setActiveConfig(config);
    setBoard(
      Array(config.rows)
        .fill(null)
        .map(() => Array(config.cols).fill(null))
    );
    setCurrentPlayer(1);
    setWinner(null);
    setWinningCells([]);
  };

  const restartGame = () => {
    if (activeConfig) startGame(activeConfig);
  };

  const checkWin = (
    currentBoard: (number | null)[][],
    r: number,
    c: number,
    player: number
  ) => {
    if (!activeConfig) return false;
    const { rows, cols } = activeConfig;

    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal /
      [1, -1], // Diagonal \
    ];

    for (const [dr, dc] of directions) {
      let cells: [number, number][] = [[r, c]];

      let step = 1;
      while (true) {
        const nr = r + dr * step;
        const nc = c + dc * step;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          currentBoard[nr][nc] === player
        ) {
          cells.push([nr, nc]);
          step++;
        } else {
          break;
        }
      }

      step = 1;
      while (true) {
        const nr = r - dr * step;
        const nc = c - dc * step;
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          currentBoard[nr][nc] === player
        ) {
          cells.push([nr, nc]);
          step++;
        } else {
          break;
        }
      }

      if (cells.length >= 4) {
        setWinningCells(cells);
        return true;
      }
    }

    return false;
  };

  const handleColumnClick = (colIndex: number) => {
    if (winner || !activeConfig) return;

    const newBoard = board.map((row) => [...row]);

    let rowIndex = -1;
    for (let r = activeConfig.rows - 1; r >= 0; r--) {
      if (newBoard[r][colIndex] === null) {
        rowIndex = r;
        break;
      }
    }

    if (rowIndex === -1) return;

    newBoard[rowIndex][colIndex] = currentPlayer;
    setBoard(newBoard);

    if (checkWin(newBoard, rowIndex, colIndex, currentPlayer)) {
      setWinner(currentPlayer);
    } else {
      const isDraw = newBoard.every((row) =>
        row.every((cell) => cell !== null)
      );
      if (isDraw) {
        setWinner("draw");
      } else {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }
  };

  const isWinningCell = (r: number, c: number) => {
    return winningCells.some(([wr, wc]) => wr === r && wc === c);
  };

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
          overflow: hidden;
        }

        /* BARRA SUPERIOR (HEADER) */
        .game-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: #0b1014;
          width: 100%;
          box-sizing: border-box;
          gap: 12px;
          z-index: 10;
          height: 48px;
        }

        .header-btn {
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .header-btn:active {
          background: #334155;
          color: #fff;
        }

        /* STATUS / BADGE CENTRALIZADO NO TOPO */
        .turn-badge {
          color: #94a3b8;
          font-size: 13px;
          font-weight: 600;
          padding: 5px 16px;
          background: #111827;
          border-radius: 20px;
          border: 1px solid #1f2937;
          text-align: center;
          white-space: nowrap;
        }

        /* ÁREA CENTRAL DO JOGO */
        .game-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 6px;
          box-sizing: border-box;
          overflow: hidden;
        }

        /* MENU DE SELEÇÃO INICIAL */
        .setup-container {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
        }

        .setup-title {
          font-size: 24px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }

        .setup-subtitle {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.4;
          margin-top: -10px;
        }

        .option-group {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .option-btn {
          width: 100%;
          background: #111827;
          border: 1px solid #1f2937;
          color: #e2e8f0;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
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

        .landscape-tip {
          font-size: 11px;
          color: #00a884;
          background: rgba(0, 168, 132, 0.1);
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid rgba(0, 168, 132, 0.2);
        }

        /* ESTRUTURA DO TABULEIRO DINÂMICO */
        .c4-board-wrapper {
          flex: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }

        .c4-board {
          background: #1e293b;
          padding: clamp(6px, 1.5vh, 14px);
          border-radius: 18px;
          border: 1px solid #334155;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
          display: flex;
          gap: clamp(4px, 1vw, 8px);
          max-width: 98vw;
          max-height: calc(100vh - 60px);
        }

        .c4-column {
          display: flex;
          flex-direction: column;
          gap: clamp(4px, 1vh, 8px);
          cursor: pointer;
          padding: 2px;
          border-radius: 28px;
          transition: background 0.15s;
        }

        .c4-column:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        /* REDIMENSIONAMENTO INTELIGENTE DAS CÉLULAS */
        .c4-cell {
          /* Calcula o diâmetro baseado na altura e largura disponíveis */
          width: clamp(26px, min(9vh, 6.8vw), 50px);
          height: clamp(26px, min(9vh, 6.8vw), 50px);
          border-radius: 50%;
          background: #0b1014;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.8);
          position: relative;
        }

        .c4-disc {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: dropDisc 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .disc-p1 {
          background: radial-gradient(circle at 30% 30%, #2dd4bf, #00a884);
          box-shadow: 0 0 10px rgba(0, 168, 132, 0.4);
        }

        .disc-p2 {
          background: radial-gradient(circle at 30% 30%, #f87171, #ef4444);
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
        }

        .c4-cell.winning .c4-disc {
          animation: winPulse 0.8s infinite alternate;
          border: 2px solid #fff;
        }

        @keyframes dropDisc {
          from {
            transform: translateY(-150%);
            opacity: 0.3;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes winPulse {
          from {
            transform: scale(0.9);
            box-shadow: 0 0 5px #fff;
          }
          to {
            transform: scale(1.08);
            box-shadow: 0 0 18px #fff;
          }
        }
      `}</style>

      <div className="game-screen">
        {/* Cabeçalho */}
        <div className="game-header">
          <button
            className="header-btn"
            onClick={activeConfig ? () => setActiveConfig(null) : onBack}
          >
            Voltar
          </button>

          {activeConfig && (
            <div className="turn-badge">
              {winner === "draw" ? (
                <span style={{ color: "#94a3b8" }}>Empate!</span>
              ) : winner ? (
                <span
                  style={{
                    color: winner === 1 ? "#00a884" : "#ef4444",
                  }}
                >
                  Jogador {winner} Venceu! 🎉
                </span>
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
          )}

          {activeConfig ? (
            <button className="header-btn" onClick={restartGame}>
              Reiniciar
            </button>
          ) : (
            <div style={{ width: 60 }} />
          )}
        </div>

        {/* Corpo principal */}
        <div className="game-body">
          {!activeConfig ? (
            /* Menu Inicial */
            <div className="setup-container">
              <h1 className="setup-title">Quatro em Linha</h1>
              <p className="setup-subtitle">
                Conecte 4 discos da mesma cor na horizontal, vertical ou diagonal.
              </p>

              <span className="landscape-tip">
                🔄 Dica: Deite o celular para mapas mais largos!
              </span>

              <div className="option-group">
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
            /* Tabuleiro de Jogo */
            <div className="c4-board-wrapper">
              <div className="c4-board">
                {Array(activeConfig.cols)
                  .fill(null)
                  .map((_, colIdx) => (
                    <div
                      key={`col-${colIdx}`}
                      className="c4-column"
                      onClick={() => handleColumnClick(colIdx)}
                    >
                      {Array(activeConfig.rows)
                        .fill(null)
                        .map((_, rowIdx) => {
                          const val = board[rowIdx]?.[colIdx];
                          const isWin = isWinningCell(rowIdx, colIdx);

                          return (
                            <div
                              key={`cell-${rowIdx}-${colIdx}`}
                              className={`c4-cell ${isWin ? "winning" : ""}`}
                            >
                              {val !== null && (
                                <div
                                  className={`c4-disc ${
                                    val === 1 ? "disc-p1" : "disc-p2"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
import { useState, useEffect } from "react";

// Lista de 20 Fases 100% Validadas (Cada cor possui EXATAMENTE 4 blocos)
const LEVELS = [
  // Fases 1 a 5 (Iniciante)
  {
    level: 1,
    tubes: [
      ["#ef4444", "#3b82f6", "#ef4444", "#3b82f6"],
      ["#3b82f6", "#ef4444", "#3b82f6", "#ef4444"],
      []
    ]
  },
  {
    level: 2,
    tubes: [
      ["#ef4444", "#22c55e", "#3b82f6", "#ef4444"],
      ["#3b82f6", "#ef4444", "#22c55e", "#3b82f6"],
      ["#22c55e", "#3b82f6", "#ef4444", "#22c55e"],
      []
    ]
  },
  {
    level: 3,
    tubes: [
      ["#eab308", "#ef4444", "#3b82f6", "#eab308"],
      ["#3b82f6", "#22c55e", "#ef4444", "#22c55e"],
      ["#22c55e", "#eab308", "#3b82f6", "#ef4444"],
      ["#ef4444", "#3b82f6", "#22c55e", "#eab308"],
      []
    ]
  },
  {
    level: 4,
    tubes: [
      ["#a855f7", "#ef4444", "#3b82f6", "#a855f7"],
      ["#22c55e", "#eab308", "#ef4444", "#22c55e"],
      ["#eab308", "#3b82f6", "#a855f7", "#3b82f6"],
      ["#ef4444", "#a855f7", "#22c55e", "#eab308"],
      ["#22c55e", "#eab308", "#3b82f6", "#ef4444"],
      [], []
    ]
  },
  {
    level: 5,
    tubes: [
      ["#ec4899", "#a855f7", "#ef4444", "#3b82f6"],
      ["#22c55e", "#eab308", "#ec4899", "#22c55e"],
      ["#eab308", "#3b82f6", "#a855f7", "#ef4444"],
      ["#ef4444", "#ec4899", "#22c55e", "#eab308"],
      ["#3b82f6", "#a855f7", "#ec4899", "#eab308"],
      ["#ef4444", "#3b82f6", "#22c55e", "#a855f7"],
      [], []
    ]
  },

  // Fases 6 a 10 (Intermediário)
  {
    level: 6,
    tubes: [
      ["#06b6d4", "#ef4444", "#06b6d4", "#3b82f6"],
      ["#3b82f6", "#22c55e", "#ef4444", "#22c55e"],
      ["#22c55e", "#06b6d4", "#3b82f6", "#ef4444"],
      ["#ef4444", "#06b6d4", "#22c55e", "#3b82f6"],
      [], []
    ]
  },
  {
    level: 7,
    tubes: [
      ["#f97316", "#a855f7", "#f97316", "#3b82f6"],
      ["#22c55e", "#f97316", "#a855f7", "#22c55e"],
      ["#3b82f6", "#22c55e", "#f97316", "#a855f7"],
      ["#a855f7", "#3b82f6", "#22c55e", "#3b82f6"],
      [], []
    ]
  },
  {
    level: 8,
    tubes: [
      ["#14b8a6", "#ec4899", "#14b8a6", "#eab308"],
      ["#eab308", "#14b8a6", "#ec4899", "#14b8a6"],
      ["#ec4899", "#eab308", "#ec4899", "#eab308"],
      [], []
    ]
  },
  {
    level: 9,
    tubes: [
      ["#ef4444", "#3b82f6", "#22c55e", "#eab308"],
      ["#a855f7", "#ef4444", "#3b82f6", "#22c55e"],
      ["#eab308", "#a855f7", "#ef4444", "#3b82f6"],
      ["#22c55e", "#eab308", "#a855f7", "#ef4444"],
      ["#3b82f6", "#22c55e", "#eab308", "#a855f7"],
      [], []
    ]
  },
  {
    level: 10,
    tubes: [
      ["#8b5cf6", "#06b6d4", "#f97316", "#8b5cf6"],
      ["#06b6d4", "#f97316", "#8b5cf6", "#06b6d4"],
      ["#f97316", "#8b5cf6", "#06b6d4", "#f97316"],
      [], []
    ]
  },

  // Fases 11 a 15 (Avançado)
  {
    level: 11,
    tubes: [
      ["#ef4444", "#a855f7", "#ec4899", "#3b82f6"],
      ["#22c55e", "#eab308", "#ef4444", "#a855f7"],
      ["#ec4899", "#3b82f6", "#22c55e", "#eab308"],
      ["#a855f7", "#ec4899", "#3b82f6", "#ef4444"],
      ["#eab308", "#22c55e", "#a855f7", "#ec4899"],
      ["#3b82f6", "#ef4444", "#eab308", "#22c55e"],
      [], []
    ]
  },
  {
    level: 12,
    tubes: [
      ["#f43f5e", "#8b5cf6", "#10b981", "#f59e0b"],
      ["#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"],
      ["#8b5cf6", "#f43f5e", "#f59e0b", "#10b981"],
      ["#f59e0b", "#10b981", "#8b5cf6", "#f43f5e"],
      [], []
    ]
  },
  {
    level: 13,
    tubes: [
      ["#06b6d4", "#3b82f6", "#a855f7", "#ec4899"],
      ["#ec4899", "#06b6d4", "#3b82f6", "#a855f7"],
      ["#a855f7", "#ec4899", "#06b6d4", "#3b82f6"],
      ["#3b82f6", "#a855f7", "#ec4899", "#06b6d4"],
      [], []
    ]
  },
  
    {
    level: 14,
    tubes: [
      ["#22c55e", "#ef4444", "#eab308", "#3b82f6"],
      ["#06b6d4", "#ec4899", "#22c55e", "#ef4444"],
      ["#eab308", "#3b82f6", "#06b6d4", "#ec4899"],
      ["#ef4444", "#3b82f6", "#22c55e", "#eab308"],
      ["#ec4899", "#06b6d4", "#ef4444", "#3b82f6"],
      ["#eab308", "#22c55e", "#ec4899", "#06b6d4"],
      [], []
    ]
  },
  
  {
    level: 15,
    tubes: [
      ["#8b5cf6", "#ec4899", "#8b5cf6", "#10b981"],
      ["#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
      ["#f59e0b", "#8b5cf6", "#10b981", "#f59e0b"],
      ["#ec4899", "#10b981", "#f59e0b", "#ec4899"],
      [], []
    ]
  },

  // Fases 16 a 20 (Mestre)
  {
    level: 16,
    tubes: [
      ["#ef4444", "#3b82f6", "#22c55e", "#eab308"],
      ["#a855f7", "#ec4899", "#06b6d4", "#f97316"],
      ["#3b82f6", "#22c55e", "#eab308", "#ef4444"],
      ["#ec4899", "#06b6d4", "#f97316", "#a855f7"],
      ["#22c55e", "#eab308", "#ef4444", "#3b82f6"],
      ["#06b6d4", "#f97316", "#a855f7", "#ec4899"],
      ["#eab308", "#ef4444", "#3b82f6", "#22c55e"],
      ["#f97316", "#a855f7", "#ec4899", "#06b6d4"],
      [], []
    ]
  },
  {
    level: 17,
    tubes: [
      ["#f43f5e", "#10b981", "#8b5cf6", "#f59e0b"],
      ["#3b82f6", "#f43f5e", "#10b981", "#8b5cf6"],
      ["#f59e0b", "#3b82f6", "#f43f5e", "#10b981"],
      ["#8b5cf6", "#f59e0b", "#3b82f6", "#f43f5e"],
      ["#10b981", "#8b5cf6", "#f59e0b", "#3b82f6"],
      [], []
    ]
  },
  {
    level: 18,
    tubes: [
      ["#a855f7", "#ef4444", "#22c55e", "#3b82f6"],
      ["#eab308", "#a855f7", "#ef4444", "#22c55e"],
      ["#3b82f6", "#eab308", "#a855f7", "#ef4444"],
      ["#22c55e", "#3b82f6", "#eab308", "#a855f7"],
      ["#ef4444", "#22c55e", "#3b82f6", "#eab308"],
      [], []
    ]
  },
  {
    level: 19,
    tubes: [
      ["#ec4899", "#06b6d4", "#f97316", "#14b8a6"],
      ["#8b5cf6", "#ec4899", "#06b6d4", "#f97316"],
      ["#14b8a6", "#8b5cf6", "#ec4899", "#06b6d4"],
      ["#f97316", "#14b8a6", "#8b5cf6", "#ec4899"],
      ["#06b6d4", "#f97316", "#14b8a6", "#8b5cf6"],
      [], []
    ]
  },
  {
    level: 20,
    tubes: [
      ["#ef4444", "#3b82f6", "#22c55e", "#eab308"],
      ["#a855f7", "#ec4899", "#06b6d4", "#f97316"],
      ["#3b82f6", "#22c55e", "#eab308", "#ec4899"],
      ["#ec4899", "#06b6d4", "#f97316", "#ef4444"],
      ["#22c55e", "#eab308", "#ef4444", "#06b6d4"],
      ["#06b6d4", "#f97316", "#a855f7", "#3b82f6"],
      ["#eab308", "#ef4444", "#3b82f6", "#a855f7"],
      ["#f97316", "#a855f7", "#ec4899", "#22c55e"],
      [], []
    ]
  }
];

export default function WaterSortGame({ onBack }: { onBack: () => void }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [tubes, setTubes] = useState<string[][]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  // Carrega a fase limpando os estados
  const loadLevel = (idx: number) => {
    setSelectedTube(null);
    setIsWon(false);
    setIsGameFinished(false);
    const levelData = LEVELS[idx].tubes.map((t) => [...t]);
    setTubes(levelData);
  };

  useEffect(() => {
    loadLevel(currentLevelIdx);
  }, [currentLevelIdx]);

  // Checagem de vitória robusta e universal
  const checkWin = (currentTubes: string[][]) => {
    const seenColors = new Set<string>();

    for (const tube of currentTubes) {
      if (tube.length > 0) {
        // 1. Cada tubo com água precisa estar cheio (4 blocos)
        if (tube.length !== 4) return false;

        const firstColor = tube[0];

        // 2. Todos os 4 blocos precisam ter a mesma cor
        const isSingleColor = tube.every((c) => c === firstColor);
        if (!isSingleColor) return false;

        // 3. A cor não pode estar repetida em outro tubo
        if (seenColors.has(firstColor)) return false;
        seenColors.add(firstColor);
      }
    }
    return true;
  };

  // Lógica ao clicar no tubo
  const handleTubeClick = (index: number) => {
    if (isWon || isGameFinished) return;

    if (selectedTube === null) {
      if (tubes[index].length > 0) {
        setSelectedTube(index);
      }
    } else if (selectedTube === index) {
      setSelectedTube(null);
    } else {
      const source = [...tubes[selectedTube]];
      const target = [...tubes[index]];

      if (source.length === 0) {
        setSelectedTube(null);
        return;
      }

      const colorToMove = source[source.length - 1];
      const canPour =
        target.length < 4 &&
        (target.length === 0 || target[target.length - 1] === colorToMove);

      if (canPour) {
        while (
          source.length > 0 &&
          target.length < 4 &&
          source[source.length - 1] === colorToMove
        ) {
          target.push(source.pop()!);
        }

        const newTubes = [...tubes];
        newTubes[selectedTube] = source;
        newTubes[index] = target;

        setTubes(newTubes);
        setSelectedTube(null);

        // Verifica a vitória após a movimentação
        if (checkWin(newTubes)) {
          if (currentLevelIdx === LEVELS.length - 1) {
            setIsGameFinished(true);
          } else {
            setIsWon(true);
          }
        }
      } else {
        if (tubes[index].length > 0) {
          setSelectedTube(index);
        } else {
          setSelectedTube(null);
        }
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
    }
  };

  const handleRestartAll = () => {
    setCurrentLevelIdx(0);
    loadLevel(0);
  };

  return (
    <>
      <style>{`
        .watersort-screen {
          width: 100vw;
          height: 100dvh;
          background: #0b1014;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          box-sizing: border-box;
          font-family: system-ui, sans-serif;
          user-select: none;
          touch-action: manipulation;
          overflow: hidden;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.9);
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #334155;
          gap: 16px;
          width: 100%;
          max-width: 420px;
          box-sizing: border-box;
        }

        .top-bar-btn {
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 6px 12px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          transition: all 0.2s;
        }

        .top-bar-btn:hover {
          color: #f8fafc;
          border-color: #64748b;
        }

        .level-txt {
          font-weight: bold;
          font-size: 14px;
          color: #f8fafc;
        }

        .hint-txt {
          color: #94a3b8;
          font-size: 12px;
          margin: 8px 0 0 0;
          text-align: center;
        }

        .tubes-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 12px;
          max-width: 420px;
          margin: auto 0;
        }

        .tube {
          width: 40px;
          height: 130px;
          border: 3px solid rgba(255, 255, 255, 0.5);
          border-top: none;
          border-radius: 0 0 20px 20px;
          display: flex;
          flex-direction: column-reverse;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .tube.selected {
          transform: translateY(-16px);
          border-color: #00a884;
          box-shadow: 0 8px 20px rgba(0, 168, 132, 0.4);
        }

        .liquid-block {
          width: 100%;
          height: 30px;
          transition: all 0.3s ease;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          background: rgba(11, 16, 20, 0.92);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 10;
        }

        .win-btn {
          background: #00a884;
          color: #fff;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .win-btn-gold {
          background: #eab308;
          color: #000;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(234, 179, 8, 0.4);
        }

        .win-btn:active, .win-btn-gold:active {
          transform: scale(0.96);
        }
      `}</style>

      <div className="watersort-screen">
        {/* Barra Superior */}
        <div className="top-bar">
          <button className="top-bar-btn" onClick={onBack}>
            ← Voltar
          </button>

          <span className="level-txt">
            Fase {currentLevelIdx + 1} / {LEVELS.length}
          </span>

          <button className="top-bar-btn" onClick={() => loadLevel(currentLevelIdx)}>
            🔄 Reiniciar
          </button>
        </div>

        {/* Dica */}
        <p className="hint-txt">
          Toque em um tubo para selecionar e em outro para despejar a água!
        </p>

        {/* Tubos */}
        <div className="tubes-container">
          {tubes.map((tube, tubeIdx) => {
            const isSelected = selectedTube === tubeIdx;

            return (
              <div
                key={tubeIdx}
                className={`tube ${isSelected ? "selected" : ""}`}
                onClick={() => handleTubeClick(tubeIdx)}
              >
                {tube.map((color, colorIdx) => (
                  <div
                    key={colorIdx}
                    className="liquid-block"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* Modal de Vitória da Fase */}
        {isWon && (
          <div className="overlay">
            <h2 style={{ margin: 0, color: "#f8fafc", fontSize: "24px" }}>
              🎉 Fase Concluída!
            </h2>
            <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}>
              Você organizou todas as cores!
            </p>
            <button className="win-btn" onClick={handleNextLevel}>
              Próxima Fase ({currentLevelIdx + 2} / {LEVELS.length}) →
            </button>
          </div>
        )}

        {/* Modal de Vitória FINAL do Jogo */}
        {isGameFinished && (
          <div className="overlay">
            <h1 style={{ margin: 0, color: "#eab308", fontSize: "32px", textAlign: "center" }}>
              🏆 VOCÊ ZEROU O JOGO!
            </h1>
            <p style={{ margin: 0, color: "#cbd5e1", fontSize: "15px", textAlign: "center" }}>
              Parabéns! Você completou todas as 20 fases do Water Sort!
            </p>
            <button className="win-btn-gold" onClick={handleRestartAll}>
              🔄 Jogar Novamente do Início
            </button>
          </div>
        )}
      </div>
    </>
  );
}
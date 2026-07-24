import { useEffect, useRef, useState } from "react";

// Definição das estruturas dos mapas com o labirinto mais aberto e navegável
const MAPS = [
  {
    id: "arena",
    name: "Arena Padrão",
    desc: "Dois blocos centrais clássicos",
    obstacles: [
      { x: 350, y: 60, w: 100, h: 40 },
      { x: 350, y: 220, w: 100, h: 40 },
    ],
  },
  {
    id: "maze",
    name: "Labirinto Dinâmico",
    desc: "Passagens amplas para manobras e tiros",
    obstacles: [
      // Paredes Verticais com passagens mais amplas
      { x: 220, y: 30, w: 18, h: 80 },
      { x: 220, y: 210, w: 18, h: 80 },
      { x: 560, y: 30, w: 18, h: 80 },
      { x: 560, y: 210, w: 18, h: 80 },
      // Paredes Centrais Estratégicas menores
      { x: 350, y: 80, w: 100, h: 18 },
      { x: 350, y: 222, w: 100, h: 18 },
      { x: 391, y: 135, w: 18, h: 50 },
    ],
  },
  {
    id: "open",
    name: "Campo Aberto",
    desc: "Sem obstáculos! Combate puro e rápido",
    obstacles: [],
  },
];

export default function TankBattle({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Estados do Jogo
  const [selectedMap, setSelectedMap] = useState<typeof MAPS[0] | null>(null);
  const [scoreP1, setScoreP1] = useState(0);
  const [scoreP2, setScoreP2] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const gameState = useRef({
    p1: { x: 80, y: 160, angle: 0, hp: 3, color: "#00a884" },
    p2: { x: 720, y: 160, angle: Math.PI, hp: 3, color: "#ef4444" },
    bullets: [] as { x: number; y: number; dx: number; dy: number; owner: number }[],
    keysP1: { forward: false, left: false, right: false, shoot: false },
    keysP2: { forward: false, left: false, right: false, shoot: false },
    lastShotP1: 0,
    lastShotP2: 0,
    obstacles: [] as { x: number; y: number; w: number; h: number }[],
    isGameOver: false,
  });

  const resetRound = () => {
    gameState.current.p1 = { x: 80, y: 160, angle: 0, hp: 3, color: "#00a884" };
    gameState.current.p2 = { x: 720, y: 160, angle: Math.PI, hp: 3, color: "#ef4444" };
    gameState.current.bullets = [];
    gameState.current.keysP1 = { forward: false, left: false, right: false, shoot: false };
    gameState.current.keysP2 = { forward: false, left: false, right: false, shoot: false };
    gameState.current.isGameOver = false;
    setWinner(null);
  };

  const restartFullGame = () => {
    setScoreP1(0);
    setScoreP2(0);
    resetRound();
  };

  // Loop Principal do Jogo
  useEffect(() => {
    if (!selectedMap) return;

    gameState.current.obstacles = selectedMap.obstacles;
    resetRound();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 320;

    let animationFrameId: number;

    const updateAndRender = () => {
      const state = gameState.current;

      if (!state.isGameOver) {
        // P1 Movimento
        if (state.keysP1.left) state.p1.angle -= 0.05;
        if (state.keysP1.right) state.p1.angle += 0.05;
        if (state.keysP1.forward) {
          const nextX = state.p1.x + Math.cos(state.p1.angle) * 2.5;
          const nextY = state.p1.y + Math.sin(state.p1.angle) * 2.5;
          if (nextX > 20 && nextX < canvas.width - 20 && nextY > 20 && nextY < canvas.height - 20) {
            state.p1.x = nextX;
            state.p1.y = nextY;
          }
        }

        // P2 Movimento
        if (state.keysP2.left) state.p2.angle -= 0.05;
        if (state.keysP2.right) state.p2.angle += 0.05;
        if (state.keysP2.forward) {
          const nextX = state.p2.x + Math.cos(state.p2.angle) * 2.5;
          const nextY = state.p2.y + Math.sin(state.p2.angle) * 2.5;
          if (nextX > 20 && nextX < canvas.width - 20 && nextY > 20 && nextY < canvas.height - 20) {
            state.p2.x = nextX;
            state.p2.y = nextY;
          }
        }

        // Disparos
        const now = Date.now();
        if (state.keysP1.shoot && now - state.lastShotP1 > 400) {
          state.bullets.push({
            x: state.p1.x + Math.cos(state.p1.angle) * 20,
            y: state.p1.y + Math.sin(state.p1.angle) * 20,
            dx: Math.cos(state.p1.angle) * 6,
            dy: Math.sin(state.p1.angle) * 6,
            owner: 1,
          });
          state.lastShotP1 = now;
        }

        if (state.keysP2.shoot && now - state.lastShotP2 > 400) {
          state.bullets.push({
            x: state.p2.x + Math.cos(state.p2.angle) * 20,
            y: state.p2.y + Math.sin(state.p2.angle) * 20,
            dx: Math.cos(state.p2.angle) * 6,
            dy: Math.sin(state.p2.angle) * 6,
            owner: 2,
          });
          state.lastShotP2 = now;
        }

        // Colisões de Balas
        for (let i = state.bullets.length - 1; i >= 0; i--) {
          const b = state.bullets[i];
          b.x += b.dx;
          b.y += b.dy;

          if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            state.bullets.splice(i, 1);
            continue;
          }

          let hitObstacle = false;
          for (const obs of state.obstacles) {
            if (b.x >= obs.x && b.x <= obs.x + obs.w && b.y >= obs.y && b.y <= obs.y + obs.h) {
              hitObstacle = true;
              break;
            }
          }
          if (hitObstacle) {
            state.bullets.splice(i, 1);
            continue;
          }

          if (b.owner !== 1 && Math.hypot(b.x - state.p1.x, b.y - state.p1.y) < 18) {
            state.p1.hp -= 1;
            state.bullets.splice(i, 1);
            if (state.p1.hp <= 0) {
              state.isGameOver = true;
              setScoreP2((prev) => prev + 1);
              setWinner("Jogador 2 Venceu!");
            }
            continue;
          }

          if (b.owner !== 2 && Math.hypot(b.x - state.p2.x, b.y - state.p2.y) < 18) {
            state.p2.hp -= 1;
            state.bullets.splice(i, 1);
            if (state.p2.hp <= 0) {
              state.isGameOver = true;
              setScoreP1((prev) => prev + 1);
              setWinner("Jogador 1 Venceu!");
            }
            continue;
          }
        }
      }

      // Renderização
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#334155";
      for (const obs of state.obstacles) {
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      }

      const drawTank = (tank: typeof state.p1) => {
        ctx.save();
        ctx.translate(tank.x, tank.y);
        ctx.rotate(tank.angle);

        ctx.fillStyle = tank.color;
        ctx.fillRect(-15, -12, 30, 24);

        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, -3, 20, 6);

        ctx.restore();

        ctx.fillStyle = "#1e293b";
        ctx.fillRect(tank.x - 15, tank.y - 22, 30, 5);
        ctx.fillStyle = tank.color;
        ctx.fillRect(tank.x - 15, tank.y - 22, (tank.hp / 3) * 30, 5);
      };

      drawTank(state.p1);
      drawTank(state.p2);

      ctx.fillStyle = "#facc15";
      for (const b of state.bullets) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(updateAndRender);
    };

    animationFrameId = requestAnimationFrame(updateAndRender);

    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedMap]);

  const setKey = (player: 1 | 2, key: "forward" | "left" | "right" | "shoot", value: boolean) => {
    if (player === 1) gameState.current.keysP1[key] = value;
    else gameState.current.keysP2[key] = value;
  };

  return (
    <>
      <style>{`
        .tank-screen {
          width: 100vw;
          height: 100dvh;
          background: #0b1014;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          font-family: system-ui, sans-serif;
          user-select: none;
          touch-action: none;
          overflow: hidden;
          padding: 8px 12px;
          box-sizing: border-box;
        }

        .map-select-overlay {
          width: 100vw;
          height: 100dvh;
          background: #0b1014;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 24px;
          color: #f8fafc;
        }

        .map-cards {
          display: flex;
          gap: 16px;
        }

        .map-card {
          background: #1e293b;
          border: 2px solid #334155;
          border-radius: 16px;
          padding: 20px;
          width: 180px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .map-card:hover {
          border-color: #00a884;
          transform: translateY(-4px);
        }

        .controls-container {
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
        }

        .dpad-cross {
          display: grid;
          grid-template-columns: repeat(2, 48px);
          grid-template-rows: repeat(3, 48px);
          gap: 6px;
          align-items: center;
          justify-content: center;
        }

        .ctrl-btn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: #1e293b;
          border: 1px solid #334155;
          color: #f8fafc;
          font-size: 18px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .ctrl-btn:active {
          background: #334155;
        }

        .p1-forward {
          background: #00a884;
          border-color: #2dd4bf;
        }

        .p2-forward {
          background: #ef4444;
          border-color: #f87171;
        }

        .btn-fire {
          background: rgba(239, 68, 68, 0.15);
          border: 1.5px solid #ef4444;
          color: #ef4444;
        }

        .center-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          position: relative;
        }

        .top-bar {
          position: absolute;
          top: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(15, 23, 42, 0.9);
          padding: 4px 8px;
          border-radius: 20px;
          border: 1px solid #334155;
          gap: 12px;
        }

        .top-bar-btn {
          background: #1e293b;
          border: 1px solid #334155;
          color: #94a3b8;
          padding: 4px 10px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 11px;
          font-weight: bold;
          transition: all 0.2s;
        }

        .top-bar-btn:hover {
          color: #f8fafc;
          border-color: #64748b;
        }

        .score-txt {
          font-weight: bold;
          font-size: 13px;
        }

        canvas {
          border-radius: 12px;
          border: 1px solid #334155;
          max-width: 98%;
          max-height: 85vh;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        .game-over-overlay {
          position: absolute;
          background: rgba(11, 16, 20, 0.9);
          padding: 20px 30px;
          border-radius: 16px;
          border: 1px solid #334155;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: center;
        }
      `}</style>

      {/* TELA DE SELEÇÃO DE MAPA */}
      {!selectedMap ? (
        <div className="map-select-overlay">
          <h2 style={{ margin: 0 }}>Escolha um Mapa para Iniciar</h2>
          <div className="map-cards">
            {MAPS.map((map) => (
              <div key={map.id} className="map-card" onClick={() => setSelectedMap(map)}>
                <h3 style={{ margin: "0 0 8px 0", color: "#00a884" }}>{map.name}</h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{map.desc}</p>
              </div>
            ))}
          </div>
          <button
            className="top-bar-btn"
            style={{ padding: "8px 16px", fontSize: "13px" }}
            onClick={onBack}
          >
            Sair do Jogo
          </button>
        </div>
      ) : (
        /* TELA DE JOGO ARCADE */
        <div className="tank-screen">
          {/* CONTROLES P1 (ESQUERDA) - ▲ GIRO ANTI-HORÁRIO (ESQUERDA DO P1) */}
          <div className="controls-container">
            <div className="dpad-cross">
              <button
                className="ctrl-btn"
                style={{ gridColumn: "1 / span 2", justifySelf: "center" }}
                onTouchStart={() => setKey(1, "left", true)}
                onTouchEnd={() => setKey(1, "left", false)}
                onMouseDown={() => setKey(1, "left", true)}
                onMouseUp={() => setKey(1, "left", false)}
              >
                ▲
              </button>

              <button
                className="ctrl-btn btn-fire"
                onTouchStart={() => setKey(1, "shoot", true)}
                onTouchEnd={() => setKey(1, "shoot", false)}
                onMouseDown={() => setKey(1, "shoot", true)}
                onMouseUp={() => setKey(1, "shoot", false)}
              >
                🔥
              </button>

              <button
                className="ctrl-btn p1-forward"
                onTouchStart={() => setKey(1, "forward", true)}
                onTouchEnd={() => setKey(1, "forward", false)}
                onMouseDown={() => setKey(1, "forward", true)}
                onMouseUp={() => setKey(1, "forward", false)}
              >
                ▶
              </button>

              <button
                className="ctrl-btn"
                style={{ gridColumn: "1 / span 2", justifySelf: "center" }}
                onTouchStart={() => setKey(1, "right", true)}
                onTouchEnd={() => setKey(1, "right", false)}
                onMouseDown={() => setKey(1, "right", true)}
                onMouseUp={() => setKey(1, "right", false)}
              >
                ▼
              </button>
            </div>
          </div>

          {/* ÁREA CENTRAL */}
          <div className="center-area">
            <div className="top-bar">
              <button className="top-bar-btn" onClick={() => setSelectedMap(null)}>
                ← Voltar
              </button>

              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span className="score-txt" style={{ color: "#00a884" }}>
                  P1: {scoreP1}
                </span>
                <span style={{ color: "#64748b" }}>|</span>
                <span className="score-txt" style={{ color: "#ef4444" }}>
                  P2: {scoreP2}
                </span>
              </div>

              <button className="top-bar-btn" onClick={restartFullGame}>
                🔄 Reiniciar
              </button>
            </div>

            <canvas ref={canvasRef} />

            {winner && (
              <div className="game-over-overlay">
                <h2 style={{ margin: 0, color: "#f8fafc" }}>{winner}</h2>
                <button
                  style={{
                    background: "#00a884",
                    border: "none",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={resetRound}
                >
                  Próxima Rodada
                </button>
              </div>
            )}
          </div>

          {/* CONTROLES P2 (DIREITA) - ▲ GIRO HORÁRIO (DIREITA DO P2) */}
          <div className="controls-container">
            <div className="dpad-cross">
              <button
                className="ctrl-btn"
                style={{ gridColumn: "1 / span 2", justifySelf: "center" }}
                onTouchStart={() => setKey(2, "right", true)}
                onTouchEnd={() => setKey(2, "right", false)}
                onMouseDown={() => setKey(2, "right", true)}
                onMouseUp={() => setKey(2, "right", false)}
              >
                ▲
              </button>

              <button
                className="ctrl-btn p2-forward"
                onTouchStart={() => setKey(2, "forward", true)}
                onTouchEnd={() => setKey(2, "forward", false)}
                onMouseDown={() => setKey(2, "forward", true)}
                onMouseUp={() => setKey(2, "forward", false)}
              >
                ◀
              </button>

              <button
                className="ctrl-btn btn-fire"
                onTouchStart={() => setKey(2, "shoot", true)}
                onTouchEnd={() => setKey(2, "shoot", false)}
                onMouseDown={() => setKey(2, "shoot", true)}
                onMouseUp={() => setKey(2, "shoot", false)}
              >
                🔥
              </button>

              <button
                className="ctrl-btn"
                style={{ gridColumn: "1 / span 2", justifySelf: "center" }}
                onTouchStart={() => setKey(2, "left", true)}
                onTouchEnd={() => setKey(2, "left", false)}
                onMouseDown={() => setKey(2, "left", true)}
                onMouseUp={() => setKey(2, "left", false)}
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
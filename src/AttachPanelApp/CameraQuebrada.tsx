import { useState, useEffect, useRef } from "react";

interface CameraQuebradaProps {
  onClose: () => void;
}

interface ColunaLCD {
  x: number;
  w: number;
  r: number;
  g: number;
  b: number;
  base: number;
}

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);
const IconFlashOff = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M3.27 3L2 4.27l5 5V13h3v9l3.58-6.14L17.73 20 19 18.73 3.27 3zM17 10h-4l4-8H7v2.18l8.46 8.46L17 10z"/>
  </svg>
);
const IconGallery = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);
const IconFlipCam = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
    <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-5 11.5V14H9v2.5L5.5 13 9 9.5V12h6V9.5l3.5 3.5-3.5 3.5z"/>
  </svg>
);

// ── CANVAS DO EFEITO AJUSTADO (MAIS PARA A ESQUERDA E MENOS LINHAS) ──
function BrokenLCDCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;

    // Gerador de colunas coloridas finas nas áreas do LCD
    const cols: ColunaLCD[] = [];
    const palette = [
      [0,0,255],[0,120,255],[0,255,255],[0,255,100],[255,255,0],
      [255,100,0],[255,0,0],[255,0,200],[150,0,255],[255,255,255],
      [0,0,0],[15,15,15],[30,30,30]
    ];
    
    let cx = 0;
    while (cx < W) {
      const [r,g,b] = palette[Math.floor(Math.random() * palette.length)];
      const w = Math.random() > 0.6 ? 1 : Math.random() > 0.5 ? 2 : 3;
      cols.push({ x: cx, w, r, g, b, base: 0.4 + Math.random() * 0.6 });
      cx += w;
    }

    // Movido mais para a esquerda para reduzir a quantidade de linhas visíveis
    const T1 = { x: 0, y: 0 };
    const T2 = { x: W * 0.52, y: 0 };  // Ajustado de 0.66 para 0.52
    const T3 = { x: W * 0.38, y: H };  // Ajustado de 0.49 para 0.38
    const T4 = { x: 0, y: H };

    function drawTriangleBorders(context: CanvasRenderingContext2D) {
      // Linha de corte preta profunda da diagonal principal
      context.strokeStyle = "rgba(0, 0, 0, 0.9)";
      context.lineWidth = 4;
      context.beginPath();
      context.moveTo(T2.x, T2.y);
      context.lineTo(T3.x, T3.y);
      context.stroke();

      context.strokeStyle = "#000000";
      context.lineWidth = 1.5;
      context.beginPath();
      context.moveTo(T2.x, T2.y);
      context.lineTo(T3.x, T3.y);
      context.stroke();

      // Reflexo sutil de vidro na quina viva
      context.strokeStyle = "rgba(255, 255, 255, 0.35)";
      context.lineWidth = 0.8;
      context.beginPath();
      context.moveTo(T2.x - 1, T2.y);
      context.lineTo(T3.x - 1, T3.y);
      context.stroke();
    }

    function draw() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, W, H);
      
      // Fundo preto absoluto da tela queimada (lado direito)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      // Máscara contendo as listras coloridas (lado esquerdo)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(T1.x, T1.y);
      ctx.lineTo(T2.x, T2.y);
      ctx.lineTo(T3.x, T3.y);
      ctx.lineTo(T4.x, T4.y);
      ctx.closePath();
      ctx.clip(); 

      // Renderiza as listras verticais
      for (const col of cols) {
        const roll = Math.random();
        let alpha = col.base;
        if (roll > 0.99) alpha = 0;
        else if (roll > 0.97) alpha *= 0.3;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${col.r},${col.g},${col.b})`;
        ctx.fillRect(col.x, 0, col.w, H);
      }

      ctx.restore();
      ctx.globalAlpha = 1;

      // Desenha as quinas vivas do vidro quebrado por cima
      drawTriangleBorders(ctx);

      // Ruído estático sutil e esporádico adaptado ao novo limite
      if (Math.random() > 0.94) {
        const gy = Math.floor(Math.random() * H);
        const gh = 4 + Math.floor(Math.random() * 10);
        const gx = (Math.random() - 0.5) * 14;
        try {
          ctx.drawImage(canvas, 0, gy, W * 0.4, gh, gx, gy, W * 0.4, gh);
        } catch (_) {}
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}

// ── MODAL DE ERRO ────────────────────────────────────────────────────────────
function ModalErro({ onClose }: CameraQuebradaProps) {
  const msgs = [
    { titulo: "ERRO: linda demais", corpo: "Sistema de câmera entrou em colapso. Reiniciando..." },
    { titulo: "Limite de beleza excedido", corpo: "O sensor não suporta tanta perfeição. Câmera travada." },
    { titulo: "Câmera danificada", corpo: "Causas prováveis: você sorriu para a lente." }
  ];
  const [idx] = useState(() => Math.floor(Math.random() * msgs.length));
  const m = msgs[idx];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 60,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0, 0, 0, 0.6)",
      animation: "bdIn 0.2s ease",
    }}>
      <div style={{
        background: "#222222",
        borderRadius: 14,
        width: 280, maxWidth: "85vw",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        animation: "boxIn 0.25s cubic-bezier(.2,.8,.3,1)",
        textAlign: "center"
      }}>
        <div style={{ padding: "24px 20px 20px" }}>
          <div style={{ color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 8 }}>{m.titulo}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.4 }}>{m.corpo}</div>
        </div>
        <div style={{ height: "0.5px", background: "rgba(255,255,255,0.15)" }}/>
        <button
          onClick={onClose}
          style={{
            display: "block", width: "100%", padding: "14px 0",
            background: "none", border: "none",
            color: "#007fff", fontSize: 17, fontWeight: 600,
            cursor: "pointer", WebkitTapHighlightColor: "transparent"
          }}
        >Ok</button>
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function CameraQuebrada({ onClose }: CameraQuebradaProps) {
  const [activeMode, setActiveMode] = useState<number>(1);
  const [showError, setShowError]   = useState<boolean>(false);
  const [flash, setFlash]           = useState<boolean>(false);
  const [pressed, setPressed]       = useState<boolean>(false);

  function handleShutter() {
    setPressed(true);
    setFlash(true);
    setTimeout(() => { setPressed(false); setFlash(false); }, 100);
    setTimeout(() => setShowError(true), 250);
  }

  return (
    <>
      <style>{`
        @keyframes bdIn  { from{opacity:0} to{opacity:1} }
        @keyframes boxIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes cqIn  { from{opacity:0} to{opacity:1} }
        @keyframes flashA{ from{opacity:0.8} to{opacity:0} }
        
        .cq-root {
          position: fixed; inset: 0; z-index: 500;
          background: #000;
          display: flex; flex-direction: column;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          animation: cqIn 0.2s ease;
        }
        .cq-vf {
          flex: 1; position: relative; overflow: hidden; background: #000;
        }
        .cq-flash {
          position: absolute; inset: 0; z-index: 45; background: #fff;
          pointer-events: none; animation: flashA 0.1s ease forwards;
        }
        
        .cq-hdr {
          position: absolute; top: 0; left: 0; right: 0; z-index: 30;
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px;
          padding-top: max(12px, env(safe-area-inset-top, 12px));
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%);
        }
        .cq-icon-btn {
          background: none; border: none; color: #fff;
          width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
        }

        .cq-bot {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 30;
          display: flex; flex-direction: column; align-items: center;
          padding-bottom: max(24px, env(safe-area-inset-bottom, 24px));
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%);
        }
        
        .cq-modes {
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px; gap: 4px;
        }
        .cq-mode {
          background: none; border: none;
          color: rgba(255,255,255,0.6);
          font-size: 14px; font-weight: 600;
          cursor: pointer; padding: 6px 16px;
          -webkit-tap-highlight-color: transparent;
          border-radius: 20px;
          transition: color 0.15s;
        }
        .cq-mode.active { 
          color: #fff; 
          background: rgba(255, 255, 255, 0.15); 
        }
        
        .cq-ctrl-row {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 0 32px; box-sizing: border-box;
        }
        
        .cq-side-btn {
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(30, 30, 30, 0.75);
          border: none; color: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .cq-side-btn:active { background: rgba(60, 60, 60, 0.85); }
        
        .cq-shut-wrap {
          position: relative; width: 80px; height: 80px;
          display: flex; align-items: center; justify-content: center;
        }
        .cq-shut-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 4px solid #ffffff; pointer-events: none;
        }
        .cq-shut {
          width: 66px; height: 66px; border-radius: 50%;
          background: #ffffff; border: none; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.08s;
        }
        .cq-shut.pressed { transform: scale(0.88); background: #dddddd; }
      `}</style>

      <div className="cq-root">
        <div className="cq-vf">
          <BrokenLCDCanvas />
          {flash && <div className="cq-flash" />}
          {showError && <ModalErro onClose={() => setShowError(false)} />}
        </div>

        <div className="cq-hdr">
          <button className="cq-icon-btn" onClick={onClose}><IconClose /></button>
          <button className="cq-icon-btn"><IconFlashOff /></button>
        </div>

        <div className="cq-bot">
          <div className="cq-modes">
            {["Vídeo", "Foto", "Recado de vídeo"].map((m, i) => (
              <button
                key={i}
                className={`cq-mode${activeMode === i ? " active" : ""}`}
                onClick={() => setActiveMode(i)}
              >{m}</button>
            ))}
          </div>

          <div className="cq-ctrl-row">
            <button className="cq-side-btn"><IconGallery /></button>
            
            <div className="cq-shut-wrap">
              <div className="cq-shut-ring" />
              <button
                className={`cq-shut${pressed ? " pressed" : ""}`}
                onClick={handleShutter}
              />
            </div>
            
            <button className="cq-side-btn"><IconFlipCam /></button>
          </div>
        </div>
      </div>
    </>
  );
}
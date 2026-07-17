import { useState, useEffect, useMemo } from "react";

type Props = {
  onFechar: () => void;
};

type Fase = "checkbox" | "verificando" | "desafio";
type TipoDesafio = "grid" | "texto";

const CATEGORIAS_GRID = [
  { label: "semáforos", alvo: "🚦" },
  { label: "faixas de pedestre", alvo: "🚸" },
  { label: "hidrantes", alvo: "🧯" },
  { label: "bicicletas", alvo: "🚲" },
  { label: "ônibus", alvo: "🚌" },
  { label: "pontes", alvo: "🌉" },
];

const DISTRATORES = ["🌳", "🏠", "⚽", "🐕", "🌵", "🎈", "📦", "🍎", "🛑", "🚗", "🎩", "🕶️", "🐢", "🍕", "🛞"];

const MENSAGENS_ERRO = [
  "Verificação falhou. Tente novamente.",
  "Resposta incorreta. Isso é embaraçoso.",
  "Quase... mas não. Tente de novo.",
  "Errado! Tem certeza que não é um robô?",
  "Falhou de novo. Talvez você seja um robô mesmo...",
  "Incorreto. A tentativa nem chegou perto.",
];

const LETRAS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function gerarGrid(alvo: string): string[] {
  const qtdAlvos = 3 + Math.floor(Math.random() * 2); // 3 ou 4
  const slots: string[] = new Array(9).fill("");
  const indicesAlvo = new Set<number>();
  while (indicesAlvo.size < qtdAlvos) {
    indicesAlvo.add(Math.floor(Math.random() * 9));
  }
  for (let i = 0; i < 9; i++) {
    if (indicesAlvo.has(i)) {
      slots[i] = alvo;
    } else {
      slots[i] = DISTRATORES[Math.floor(Math.random() * DISTRATORES.length)];
    }
  }
  return slots;
}

function gerarTexto(): string {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += LETRAS[Math.floor(Math.random() * LETRAS.length)];
  }
  return s;
}

export default function NovoGrupoCaptcha({ onFechar }: Props) {
  const [fase, setFase] = useState<Fase>("checkbox");
  const [tentativas, setTentativas] = useState(1);
  const [tremendo, setTremendo] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const [tipoDesafio, setTipoDesafio] = useState<TipoDesafio>("grid");
  const [categoria, setCategoria] = useState(CATEGORIAS_GRID[0]);
  const [tiles, setTiles] = useState<string[]>([]);
  const [selecionados, setSelecionados] = useState<Set<number>>(new Set());
  const [textoAlvo, setTextoAlvo] = useState("");
  const [textoDigitado, setTextoDigitado] = useState("");

  const sortearNovoDesafio = () => {
    const tipo: TipoDesafio = Math.random() < 0.65 ? "grid" : "texto";
    setTipoDesafio(tipo);
    setSelecionados(new Set());
    setTextoDigitado("");
    if (tipo === "grid") {
      const cat = CATEGORIAS_GRID[Math.floor(Math.random() * CATEGORIAS_GRID.length)];
      setCategoria(cat);
      setTiles(gerarGrid(cat.alvo));
    } else {
      setTextoAlvo(gerarTexto());
    }
  };

  useEffect(() => {
    if (fase === "checkbox") return;
    if (fase === "verificando") {
      const t = setTimeout(() => {
        sortearNovoDesafio();
        setFase("desafio");
      }, 900);
      return () => clearTimeout(t);
    }
  }, [fase]);

  const handleCheckbox = () => {
    setFase("verificando");
  };

  const handleVerificar = () => {
    setTremendo(true);
    setMensagemErro(MENSAGENS_ERRO[Math.floor(Math.random() * MENSAGENS_ERRO.length)]);
    setTimeout(() => {
      setTremendo(false);
      setTentativas((n) => n + 1);
      sortearNovoDesafio();
    }, 900);
  };

  const toggleTile = (i: number) => {
    setSelecionados((prev) => {
      const novo = new Set(prev);
      if (novo.has(i)) novo.delete(i);
      else novo.add(i);
      return novo;
    });
  };

  const letrasDistorcidas = useMemo(() => {
    return textoAlvo.split("").map((letra) => ({
      letra,
      rot: (Math.random() * 30 - 15).toFixed(1),
      ty: (Math.random() * 10 - 5).toFixed(1),
      fs: 22 + Math.floor(Math.random() * 8),
    }));
  }, [textoAlvo]);

  return (
    <div className="cp-overlay">
      <div className="cp-sheet">
        <button className="cp-close" onClick={onFechar} aria-label="Cancelar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#5f6368" strokeWidth="1.8">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>

        <p className="cp-titulo">Verificação para criar o grupo</p>

        {fase === "checkbox" && (
          <div className="cp-checkbox-card">
            <label className="cp-checkbox-linha" onClick={handleCheckbox}>
              <span className="cp-checkbox-box" />
              <span className="cp-checkbox-texto">Não sou um robô</span>
            </label>
            <div className="cp-marca">
              <div className="cp-marca-logo" />
              <span>reCHATCHA</span>
            </div>
          </div>
        )}

        {fase === "verificando" && (
          <div className="cp-checkbox-card cp-verificando">
            <div className="cp-mini-spinner" />
            <span className="cp-verificando-texto">Verificando...</span>
          </div>
        )}

        {fase === "desafio" && (
          <div className={`cp-desafio-card ${tremendo ? "cp-tremer" : ""}`}>
            <div className="cp-instrucao">
              <span className="cp-instrucao-titulo">
                {tipoDesafio === "grid"
                  ? <>Selecione todas as imagens com <strong>{categoria.label}</strong></>
                  : <>Digite as letras e números que você vê abaixo</>}
              </span>
              <span className="cp-tentativa">Tentativa nº {tentativas}</span>
            </div>

            {tipoDesafio === "grid" && (
              <div className="cp-grid">
                {tiles.map((emoji, i) => (
                  <button
                    key={i}
                    className={`cp-tile ${selecionados.has(i) ? "cp-tile-selecionado" : ""}`}
                    style={{ background: `hsl(${(i * 47) % 360}, 30%, 22%)` }}
                    onClick={() => toggleTile(i)}
                  >
                    <span className="cp-tile-emoji">{emoji}</span>
                    {selecionados.has(i) && (
                      <span className="cp-tile-check">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <circle cx="12" cy="12" r="12" fill="#4285f4" />
                          <path d="M7 12.5l3 3 7-7" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {tipoDesafio === "texto" && (
              <div className="cp-texto-desafio">
                <div className="cp-texto-imagem">
                  {letrasDistorcidas.map((l, i) => (
                    <span
                      key={i}
                      className="cp-letra"
                      style={{
                        transform: `rotate(${l.rot}deg) translateY(${l.ty}px)`,
                        fontSize: `${l.fs}px`,
                      }}
                    >
                      {l.letra}
                    </span>
                  ))}
                  <div className="cp-ruido" />
                </div>
                <input
                  className="cp-input"
                  placeholder="Digite o texto acima"
                  value={textoDigitado}
                  onChange={(e) => setTextoDigitado(e.target.value)}
                />
              </div>
            )}

            {mensagemErro && tremendo && (
              <div className="cp-erro">{mensagemErro}</div>
            )}

            <div className="cp-desafio-rodape">
              <button className="cp-icone-btn" onClick={() => sortearNovoDesafio()} title="Nova verificação">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#5f6368" strokeWidth="1.8">
                  <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.5 9A7 7 0 0 1 19 12M18.5 15A7 7 0 0 1 5 12" strokeLinecap="round" />
                </svg>
              </button>
              <button className="cp-verificar-btn" onClick={handleVerificar}>
                VERIFICAR
              </button>
            </div>
          </div>
        )}

        <button className="cp-cancelar-link" onClick={onFechar}>
          Cancelar criação do grupo
        </button>
      </div>

      <style>{`
        .cp-overlay {
          position: absolute; inset: 0; z-index: 500;
          background: rgba(0,0,0,.6);
          display: flex; align-items: flex-end; justify-content: center;
          animation: cpFadeIn .15s ease;
        }
        @keyframes cpFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .cp-sheet {
          position: relative;
          background: #131313; border-radius: 16px 16px 0 0;
          width: 100%; max-width: 100%; max-height: 82%;
          overflow-y: auto;
          padding: 18px 16px 20px;
          box-shadow: 0 -8px 30px rgba(0,0,0,.6);
          animation: cpSlideUp .22s cubic-bezier(.2,.8,.3,1);
          font-family: inherit;
        }
        .cp-sheet::-webkit-scrollbar { width: 0; }
        @keyframes cpSlideUp {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cp-close {
          position: absolute; top: 14px; right: 12px;
          background: none; border: none; cursor: pointer;
          padding: 4px; line-height: 0;
        }

        .cp-titulo {
          color: #e8eaed; font-size: 14px; font-weight: 600;
          margin: 2px 30px 14px 2px;
        }

        .cp-checkbox-card {
          background: #f9f9f9; border: 1px solid #d3d3d3; border-radius: 4px;
          padding: 18px 16px; display: flex; align-items: center; justify-content: space-between;
          gap: 16px;
        }
        .cp-checkbox-linha { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .cp-checkbox-box {
          width: 26px; height: 26px; border: 2px solid #c1c1c1; border-radius: 3px;
          background: #fff; flex-shrink: 0;
        }
        .cp-checkbox-texto { color: #1a1a1a; font-size: 14.5px; }
        .cp-marca { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
        .cp-marca-logo {
          width: 26px; height: 26px; border-radius: 50%;
          background: conic-gradient(#4285f4 0 25%, #ea4335 25% 50%, #fbbc05 50% 75%, #34a853 75% 100%);
        }
        .cp-marca span { color: #6b6b6b; font-size: 9px; font-weight: 600; }

        .cp-verificando { justify-content: center; gap: 10px; }
        .cp-mini-spinner {
          width: 18px; height: 18px; border-radius: 50%;
          border: 2.5px solid #d3d3d3; border-top-color: #4285f4;
          animation: cpSpin .7s linear infinite;
        }
        @keyframes cpSpin { to { transform: rotate(360deg); } }
        .cp-verificando-texto { color: #1a1a1a; font-size: 13.5px; }

        .cp-desafio-card {
          background: #f9f9f9; border-radius: 6px; overflow: hidden;
          border: 1px solid #d3d3d3;
        }
        .cp-tremer { animation: cpShake .4s; }
        @keyframes cpShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }

        .cp-instrucao {
          background: #4285f4; padding: 12px 14px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .cp-instrucao-titulo { color: #fff; font-size: 13.5px; line-height: 18px; }
        .cp-tentativa { color: rgba(255,255,255,.75); font-size: 10.5px; }

        .cp-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 2px; background: #fff;
        }
        .cp-tile {
          position: relative; aspect-ratio: 1 / 1; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          padding: 0;
        }
        .cp-tile-emoji { font-size: 30px; filter: drop-shadow(0 1px 2px rgba(0,0,0,.4)); }
        .cp-tile-selecionado { box-shadow: inset 0 0 0 3px #4285f4; }
        .cp-tile-check { position: absolute; top: 4px; left: 4px; }

        .cp-texto-desafio { padding: 16px 14px; display: flex; flex-direction: column; gap: 14px; }
        .cp-texto-imagem {
          position: relative; background: #e8e8e8; border-radius: 4px;
          height: 64px; display: flex; align-items: center; justify-content: center;
          gap: 4px; overflow: hidden;
        }
        .cp-letra {
          display: inline-block; font-weight: 700; color: #333;
          font-family: Georgia, serif;
        }
        .cp-ruido {
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(115deg, rgba(0,0,0,.08) 0 2px, transparent 2px 10px);
        }
        .cp-input {
          background: #fff; border: 1.5px solid #c1c1c1; border-radius: 4px;
          padding: 10px 12px; font-size: 14px; color: #1a1a1a;
          font-family: inherit;
        }
        .cp-input:focus { outline: none; border-color: #4285f4; }

        .cp-erro {
          background: #fce8e6; color: #c5221f; font-size: 12px;
          padding: 8px 14px; font-weight: 500;
        }

        .cp-desafio-rodape {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 12px; background: #f0f0f0;
        }
        .cp-icone-btn {
          background: none; border: none; cursor: pointer; padding: 6px;
          line-height: 0; border-radius: 50%;
        }
        .cp-icone-btn:active { background: rgba(0,0,0,.06); }
        .cp-verificar-btn {
          background: #4285f4; color: #fff; border: none;
          padding: 9px 18px; border-radius: 4px; font-size: 12.5px;
          font-weight: 600; letter-spacing: .3px; cursor: pointer; font-family: inherit;
        }
        .cp-verificar-btn:active { background: #3367d6; }

        .cp-cancelar-link {
          display: block; margin: 16px auto 2px; background: none; border: none;
          color: #8696a0; font-size: 12.5px; text-decoration: underline;
          cursor: pointer; font-family: inherit;
        }
      `}</style>
    </div>
  );
}
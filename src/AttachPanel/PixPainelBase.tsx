import { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PixPainelBase — versão padronizada/reutilizável do painel de Pix.
// Mostra uma lista de transações recentes; ao tocar em uma, ou mostra um erro
// de "falha ao carregar comprovante" (toast), ou — só para a transação cujo
// índice bate com `indiceComprovante` — abre o comprovante de verdade.
//
// Cada chat define suas próprias transações e o comprovante (ex: pixMae.ts).
// ─────────────────────────────────────────────────────────────────────────────

export type TransacaoPix = {
  id: string;
  nome: string;
  avatarLetra: string; // iniciais mostradas no círculo
  valor: string; // ex: "R$ 45,00"
  data: string;
  hora: string;
  tipo: "enviado" | "recebido";
};

export type ComprovantePix = {
  valor: string;
  data: string;
  hora: string;
  idTransacao: string;
  pagador: { nome: string; instituicao: string; chave?: string };
  recebedor: { nome: string; instituicao: string; chave?: string };
  descricao?: string;
};

type Props = {
  onClose: () => void;
  transacoes: TransacaoPix[];
  indiceComprovante: number; // índice (0-based) da transação que realmente abre
  comprovante: ComprovantePix;
  titulo?: string;
};

const IconBack = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const IconPixCircle = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7l4.2 4.2a1.13 1.13 0 0 0 1.6 0L17 7" />
    <path d="M7 17l4.2-4.2a1.13 1.13 0 0 1 1.6 0L17 17" />
  </svg>
);

const IconAlert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="#32bcad">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export default function PixPainelBase({
  onClose,
  transacoes,
  indiceComprovante,
  comprovante,
  titulo = "Pix",
}: Props) {
  const [mostrarErro, setMostrarErro] = useState(false);
  const [mostrarComprovante, setMostrarComprovante] = useState(false);

  useEffect(() => {
    if (!mostrarErro) return;
    const t = setTimeout(() => setMostrarErro(false), 2600);
    return () => clearTimeout(t);
  }, [mostrarErro]);

  const handleAbrirTransacao = (index: number) => {
    if (index === indiceComprovante) {
      setMostrarComprovante(true);
    } else {
      setMostrarErro(true);
    }
  };

  if (mostrarComprovante) {
    return (
      <div className="pix-screen">
        <div className="pix-header">
          <button className="pix-btn-voltar" onClick={() => setMostrarComprovante(false)}>
            <IconBack />
          </button>
          <span className="pix-header-titulo">Comprovante</span>
        </div>

        <div className="pix-receipt-body">
          <div className="pix-receipt-card">
            <div className="pix-receipt-check"><IconCheckCircle /></div>
            <div className="pix-receipt-valor">{comprovante.valor}</div>
            <div className="pix-receipt-status">Transferência via Pix realizada</div>
            <div className="pix-receipt-datahora">{comprovante.data} às {comprovante.hora}</div>

            <div className="pix-receipt-divisor" />

            <div className="pix-receipt-secao">
              <div className="pix-receipt-secao-label">Quem pagou</div>
              <div className="pix-receipt-linha"><span>Nome</span><span>{comprovante.pagador.nome}</span></div>
              <div className="pix-receipt-linha"><span>Instituição</span><span>{comprovante.pagador.instituicao}</span></div>
              {comprovante.pagador.chave && (
                <div className="pix-receipt-linha"><span>Chave Pix</span><span>{comprovante.pagador.chave}</span></div>
              )}
            </div>

            <div className="pix-receipt-secao">
              <div className="pix-receipt-secao-label">Quem recebeu</div>
              <div className="pix-receipt-linha"><span>Nome</span><span>{comprovante.recebedor.nome}</span></div>
              <div className="pix-receipt-linha"><span>Instituição</span><span>{comprovante.recebedor.instituicao}</span></div>
              {comprovante.recebedor.chave && (
                <div className="pix-receipt-linha"><span>Chave Pix</span><span>{comprovante.recebedor.chave}</span></div>
              )}
            </div>

            {comprovante.descricao && (
              <div className="pix-receipt-secao">
                <div className="pix-receipt-secao-label">Descrição</div>
                <div className="pix-receipt-descricao">{comprovante.descricao}</div>
              </div>
            )}

            <div className="pix-receipt-divisor" />
            <div className="pix-receipt-id">ID da transação: {comprovante.idTransacao}</div>
          </div>
        </div>

        <style>{estilos}</style>
      </div>
    );
  }

  return (
    <div className="pix-screen">
      <div className="pix-header">
        <button className="pix-btn-voltar" onClick={onClose}>
          <IconBack />
        </button>
        <span className="pix-header-titulo">{titulo}</span>
      </div>

      <div className="pix-container">
        <div className="pix-secao-label">Transações recentes</div>
        <div className="pix-lista">
          {transacoes.map((t, i) => (
            <div key={t.id} className="pix-item" onClick={() => handleAbrirTransacao(i)}>
              <div className="pix-avatar">{t.avatarLetra}</div>
              <div className="pix-item-meta">
                <div className="pix-item-nome">{t.nome}</div>
                <div className="pix-item-sub">{t.tipo === "enviado" ? "Pix enviado" : "Pix recebido"} · {t.data} {t.hora}</div>
              </div>
              <div className={`pix-item-valor ${t.tipo}`}>
                {t.tipo === "enviado" ? "- " : "+ "}{t.valor}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mostrarErro && (
        <div className="pix-toast">
          <IconAlert />
          <span>Não foi possível carregar o comprovante. Tente novamente mais tarde.</span>
        </div>
      )}

      <style>{estilos}</style>
    </div>
  );
}

const estilos = `
  .pix-screen {
    position: fixed;
    inset: 0;
    background: #0b141a;
    color: #e9edef;
    z-index: 100;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .pix-header {
    height: 60px;
    background: #1f2c33;
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 12px;
    border-bottom: 1px solid #2a3942;
    flex-shrink: 0;
  }

  .pix-btn-voltar {
    background: none;
    border: none;
    color: #aebac1;
    cursor: pointer;
    padding: 6px;
    display: flex;
    border-radius: 50%;
  }
  .pix-btn-voltar:active { background: rgba(255,255,255,0.08); }

  .pix-header-titulo { font-size: 17px; font-weight: 600; color: #e9edef; }

  .pix-container { flex: 1; overflow-y: auto; padding: 0 16px 24px; }
  .pix-secao-label {
    font-size: 13px; font-weight: 600; color: #8696a0;
    text-transform: uppercase; letter-spacing: 0.6px; padding: 16px 0 10px;
  }

  .pix-lista { display: flex; flex-direction: column; }
  .pix-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 4px; cursor: pointer;
    border-bottom: 1px solid #1f2c34;
  }
  .pix-item:active { background: rgba(255,255,255,0.04); }

  .pix-avatar {
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, #32bcad, #1f8f83);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: #fff; flex-shrink: 0;
  }

  .pix-item-meta { flex: 1; min-width: 0; }
  .pix-item-nome { font-size: 15px; color: #e9edef; }
  .pix-item-sub { font-size: 12.5px; color: #8696a0; margin-top: 2px; }

  .pix-item-valor { font-size: 15px; font-weight: 600; flex-shrink: 0; }
  .pix-item-valor.enviado { color: #f15c6d; }
  .pix-item-valor.recebido { color: #32bcad; }

  .pix-toast {
    position: absolute;
    left: 16px; right: 16px; bottom: 24px;
    background: #2a1618;
    border: 1px solid #5a2b30;
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #f5b8bd;
    font-size: 13.5px;
    line-height: 1.4;
    box-shadow: 0 6px 20px rgba(0,0,0,0.5);
    animation: pixToastIn 0.2s ease-out;
  }
  .pix-toast svg { flex-shrink: 0; color: #f15c6d; }

  @keyframes pixToastIn {
    from { transform: translateY(12px); opacity: 0; }
    to   { transform: translateY(0); opacity: 1; }
  }

  .pix-receipt-body {
    flex: 1;
    overflow-y: auto;
    padding: 24px 16px;
    display: flex;
    justify-content: center;
  }

  .pix-receipt-card {
    background: #1a242a;
    border: 1px solid #2a3942;
    border-radius: 16px;
    padding: 28px 22px;
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
  }

  .pix-receipt-check { display: flex; justify-content: center; margin-bottom: 12px; }
  .pix-receipt-valor { font-size: 28px; font-weight: 700; color: #e9edef; text-align: center; }
  .pix-receipt-status { font-size: 14px; color: #8696a0; text-align: center; margin-top: 6px; }
  .pix-receipt-datahora { font-size: 13px; color: #8696a0; text-align: center; margin-top: 2px; }

  .pix-receipt-divisor { height: 1px; background: #2a3942; margin: 20px 0; }

  .pix-receipt-secao { margin-bottom: 16px; }
  .pix-receipt-secao-label {
    font-size: 12px; font-weight: 600; color: #8696a0;
    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;
  }
  .pix-receipt-linha {
    display: flex; justify-content: space-between; gap: 12px;
    font-size: 14px; color: #e9edef; padding: 4px 0;
  }
  .pix-receipt-linha span:first-child { color: #8696a0; }
  .pix-receipt-linha span:last-child { text-align: right; }

  .pix-receipt-descricao { font-size: 14px; color: #c9d1d6; line-height: 1.5; }

  .pix-receipt-id { font-size: 11.5px; color: #55666f; text-align: center; word-break: break-all; }
`;
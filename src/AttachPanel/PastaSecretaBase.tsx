import { useState, type ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PastaSecretaBase — versão padronizada/reutilizável da Pasta Secreta.
// Mesma navegação (explorer → pasta → arquivo) e o mesmo visual do original;
// as pastas/arquivos são passados por prop por cada chat (ex: pastaMae.ts).
//
// Uso típico: primeiro mostra o PastaSecretaLogin (IP + senha do chat) e, se
// acertar, renderiza este componente com as pastas daquele chat.
// ─────────────────────────────────────────────────────────────────────────────

export type Arquivo = {
  id: string;
  nome: string;
  tipo: "foto" | "email" | "mensagem";
  tamanho: string;
  data: string;
  src?: string;
  conteudo?: string;
  de?: string;
  assunto?: string;
};

export type Pasta = {
  label: string;
  cor: string;
  icone: ReactNode;
  arquivos: Arquivo[];
};

export type PastasMap = Record<string, Pasta>;

type Props = {
  onClose: () => void;
  pastas: PastasMap;
  titulo?: string;
};

export default function PastaSecretaBase({ onClose, pastas, titulo = "Pasta Secreta" }: Props) {
  const [etapa, setEtapa] = useState<"explorer" | "pasta" | "arquivo">("explorer");
  const [pastaSelecionada, setPastaSelecionada] = useState<string | null>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<Arquivo | null>(null);

  const handleVoltar = () => {
    if (etapa === "arquivo") { setArquivoSelecionado(null); setEtapa("pasta"); return; }
    if (etapa === "pasta")   { setPastaSelecionada(null);   setEtapa("explorer"); return; }
    onClose();
  };

  const nomesPastas = Object.keys(pastas);

  // ── EXPLORER (raiz) ────────────────────────────────────────────
  if (etapa === "explorer") {
    return (
      <div className="ps-fullscreen">
        <div className="ps-header">
          <button className="ps-btn-voltar" onClick={handleVoltar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="ps-header-meta">
            <span className="ps-header-titulo">{titulo}</span>
            <span className="ps-header-sub">{nomesPastas.length} pastas</span>
          </div>
        </div>
        <div className="ps-address-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#8696a0">
            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
          <span>Este Dispositivo › {titulo}</span>
        </div>
        <div className="ps-container">
          <div className="ps-section-label">Pastas</div>
          <div className="ps-grid">
            {nomesPastas.map((id) => {
              const pasta = pastas[id];
              return (
                <div key={id} className="ps-folder-card" onClick={() => { setPastaSelecionada(id); setEtapa("pasta"); }}>
                  <div className="ps-folder-thumb">
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                      <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill={pasta.cor} opacity="0.9"/>
                      <path d="M20 8H4v10h16V8z" fill={pasta.cor} opacity="0.55"/>
                    </svg>
                    <div className="ps-folder-inner-icon" style={{ color: pasta.cor }}>
                      {pasta.icone}
                    </div>
                  </div>
                  <span className="ps-folder-label">{pasta.label}</span>
                  <span className="ps-folder-count">{pasta.arquivos.length} itens</span>
                </div>
              );
            })}
          </div>
        </div>
        <style>{estilos}</style>
      </div>
    );
  }

  // ── LISTA DE ARQUIVOS ──────────────────────────────────────────
  if (etapa === "pasta" && pastaSelecionada) {
    const pasta = pastas[pastaSelecionada];
    return (
      <div className="ps-fullscreen">
        <div className="ps-header">
          <button className="ps-btn-voltar" onClick={handleVoltar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="ps-header-meta">
            <span className="ps-header-titulo">{pasta.label}</span>
            <span className="ps-header-sub">{pasta.arquivos.length} itens</span>
          </div>
        </div>
        <div className="ps-address-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#8696a0">
            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
          <span>Este Dispositivo › {titulo} › {pasta.label}</span>
        </div>
        <div className="ps-container">
          <div className="ps-section-label">Arquivos</div>
          <div className="ps-file-lista">
            {pasta.arquivos.map((arq) => (
              <div key={arq.id} className="ps-file-item" onClick={() => { setArquivoSelecionado(arq); setEtapa("arquivo"); }}>
                <div className="ps-file-thumb" style={{ background: `${pasta.cor}18`, color: pasta.cor }}>
                  {arq.tipo === "foto" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  ) : arq.tipo === "email" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                  )}
                </div>
                <div className="ps-file-meta">
                  <div className="ps-file-nome">{arq.nome}</div>
                  {arq.assunto && <div className="ps-file-sub">{arq.assunto}</div>}
                  <div className="ps-file-info">{arq.tamanho} · {arq.data}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3d5a6b">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
        <style>{estilos}</style>
      </div>
    );
  }

  // ── VISUALIZADOR ──────────────────────────────────────────────
  if (etapa === "arquivo" && arquivoSelecionado && pastaSelecionada) {
    const pasta = pastas[pastaSelecionada];
    return (
      <div className="ps-fullscreen">
        <div className="ps-header">
          <button className="ps-btn-voltar" onClick={handleVoltar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="ps-header-meta">
            <span className="ps-header-titulo">{arquivoSelecionado.nome}</span>
            <span className="ps-header-sub">{arquivoSelecionado.tamanho} · {arquivoSelecionado.data}</span>
          </div>
        </div>
        <div className="ps-viewer-body">
          {arquivoSelecionado.tipo === "foto" && (
            <div className="ps-foto-wrapper">
              <img
                src={arquivoSelecionado.src}
                alt={arquivoSelecionado.nome}
                className="ps-foto-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement!;
                  if (!parent.querySelector(".ps-foto-fallback")) {
                    const fb = document.createElement("div");
                    fb.className = "ps-foto-fallback";
                    fb.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="#3d5a6b"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg><p>Adicione a imagem em<br/><code>public/imagens/</code></p>`;
                    parent.appendChild(fb);
                  }
                }}
              />
              <p className="ps-foto-nome">{arquivoSelecionado.nome}</p>
            </div>
          )}

          {arquivoSelecionado.tipo === "email" && (
            <div className="ps-email-card">
              <div className="ps-email-header">
                <div className="ps-email-avatar" style={{ background: pasta.cor }}>
                  {arquivoSelecionado.de?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="ps-email-meta">
                  <div className="ps-email-de">{arquivoSelecionado.de}</div>
                  <div className="ps-email-data">{arquivoSelecionado.data}</div>
                </div>
              </div>
              <div className="ps-email-assunto">{arquivoSelecionado.assunto}</div>
              <div className="ps-email-divisor" />
              <pre className="ps-email-corpo">{arquivoSelecionado.conteudo}</pre>
            </div>
          )}

          {arquivoSelecionado.tipo === "mensagem" && (
            <div className="ps-msg-card">
              <pre className="ps-msg-texto">{arquivoSelecionado.conteudo}</pre>
            </div>
          )}
        </div>
        <style>{estilos}</style>
      </div>
    );
  }

  return null;
}

const estilos = `
  .ps-fullscreen {
    position: fixed; inset: 0; background: #0b141a; z-index: 100;
    display: flex; flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .ps-header {
    height: 60px; background: #1f2c33; display: flex; align-items: center;
    padding: 0 12px; gap: 14px; flex-shrink: 0; border-bottom: 1px solid #2a3942;
  }
  .ps-btn-voltar {
    background: none; border: none; color: #aebac1; cursor: pointer; padding: 6px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; -webkit-tap-highlight-color: transparent; transition: background 0.1s;
  }
  .ps-btn-voltar:active { background: rgba(255,255,255,0.08); }
  .ps-header-meta { display: flex; flex-direction: column; min-width: 0; }
  .ps-header-titulo { font-size: 17px; font-weight: 600; color: #e9edef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ps-header-sub { font-size: 12px; color: #8696a0; margin-top: 1px; }

  .ps-address-bar {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; background: #111b22;
    border-bottom: 1px solid #1f2c34; flex-shrink: 0;
  }
  .ps-address-bar span { font-size: 12px; color: #8696a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .ps-container { flex: 1; overflow-y: auto; padding: 0 16px 24px; }
  .ps-section-label {
    font-size: 13px; font-weight: 600; color: #8696a0;
    text-transform: uppercase; letter-spacing: 0.6px; padding: 16px 0 10px;
  }

  .ps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .ps-folder-card {
    display: flex; flex-direction: column; align-items: center;
    background: #1a242a; border-radius: 14px; padding: 14px 8px 12px;
    cursor: pointer; gap: 6px; border: 1px solid #2a3942;
    transition: background 0.1s, transform 0.08s;
    -webkit-tap-highlight-color: transparent;
  }
  .ps-folder-card:active { background: #222d34; transform: scale(0.97); }
  .ps-folder-thumb {
    position: relative; width: 52px; height: 52px;
    display: flex; align-items: center; justify-content: center;
  }
  .ps-folder-inner-icon {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -42%); opacity: 0.9;
  }
  .ps-folder-inner-icon svg { width: 22px; height: 22px; }
  .ps-folder-label { font-size: 13px; font-weight: 600; color: #e9edef; text-align: center; }
  .ps-folder-count { font-size: 11px; color: #8696a0; }

  .ps-file-lista { display: flex; flex-direction: column; gap: 2px; }
  .ps-file-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 4px; cursor: pointer;
    border-bottom: 1px solid #1f2c34;
    -webkit-tap-highlight-color: transparent; transition: background 0.1s;
  }
  .ps-file-item:active { background: rgba(255,255,255,0.04); }
  .ps-file-thumb {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ps-file-meta { flex: 1; min-width: 0; }
  .ps-file-nome { font-size: 15px; color: #e9edef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ps-file-sub { font-size: 13px; color: #8696a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
  .ps-file-info { font-size: 12px; color: #3d5a6b; margin-top: 3px; }

  .ps-viewer-body {
    flex: 1; overflow-y: auto; padding: 20px 16px;
    display: flex; flex-direction: column; align-items: center;
  }

  .ps-foto-wrapper { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .ps-foto-img { width: 100%; max-width: 420px; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
  .ps-foto-nome { font-size: 13px; color: #8696a0; }
  .ps-foto-fallback {
    width: 100%; max-width: 420px; height: 240px; background: #1a242a; border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; color: #3d5a6b; text-align: center; font-size: 14px;
  }
  .ps-foto-fallback code { color: #8696a0; font-size: 13px; }

  .ps-email-card {
    background: #1a242a; border-radius: 14px; padding: 20px;
    width: 100%; max-width: 480px; border: 1px solid #2a3942;
  }
  .ps-email-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .ps-email-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .ps-email-meta { display: flex; flex-direction: column; }
  .ps-email-de { font-size: 14px; color: #e9edef; font-weight: 500; }
  .ps-email-data { font-size: 12px; color: #8696a0; margin-top: 2px; }
  .ps-email-assunto { font-size: 17px; font-weight: 600; color: #e9edef; margin-bottom: 14px; line-height: 1.3; }
  .ps-email-divisor { height: 1px; background: #2a3942; margin-bottom: 16px; }
  .ps-email-corpo {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 15px; line-height: 1.7; color: #c9d1d6;
    white-space: pre-wrap; word-break: break-word; margin: 0;
  }

  .ps-msg-card {
    background: #1a242a; border-radius: 14px; padding: 20px;
    width: 100%; max-width: 480px; border: 1px solid #2a3942;
    border-left: 3px solid #502702;
    display: flex; justify-content: center; align-items: center;
  }
  .ps-msg-texto {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 15px; line-height: 1.7; color: #e9edef;
    white-space: pre-wrap; word-break: break-word; margin: 0;
    text-align: center; width: 100%;
  }
`;
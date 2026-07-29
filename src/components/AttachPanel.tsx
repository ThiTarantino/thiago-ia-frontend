import CameraQuebrada from "../AttachPanelApp/CameraQuebrada.tsx";
import SpotifyPlayer from "../AttachPanelApp/SpotifyPlayer.tsx";
import DocumentosPainel from "../AttachPanelApp/DocumentosPainel.tsx";

import GaleriaPainel from "../AttachPanelApp/GaleriaPainel.tsx";
import LocalizacaoPainel from "../AttachPanelApp/LocalizacaoPainel";
import PastaSecreta from "../AttachPanelApp/PastaSecreta.tsx";
import { useState } from "react";
import ContatosPainel from "../AttachPanelApp/ContatosPainel.tsx";

// ─── CONFIGURAÇÃO DA PASTA SECRETA ────────────────────────────────
const SENHA_CORRETA = "1704pipoca";   // troque pela senha real
const IP_CORRETO    = "192.036.5";    // troque pelo IP real

// Grupos de dígitos baseados no IP correto (ex: [3, 3, 1] para "192.036.5")
const IP_GRUPOS = IP_CORRETO.trim().split(".").map((g) => g.length);
const IP_MAX_DIGITOS = IP_GRUPOS.reduce((acc, g) => acc + g, 0);

// Formata uma sequência de dígitos no padrão dos grupos do IP correto
function formatarIp(digitos: string): string {
  const partes: string[] = [];
  let cursor = 0;
  for (const tamanho of IP_GRUPOS) {
    if (cursor >= digitos.length) break;
    partes.push(digitos.slice(cursor, cursor + tamanho));
    cursor += tamanho;
  }
  return partes.join(".");
}

type AttachOpcao = {
  label: string;
  corIcone: string;
  icon: React.ReactNode;
};

const ATTACH_OPCOES: AttachOpcao[] = [
  {
    label: "Galeria",
    corIcone: "#29b6f6",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>
      </svg>
    )
  },
  {
    label: "Câmera",
    corIcone: "#ff2d55",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="3.2"/>
        <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
      </svg>
    )
  },
  {
    label: "Localização",
    corIcone: "#1ebd5b",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    )
  },
  {
    label: "Contato",
    corIcone: "#00a79d",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    )
  },
  {
    label: "Documento",
    corIcone: "#7f66ff",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    )
  },
  {
    label: "Áudio",
    corIcone: "#ff9500",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
    )
  },
  {
    label: "Pasta",
    corIcone: "#f0c040",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
        <path d="M17 13h-4v-1.5l-2 2 2 2V14h4v1.5l2-2-2-2V13z" fill="rgba(0,0,0,0.25)"/>
      </svg>
    )
  }
];

type Props = { onClose: () => void };

export default function AttachPanel({ onClose }: Props) {
  const [showCamera, setShowCamera] = useState(false);
  const [showSpotify, setShowSpotify] = useState(false);
  const [showDocumentos, setShowDocumentos] = useState(false);
  const [showContatos, setShowContatos] = useState(false); 
  const [showGaleria, setShowGaleria] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showLocalizacao, setShowLocalizacao] = useState(false);
  const [showPasta, setShowPasta] = useState(false);

  // ── Estado do modal de login da Pasta Secreta ──────────────────
  const [showLoginPasta, setShowLoginPasta] = useState(false);
  const [ip, setIp] = useState("");
  const [senha, setSenha] = useState("");
  const [erroIp, setErroIp] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitos = e.target.value.replace(/\D/g, "").slice(0, IP_MAX_DIGITOS);
    setIp(formatarIp(digitos));
    setErroIp(false);
  };

  const handleLoginPasta = (e: React.FormEvent) => {
    e.preventDefault();
    const ipOk = ip.trim() === IP_CORRETO.trim();
    const senhaOk = senha === SENHA_CORRETA;
    setErroIp(!ipOk);
    setErroSenha(!senhaOk);
    if (ipOk && senhaOk) {
      setShowLoginPasta(false);
      setShowPasta(true);
    }
  };

  const handleCancelarLoginPasta = () => {
    setShowLoginPasta(false);
    setIp("");
    setSenha("");
    setErroIp(false);
    setErroSenha(false);
  };

  if (showCamera) return <CameraQuebrada onClose={() => setShowCamera(false)} />;
  if (showSpotify) return <SpotifyPlayer onClose={() => setShowSpotify(false)} />;
  if (showDocumentos) return <DocumentosPainel onClose={() => setShowDocumentos(false)} />;
  if (showContatos) return <ContatosPainel onClose={() => setShowContatos(false)} />;
  if (showGaleria) return <GaleriaPainel onClose={() => setShowGaleria(false)} />;
  if (showLocalizacao) return <LocalizacaoPainel onClose={() => setShowLocalizacao(false)} />;
  if (showPasta) return <PastaSecreta onClose={() => setShowPasta(false)} />;

  return (
    <>
      <div className={`wa-attach-backdrop ${isExiting ? "exit" : ""}`} onClick={handleClose} />

      <div className={`wa-attach-panel ${isExiting ? "exit" : ""}`}>
        <div className="wa-attach-grid">
          {ATTACH_OPCOES.map((op, i) => (
            <div
              key={i}
              className="wa-attach-item"
              onClick={() => {
                if (op.label === "Galeria") { setShowGaleria(true); return; }
                if (op.label === "Documento") { setShowDocumentos(true); return; }
                if (op.label === "Câmera") { setShowCamera(true); return; }
                if (op.label === "Áudio") { setShowSpotify(true); return; }
                if (op.label === "Contato") { setShowContatos(true); return; }
                if (op.label === "Localização") { setShowLocalizacao(true); return; }
                if (op.label === "Pasta") { setShowLoginPasta(true); return; }
                handleClose();
              }}
            >
              <div className="wa-attach-icon-box" style={{ color: op.corIcone }}>
                {op.icon}
              </div>
              <span className="wa-attach-label">{op.label}</span>
            </div>
          ))}
        </div>

        <style>{`
          .wa-attach-backdrop {
            position: fixed;
            inset: 0;
            z-index: 50;
            background: transparent;
            transition: opacity 0.2s ease;
          }

          .wa-attach-panel {
            position: absolute;
            bottom: 74px;
            left: 10px;
            right: 10px;
            z-index: 51;
            background: #0b141a; 
            padding: 24px 10px 20px 10px;
            border-radius: 28px; 
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
            animation: panelSlideUp 0.2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          }

          .wa-attach-panel.exit {
            animation: panelSlideDown 0.2s cubic-bezier(0.4, 0, 1, 1) forwards;
          }

          @keyframes panelSlideUp {
            from { transform: translateY(100%); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
          }

          @keyframes panelSlideDown {
            from { transform: translateY(0); opacity: 1; }
            to   { transform: translateY(100%); opacity: 0; }
          }

          .wa-attach-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            row-gap: 20px;
            column-gap: 4px;
            justify-items: center;
          }

          .wa-attach-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            gap: 4px;
            cursor: pointer;
            border: none;
            background: none;
            outline: none;
            -webkit-tap-highlight-color: transparent;
          }

          .wa-attach-icon-box {
            width: 60px;
            height: 60px;
            background: #1a242a; 
            border-radius: 20px; 
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.1s ease, transform 0.08s ease;
          }

          .wa-attach-item:active .wa-attach-icon-box {
            background: #222d34;
            transform: scale(0.95);
          }

          .wa-attach-label {
            color: #8696a0; 
            font-size: 13px;
            font-weight: 400;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            white-space: nowrap;
          }
        `}</style>
      </div>

      {/* ── MODAL DE LOGIN DA PASTA SECRETA (sobreposto na página inicial) ── */}
      {showLoginPasta && (
        <div className="ps-login-overlay">
          <div className="ps-login-card">
            <div className="ps-login-icon">
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill="#f6c549"/>
                <path d="M20 8H4v10h16V8z" fill="#fcd877"/>
                <rect x="10" y="13" width="4" height="3" rx="0.8" fill="#b8860b"/>
                <path d="M10.8 13v-1.2a1.2 1.2 0 1 1 2.4 0V13" stroke="#b8860b" strokeWidth="1.2" fill="none"/>
              </svg>
            </div>
            <div className="ps-login-header">
              <h3>Pasta Protegida</h3>
              <p>Insira o endereço IP e a senha para acessar os arquivos.</p>
            </div>
            <form onSubmit={handleLoginPasta} className="ps-login-form">
              <div className="ps-login-field">
                <label htmlFor="ps-ip">Endereço IP</label>
                <input
                  id="ps-ip" type="text" inputMode="numeric" placeholder="ex: 192.168.0.1"
                  value={ip}
                  onChange={handleIpChange}
                  className={`ps-login-input ${erroIp ? "has-error" : ""}`}
                  autoComplete="off" autoFocus
                />
                {erroIp && <span className="ps-login-error">Endereço IP incorreto.</span>}
              </div>
              <div className="ps-login-field">
                <label htmlFor="ps-senha">Senha</label>
                <input
                  id="ps-senha" type="password" placeholder="Senha da pasta"
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setErroSenha(false); }}
                  className={`ps-login-input ${erroSenha ? "has-error" : ""}`}
                />
                {erroSenha && <span className="ps-login-error">Senha incorreta. Tente novamente.</span>}
              </div>
              <div className="ps-login-actions">
                <button type="button" className="ps-login-btn-cancel" onClick={handleCancelarLoginPasta}>Cancelar</button>
                <button type="submit" className="ps-login-btn-ok">Ok</button>
              </div>
            </form>
          </div>

          <style>{`
            .ps-login-overlay {
              position: fixed; inset: 0; z-index: 200;
              background: rgba(11, 20, 26, 0.78);
              display: flex; align-items: center; justify-content: center;
              padding: 24px;
              animation: psLoginFadeIn 0.18s ease-out;
            }
            @keyframes psLoginFadeIn {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            .ps-login-card {
              background: #222e35; border-radius: 16px; width: 100%; max-width: 320px;
              padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.56);
              animation: psLoginCardPop 0.25s cubic-bezier(0.34,1.56,0.64,1);
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            }
            @keyframes psLoginCardPop {
              from { transform: scale(0.88); opacity: 0; }
              to   { transform: scale(1);    opacity: 1; }
            }
            .ps-login-icon { display: flex; justify-content: center; margin-bottom: 14px; }
            .ps-login-header { text-align: center; margin-bottom: 22px; }
            .ps-login-header h3 { margin: 0 0 6px 0; font-size: 18px; font-weight: 600; color: #e9edef; }
            .ps-login-header p  { margin: 0; font-size: 13.5px; line-height: 1.5; color: #8696a0; }

            .ps-login-form { display: flex; flex-direction: column; gap: 16px; }
            .ps-login-field { display: flex; flex-direction: column; gap: 6px; }
            .ps-login-field label {
              font-size: 11px; font-weight: 600; color: #8696a0;
              text-transform: uppercase; letter-spacing: 0.5px;
            }
            .ps-login-input {
              background: #2a3942; border: 1.5px solid transparent; border-radius: 10px;
              padding: 12px 14px; font-size: 15px; color: #e9edef; outline: none;
              width: 100%; transition: border-color 0.15s; caret-color: #00a884;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .ps-login-input::placeholder { color: #3b4a54; }
            .ps-login-input:focus { border-color: #00a884; }
            .ps-login-input.has-error { border-color: #f15c6d; }
            .ps-login-error { font-size: 12px; color: #f15c6d; padding-left: 2px; }

            .ps-login-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 4px; }
            .ps-login-btn-cancel {
              padding: 9px 18px; border-radius: 20px; border: none;
              background: transparent; color: #00a884; font-size: 14px; font-weight: 600;
              cursor: pointer; -webkit-tap-highlight-color: transparent;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .ps-login-btn-cancel:active { background: rgba(0,168,132,0.08); }
            .ps-login-btn-ok {
              padding: 9px 22px; border-radius: 20px; border: none;
              background: #00a884; color: #fff; font-size: 14px; font-weight: 600;
              cursor: pointer; -webkit-tap-highlight-color: transparent;
              transition: background 0.1s, transform 0.08s;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .ps-login-btn-ok:active { background: #008f6e; transform: scale(0.97); }
          `}</style>
        </div>
      )}
    </>
  );
}
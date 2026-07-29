import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// PastaSecretaLogin — modal de login (IP + senha) reutilizável.
// Cada chat tem seu próprio IP e senha corretos, e decide o que acontece
// em caso de sucesso (onSuccess) — normalmente abrir o painel de conteúdo
// daquele chat específico (ex: <PastaSecretaMae />).
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  ipCorreto: string;
  senhaCorreta: string;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function PastaSecretaLogin({ ipCorreto, senhaCorreta, onSuccess, onCancel }: Props) {
  const IP_GRUPOS = ipCorreto.trim().split(".").map((g) => g.length);
  const IP_MAX_DIGITOS = IP_GRUPOS.reduce((acc, g) => acc + g, 0);

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

  const [ip, setIp] = useState("");
  const [senha, setSenha] = useState("");
  const [erroIp, setErroIp] = useState(false);
  const [erroSenha, setErroSenha] = useState(false);

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitos = e.target.value.replace(/\D/g, "").slice(0, IP_MAX_DIGITOS);
    setIp(formatarIp(digitos));
    setErroIp(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ipOk = ip.trim() === ipCorreto.trim();
    const senhaOk = senha === senhaCorreta;
    setErroIp(!ipOk);
    setErroSenha(!senhaOk);
    if (ipOk && senhaOk) {
      onSuccess();
    }
  };

  const handleCancelar = () => {
    setIp("");
    setSenha("");
    setErroIp(false);
    setErroSenha(false);
    onCancel();
  };

  return (
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
        <form onSubmit={handleLogin} className="ps-login-form">
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
            <button type="button" className="ps-login-btn-cancel" onClick={handleCancelar}>Cancelar</button>
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
  );
}
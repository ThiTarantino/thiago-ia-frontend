import { useState } from "react";

type EnigmaDoc = {
  id: number;
  nome: string;
  tamanho: string;
  data: string;
  tipo: "png" | "c" | "pdf" | "zip";
  conteudo: string;
};

// Arquivos internos da pasta zipada após descriptografar
type ZipInnerFile = {
  id: string;
  nome: string;
  tipo: "txt" | "png";
  conteudo: string;
  meta?: string;
};

const LISTA_DOCUMENTOS: EnigmaDoc[] = [
  {
    id: 1,
    nome: "para_voce.pdf",
    tamanho: "25 kB",
    data: "23/05/2026",
    tipo: "pdf",
    conteudo: "LOG DE SISTEMA - FRAGMENTO 1\n\n[SISTEMA CORROMPIDO]: A primeira engrenagem foi movida. A resposta inicial que você busca para a Forca está na primeira letra da palavra que define o local onde a luz se esconde.",
  },
  {
    id: 2,
    nome: "Enigma 1.pdf",
    tamanho: "2,9 kB",
    data: "21/05/2026",
    tipo: "pdf",
    conteudo: "\nSinclair,\n\nConforme conversamos, o acesso ao módulo segue bloqueado até a\nconfirmação abaixo. Não perca este e-mail — não vou reenviar.\n\nCódigo de autorização: 𐤀 𐤎 𐤁\n\nQualquer dúvida, você sabe onde me achar.",
  },
  {
    id: 3,
    nome: "Enigma 2.pdf",
    tamanho: "2,3 kB",
    data: "21/05/2026",
    tipo: "pdf",
    conteudo: "Guardo o tempo parado. Mostro rostos que talvez já não estejam\nmais por perto, sorrisos presos num instante só. Mas quem olha\nrápido demais nunca vê o que realmente escondo.\n\nVolte para onde os momentos ficam guardados. Alguns deles não\nsão só lembrança — carregam mais três símbolos.",
  },
  {
    id: 4,
    nome: "Enigma 3.pdf",
    tamanho: "24 kB",
    data: "19/05/2026",
    tipo: "pdf",
    conteudo: "ARQUIVO RECUPERADO - FRAGMENTO 4\n\nContagem regressiva iniciada. A quantidade de caracteres da palavra final é determinada subtraindo o alphabeto pelas suas falhas cometidas.",
  },
  {
    id: 5,
    nome: "Enigma_4.pdf",
    tamanho: "684 kB",
    data: "11/05/2026",
    tipo: "pdf",
    conteudo: "Se eu estiver lendo isso de novo é porque preciso lembrar antes de esquecer, ou antes que não sobre tempo pra lembrar de nada.\n\nSeparei tudo em pedaços porque não confio em deixar isso inteiro em lugar nenhum. Uma parte eu escondi em símbolos, a outra em números, cada fragmento onde eu sabia que só eu ia pensar em procurar.\n\nSe eu já juntei tudo — o nome, o número, os símbolos traduzidos — sei o que fazer: é só a senha do arquivo. Sem espaço, do jeito que sempre escrevo quando não quero errar.\n\nDepois disso, não tem mais volta.",
  },
  {
    id: 6,
    nome: "OCULTO.zip",
    tamanho: "4.218 kB",
    data: "25/05/2026",
    tipo: "zip",
    conteudo: "", // O conteúdo agora está estruturado nos arquivos internos abaixo
  },
];

// 3 Arquivos de texto e 2 fotos de confissão amorosa
const ARQUIVOS_ZIP_INTERNOS: ZipInnerFile[] = [
  {
    id: "zf1",
    nome: "PISTA SOBRE A PASTA1.txt",
    tipo: "txt",
    conteudo: "SENHA,\n\n-1704 ÓBVIO que seria isso, MDSS, como eu fui burro..\n- Consegui descobrir metade da senha.\n-mas cade o resto?",
  },
  {
    id: "zf2",
    nome: "PISTA SOBRE A PASTA2.txt",
    tipo: "txt",
    conteudo: "LOCALIZAÇÃO,\n\n-Essa LOCALIZAÇÃO do whats esta meio estranha, vou analisar isso mais tarde.\n-bizarro...",
  },
  {
    id: "zf3",
    nome: "PISTA SOBRE A PASTA3.txt",
    tipo: "txt",
    conteudo: "??????,\n\n-o que é isso, um arroba?\n-Preciso dar uma olhada no INSTAGRAM.\n-Talvez um animal, uma comida favorita?Pense,pense...",
  },
  {
    id: "zf4",
    nome: "print_primeira_conversa.png",
    tipo: "png",
    conteudo: "Recordação digital de onde tudo começou. Um print eterno do dia em que mudei minha rota para cruzar com a sua.",
    meta: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)", // Simulação visual profissional de imagem de fundo
  },
  {
    id: "zf5",
    nome: "nosso_lugar_favorito.png",
    tipo: "png",
    conteudo: "Fotografia gravada no peito. O instante perfeito onde o tempo parou e eu soube que era você.",
    meta: "linear-gradient(135deg, #243b55 0%, #141e30 100%)",
  },
];

type Props = { onClose: () => void };

export default function DocumentosPainel({ onClose }: Props) {
  const [docSelecionado, setDocSelecionado] = useState<EnigmaDoc | null>(null);
  const [exibirPromptSenha, setExibirPromptSenha] = useState(false);
  const [pastaZipAberta, setPastaZipAberta] = useState(false);
  const [subDocSelecionado, setSubDocSelecionado] = useState<ZipInnerFile | null>(null);
  
  const [inputSenha, setInputSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);

  const SENHA_CORRETA = "bela";

  const handleAbrirDoc = (doc: EnigmaDoc) => {
    if (doc.tipo === "zip") {
      setInputSenha("");
      setErroSenha(false);
      setExibirPromptSenha(true); // Abre apenas a aba flutuante de senha sobre a lista
    } else {
      setDocSelecionado(doc);
    }
  };

  const handleVerificarSenha = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputSenha === SENHA_CORRETA) {
      setExibirPromptSenha(false);
      setPastaZipAberta(true); // Libera a entrada para a pasta interna
      setErroSenha(false);
    } else {
      setErroSenha(true);
    }
  };

  return (
    <div className="wa-doc-screen">
      {/* Cabeçalho superior */}
      <div className="wa-doc-header">
        <div className="wa-doc-header-left">
          <button className="wa-doc-btn-voltar" onClick={pastaZipAberta ? () => setPastaZipAberta(false) : onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <span className="wa-doc-header-titulo">
            {pastaZipAberta ? "OCULTO.zip" : "Documentos"}
          </span>
        </div>
        
        <div className="wa-doc-header-right">
          <button className="wa-doc-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <button className="wa-doc-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="16" y2="6"></line>
              <line x1="4" y1="12" x2="20" y2="12"></line>
              <line x1="4" y1="18" x2="12" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Visão de Pasta Interna Criptografada Desbloqueada */}
      {pastaZipAberta ? (
        <div className="wa-doc-container">
          <div className="wa-doc-secao">Conteúdo Extraído (5 itens)</div>
          <div className="wa-doc-lista">
            {ARQUIVOS_ZIP_INTERNOS.map((subDoc) => (
              <div key={subDoc.id} className="wa-doc-item" onClick={() => setSubDocSelecionado(subDoc)}>
                <div className={`wa-doc-thumb type-${subDoc.tipo}`}>
                  {subDoc.tipo === "png" ? (
                    <div className="wa-inner-image-preview" style={{ background: subDoc.meta }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  ) : (
                    <span className="wa-doc-thumb-ext">TXT</span>
                  )}
                </div>
                <div className="wa-doc-meta-container">
                  <div className="wa-doc-meta-main">
                    <div className="wa-doc-nome">{subDoc.nome}</div>
                    <div className="wa-doc-tamanho">{subDoc.tipo === "png" ? "1.8 MB" : "1.2 kB"}</div>
                  </div>
                  <div className="wa-doc-data">25/05/2026</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Área principal de lista de Documentos Recentes */
        <div className="wa-doc-container">
          <div className="wa-doc-secao">Recentes</div>
          
          <div className="wa-doc-lista">
            {LISTA_DOCUMENTOS.map((doc) => (
              <div key={doc.id} className="wa-doc-item" onClick={() => handleAbrirDoc(doc)}>
                <div className={`wa-doc-thumb type-${doc.tipo}`}>
                  {doc.tipo === "zip" ? (
                    <svg className="wa-doc-zip-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6h-8l-2-2H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" fill="#E6A100"/>
                      <path d="M12 6h2v2h-2V6zm2 2h2v2h-2V8zm-2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v5h-2v-5z" fill="#FFF" opacity="0.9"/>
                      <path d="M11 14h4v2h-4v-2z" fill="#757575"/>
                    </svg>
                  ) : (
                    <span className="wa-doc-thumb-ext">{doc.tipo.toUpperCase()}</span>
                  )}
                </div>
                
                <div className="wa-doc-meta-container">
                  <div className="wa-doc-meta-main">
                    <div className="wa-doc-nome">{doc.nome}</div>
                    <div className="wa-doc-tamanho">{doc.tamanho}</div>
                  </div>
                  <div className="wa-doc-data">{doc.data}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ABA FLUTUANTE DE SENHA - Aparece sobre a tela de arquivos sem abrir página inteira */}
      {exibirPromptSenha && (
        <div className="wa-floating-overlay">
          <div className="wa-floating-card">
            <div className="wa-floating-card-header">
              <h3>Arquivo Protegido</h3>
              <p>Insira a senha do arquivo compactado para extrair as mídias.</p>
            </div>
            
            <form onSubmit={handleVerificarSenha} className="wa-floating-form">
              <div className="wa-floating-input-group">
                <input 
                  id="zip-pass"
                  type="password" 
                  placeholder="Senha do arquivo"
                  value={inputSenha}
                  onChange={(e) => setInputSenha(e.target.value)}
                  className={`wa-floating-input ${erroSenha ? "has-error" : ""}`}
                  autoFocus
                />
                {erroSenha && <span className="wa-floating-error">Senha incorreta. Tente novamente.</span>}
              </div>

              <div className="wa-floating-actions">
                <button type="button" className="wa-floating-btn-cancel" onClick={() => setExibirPromptSenha(false)}>
                  Cancelar
                </button>
                <button type="submit" className="wa-floating-btn-submit">
                  Ok
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leitor Normal para os Documentos Padrões */}
      {docSelecionado && (
        <div className="wa-reader-fullscreen">
          <div className="wa-reader-header">
            <button className="wa-reader-btn-voltar" onClick={() => setDocSelecionado(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div className="wa-reader-header-meta">
              <span className="wa-reader-filename">{docSelecionado.nome}</span>
              <span className="wa-reader-filesize">{docSelecionado.tamanho}</span>
            </div>
          </div>
          <div className="wa-reader-body">
            <pre className="wa-reader-text">{docSelecionado.conteudo}</pre>
          </div>
        </div>
      )}

      {/* Leitor Interno para Arquivos de Confissão Amorosa de dentro do ZIP */}
      {subDocSelecionado && (
        <div className="wa-reader-fullscreen sub-reader">
          <div className="wa-reader-header">
            <button className="wa-reader-btn-voltar" onClick={() => setSubDocSelecionado(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div className="wa-reader-header-meta">
              <span className="wa-reader-filename">{subDocSelecionado.nome}</span>
              <span className="wa-reader-filesize">{subDocSelecionado.tipo === "png" ? "Foto de Recordação" : "Documento de Texto"}</span>
            </div>
          </div>
          <div className="wa-reader-body wa-love-content">
            {subDocSelecionado.tipo === "png" ? (
              <div className="wa-love-image-box">
                <div className="wa-love-photo-render" style={{ background: subDocSelecionado.meta }} />
                <p className="wa-love-photo-caption">{subDocSelecionado.conteudo}</p>
              </div>
            ) : (
              <pre className="wa-reader-text love-text">{subDocSelecionado.conteudo}</pre>
            )}
          </div>
        </div>
      )}

      <style>{`
        .wa-doc-screen {
          position: fixed;
          inset: 0;
          background: #0b141a;
          color: #e9edef;
          z-index: 100;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          user-select: none;
        }

        .wa-doc-header {
          height: 64px;
          background: #0b141a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          border-bottom: 1px solid #1f2c34;
        }

        .wa-doc-header-left { display: flex; align-items: center; gap: 16px; }

        .wa-doc-btn-voltar {
          background: transparent;
          border: none;
          color: #e9edef;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
        }
        .wa-doc-btn-voltar:active { background: rgba(255, 255, 255, 0.07); }

        .wa-doc-header-titulo { font-size: 20px; font-weight: 400; color: #e9edef; }
        .wa-doc-header-right { display: flex; align-items: center; gap: 8px; }

        .wa-doc-icon-btn {
          background: transparent;
          border: none;
          color: #e9edef;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .wa-doc-container { flex: 1; overflow-y: auto; padding: 0 16px; }
        .wa-doc-secao { font-size: 14px; color: #8696a0; font-weight: 500; padding: 16px 0 12px 0; }
        .wa-doc-lista { display: flex; flex-direction: column; }

        .wa-doc-item { display: flex; align-items: center; gap: 16px; cursor: pointer; }
        .wa-doc-item:active { background: rgba(255, 255, 255, 0.04); }

        .wa-doc-thumb {
          width: 40px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        
        .wa-doc-thumb.type-png { background: #51595e; }
        .wa-doc-thumb.type-txt { background: #202c33; border: 1px solid #374248; }
        .wa-doc-thumb.type-c { background: #607d8b; }
        .wa-doc-thumb.type-pdf { background: #ea4335; }
        .wa-doc-thumb.type-zip { background: transparent; }
        
        .wa-doc-zip-svg { width: 100%; height: 100%; object-fit: contain; }
        .wa-inner-image-preview { 
          width: 100%; height: 100%; border-radius: 6px; 
          display: flex; align-items: center; justify-content: center; 
        }

        .wa-doc-thumb-ext { font-size: 10px; font-weight: 800; color: #fff; letter-spacing: 0.5px; }

        .wa-doc-meta-container {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #1f2c34;
          padding: 14px 0;
          min-width: 0;
        }

        .wa-doc-meta-main { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .wa-doc-nome { font-size: 16px; color: #e9edef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wa-doc-tamanho { font-size: 14px; color: #8696a0; }
        .wa-doc-data { font-size: 13px; color: #8696a0; white-space: nowrap; }

        /* ABA / DIÁLOGO FLUTUANTE DE SENHA - EXCLUSIVO ESTILO WHATSAPP */
        .wa-floating-overlay {
          position: fixed;
          inset: 0;
          background: rgba(11, 20, 26, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 200;
          padding: 24px;
          animation: overlayFade 0.2s ease-out;
        }

        .wa-floating-card {
          background: #222e35;
          border-radius: 14px;
          width: 100%;
          max-width: 320px;
          padding: 22px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.56);
          box-sizing: border-box;
          animation: cardPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .wa-floating-card-header h3 { margin: 0 0 6px 0; font-size: 18px; font-weight: 500; color: #e9edef; }
        .wa-floating-card-header p { margin: 0 0 18px 0; font-size: 13.5px; line-height: 1.4; color: #8696a0; }

        .wa-floating-form { display: flex; flex-direction: column; gap: 20px; }
        .wa-floating-input-group { display: flex; flex-direction: column; gap: 6px; }

        .wa-floating-input {
          background: #2a3942;
          border: 1px solid transparent;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 15px;
          color: #e9edef;
          outline: none;
          width: 100%;
          box-sizing: border-box;
        }
        .wa-floating-input:focus { border-color: #00a884; }
        .wa-floating-input.has-error { border-color: #f15c6d; }

        .wa-floating-error { color: #f15c6d; font-size: 12px; padding-left: 2px; }

        .wa-floating-actions { display: flex; justify-content: flex-end; gap: 8px; }
        
        .wa-floating-btn-cancel, .wa-floating-btn-submit {
          border: none; background: transparent; font-size: 14px; font-weight: 600;
          padding: 8px 14px; cursor: pointer; border-radius: 18px;
        }
        .wa-floating-btn-cancel { color: #00a884; }
        .wa-floating-btn-cancel:hover { background: rgba(0, 168, 132, 0.08); }
        .wa-floating-btn-submit { color: #111b21; background: #00a884; }
        .wa-floating-btn-submit:active { opacity: 0.8; }

        /* LEITORES DE CONTEÚDO */
        .wa-reader-fullscreen {
          position: fixed;
          inset: 0;
          background: #121b22;
          z-index: 120;
          display: flex;
          flex-direction: column;
        }
        .sub-reader { z-index: 130; }

        .wa-reader-header {
          height: 60px;
          background: #202c33;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 12px;
        }

        .wa-reader-header-meta { display: flex; flex-direction: column; min-width: 0; }
        .wa-reader-filename { font-size: 16px; color: #e9edef; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wa-reader-filesize { font-size: 12px; color: #8696a0; margin-top: 2px; }

        .wa-reader-body { flex: 1; background: #0b141a; padding: 24px 20px; overflow-y: auto; }
        .wa-love-content { background: #0b141a; display: flex; justify-content: center; align-items: start; }
        
        .wa-reader-text { 
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 16px; line-height: 1.6; color: #e9edef; white-space: pre-wrap; word-break: break-word; 
        }
        .love-text { color: #e9edef; background: #1f2c34; padding: 18px; border-radius: 10px; border-left: 3px solid #00a884; }

        /* RENDERIZADOR PROFISSONAL DE FOTOS AMOROSAS (Simulação Visual) */
        .wa-love-image-box {
          background: #1f2c34; border-radius: 10px; padding: 10px; width: 100%; max-width: 380px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3); box-sizing: border-box;
        }
        .wa-love-photo-render {
          width: 100%; height: 240px; border-radius: 8px; margin-bottom: 10px;
          opacity: 0.85; position: relative;
        }
        .wa-love-photo-caption {
          margin: 4px 0; font-size: 14.5px; line-height: 1.5; color: #e9edef; font-family: sans-serif;
        }

        @keyframes overlayFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cardPop { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes readerFadeIn { from { transform: scale(1.02); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
import { useState } from "react";

type EnigmaDoc = {
  id: number;
  nome: string;
  tamanho: string;
  data: string;
  tipo: "png" | "c" | "pdf";
  conteudo: string;
};

const LISTA_DOCUMENTOS: EnigmaDoc[] = [
  {
    id: 1,
    nome: "image-1.png",
    tamanho: "25 kB",
    data: "23/05/2026",
    tipo: "png",
    conteudo: "LOG DE SISTEMA - FRAGMENTO 1\n\n[SISTEMA CORROMPIDO]: A primeira engrenagem foi movida. A resposta inicial que você busca para a Forca está na primeira letra da palavra que define o local onde a luz se esconde.",
  },
  {
    id: 2,
    nome: "lista-1.c",
    tamanho: "2,9 kB",
    data: "21/05/2026",
    tipo: "c",
    conteudo: "#include <stdio.h>\n// FRAGMENTO 2\n\nint main() {\n    int erros_permitidos = 6;\n    printf('A soma de todas as pistas musicais equivale à metade do caminho.\\n');\n    return 0;\n}",
  },
  {
    id: 3,
    nome: "lista.c",
    tamanho: "2,3 kB",
    data: "21/05/2026",
    tipo: "c",
    conteudo: "#include <stdio.h>\n// FRAGMENTO 3\n\nvoid verificarCamera() {\n    // O que o olho quebrado não registra é a chave.\n    // Analise o escuro.\n}",
  },
  {
    id: 4,
    nome: "image.png",
    tamanho: "24 kB",
    data: "19/05/2026",
    tipo: "png",
    conteudo: "ARQUIVO RECUPERADO - FRAGMENTO 4\n\nContagem regressiva iniciada. A quantidade de caracteres da palavra final é determinada subtraindo o alfabeto pelas suas falhas cometidas.",
  },
  {
    id: 5,
    nome: "UA2_Avaliacao.pdf",
    tamanho: "684 kB",
    data: "11/05/2026",
    tipo: "pdf",
    conteudo: "AVALIAÇÃO DE SEGURANÇA TERMINAL - ENIGMA FINAL\n\nSe todas as conexões foram estabelecidas entre os códigos dos documentos, insira o termo decifrado no input principal do Jogo da Forca para quebrar o loop.",
  },
];

type Props = { onClose: () => void };

export default function DocumentosPainel({ onClose }: Props) {
  const [docSelecionado, setDocSelecionado] = useState<EnigmaDoc | null>(null);

  return (
    <div className="wa-doc-screen">
      {/* Cabeçalho superior */}
      <div className="wa-doc-header">
        <div className="wa-doc-header-left">
          <button className="wa-doc-btn-voltar" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <span className="wa-doc-header-titulo">Documentos</span>
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

      {/* Área da lista */}
      <div className="wa-doc-container">
        <div className="wa-doc-secao">Recentes</div>
        
        <div className="wa-doc-lista">
          {LISTA_DOCUMENTOS.map((doc) => (
            <div key={doc.id} className="wa-doc-item" onClick={() => setDocSelecionado(doc)}>
              {/* Ícone quadrado do tipo de arquivo */}
              <div className={`wa-doc-thumb type-${doc.tipo}`}>
                <span className="wa-doc-thumb-ext">{doc.tipo.toUpperCase()}</span>
              </div>
              
              {/* Container de metadados alinhado */}
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

      {/* Leitor em Tela Cheia (100% Inset) */}
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

      <style>{`
        /* Tela base escura */
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

        /* Header Superior */
        .wa-doc-header {
          height: 64px;
          background: #0b141a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
        }

        .wa-doc-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

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

        .wa-doc-header-titulo {
          font-size: 20px;
          font-weight: 400;
          color: #e9edef;
        }

        .wa-doc-header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

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
        .wa-doc-icon-btn:active { background: rgba(255, 255, 255, 0.07); }

        /* Container da Lista */
        .wa-doc-container {
          flex: 1;
          overflow-y: auto;
          padding: 0 16px;
        }

        .wa-doc-secao {
          font-size: 14px;
          color: #8696a0;
          font-weight: 500;
          padding: 16px 0 12px 0;
        }

        .wa-doc-lista {
          display: flex;
          flex-direction: column;
        }

        /* Alinhamento Corrigido: Centraliza verticalmente o ícone e os textos */
        .wa-doc-item {
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
        }
        .wa-doc-item:active { background: rgba(255, 255, 255, 0.04); }

        /* Ícones Quadrados Estilo WhatsApp Mobile */
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
        .wa-doc-thumb.type-c { background: #607d8b; }
        .wa-doc-thumb.type-pdf { background: #ea4335; }

        .wa-doc-thumb-ext {
          font-size: 10px;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.5px;
        }

        /* Container de textos com padding interno para manter a centralização */
        .wa-doc-meta-container {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #1f2c34;
          padding: 14px 0;
          min-width: 0;
        }

        .wa-doc-meta-main {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .wa-doc-nome {
          font-size: 16px;
          color: #e9edef;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wa-doc-tamanho {
          font-size: 14px;
          color: #8696a0;
        }

        .wa-doc-data {
          font-size: 13px;
          color: #8696a0;
          white-space: nowrap;
        }

        /* Visualizador em Tela Cheia (100% Ocupado) */
        .wa-reader-fullscreen {
          position: fixed;
          inset: 0;
          background: #121b22;
          z-index: 120;
          display: flex;
          flex-direction: column;
          animation: readerFadeIn 0.18s ease-out;
        }

        .wa-reader-header {
          height: 60px;
          background: #202c33;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .wa-reader-btn-voltar {
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

        .wa-reader-header-meta {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .wa-reader-filename {
          font-size: 16px;
          color: #e9edef;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wa-reader-filesize {
          font-size: 12px;
          color: #8696a0;
          margin-top: 2px;
        }

        .wa-reader-body {
          flex: 1;
          background: #182229;
          padding: 24px 20px;
          overflow-y: auto;
        }

        .wa-reader-text {
          font-family: 'Courier New', Courier, monospace;
          font-size: 16px;
          line-height: 1.6;
          color: #e9edef;
          white-space: pre-wrap;
          word-break: break-word;
        }

        @keyframes readerFadeIn {
          from { transform: scale(1.03); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
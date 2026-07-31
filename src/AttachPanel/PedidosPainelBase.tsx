// ─────────────────────────────────────────────────────────────────────────────
// PedidosPainelBase — versão padronizada/reutilizável do painel de Pedidos,
// no estilo "histórico de pedidos" de um app de entregas.
//
// Cada chat define seus próprios itens comprados (ex: pedidosMae.ts). A ideia
// é que a combinação dos itens, nomes, quantidades etc. sirva de pista para
// um enigma — então o conteúdo real fica todo nos dados, não aqui.
// ─────────────────────────────────────────────────────────────────────────────

export type ItemPedido = {
  id: string;
  produto: string;
  variacao?: string; // ex: "500g", "Cor: Azul"
  preco: string; // ex: "R$ 24,90"
  quantidade: number;
  loja: string;
  data: string;
  status?: string; // ex: "Pedido entregue"
  imagem?: string; // opcional — se não vier, mostra um ícone genérico
};

type Props = {
  onClose: () => void;
  itens: ItemPedido[];
  titulo?: string;
};

const IconBack = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const IconBag = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#8696a0">
    <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#1ebd5b">
    <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
  </svg>
);

export default function PedidosPainelBase({ onClose, itens, titulo = "Meus Pedidos" }: Props) {
  return (
    <div className="pd-screen">
      <div className="pd-header">
        <button className="pd-btn-voltar" onClick={onClose}>
          <IconBack />
        </button>
        <span className="pd-header-titulo">{titulo}</span>
      </div>

      <div className="pd-container">
        <div className="pd-secao-label">Pedidos ({itens.length})</div>

        <div className="pd-lista">
          {itens.map((item) => (
            <div key={item.id} className="pd-card">
              <div className="pd-card-top">
                <span className="pd-loja">{item.loja}</span>
                {item.status && (
                  <span className="pd-status">
                    <IconCheck /> {item.status}
                  </span>
                )}
              </div>

              <div className="pd-card-body">
                <div className="pd-thumb">
                  {item.imagem ? (
                    <img src={item.imagem} alt={item.produto} />
                  ) : (
                    <IconBag />
                  )}
                </div>
                <div className="pd-info">
                  <div className="pd-produto">{item.produto}</div>
                  {item.variacao && <div className="pd-variacao">{item.variacao}</div>}
                  <div className="pd-qtd-preco">
                    <span>x{item.quantidade}</span>
                    <span className="pd-preco">{item.preco}</span>
                  </div>
                </div>
              </div>

              <div className="pd-card-bottom">
                <span className="pd-data">{item.data}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .pd-screen {
          position: fixed;
          inset: 0;
          background: #0b141a;
          color: #e9edef;
          z-index: 100;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .pd-header {
          height: 60px;
          background: #1f2c33;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 12px;
          border-bottom: 1px solid #2a3942;
          flex-shrink: 0;
        }

        .pd-btn-voltar {
          background: none;
          border: none;
          color: #aebac1;
          cursor: pointer;
          padding: 6px;
          display: flex;
          border-radius: 50%;
        }
        .pd-btn-voltar:active { background: rgba(255,255,255,0.08); }

        .pd-header-titulo { font-size: 17px; font-weight: 600; color: #e9edef; }

        .pd-container { flex: 1; overflow-y: auto; padding: 0 16px 24px; }
        .pd-secao-label {
          font-size: 13px; font-weight: 600; color: #8696a0;
          text-transform: uppercase; letter-spacing: 0.6px; padding: 16px 0 10px;
        }

        .pd-lista { display: flex; flex-direction: column; gap: 12px; }

        .pd-card {
          background: #1a242a;
          border: 1px solid #2a3942;
          border-radius: 14px;
          overflow: hidden;
        }

        .pd-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid #232f36;
        }
        .pd-loja { font-size: 13.5px; font-weight: 600; color: #e9edef; }
        .pd-status {
          font-size: 12px; color: #8696a0;
          display: flex; align-items: center; gap: 4px;
        }

        .pd-card-body { display: flex; gap: 12px; padding: 14px; }

        .pd-thumb {
          width: 64px; height: 64px; border-radius: 10px;
          background: #202c33;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; overflow: hidden;
        }
        .pd-thumb img { width: 100%; height: 100%; object-fit: cover; }

        .pd-info { flex: 1; min-width: 0; }
        .pd-produto { font-size: 14.5px; color: #e9edef; line-height: 1.3; }
        .pd-variacao { font-size: 12.5px; color: #8696a0; margin-top: 4px; }
        .pd-qtd-preco {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 8px; font-size: 13.5px; color: #8696a0;
        }
        .pd-preco { color: #e9edef; font-weight: 600; }

        .pd-card-bottom {
          padding: 8px 14px 12px;
        }
        .pd-data { font-size: 12px; color: #55666f; }
      `}</style>
    </div>
  );
}
import { useState } from "react";

type NovoGrupoProps = {
  onBack: () => void;
};

export default function NovoGrupo({ onBack }: NovoGrupoProps) {
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>([]);

  const contatos = [
    { id: "1", nome: "Ana Silva", status: "Disponível" },
    { id: "2", nome: "Carlos Eduardo", status: "Ocupado" },
    { id: "3", nome: "Mariana Souza", status: "Até logo!" },
    { id: "4", nome: "Pedro Henrique", status: "Em reunião" },
  ];

  const toggleContato = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const contatosFiltrados = contatos.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="wa-screen-std">
      {/* Cabeçalho */}
      <div className="wa-std-header">
        <button className="wa-std-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <div className="wa-std-header-titles">
          <h2>Novo grupo</h2>
          <span className="wa-std-subtitle">
            {selecionados.length === 0
              ? "Adicionar participantes"
              : `${selecionados.length} selecionado(s)`}
          </span>
        </div>
      </div>

      {/* Busca */}
      <div className="wa-std-search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8696a0" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Pesquisar contatos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Lista de Contatos */}
      <div className="wa-std-container">
        {contatosFiltrados.map((contato) => {
          const isSelected = selecionados.includes(contato.id);
          return (
            <div
              key={contato.id}
              className={`wa-std-item-row ${isSelected ? "selected" : ""}`}
              onClick={() => toggleContato(contato.id)}
            >
              <div className="wa-std-avatar">
                {contato.nome.charAt(0)}
                {isSelected && (
                  <div className="wa-std-check-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111b21" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              <div className="wa-std-item-info">
                <span className="wa-std-title">{contato.nome}</span>
                <span className="wa-std-sub">{contato.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão de Avançar Flutuante */}
      {selecionados.length > 0 && (
        <button className="wa-std-fab-next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111b21" strokeWidth="3">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      )}

      <style>{`
        .wa-screen-std {
          position: fixed; inset: 0; background: #0b141a; color: #e9edef;
          z-index: 300; display: flex; flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
        }
        .wa-std-header {
          height: 60px; background: #202c33; display: flex; align-items: center;
          padding: 0 16px; gap: 20px;
        }
        .wa-std-back-btn {
          background: none; border: none; color: #e9edef; cursor: pointer;
          display: flex; align-items: center; padding: 4px;
        }
        .wa-std-header-titles { display: flex; flex-direction: column; }
        .wa-std-header h2 { font-size: 18px; font-weight: 500; margin: 0; color: #e9edef; }
        .wa-std-subtitle { font-size: 13px; color: #8696a0; }
        
        .wa-std-search-box {
          display: flex; align-items: center; gap: 12px; background: #202c33;
          padding: 8px 16px; border-bottom: 1px solid #111b21;
        }
        .wa-std-search-box input {
          background: transparent; border: none; outline: none; color: #e9edef;
          width: 100%; font-size: 14.5px;
        }

        .wa-std-container { flex: 1; overflow-y: auto; padding: 8px 0; }
        .wa-std-item-row {
          display: flex; align-items: center; gap: 16px; padding: 12px 16px;
          cursor: pointer;
        }
        .wa-std-item-row:active { background: #202c33; }
        .wa-std-avatar {
          width: 45px; height: 45px; border-radius: 50%; background: #6b7c85;
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; font-size: 18px; color: #fff; position: relative;
        }
        .wa-std-check-badge {
          position: absolute; bottom: 0; right: 0; background: #00a884;
          width: 18px; height: 18px; border-radius: 50%; display: flex;
          align-items: center; justify-content: center; border: 2px solid #0b141a;
        }
        .wa-std-item-info { display: flex; flex-direction: column; gap: 2px; }
        .wa-std-title { font-size: 16px; color: #e9edef; font-weight: 400; }
        .wa-std-sub { font-size: 13.5px; color: #8696a0; }

        .wa-std-fab-next {
          position: fixed; bottom: 28px; right: 28px; width: 56px; height: 56px;
          border-radius: 18px; background: #00a884; border: none; display: flex;
          align-items: center; justify-content: center; cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
}
import { useState, useMemo } from "react";
import { ArrowLeft, Check, Search, X, User } from "lucide-react";

type NovaTransmissaoProps = {
  onBack: () => void;
  onConfirm?: (selecionadosIds: string[]) => void;
};

interface Contato {
  id: string;
  nome: string;
  status: string;
  avatarUrl?: string;
}

export default function NovaTransmissao({ onBack, onConfirm }: NovaTransmissaoProps) {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [busca, setBusca] = useState("");
  const [mostrarBusca, setMostrarBusca] = useState(false);

  // Lista simulada de contatos
  const contatos: Contato[] = [
    { id: "1", nome: "Ana Silva", status: "Disponível" },
    { id: "2", nome: "Carlos Eduardo", status: "Ocupado" },
    { id: "3", nome: "Mariana Souza", status: "Até logo!" },
    { id: "4", nome: "Pedro Henrique", status: "Em reunião" },
    { id: "5", nome: "Beatriz Lima", status: "Nas nuvens ☁️" },
    { id: "6", nome: "Lucas Mendes", status: "Somente chamadas de emergência" },
  ];

  // Alternar seleção de contato
  const toggleContato = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtragem com base no campo de busca
  const contatosFiltrados = useMemo(() => {
    return contatos.filter((c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.status.toLowerCase().includes(busca.toLowerCase())
    );
  }, [busca]);

  // Lista de objetos selecionados para a barra de Chips
  const contatosSelecionadosObjs = useMemo(() => {
    return contatos.filter((c) => selecionados.includes(c.id));
  }, [selecionados]);

  return (
    <div className="wa-screen-std">
      {/* Cabeçalho */}
      <div className="wa-std-header">
        <button className="wa-std-icon-btn" onClick={onBack} title="Voltar">
          <ArrowLeft size={22} />
        </button>

        {mostrarBusca ? (
          <div className="wa-std-search-input-wrapper">
            <input
              type="text"
              placeholder="Pesquisar..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoFocus
              className="wa-std-search-input"
            />
            {busca && (
              <button className="wa-std-icon-btn" onClick={() => setBusca("")}>
                <X size={18} />
              </button>
            )}
          </div>
        ) : (
          <div className="wa-std-header-titles">
            <h2>Nova transmissão</h2>
            <span className="wa-std-subtitle">
              {selecionados.length} de 256 selecionados
            </span>
          </div>
        )}

        <button
          className="wa-std-icon-btn"
          onClick={() => {
            setMostrarBusca(!mostrarBusca);
            if (mostrarBusca) setBusca("");
          }}
          title={mostrarBusca ? "Fechar busca" : "Buscar"}
        >
          {mostrarBusca ? <X size={22} /> : <Search size={20} />}
        </button>
      </div>

      {/* Chips de Contatos Selecionados (Horizontal Scroll) */}
      {contatosSelecionadosObjs.length > 0 && (
        <div className="wa-std-selected-bar wa-scrollable-x">
          {contatosSelecionadosObjs.map((c) => (
            <div key={c.id} className="wa-std-chip" onClick={() => toggleContato(c.id)}>
              <div className="wa-std-chip-avatar">
                {c.nome.charAt(0)}
              </div>
              <span className="wa-std-chip-name">{c.nome.split(" ")[0]}</span>
              <div className="wa-std-chip-remove">
                <X size={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Informativo de transmissão */}
      <div className="wa-std-info-bar">
        <p>
          Apenas contatos com o seu número salvo na agenda receberão suas mensagens de transmissão.
        </p>
      </div>

      {/* Lista de Contatos */}
      <div className="wa-std-container wa-scrollable">
        {contatosFiltrados.map((contato) => {
          const isSelected = selecionados.includes(contato.id);
          return (
            <div
              key={contato.id}
              className={`wa-std-item-row ${isSelected ? "selected" : ""}`}
              onClick={() => toggleContato(contato.id)}
            >
              <div className={`wa-std-avatar ${isSelected ? "avatar-selected" : ""}`}>
                {contato.nome.charAt(0)}
                {isSelected && (
                  <div className="wa-std-check-badge">
                    <Check size={12} strokeWidth={3} color="#111b21" />
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

        {contatosFiltrados.length === 0 && (
          <div className="wa-std-empty">
            <User size={40} color="#8696a0" />
            <p>Nenhum contato encontrado</p>
          </div>
        )}
      </div>

      {/* FAB - Botão de Confirmar */}
      {selecionados.length > 0 && (
        <button
          className="wa-std-fab-next"
          onClick={() => onConfirm && onConfirm(selecionados)}
          title="Criar lista de transmissão"
        >
          <Check size={26} strokeWidth={2.5} color="#111b21" />
        </button>
      )}

      {/* Estilos CSS */}
      <style>{`
        .wa-screen-std {
          position: fixed;
          inset: 0;
          background: #0b141a;
          color: #e9edef;
          z-index: 300;
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          overflow-x: hidden;
          user-select: none;
          WebkitTapHighlightColor: transparent;
        }

        .wa-std-header {
          height: 60px;
          background: #202c33;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 12px;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .wa-std-icon-btn {
          background: none;
          border: none;
          color: #aebac1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.15s;
        }
        .wa-std-icon-btn:active {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .wa-std-header-titles {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .wa-std-header h2 {
          font-size: 18px;
          font-weight: 500;
          margin: 0;
          color: #e9edef;
          line-height: 1.2;
        }

        .wa-std-subtitle {
          font-size: 13px;
          color: #8696a0;
          margin-top: 2px;
        }

        .wa-std-search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background: #111b21;
          border-radius: 8px;
          padding: 4px 8px;
        }

        .wa-std-search-input {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          color: #e9edef;
          font-size: 15px;
        }

        /* Chips de Contatos Selecionados */
        .wa-std-selected-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: #111b21;
          border-bottom: 1px solid #202c33;
          overflow-x: auto;
          flex-shrink: 0;
        }

        .wa-scrollable-x::-webkit-scrollbar {
          height: 3px;
        }
        .wa-scrollable-x::-webkit-scrollbar-thumb {
          background-color: rgba(134, 150, 160, 0.3);
          border-radius: 3px;
        }

        .wa-std-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #202c33;
          padding: 4px 8px 4px 4px;
          border-radius: 16px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background-color 0.15s;
        }
        .wa-std-chip:active {
          background: #2a3942;
        }

        .wa-std-chip-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #6b7c85;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wa-std-chip-name {
          font-size: 13px;
          color: #e9edef;
          max-width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wa-std-chip-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #8696a0;
          color: #111b21;
          border-radius: 50%;
          width: 16px;
          height: 16px;
        }

        /* Barra de Informação */
        .wa-std-info-bar {
          padding: 12px 20px;
          background: #0b141a;
          border-bottom: 1px solid #1f2c34;
          font-size: 13px;
          color: #8696a0;
          text-align: center;
          line-height: 18px;
          flex-shrink: 0;
        }
        .wa-std-info-bar p { margin: 0; }

        /* Lista */
        .wa-std-container {
          flex: 1;
          overflow-y: auto;
          padding: 4px 0;
        }

        .wa-scrollable::-webkit-scrollbar {
          width: 5px;
        }
        .wa-scrollable::-webkit-scrollbar-thumb {
          background-color: rgba(134, 150, 160, 0.2);
          border-radius: 3px;
        }

        .wa-std-item-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 10px 16px;
          cursor: pointer;
          transition: background-color 0.15s;
        }
        .wa-std-item-row:active {
          background: #202c33;
        }

        .wa-std-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #6b7c85;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 18px;
          color: #fff;
          position: relative;
          transition: transform 0.15s ease;
        }

        .wa-std-check-badge {
          position: absolute;
          bottom: -1px;
          right: -1px;
          background: #00a884;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0b141a;
          animation: popIn 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .wa-std-item-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          border-bottom: 1px solid #1f2c34;
          padding-bottom: 10px;
        }
        .wa-std-item-row:last-child .wa-std-item-info {
          border-bottom: none;
        }

        .wa-std-title {
          font-size: 16px;
          color: #e9edef;
          font-weight: 400;
        }

        .wa-std-sub {
          font-size: 13.5px;
          color: #8696a0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wa-std-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 12px;
          color: #8696a0;
        }
        .wa-std-empty p { margin: 0; font-size: 14px; }

        /* FAB */
        .wa-std-fab-next {
          position: fixed;
          bottom: 28px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 18px;
          background: #00a884;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.15s;
          animation: fabPop 0.2s ease-out;
        }
        .wa-std-fab-next:active {
          transform: scale(0.92);
          background: #008f72;
        }

        @keyframes popIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        @keyframes fabPop {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
import { useState } from 'react';
import { Search, MoreVertical, Users, Megaphone, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

// --- Tipagens ---
export interface SubGrupo {
  id: string;
  nome: string;
  ultimaMensagem: string;
  hora: string;
  naoLidas?: number;
  isAvisos?: boolean;
  urlExterna?: string;
  mensagemModal?: string;
}

export interface ComunidadeItem {
  id: string;
  nome: string;
  descricao?: string;
  bgAvatar: string;
  subgrupos: SubGrupo[];
}

// --- Dados de Exemplo ---
const INITIAL_COMUNIDADES: ComunidadeItem[] = [
  {
    id: 'com-1',
    nome: 'Condomínio Vila Verde 🌿',
    bgAvatar: '#1e3d34',
    subgrupos: [
      {
        id: 'g-1',
        nome: 'Avisos da Síndica',
        ultimaMensagem: '📢 Manutenção do elevador amanhã das 8h às 12h.',
        hora: '10:30',
        naoLidas: 2,
        isAvisos: true,
        // 1. Abre a Telinha / Modal de informações
        mensagemModal: '📌 Comunicado da Síndica:\n\nPrezados moradores, informamos que haverá manutenção preventiva no elevador do Bloco A amanhã, das 8h às 12h.\n\nContamos com a compreensão de todos!'
      },
      {
        id: 'g-2',
        nome: 'Moradores - Bloco A',
        ultimaMensagem: 'Alguém esqueceu uma chave na portaria?',
        hora: '09:15',
        naoLidas: 5,
        // 2. Abre vídeo no YouTube
        urlExterna: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: 'g-3',
        nome: 'Achados e Perdidos',
        ultimaMensagem: 'Encontrei um brinquedo no playground.',
        hora: 'Ontem',
        // 3. Abre vídeo no YouTube
        urlExterna: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ'
      }
    ]
  },
  {
    id: 'com-2',
    nome: 'Faculdade - Ciência da Computação 🎓',
    bgAvatar: '#2c3e50',
    subgrupos: [
      {
        id: 'g-4',
        nome: 'Comunicados Gerais',
        ultimaMensagem: '📢 Calendário de provas do 2º semestre disponível.',
        hora: 'Terça-feira',
        isAvisos: true,
        // Abre Telinha / Modal
        mensagemModal: '📌 Calendário Acadêmico:\n\nAs avaliações A1 começam no dia 15/10. Fiquem atentos às datas no portal do aluno!'
      },
      {
        id: 'g-5',
        nome: 'TCC e Projetos 2026',
        ultimaMensagem: 'Pessoal, lembrem de enviar o relatório.',
        hora: 'Segunda-feira',
        naoLidas: 1,
        // Abre perfil do Instagram
        urlExterna: 'https://www.instagram.com'
      }
    ]
  }
];

export default function ComunidadesPage() {
  const [comunidades, setComunidades] = useState<ComunidadeItem[]>(INITIAL_COMUNIDADES);
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({
    'com-1': true,
    'com-2': true
  });
  
  // Estados da Barra de Pesquisa Padronizada
  const [campoBuscaAberto, setCampoBuscaAberto] = useState<boolean>(false);
  const [busca, setBusca] = useState<string>('');

  // Estado para Modal
  const [modalData, setModalData] = useState<{ titulo: string; conteudo: string } | null>(null);

  // Expandir / Recolher
  const toggleExpandir = (id: string) => {
    setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Clique no grupo
  const handleGrupoClick = (comunidadeId: string, grupo: SubGrupo) => {
    // Limpa o contador de não lidas ao clicar
    setComunidades((prevComunidades) =>
      prevComunidades.map((com) => {
        if (com.id === comunidadeId) {
          return {
            ...com,
            subgrupos: com.subgrupos.map((sub) =>
              sub.id === grupo.id ? { ...sub, naoLidas: 0 } : sub
            )
          };
        }
        return com;
      })
    );

    // 1. Se possuir mensagemModal, abre a telinha pop-up
    if (grupo.mensagemModal) {
      setModalData({
        titulo: grupo.nome,
        conteudo: grupo.mensagemModal
      });
      return;
    }

    // 2. Se possuir urlExterna (YouTube / Instagram), abre o link em nova aba
    if (grupo.urlExterna) {
      window.open(grupo.urlExterna, '_blank');
      return;
    }

    // Comportamento genérico de fallback
    alert(`Abrindo conversa: ${grupo.nome}`);
  };

  const handleNovaComunidade = () => {
    alert('Abrir tela de criação de nova comunidade');
  };

  const handleMenuOpcoes = () => {
    
  };

  // Filtragem na busca
  const comunidadesFiltradas = comunidades.map((com) => {
    const subgruposFiltrados = com.subgrupos.filter((sub) =>
      sub.nome.toLowerCase().includes(busca.toLowerCase()) ||
      sub.ultimaMensagem.toLowerCase().includes(busca.toLowerCase())
    );

    const comNomeBate = com.nome.toLowerCase().includes(busca.toLowerCase());

    if (comNomeBate || subgruposFiltrados.length > 0) {
      return {
        ...com,
        subgrupos: comNomeBate ? com.subgrupos : subgruposFiltrados
      };
    }
    return null;
  }).filter(Boolean) as ComunidadeItem[];

  return (
    <div 
      className="wa-home-scroll"
      style={{ WebkitTapHighlightColor: 'transparent', outline: 'none', position: 'relative' }}
    >
      {/* 1. Header Dinâmico com Padrão Exato de Pesquisa */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '16px 16px 12px 16px',
        backgroundColor: '#0b141a',
        height: 60,
        boxSizing: 'border-box'
      }}>
        {campoBuscaAberto ? (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 10 }}>
            <input
              type="text"
              placeholder="Pesquisar comunidades..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                backgroundColor: '#202c33',
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                color: '#e9edef',
                fontSize: 15,
                outline: 'none'
              }}
            />
            <span 
              onClick={() => { setCampoBuscaAberto(false); setBusca(''); }}
              style={{ color: '#00a884', cursor: 'pointer', fontSize: 14, fontWeight: '500' }}
            >
              Cancelar
            </span>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 22, fontWeight: '500', margin: 0, color: '#e9edef' }}>Comunidades</h1>
            <div style={{ display: 'flex', gap: 20, color: '#aebac1' }}>
              <Search size={22} cursor="pointer" onClick={() => setCampoBuscaAberto(true)} />
              <MoreVertical size={22} cursor="pointer" onClick={handleMenuOpcoes} />
            </div>
          </>
        )}
      </div>

      {/* 2. Criar Nova Comunidade */}
      {!busca && (
        <div style={{ padding: '0 16px' }}>
          <div 
            onClick={handleNovaComunidade}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 16, 
              padding: '10px 0', 
              cursor: 'pointer' 
            }}
          >
            <div style={{ 
              width: 44, 
              height: 44, 
              borderRadius: 12, 
              backgroundColor: '#00a884', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              position: 'relative',
              flexShrink: 0
            }}>
              <Users size={22} color="#0b141a" />
              <div style={{ 
                position: 'absolute', 
                bottom: -2, 
                right: -2, 
                backgroundColor: '#00a884', 
                borderRadius: '50%', 
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #0b141a' 
              }}>
                <Plus size={12} color="#0b141a" strokeWidth={3} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: '500', color: '#e9edef' }}>
              Nova comunidade
            </div>
          </div>
        </div>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid #1f2c34', margin: '8px 0 4px 0' }} />

      {/* 3. Lista de Comunidades */}
      <div>
        {comunidadesFiltradas.map((comunidade) => {
          const isExpanded = expandidos[comunidade.id] ?? true;

          return (
            <div key={comunidade.id} style={{ marginBottom: 4 }}>
              {/* Cabeçalho da Comunidade */}
              <div 
                onClick={() => toggleExpandir(comunidade.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ 
                    width: 44, 
                    height: 44, 
                    borderRadius: 12, 
                    backgroundColor: comunidade.bgAvatar, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Users size={22} color="#e9edef" />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: '600', color: '#e9edef' }}>
                    {comunidade.nome}
                  </div>
                </div>
                <div>
                  {isExpanded ? <ChevronUp size={20} color="#8696a0" /> : <ChevronDown size={20} color="#8696a0" />}
                </div>
              </div>

              {/* Lista de Subgrupos */}
              {isExpanded && (
                <div>
                  {comunidade.subgrupos.map((grupo) => (
                    <div 
                      key={grupo.id}
                      onClick={() => handleGrupoClick(comunidade.id, grupo)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        padding: '10px 16px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, overflow: 'hidden' }}>
                        <div style={{ 
                          width: 44, 
                          height: 44, 
                          borderRadius: '50%', 
                          backgroundColor: grupo.isAvisos ? '#103629' : '#202c33', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {grupo.isAvisos ? (
                            <Megaphone size={20} color="#00a884" />
                          ) : (
                            <Users size={20} color="#8696a0" />
                          )}
                        </div>

                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 16, fontWeight: '500', color: '#e9edef' }}>
                              {grupo.nome}
                            </span>
                            <span style={{ fontSize: 12, color: grupo.naoLidas ? '#00a884' : '#8696a0' }}>
                              {grupo.hora}
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 3 }}>
                            <span style={{ 
                              fontSize: 13, 
                              color: '#8696a0', 
                              whiteSpace: 'nowrap', 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis' 
                            }}>
                              {grupo.ultimaMensagem}
                            </span>
                            {grupo.naoLidas && grupo.naoLidas > 0 ? (
                              <span style={{ 
                                backgroundColor: '#00a884', 
                                color: '#0b141a', 
                                borderRadius: '50%', 
                                minWidth: 18,
                                height: 18,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 11, 
                                fontWeight: 'bold',
                                padding: '0 4px',
                                marginLeft: 8
                              }}>
                                {grupo.naoLidas}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Telinha / Pop-up In-App */}
      {modalData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#222e35',
            borderRadius: 12,
            padding: 20,
            maxWidth: 320,
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            border: '1px solid #2a3942'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0, fontSize: 18, color: '#e9edef', fontWeight: '600' }}>
                {modalData.titulo}
              </h3>
              <X size={20} color="#8696a0" cursor="pointer" onClick={() => setModalData(null)} />
            </div>

            <p style={{ 
              color: '#d1d7db', 
              fontSize: 14, 
              lineHeight: 1.5, 
              whiteSpace: 'pre-wrap', 
              margin: '0 0 20px 0' 
            }}>
              {modalData.conteudo}
            </p>

            <button 
              onClick={() => setModalData(null)}
              style={{
                width: '100%',
                backgroundColor: '#00a884',
                color: '#0b141a',
                border: 'none',
                borderRadius: 20,
                padding: '10px 0',
                fontWeight: '600',
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
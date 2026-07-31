import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, MoreVertical, Plus, ChevronUp, ChevronDown, X, Check } from 'lucide-react';
import { resolveCloudAssetSrc } from '../cloudAssets';

// --- Tipagens do TypeScript ---
export interface StoryMedia {
  id: number;
  url: string;
  tipo?: 'image' | 'video';
  legenda?: string;
}

export interface StatusItem {
  id: string;
  nome: string;
  hora: string;
  visto: boolean;
  fotoPerfil?: string;
  letter: string;
  bg: string;
  media: StoryMedia[];
}

interface AvatarPlaceholderProps {
  foto?: string;
  letter?: string;
  bg?: string;
}

// --- Dados Iniciais com Imagens de Perfil ---
const INITIAL_STATUSES: StatusItem[] = [
  {
    id: 'rn',
    nome: 'Thiago 2.0',
    hora: '20:15',
    visto: false,
    fotoPerfil: resolveCloudAssetSrc("/imagens/foto1.jpg"),
    letter: 'RN',
    bg: '#34495e',
    media: [
      { id: 1, url: resolveCloudAssetSrc("/videos/video_1.mp4"), tipo: 'video', legenda: 'Trabalhando no projeto 🚀' },
      { id: 2, url: resolveCloudAssetSrc("/videos/video_2.mp4"), tipo: 'video', legenda: 'Cafezinho da tarde ☕' }
    ]
  },
  {
    id: 'rm',
    nome: 'Elena',
    hora: '07:51',
    visto: false,
    fotoPerfil: resolveCloudAssetSrc("/imagens/elena.jfif"),
    letter: 'RM',
    bg: '#8e44ad',
    media: [
      { id: 1, url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Promoção do dia! 🍔' },
      { id: 2, url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Venha experimentar 🔥' },
      { id: 3, url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Entrega grátis hoje 🛵' }
    ]
  },
  {
    id: 'ca',
    nome: 'Carly Shay',
    hora: 'Há 15 minutos',
    visto: false,
    fotoPerfil: resolveCloudAssetSrc("/imagens/carly5.jfif"),
    letter: 'CA',
    bg: '#e67e22',
    media: [
      { id: 1, url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Ao vivo no iCarly! 🎬' },
      { id: 2, url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Com a galera 🎉' }
    ]
  },
  {
    id: 'sa',
    nome: 'Sam Puckett',
    hora: 'Há 42 minutos',
    visto: false,
    fotoPerfil: resolveCloudAssetSrc("/imagens/sam.jfif"),
    letter: 'SA',
    bg: '#16a085',
    media: [
      { id: 1, url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Bacon é vida 🥓' }
    ]
  },
  {
    id: 'ic',
    nome: 'Desconhecido',
    hora: '14:47',
    visto: true,
    fotoPerfil: resolveCloudAssetSrc("/imagens/desconhecido.jfif"),
    letter: 'IC',
    bg: '#2c3e50',
    media: [
      { id: 1, url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Corte do dia ✂️' }
    ]
  },
  {
    id: 'tp',
    nome: 'Timão & Pumba',
    hora: 'Ontem 22:10',
    visto: true,
    fotoPerfil: resolveCloudAssetSrc("/imagens/timao.jfif"),
    letter: 'TP',
    bg: '#d35400',
    media: [
      { id: 1, url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Hakuna Matata! 🐗' },
      { id: 2, url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop', tipo: 'image', legenda: 'Sem problemas! 🌴' }
    ]
  }
];

const MINHA_FOTO_PERFIL = resolveCloudAssetSrc("/imagens/foto_isabela.jpg");

export default function AtualizacoesPage() {
  const [statuses, setStatuses] = useState<StatusItem[]>(INITIAL_STATUSES);
  const [expandidoVistos, setExpandidoVistos] = useState<boolean>(false);
  
  // Estados da Barra de Pesquisa Padronizada
  const [campoBuscaAberto, setCampoBuscaAberto] = useState<boolean>(false);
  const [busca, setBusca] = useState<string>('');

  // Estado para controlar se o canal está sendo seguido
  const [seguindoCanal, setSeguindoCanal] = useState<boolean>(false);

  // Estados do Modal Viewer
  const [storyAtivo, setStoryAtivo] = useState<StatusItem | null>(null);
  const [mediaIndex, setMediaIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [carregada, setCarregada] = useState<boolean>(false);

  const mediaIndexRef = useRef(mediaIndex);
  mediaIndexRef.current = mediaIndex;
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const AvatarPlaceholder = ({ foto, letter = 'U', bg = '#121b22' }: AvatarPlaceholderProps) => {
    const [erroImagem, setErroImagem] = useState(false);

    return (
      <div style={{
        width: 45,
        height: 45,
        borderRadius: '50%',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e9edef',
        fontWeight: 'bold',
        fontSize: 14,
        flexShrink: 0,
        overflow: 'hidden'
      }}>
        {foto && !erroImagem ? (
          <img
            src={foto}
            alt={letter}
            onError={() => setErroImagem(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        ) : (
          letter
        )}
      </div>
    );
  };

  const marcarComoVisto = useCallback((statusId: string) => {
    setStatuses((prev) =>
      prev.map((item) => (item.id === statusId ? { ...item, visto: true } : item))
    );
  }, []);

  const fecharStory = useCallback(() => {
    if (storyAtivo) {
      marcarComoVisto(storyAtivo.id);
    }
    setStoryAtivo(null);
    setMediaIndex(0);
    setProgress(0);
    setCarregada(false);
  }, [storyAtivo, marcarComoVisto]);

  const irParaProximaMedia = useCallback(() => {
    if (!storyAtivo) return;

    const currentIndex = mediaIndexRef.current;
    if (currentIndex < storyAtivo.media.length - 1) {
      setCarregada(false);
      setProgress(0);
      setMediaIndex(currentIndex + 1);
    } else {
      fecharStory();
    }
  }, [storyAtivo, fecharStory]);

  const anteriorMedia = () => {
    if (mediaIndex > 0) {
      setCarregada(false);
      setProgress(0);
      setMediaIndex((prev) => prev - 1);
    }
  };

  const abrirStory = (statusObj: StatusItem) => {
    setStoryAtivo(statusObj);
    setMediaIndex(0);
    setProgress(0);
    setCarregada(false);
  };

  const mediaAtual = storyAtivo?.media[mediaIndex];
  const éVideo = mediaAtual?.tipo === 'video' || mediaAtual?.url.toLowerCase().endsWith('.mp4');

  useEffect(() => {
    if (!storyAtivo || !carregada || éVideo) return;

    const DURATION = 5000;
    const INTERVAL = 50;
    const step = (INTERVAL / DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          clearInterval(timer);
          irParaProximaMedia();
          return 0;
        }
        return prev + step;
      });
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [storyAtivo, mediaIndex, carregada, éVideo, irParaProximaMedia]);

  // Filtragem da Busca
  const statusFiltrados = statuses.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const recentes = statusFiltrados.filter((item) => !item.visto);
  const vistos = statusFiltrados.filter((item) => item.visto);

  // Canal de exemplo filtrado
  const exibeCanal = "stickers 🎀".includes(busca.toLowerCase()) || busca === '';

  return (
    <div className="wa-home-scroll" style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}>
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
              placeholder="Pesquisar..."
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
            <h1 style={{ fontSize: 22, fontWeight: '500', margin: 0, color: '#e9edef' }}>Atualizações</h1>
            <div style={{ display: 'flex', gap: 20, color: '#aebac1' }}>
              <Search size={22} cursor="pointer" onClick={() => setCampoBuscaAberto(true)} />
              <MoreVertical size={22} cursor="pointer" />
            </div>
          </>
        )}
      </div>

      {/* 2. Seção Status */}
      <div style={{ padding: '0 16px' }}>
        <h2 style={{ fontSize: 18, fontWeight: '600', marginBottom: 16 }}>Status</h2>

        {/* Meu Status (esconde ao pesquisar) */}
        {!busca && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, cursor: 'pointer' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <AvatarPlaceholder foto={MINHA_FOTO_PERFIL} letter="VC" bg="#202c33" />
              <div style={{ 
                position: 'absolute', 
                bottom: -2, 
                right: -2, 
                backgroundColor: '#00a884', 
                borderRadius: '50%', 
                padding: 2, 
                border: '2px solid #0b141a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plus size={12} color="#0b141a" strokeWidth={3} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: '500' }}>Adicionar status</div>
              <div style={{ fontSize: 13, color: '#8696a0', marginTop: 2 }}>Desaparecerá em 24 horas</div>
            </div>
          </div>
        )}

        {/* --- RECENTES --- */}
        {recentes.length > 0 && (
          <>
            <div style={{ fontSize: 13, fontWeight: '600', color: '#8696a0', marginBottom: 16 }}>
              Atualizações recentes
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recentes.map((item) => (
                <div 
                  key={item.id} 
                  style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                  onClick={() => abrirStory(item)}
                >
                  <div style={{ 
                    padding: 2, 
                    borderRadius: '50%', 
                    border: '2px solid #00a884',
                    display: 'inline-block',
                    flexShrink: 0
                  }}>
                    <AvatarPlaceholder foto={item.fotoPerfil} letter={item.letter} bg={item.bg} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: '500' }}>{item.nome}</div>
                    <div style={{ fontSize: 13, color: '#8696a0', marginTop: 2 }}>{item.hora}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* --- VISUALIZADAS --- */}
        {vistos.length > 0 && (
          <>
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                fontSize: 13, 
                fontWeight: '600', 
                color: '#8696a0', 
                marginTop: 24,
                marginBottom: 16,
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={() => setExpandidoVistos(!expandidoVistos)}
            >
              <span>Atualizações visualizadas</span>
              {expandidoVistos || busca ? <ChevronUp size={18} color="#8696a0" /> : <ChevronDown size={18} color="#8696a0" />}
            </div>

            {(expandidoVistos || busca) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {vistos.map((item) => (
                  <div 
                    key={item.id} 
                    style={{ display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
                    onClick={() => abrirStory(item)}
                  >
                    <div style={{ 
                      padding: 2, 
                      borderRadius: '50%', 
                      border: '2px solid #374248',
                      display: 'inline-block',
                      flexShrink: 0
                    }}>
                      <AvatarPlaceholder foto={item.fotoPerfil} letter={item.letter} bg={item.bg} />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: '500' }}>{item.nome}</div>
                      <div style={{ fontSize: 13, color: '#8696a0', marginTop: 2 }}>{item.hora}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #1f2c34', margin: '20px 0' }} />

      {/* 3. Canais */}
      {exibeCanal && (
        <div style={{ padding: '0 16px' }}>
          <h2 style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Canais</h2>
          <p style={{ fontSize: 14, color: '#8696a0', lineHeight: '1.4', margin: 0 }}>
            Receba atualizações sobre os assuntos do seu interesse. Encontre canais que você pode seguir abaixo.
          </p>

          <div style={{ fontSize: 13, fontWeight: '600', color: '#8696a0', marginTop: 20, marginBottom: 16 }}>
            Encontrar canais para seguir
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AvatarPlaceholder letter="🎀" bg="#2a3942" />
              <div>
                <div style={{ fontSize: 16, fontWeight: '500' }}>Stickers 🎀</div>
                <div style={{ fontSize: 13, color: '#8696a0', marginTop: 2 }}>284 mil seguidores</div>
              </div>
            </div>
            
            {/* Botão Seguir / Seguindo */}
            <button 
              onClick={() => setSeguindoCanal(!seguindoCanal)}
              style={{ 
                backgroundColor: seguindoCanal ? 'transparent' : '#103629', 
                color: seguindoCanal ? '#8696a0' : '#25d366', 
                border: seguindoCanal ? '1px solid #374248' : 'none', 
                borderRadius: 20, 
                padding: '8px 20px', 
                fontWeight: '600',
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s ease'
              }}
            >
              {seguindoCanal ? (
                <>
                  <Check size={16} color="#8696a0" />
                  Seguindo
                </>
              ) : (
                'Seguir'
              )}
            </button>
          </div>
        </div>
      )}

      {/* --- MODAL STORY (FOTO + VÍDEO) --- */}
      {storyAtivo && mediaAtual && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {éVideo ? (
            <video
              ref={videoRef}
              key={`${storyAtivo.id}-${mediaIndex}`}
              src={mediaAtual.url}
              autoPlay
              playsInline
              onLoadedData={() => setCarregada(true)}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
                  setProgress(p);
                }
              }}
              onEnded={irParaProximaMedia}
              onError={irParaProximaMedia}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1,
                opacity: carregada ? 1 : 0
              }}
            />
          ) : (
            <img 
              key={`${storyAtivo.id}-${mediaIndex}`}
              src={mediaAtual.url} 
              alt="Story" 
              onLoad={() => setCarregada(true)}
              onError={irParaProximaMedia}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 1,
                opacity: carregada ? 1 : 0,
                transition: 'opacity 0.15s ease'
              }}
            />
          )}

          {/* Top Bar */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            padding: '12px 16px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
              {storyAtivo.media.map((_, idx) => (
                <div 
                  key={idx} 
                  style={{
                    flex: 1,
                    height: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    height: '100%',
                    backgroundColor: '#fff',
                    width: idx < mediaIndex ? '100%' : idx === mediaIndex ? `${progress}%` : '0%'
                  }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <AvatarPlaceholder foto={storyAtivo.fotoPerfil} letter={storyAtivo.letter} bg={storyAtivo.bg} />
                <div>
                  <div style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>{storyAtivo.nome}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{storyAtivo.hora}</div>
                </div>
              </div>
              <button 
                onClick={fecharStory} 
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Toque para Navegar */}
          <div style={{
            position: 'absolute',
            top: 60,
            bottom: 60,
            left: 0,
            right: 0,
            zIndex: 5,
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <div onClick={anteriorMedia} style={{ width: '35%', height: '100%', cursor: 'pointer' }} />
            <div onClick={irParaProximaMedia} style={{ width: '65%', height: '100%', cursor: 'pointer' }} />
          </div>

          {/* Legenda */}
          {mediaAtual.legenda && (
            <div style={{
              position: 'relative',
              zIndex: 10,
              width: '100%',
              padding: '20px 16px 32px 16px',
              textAlign: 'center',
              color: '#fff',
              fontSize: 16,
              background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              boxSizing: 'border-box'
            }}>
              {mediaAtual.legenda}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
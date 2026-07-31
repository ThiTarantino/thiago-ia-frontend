import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MoreVertical, 
  Link as LinkIcon, 
  Phone, 
  Video, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Volume2,
  Share2,
  Mic,
  PhoneOff,
  Lock,
  Grip,
  Delete,
  X
} from 'lucide-react';
import { resolveCloudAssetSrc } from '../cloudAssets';

// --- Tipagens ---
export interface CallItem {
  id: string;
  nome: string;
  dataHora: string;
  tipo: 'voz' | 'video';
  direcao: 'recebida' | 'efetuada' | 'perdida';
  fotoPerfil?: string;
  audioUrl?: string;
}

interface AvatarPlaceholderProps {
  foto?: string;
  letter?: string;
  bg?: string;
  size?: number;
}

// --- Número secreto correto para discagem ---
const NUMERO_CORRETO = "51986044473"; 

// --- Contato ID 15 (Oculto da Lista Principal) ---
const SECRET_CALL: CallItem = {
  id: '15',
  nome: 'Contato Secreto',
  dataHora: 'Agora',
  tipo: 'voz',
  direcao: 'efetuada',
  fotoPerfil: resolveCloudAssetSrc("/imagens/desconhecido.jfif"),
  audioUrl: '/audios/segredo.mp3'
};

// --- Dados Iniciais de Chamadas ---
const INITIAL_CALLS: CallItem[] = [
  {
    id: '1',
    nome: 'Thiago 2.0',
    dataHora: 'Hoje 20:15',
    tipo: 'voz',
    direcao: 'perdida',
    fotoPerfil: resolveCloudAssetSrc("/imagens/foto1.jpg"),
    audioUrl: '/audios/thiago.mp3'
  },
  {
    id: '2',
    nome: 'Elena',
    dataHora: 'Hoje 17:30',
    tipo: 'voz',
    direcao: 'efetuada',
    fotoPerfil: resolveCloudAssetSrc("/imagens/elena.jfif"),
    audioUrl: '/audios/elena.mp3'
  },
  {
    id: '3',
    nome: 'Carly Shay',
    dataHora: 'Ontem 21:10',
    tipo: 'voz',
    direcao: 'recebida',
    fotoPerfil: resolveCloudAssetSrc("/imagens/carly5.jfif"),
    audioUrl: '/audios/carly.mp3'
  },
  {
    id: '4',
    nome: 'Sam Puckett',
    dataHora: 'Ontem 18:45',
    tipo: 'voz',
    direcao: 'efetuada',
    fotoPerfil: resolveCloudAssetSrc("/imagens/sam.jfif"),
    audioUrl: '/audios/sam.mp3'
  },
  {
    id: '5',
    nome: 'Sam Puckett',
    dataHora: 'Ontem 18:30',
    tipo: 'voz',
    direcao: 'perdida',
    fotoPerfil: resolveCloudAssetSrc("/imagens/sam.jfif"),
    audioUrl: '/audios/sam.mp3'
  },
  {
    id: '6',
    nome: 'Sam Puckett',
    dataHora: 'Ontem 18:15',
    tipo: 'voz',
    direcao: 'perdida',
    fotoPerfil: resolveCloudAssetSrc("/imagens/sam.jfif"),
    audioUrl: '/audios/sam.mp3'
  },
  {
    id: '7',
    nome: 'Thiago 2.0',
    dataHora: 'Ontem 14:20',
    tipo: 'voz',
    direcao: 'efetuada',
    fotoPerfil: resolveCloudAssetSrc("/imagens/foto1.jpg"),
    audioUrl: '/audios/thiago.mp3'
  },
  {
    id: '8',
    nome: 'Timão & Pumba',
    dataHora: '26 de julho 11:05',
    tipo: 'voz',
    direcao: 'efetuada',
    fotoPerfil: resolveCloudAssetSrc("/imagens/timao.jfif"),
    audioUrl: '/audios/timao.mp3'
  },
  {
    id: '9',
    nome: 'Thiago 2.0',
    dataHora: '23 de julho 11:10',
    tipo: 'voz',
    direcao: 'efetuada',
    fotoPerfil: resolveCloudAssetSrc("/imagens/foto1.jpg"),
    audioUrl: '/audios/thiago.mp3'
  },
  {
    id: '10',
    nome: 'Carly Shay',
    dataHora: '25 de julho 20:15',
    tipo: 'voz',
    direcao: 'efetuada',
    fotoPerfil: resolveCloudAssetSrc("/imagens/carly5.jfif"),
    audioUrl: '/audios/carly.mp3'
  },
  {
    id: '11',
    nome: 'Carly Shay',
    dataHora: '25 de julho 19:30',
    tipo: 'voz',
    direcao: 'perdida',
    fotoPerfil: resolveCloudAssetSrc("/imagens/carly5.jfif"),
    audioUrl: '/audios/carly.mp3'
  },
  {
    id: '12',
    nome: 'Elena',
    dataHora: '24 de julho 16:20',
    tipo: 'voz',
    direcao: 'recebida',
    fotoPerfil: resolveCloudAssetSrc("/imagens/elena.jfif"),
    audioUrl: '/audios/elena.mp3'
  },
  {
    id: '13',
    nome: 'Thiago 2.0',
    dataHora: '23 de julho 15:40',
    tipo: 'voz',
    direcao: 'recebida',
    fotoPerfil: resolveCloudAssetSrc("/imagens/foto1.jpg"),
    audioUrl: '/audios/thiago.mp3'
  },
  {
    id: '14',
    nome: 'Timão & Pumba',
    dataHora: '26 de julho 10:45',
    tipo: 'voz',
    direcao: 'efetuada',
    fotoPerfil: resolveCloudAssetSrc("/imagens/timao.jfif"),
    audioUrl: '/audios/timao.mp3'
  }
];

export default function LigacoesPage() {
  const [calls] = useState<CallItem[]>(INITIAL_CALLS);
  const [busca, setBusca] = useState<string>('');
  const [campoBuscaAberto, setCampoBuscaAberto] = useState<boolean>(false);

  // --- Estados do Teclado Discador ---
  const [tecladoAberto, setTecladoAberto] = useState(false);
  const [numeroDigitado, setNumeroDigitado] = useState("");
  const [erroNumero, setErroNumero] = useState("");

  // --- Estados da Chamada em Andamento ---
  const [emChamada, setEmChamada] = useState(false);
  const [contatoAtivo, setContatoAtivo] = useState<CallItem | null>(null);
  const [statusChamada, setStatusChamada] = useState("Chamando...");
  const [segundos, setSegundos] = useState(0);
  const [chamadaConectada, setChamadaConectada] = useState(false);

  // Referências de Áudio e Cronômetro
  const audioPessoaRef = useRef<HTMLAudioElement | null>(null);
  const audioChamandoRef = useRef<HTMLAudioElement | null>(null);
  const cronometroRef = useRef<number | null>(null);

  // Componente Avatar
  const AvatarPlaceholder = ({ foto, letter = 'U', bg = '#121b22', size = 44 }: AvatarPlaceholderProps) => {
    const [erroImagem, setErroImagem] = useState(false);

    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e9edef',
        fontWeight: 'bold',
        fontSize: Math.round(size * 0.35),
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

  // Ícone indicador de direção
  const CallDirectionIcon = ({ direcao }: { direcao: CallItem['direcao'] }) => {
    if (direcao === 'perdida') {
      return <ArrowDownLeft size={16} color="#f15c6d" style={{ flexShrink: 0 }} />;
    }
    if (direcao === 'recebida') {
      return <ArrowDownLeft size={16} color="#00a884" style={{ flexShrink: 0 }} />;
    }
    return <ArrowUpRight size={16} color="#00a884" style={{ flexShrink: 0 }} />;
  };

  // Iniciar chamada
  const handleIniciarChamada = (item: CallItem) => {
    setContatoAtivo(item);
    setEmChamada(true);
    setStatusChamada("Chamando...");
    setSegundos(0);
    setChamadaConectada(false);
  };

  // Digitação do Teclado
  const handleAddDigito = (digito: string) => {
    setErroNumero("");
    if (numeroDigitado.length < 15) {
      setNumeroDigitado((prev) => prev + digito);
    }
  };

  const handleBackspace = () => {
    setErroNumero("");
    setNumeroDigitado((prev) => prev.slice(0, -1));
  };

  const handleDiscar = () => {
    if (numeroDigitado.trim() === NUMERO_CORRETO) {
      setTecladoAberto(false);
      setNumeroDigitado("");
      setErroNumero("");
      handleIniciarChamada(SECRET_CALL);
    } else {
      setErroNumero("Número inválido");
    }
  };

  // Controla áudios da chamada
  useEffect(() => {
    let conexaoTimeout: number;

    if (emChamada) {
      if (audioChamandoRef.current) {
        audioChamandoRef.current.currentTime = 0;
        audioChamandoRef.current.play().catch((err) => console.log("Erro áudio tu-tu:", err));
      }

      conexaoTimeout = window.setTimeout(() => {
        if (audioChamandoRef.current) audioChamandoRef.current.pause();

        setChamadaConectada(true);
        
        if (audioPessoaRef.current) {
          audioPessoaRef.current.currentTime = 0;
          audioPessoaRef.current.play().catch((err) => console.log("Erro áudio da pessoa:", err));
        }
      }, 2500);
    }

    return () => {
      window.clearTimeout(conexaoTimeout);
      if (cronometroRef.current) window.clearInterval(cronometroRef.current);
      if (audioChamandoRef.current) audioChamandoRef.current.pause();
      if (audioPessoaRef.current) audioPessoaRef.current.pause();
    };
  }, [emChamada]);

  // Cronômetro
  useEffect(() => {
    if (emChamada && chamadaConectada) {
      cronometroRef.current = window.setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (cronometroRef.current) {
        window.clearInterval(cronometroRef.current);
        cronometroRef.current = null;
      }
    };
  }, [emChamada, chamadaConectada]);

  const formatarTempo = (totalSegundos: number) => {
    const minutos = Math.floor(totalSegundos / 60);
    const tabsSegundos = totalSegundos % 60;
    return `${minutos.toString().padStart(2, "0")}:${tabsSegundos.toString().padStart(2, "0")}`;
  };

  const handleAudioFim = () => {
    if (cronometroRef.current) window.clearInterval(cronometroRef.current);
    setStatusChamada("Chamada encerrada");
    setChamadaConectada(false);
    
    setTimeout(() => {
      setEmChamada(false);
    }, 1500);
  };

  const chamadasFiltradas = calls.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ 
      backgroundColor: '#0b141a', 
      color: '#e9edef', 
      height: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      WebkitTapHighlightColor: 'transparent'
    }}>
      {/* Áudios dinâmicos */}
      <audio ref={audioChamandoRef} src={resolveCloudAssetSrc("/audios/chamando.mp3")} loop />
      <audio 
        ref={audioPessoaRef} 
        src={resolveCloudAssetSrc(contatoAtivo?.audioUrl || "/audios/ajuda.mp3")} 
        onEnded={handleAudioFim} 
      />

      {!emChamada ? (
        <>
          {/* Header */}
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
                  placeholder="Pesquisar chamadas..."
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
                <h1 style={{ fontSize: 22, fontWeight: '500', margin: 0 }}>Ligações</h1>
                <div style={{ display: 'flex', gap: 20, color: '#aebac1' }}>
                  <Search size={22} cursor="pointer" onClick={() => setCampoBuscaAberto(true)} />
                  <MoreVertical size={22} cursor="pointer" />
                </div>
              </>
            )}
          </div>

          {/* Lista com Scroll */}
          <div style={{ 
            height: 'calc(100vh - 60px)', 
            overflowY: 'auto', 
            padding: '0 16px',
            paddingBottom: 160 
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 16, 
              margin: '12px 0 24px 0', 
              cursor: 'pointer' 
            }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#00a884',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <LinkIcon size={22} color="#0b141a" style={{ transform: 'rotate(-45deg)' }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: '500' }}>Criar link de chamada</div>
                <div style={{ fontSize: 13, color: '#8696a0', marginTop: 2 }}>
                  Compartilhe um link para sua chamada do WhatsApp
                </div>
              </div>
            </div>

            <div style={{ fontSize: 15, fontWeight: '600', color: '#8696a0', marginBottom: 16 }}>
              Recentes
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {chamadasFiltradas.length > 0 ? (
                chamadasFiltradas.map((item, index) => {
                  const ePerdida = item.direcao === 'perdida';

                  return (
                    <div 
                      key={`${item.id}-${index}`} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <AvatarPlaceholder foto={item.fotoPerfil} size={45} />
                        
                        <div>
                          <div style={{ 
                            fontSize: 16, 
                            fontWeight: '500', 
                            color: ePerdida ? '#f15c6d' : '#e9edef' 
                          }}>
                            {item.nome}
                          </div>

                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 6, 
                            fontSize: 13, 
                            color: '#8696a0', 
                            marginTop: 3 
                          }}>
                            <CallDirectionIcon direcao={item.direcao} />
                            <span>{item.dataHora}</span>
                          </div>
                        </div>
                      </div>

                      <div 
                        onClick={() => handleIniciarChamada(item)}
                        style={{ padding: 8, cursor: 'pointer', color: '#00a884' }}
                      >
                        {item.tipo === 'video' ? (
                          <Video size={22} />
                        ) : (
                          <Phone size={20} />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: '#8696a0', padding: '30px 0', fontSize: 14 }}>
                  Nenhuma chamada encontrada.
                </div>
              )}
            </div>
          </div>

          {/* Botão Flutuante FAB acima da barra inferior */}
          <div 
            onClick={() => {
              setTecladoAberto(true);
              setNumeroDigitado("");
              setErroNumero("");
            }}
            style={{
              position: 'fixed',
              bottom: 90,
              right: 18,
              width: 56,
              height: 56,
              borderRadius: '16px',
              backgroundColor: '#00a884',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
              cursor: 'pointer',
              zIndex: 30
            }}
          >
            <Grip size={26} color="#0b141a" />
          </div>

          {/* --- MODAL DO TECLADO DISCADOR --- */}
          {tecladoAberto && (
            <div style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#0b141a',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 16,
              paddingBottom: 120, // Garante que NADA fique atrás da barra de navegação
              boxSizing: 'border-box'
            }}>
              {/* Topo: Título e Botão Fechar */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '0 20px',
                height: 48,
                flexShrink: 0
              }}>
                <span style={{ fontSize: 18, color: '#8696a0', fontWeight: '500' }}>Discador</span>
                <div 
                  onClick={() => setTecladoAberto(false)}
                  style={{
                    padding: 8,
                    cursor: 'pointer',
                    color: '#aebac1'
                  }}
                >
                  <X size={26} />
                </div>
              </div>

              {/* Visor de Número */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                flex: 1,
                padding: '0 20px',
                minHeight: 70
              }}>
                <div style={{ 
                  fontSize: 32, 
                  fontWeight: '500', 
                  color: '#e9edef',
                  letterSpacing: 2,
                  textAlign: 'center',
                  wordBreak: 'break-all'
                }}>
                  {numeroDigitado || <span style={{ color: '#8696a0', fontSize: 18 }}>Digite o número</span>}
                </div>

                {erroNumero && (
                  <div style={{ color: '#f15c6d', fontSize: 14, marginTop: 6, fontWeight: '500' }}>
                    {erroNumero}
                  </div>
                )}
              </div>

              {/* Teclado Numérico (Grid 3x4) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px 20px',
                maxWidth: 300,
                margin: '0 auto',
                width: '100%',
                padding: '0 20px',
                flexShrink: 0
              }}>
                {[
                  { num: '1', sub: '' },
                  { num: '2', sub: 'ABC' },
                  { num: '3', sub: 'DEF' },
                  { num: '4', sub: 'GHI' },
                  { num: '5', sub: 'JKL' },
                  { num: '6', sub: 'MNO' },
                  { num: '7', sub: 'PQRS' },
                  { num: '8', sub: 'TUV' },
                  { num: '9', sub: 'WXYZ' },
                  { num: '*', sub: '' },
                  { num: '0', sub: '+' },
                  { num: '#', sub: '' },
                ].map((item) => (
                  <button
                    key={item.num}
                    onClick={() => handleAddDigito(item.num)}
                    style={{
                      backgroundColor: '#202c33',
                      border: 'none',
                      borderRadius: '50%',
                      width: 58,
                      height: 58,
                      margin: '0 auto',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#e9edef',
                      cursor: 'pointer',
                      outline: 'none',
                      WebkitTapHighlightColor: 'transparent'
                    }}
                  >
                    <span style={{ fontSize: 20, fontWeight: '500', lineHeight: '1' }}>{item.num}</span>
                    {item.sub && <span style={{ fontSize: 8, color: '#8696a0', marginTop: 2 }}>{item.sub}</span>}
                  </button>
                ))}
              </div>

              {/* Botões de Ação (Ligar e Apagar) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                marginTop: 20,
                flexShrink: 0
              }}>
                {/* Botão de Ligar (Centralizado) */}
                <button
                  onClick={handleDiscar}
                  style={{
                    backgroundColor: '#00a884',
                    border: 'none',
                    borderRadius: '50%',
                    width: 58,
                    height: 58,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0b141a',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    outline: 'none'
                  }}
                >
                  <Phone size={26} />
                </button>

                {/* Botão de Apagar (Posicionado à direita) */}
                {numeroDigitado.length > 0 && (
                  <button
                    onClick={handleBackspace}
                    style={{
                      position: 'absolute',
                      right: '18%',
                      backgroundColor: 'transparent',
                      border: 'none',
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#aebac1',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    <Delete size={24} />
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Tela de Chamada Ativa */
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#0e1b21',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 24px 85px 24px',
          color: '#fff',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8696a0', fontSize: 12 }}>
            <Lock size={14} />
            <span>Criptografia de ponta a ponta</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', marginBottom: 40 }}>
            <div style={{ marginBottom: 20 }}>
              <AvatarPlaceholder 
                foto={contatoAtivo?.fotoPerfil}  
                size={110}
              />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: '500', margin: '0 0 8px 0', color: '#e9edef' }}>
              {contatoAtivo?.nome}
            </h1>
            <p style={{ fontSize: 15, color: '#8696a0', margin: 0 }}>
              {chamadaConectada ? formatarTempo(segundos) : statusChamada}
            </p>
          </div>

          <div style={{
            width: '100%',
            maxWidth: 320,
            backgroundColor: '#1c2d35',
            padding: '14px 24px',
            borderRadius: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
          }}>
            <div style={{ color: '#aebac1', cursor: 'pointer' }}>
              <Volume2 size={24} />
            </div>
            <div style={{ color: '#aebac1', cursor: 'pointer' }}>
              <Share2 size={24} />
            </div>
            <div style={{ color: '#aebac1', cursor: 'pointer' }}>
              <Mic size={24} />
            </div>
            
            <div 
              onClick={() => {
                if (audioChamandoRef.current) audioChamandoRef.current.pause();
                if (audioPessoaRef.current) audioPessoaRef.current.pause();
                setEmChamada(false);
              }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#ea0038',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <PhoneOff size={22} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import GameHub from "./GameHub.tsx";
import { respostaModoOffline } from "./respostas";
import AttachPanel from "./components/AttachPanel";
import EmojiPanel  from "./components/EmojiPanel";
import MenuPanel   from "./components/MenuPanel";
import './WhatsApp.css';

// ─────────────────────────────────────────────────────────────────────────────
// SENHA DA TELA DE BLOQUEIO — 4 dígitos
// ─────────────────────────────────────────────────────────────────────────────
const SENHA_BLOQUEIO = "2507";

// ─────────────────────────────────────────────────────────────────────────────
// ÁUDIOS DO BOT — coloque seus arquivos em /public/audios/
// Nomeie como: audio_bot_1.ogg, audio_bot_2.ogg ... audio_bot_8.ogg
// Pode usar .mp3 também — só ajuste a extensão abaixo.
// ─────────────────────────────────────────────────────────────────────────────
const AUDIOS_BOT = [
  "/audios/audio_bot_1.ogg",
  "/audios/audio_bot_2.ogg",
  "/audios/audio_bot_3.ogg",
  "/audios/audio_bot_4.ogg",
  "/audios/audio_bot_5.ogg",
  "/audios/audio_bot_6.ogg",
  "/audios/audio_bot_7.ogg",
  "/audios/audio_bot_8.ogg",
];

// Durações reais de cada áudio do bot (em segundos) — ajuste conforme seus arquivos
const DURACAO_AUDIOS_BOT = [4, 6, 3, 7, 5, 4, 8, 5];

type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
  isAudio?: boolean;
  audioDuration?: number;
  audioSrc?: string; // caminho do arquivo de áudio real (só para mensagens do bot)
};

function getTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const FOTOS = [
  "/imagens/foto1.jpg",
  "/imagens/foto2.png",
  "/imagens/foto3.jpeg",
  "/imagens/foto4.jpg",
  "/imagens/foto5.jpg",
  "/imagens/foto6.jpg",
  "/imagens/foto7.jpg",
  "/imagens/foto8.jpg",
  "/imagens/foto9.jpg",
  "/imagens/foto10.jpg",
  "/imagens/foto11.jpg",
  "/imagens/foto12.jpg",
  "/imagens/foto13.jpg",
  "/imagens/foto14.jpg",
  "/imagens/foto15.jpg",
];

// ─────────────────────────────────────────────────────────────────────────────
// FOTO DO USUÁRIO — aparece no círculo da bolha de áudio enviada por você
// Troque pelo caminho da foto da Isabela, ex: "/imagens/isabela.jpg"
// ─────────────────────────────────────────────────────────────────────────────
const FOTO_USUARIO = "/imagens/foto_isabela.jpg";

// ─────────────────────────────────────────────────────────────────────────────
// VÍDEOS DA CHAMADA — coloque em /public/videos/
// Nomeie como: video_1.mp4, video_2.mp4 ... video_5.mp4
// ─────────────────────────────────────────────────────────────────────────────
const VIDEOS_CHAMADA = [
  "/videos/video_1.mp4",
  "/videos/video_2.mp4",
  "/videos/video_3.mp4",
  "/videos/video_4.mp4",
  "/videos/video_5.mp4",
];

type CallState = "idle" | "ringing" | "connected" | "ended";
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);
const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);
const IconMore = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);
const IconDone = () => (
  <svg viewBox="0 0 18 18" fill="#53bdeb" width="16" height="16">
    <path d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198-3.065-2.483a.434.434 0 0 0-.609.076l-.445.55a.434.434 0 0 0 .076.609l3.671 2.975a.434.434 0 0 0 .608-.076l.577-.74 6.832-8.772a.434.434 0 0 0-.076-.609zm-4.1 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198-.974-.79a.434.434 0 0 0-.609.076l-.444.55a.434.434 0 0 0 .076.609l1.58 1.279a.434.434 0 0 0 .609-.076l.576-.74 6.831-8.772a.434.434 0 0 0-.076-.609z" />
  </svg>
);
const IconGamepad = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z" />
  </svg>
);
const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" />
    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
  </svg>
);
const IconVideoCall = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);
const IconEndCall = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
  </svg>
);
const IconMicOff = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z" />
  </svg>
);
const IconFlipCamera = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M20 5h-3.17L15 3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-5 11.5V14H9v2.5L5.5 13 9 9.5V12h6V9.5l3.5 3.5-3.5 3.5z" />
  </svg>
);
const IconEmoji = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);
const IconAttach = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
  </svg>
);
const IconMic = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
  </svg>
);
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const IconPause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
  </svg>
);
const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// IconLock / IconBackspace — usados na tela de bloqueio
// ─────────────────────────────────────────────────────────────────────────────
const IconBackspace = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
    <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-4.59 12.59L16 17l-3-3-3 3-1.41-1.41L11.59 12 8.59 9.41 10 8l3 3 3-3 1.41 1.41L14.41 12l3 3z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// LockScreen — tela de bloqueio com 4 dígitos, estilo WhatsApp
// ─────────────────────────────────────────────────────────────────────────────
function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleDigit(d: string) {
    if (pin.length >= 4) return;
    const novoPin = pin + d;
    setPin(novoPin);

    if (novoPin.length === 4) {
      setTimeout(() => {
        if (novoPin === SENHA_BLOQUEIO) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setError(false);
            setPin("");
          }, 450);
        }
      }, 150);
    }
  }

  function handleBackspace() {
    setPin((p) => p.slice(0, -1));
  }

  const teclas = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

  return (
  <div className="wa-lock-screen">
    <div 
  className="wa-lock-icon"
  style={{
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    overflow: "hidden",
    margin: "0 auto 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  }}
>
  <img 
    src="/imagens/foto11.jpg" 
    alt="Foto de perfil"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      position: "static",
      borderRadius: "50%"
    }}
  />
</div>
    <div className="wa-lock-title">Onde tudo começou</div>
    <div className={`wa-lock-subtitle ${error ? "error" : ""}`}>
      {error ? "Senha incorreta" : "Digite a senha"}
    </div>

      <div className={`wa-lock-dots ${error ? "shake" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`wa-lock-dot ${i < pin.length ? "filled" : ""} ${error ? "error" : ""}`}
          />
        ))}
      </div>

      <div className="wa-lock-keypad">
        {teclas.map((k, i) => {
          if (k === "") return <div key={i} className="wa-lock-key empty" />;
          if (k === "back") {
            return (
              <button
                key={i}
                className="wa-lock-key action"
                onClick={handleBackspace}
                title="Apagar"
              >
                <IconBackspace />
              </button>
            );
          }
          return (
            <button key={i} className="wa-lock-key" onClick={() => handleDigit(k)}>
              {k}
            </button>
          );
        })}
      </div>

      <style>{`
        .wa-lock-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #0b141a 0%, #111b21 100%);
          color: #e9edef;
          padding: 24px;
          user-select: none;
        }
        .wa-lock-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #202c33;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #00a884;
          margin-bottom: 18px;
        }
        .wa-lock-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 6px;
        }
        .wa-lock-subtitle {
          font-size: 13px;
          color: #8696a0;
          margin-bottom: 24px;
          transition: color .15s ease;
        }
        .wa-lock-subtitle.error {
          color: #f15c6d;
        }
        .wa-lock-dots {
          display: flex;
          gap: 18px;
          margin-bottom: 40px;
        }
        .wa-lock-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 1.5px solid #8696a0;
          background: transparent;
          transition: background .15s ease, border-color .15s ease;
        }
        .wa-lock-dot.filled {
          background: #00a884;
          border-color: #00a884;
        }
        .wa-lock-dot.error {
          background: #f15c6d;
          border-color: #f15c6d;
        }
        .wa-lock-dots.shake {
          animation: wa-lock-shake 0.4s ease;
        }
        @keyframes wa-lock-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .wa-lock-keypad {
          display: grid;
          grid-template-columns: repeat(3, 68px);
          gap: 18px;
          justify-content: center;
        }
        .wa-lock-key {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: none;
          background: #202c33;
          color: #e9edef;
          font-size: 24px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background .1s ease;
        }
        .wa-lock-key:active {
          background: #2a3942;
        }
        .wa-lock-key.empty {
          background: transparent;
          cursor: default;
        }
        .wa-lock-key.action {
          background: transparent;
          color: #8696a0;
        }
        .wa-lock-key.action:active {
          background: #202c33;
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AudioBubble — bolha de áudio com player real (quando há audioSrc)
// ou player simulado (quando é áudio do usuário, sem arquivo)
// ─────────────────────────────────────────────────────────────────────────────
function AudioBubble({
  role,
  duration,
  time,
  audioSrc,
}: {
  role: "user" | "bot";
  duration: number;
  time: string;
  audioSrc?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [realDuration, setRealDuration] = useState(duration);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Barra de onda decorativa — cada bolha tem alturas diferentes
  const waveHeights = useRef(
    Array.from({ length: 28 }, () => Math.floor(Math.random() * 16) + 3)
  ).current;

  function formatDuration(s: number) {
    const total = Math.round(s);
    const m = Math.floor(total / 60);
    const sec = total % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  // Inicializa o elemento de áudio real (apenas para mensagens do bot)
  useEffect(() => {
    if (!audioSrc) return;
    const audio = new Audio(audioSrc);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      if (audio.duration && isFinite(audio.duration)) {
        setRealDuration(audio.duration);
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    });

    audio.addEventListener("ended", () => {
      setPlaying(false);
      setProgress(0);
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [audioSrc]);

  function togglePlay() {
    // ── Bot: reproduz áudio real ──────────────────────────────────
    if (audioSrc && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setPlaying(true);
      }
      return;
    }

    // ── Usuário: simula progresso ─────────────────────────────────
    if (playing) {
      clearInterval(intervalRef.current!);
      setPlaying(false);
      return;
    }
    setPlaying(true);
    const totalSteps = realDuration * 10;
    let step = Math.floor(progress * totalSteps);
    intervalRef.current = setInterval(() => {
      step++;
      setProgress(step / totalSteps);
      if (step >= totalSteps) {
        clearInterval(intervalRef.current!);
        setPlaying(false);
        setProgress(0);
      }
    }, 100);
  }

  useEffect(() => () => clearInterval(intervalRef.current!), []);

  const elapsed = progress * realDuration;
  const displayed = playing || progress > 0 ? elapsed : realDuration;

  // Avatar: foto do Thiago para o bot, círculo verde escuro vazio para o usuário
  const Avatar = () =>
    role === "bot" ? (
      <div className="wa-audio-avatar bot-avatar">
        <img src={FOTOS[0]} alt="Thiago" />
      </div>
    ) : (
      <div className="wa-audio-avatar user-avatar">
        <img src={FOTO_USUARIO} alt="Você" />
      </div>
    );

  return (
    <div className={`wa-audio-bubble-row ${role}`}>
      <div className={`wa-audio-bubble ${role}`}>
        <Avatar />

        <button className="wa-audio-play-btn" onClick={togglePlay}>
          {playing ? <IconPause /> : <IconPlay />}
        </button>

        <div className="wa-audio-wave">
          {waveHeights.map((h, i) => {
            const barProgress = i / waveHeights.length;
            const active = barProgress <= progress;
            return (
              <div
                key={i}
                className={`wa-audio-bar ${active ? "active" : ""}`}
                style={{ height: `${h}px` }}
              />
            );
          })}
        </div>

        <span className="wa-audio-duration">{formatDuration(displayed)}</span>

        <div className="wa-audio-meta">
          <span className="wa-timestamp">{time}</span>
          {role === "user" && <IconDone />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App principal
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Oi! Sou o Thiago 2.0, um clone digital, como posso ajudar?",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [fotoAberta, setFotoAberta] = useState<string | null>(null);
  const [modoOffline, setModoOffline] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  // ── Painéis flutuantes ──
  const [showEmojiPanel, setShowEmojiPanel]   = useState(false);
  const [showAttachPanel, setShowAttachPanel] = useState(false);
  const [showMenuPanel, setShowMenuPanel]     = useState(false);

  // ── Estados da chamada de vídeo ──
  const [callState, setCallState] = useState<CallState>("idle");
  const [callSeconds, setCallSeconds] = useState(0);
  const [callVideo, setCallVideo] = useState<string>("");
  const [callVideoIndex, setCallVideoIndex] = useState(-1);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callRingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ringAudioRef = useRef<HTMLAudioElement | null>(null);

  // ── Estados de gravação fake ──
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [waveValues, setWaveValues] = useState<number[]>(Array(20).fill(4));
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const waveAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordingStartRef = useRef<number>(0);

  const micBtnRef = useRef<HTMLButtonElement>(null);

  // Registra o touchstart com passive:false para poder usar preventDefault
  useEffect(() => {
    const btn = micBtnRef.current;
    if (!btn) return;
    const handler = (e: TouchEvent) => {
      e.preventDefault();
      startRecording();
    };
    btn.addEventListener("touchstart", handler, { passive: false });
    return () => btn.removeEventListener("touchstart", handler);
  }, []);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function iniciarChamada() {
    const nextIndex = (callVideoIndex + 1) % VIDEOS_CHAMADA.length;
    setCallVideoIndex(nextIndex);
    setCallVideo(VIDEOS_CHAMADA[nextIndex]);
    setCallState("ringing");
    setCallSeconds(0);

    // Som de ring — usa a API de oscilador do browser para não precisar de arquivo
    try {
      const ctx = new AudioContext();
      const makeRing = () => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 480;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.6);
      };
      makeRing();
      const ringInterval = setInterval(makeRing, 3000);
      (ringAudioRef as any).current = { stop: () => { clearInterval(ringInterval); ctx.close(); } };
    } catch {}

    // Após 3–7s aleatórios, "atende"
    const delay = 3000 + Math.random() * 4000;
    callRingTimerRef.current = setTimeout(() => {
      if (ringAudioRef.current) (ringAudioRef.current as any).stop();
      setCallState("connected");
      callTimerRef.current = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    }, delay);
  }

  function encerrarChamada() {
    clearTimeout(callRingTimerRef.current!);
    clearInterval(callTimerRef.current!);
    if (ringAudioRef.current) (ringAudioRef.current as any).stop();
    setCallState("ended");
    setTimeout(() => {
      setCallState("idle");
      setCallSeconds(0);
      setCallVideo("");
    }, 1500);
  }

  function formatCallTimer(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  function startRecording() {
    setRecording(true);
    setRecordingSeconds(0);
    recordingStartRef.current = Date.now();

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);

    waveAnimRef.current = setInterval(() => {
      setWaveValues(Array.from({ length: 20 }, () => Math.floor(Math.random() * 22) + 3));
    }, 120);
  }

  function stopAndSendAudio() {
    if (!recording) return;
    clearInterval(recordingTimerRef.current!);
    clearInterval(waveAnimRef.current!);
    setRecording(false);

    const duration = Math.max(1, Math.round((Date.now() - recordingStartRef.current) / 1000));
    setRecordingSeconds(0);
    setWaveValues(Array(20).fill(4));

    // Bolha de áudio do usuário (sem src — é o "fake")
    const audioMsg: Message = {
      role: "user",
      text: "[áudio]",
      time: getTime(),
      isAudio: true,
      audioDuration: duration,
    };
    setMessages((prev) => [...prev, audioMsg]);

    // Bot responde com um dos 8 áudios reais gravados por você
    setLoading(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * AUDIOS_BOT.length);
      const botMsg: Message = {
        role: "bot",
        text: "[áudio]",
        time: getTime(),
        isAudio: true,
        audioSrc: AUDIOS_BOT[idx],
        audioDuration: DURACAO_AUDIOS_BOT[idx],
      };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 800 + Math.random() * 600);
  }

  function cancelRecording() {
    clearInterval(recordingTimerRef.current!);
    clearInterval(waveAnimRef.current!);
    setRecording(false);
    setRecordingSeconds(0);
    setWaveValues(Array(20).fill(4));
  }

  function formatTimer(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Filtra áudios do histórico — a IA não vê
    const historyToSend = messages
      .filter((m) => !m.isAudio)
      .map((msg) => ({
        role: msg.role === "bot" ? "model" : "user",
        text: msg.text,
      }));

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: historyToSend }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro");
      setModoOffline(false);
      setMessages((prev) => [...prev, { role: "bot", text: data.response, time: getTime() }]);
    } catch {
      setModoOffline(true);
      const resposta = respostaModoOffline(text);
      setMessages((prev) => [...prev, { role: "bot", text: resposta, time: getTime() }]);
    }
    setLoading(false);
  }

  // ── Tela de bloqueio: exibida antes de tudo ──
  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  if (showGames) return <GameHub onBack={() => setShowGames(false)} />;

  return (
    <>

      <div className="wa-app">

        {/* ── HEADER ── */}
        <header className="wa-header">
          <div className="wa-header-left" onClick={() => setShowProfile(true)}>
            <div className="wa-avatar"><img src={FOTOS[0]} alt="Thiago" /></div>
            <div className="wa-header-info">
              <span className="wa-header-name">Thiago 2.0</span>
              <span className={`wa-header-status ${loading ? "typing" : ""}`}>
                {loading ? "digitando..." : <><span className="wa-status-dot" />{modoOffline ? "preguiça agora" : "online agora"}</>}
              </span>
            </div>
          </div>
          <div className="wa-header-actions">
            <button className="wa-icon-btn" title="Chamada de vídeo" onClick={() => iniciarChamada()}><IconVideoCall /></button>
            <button className="wa-icon-btn" title="Jogos" onClick={() => setShowGames(true)}><IconGamepad /></button>
            <button className="wa-icon-btn" title="Menu" onClick={() => { setShowMenuPanel(p => !p); setShowEmojiPanel(false); setShowAttachPanel(false); }}><IconMore /></button>
          </div>
        </header>

        {modoOffline && (
          <div className="wa-banner">
            <span className="wa-banner-dot" />
            Internet Lenta
          </div>
        )}

        {/* ── CHAT ── */}
        <main className="wa-chat">
          <div className="wa-date-chip">Hoje</div>

          {messages.map((msg, i) =>
            msg.isAudio ? (
              <AudioBubble
                key={i}
                role={msg.role}
                duration={msg.audioDuration ?? 1}
                time={msg.time}
                audioSrc={msg.audioSrc}
              />
            ) : (
              <div key={i} className={`wa-bubble-row ${msg.role}`}>
                <div className={`wa-bubble ${msg.role}`}>
                  <span className="wa-bubble-text">{msg.text}</span>
                  <div className="wa-bubble-meta">
                    <span className="wa-timestamp">{msg.time}</span>
                    {msg.role === "user" && <IconDone />}
                  </div>
                </div>
              </div>
            )
          )}

          {loading && (
            <div className="wa-bubble-row bot">
              <div className="wa-bubble bot">
                <div className="wa-typing">
                  <div className="wa-dot" /><div className="wa-dot" /><div className="wa-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </main>

        {/* ── INPUT BAR ── */}
        <footer className="wa-inputbar">
          {recording ? (
            <>
              <button className="wa-rec-cancel" onClick={cancelRecording} title="Cancelar">
                <IconTrash />
              </button>
              <div className="wa-recording-bar">
                <span className="wa-rec-dot" />
                <span className="wa-rec-timer">{formatTimer(recordingSeconds)}</span>
                <div className="wa-rec-wave">
                  {waveValues.map((h, i) => (
                    <div key={i} className="wa-rec-bar" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>
              <button
                className="wa-send-btn recording"
                onMouseUp={stopAndSendAudio}
                onTouchEnd={stopAndSendAudio}
                title="Enviar áudio"
              >
                <IconSend />
              </button>
            </>
          ) : (
            <>
              <div className={`wa-input-wrapper ${inputFocused ? "focused" : ""}`}>
                <button className="wa-emoji-btn" tabIndex={-1} onClick={() => { setShowEmojiPanel(p => !p); setShowAttachPanel(false); setShowMenuPanel(false); }}><IconEmoji /></button>
                <input
                  ref={inputRef}
                  className="wa-text-input"
                  placeholder="Mensagem"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  disabled={loading}
                />
                {!input.trim() && (
                  <button className="wa-attach-btn" tabIndex={-1} onClick={() => { setShowAttachPanel(p => !p); setShowEmojiPanel(false); setShowMenuPanel(false); }}><IconAttach /></button>
                )}
              </div>
              {input.trim() ? (
                <button className="wa-send-btn" onClick={() => sendMessage(input)} disabled={loading}>
                  <IconSend />
                </button>
              ) : (
                <button
                  ref={micBtnRef}
                  className="wa-send-btn mic"
                  disabled={loading}
                  onMouseDown={startRecording}
                  title="Segurar para gravar"
                >
                  <IconMic />
                </button>
              )}
            </>
          )}
        </footer>

        {/* ── PERFIL ── */}
        {showProfile && (
          <div className="wa-profile">
            <div className="wa-profile-header">
              <button className="wa-icon-btn" onClick={() => setShowProfile(false)}><IconBack /></button>
              <span className="wa-profile-title">Informações do contato</span>
              <button className="wa-icon-btn" title="Jogos" onClick={() => { setShowProfile(false); setShowGames(true); }}><IconGamepad /></button>
            </div>
            <div className="wa-profile-body">
              <div className="wa-profile-cover">
                <div className="wa-profile-avatar" onClick={() => setFotoAberta(FOTOS[0])}>
                  <img src={FOTOS[0]} alt="Thiago avatar" />
                  <div className="wa-profile-avatar-overlay"><IconCamera /></div>
                </div>
                <div className="wa-profile-name">Thiago 2.0</div>
                <div className="wa-profile-sub">Clone Digital</div>
              </div>
              <div className="wa-profile-section">
                <div className="wa-profile-section-label">Sobre</div>
                <div className="wa-profile-section-value">Dev por profissão, Hamburguer por paixão, da Isabela por escolha</div>
                <div className="wa-profile-section-hint">Descrição</div>
              </div>
              <div className="wa-profile-section">
                <div className="wa-profile-section-label">Jogos</div>
                <div className="wa-profile-action" onClick={() => { setShowProfile(false); setShowGames(true); }}>
                  <div className="wa-profile-action-icon"><IconGamepad /></div>
                  <span className="wa-profile-action-text">Jogar com o Thiago 2.0</span>
                </div>
              </div>
              <div className="wa-profile-section" style={{ paddingBottom: 10 }}>
                <div className="wa-profile-section-label">Mídia, links e docs</div>
              </div>
              <div className="wa-fotos-grid">
                {FOTOS.map((foto, i) => (
                  <div key={i} className="wa-foto-item" onClick={() => setFotoAberta(foto)}>
                    <img src={foto} alt={`foto ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        

        {/* ── LIGHTBOX ── */}
        {fotoAberta && (
          <div className="wa-lightbox" onClick={() => setFotoAberta(null)}>
            <button className="wa-lightbox-close" onClick={(e) => { e.stopPropagation(); setFotoAberta(null); }}>✕</button>
            <button className="wa-lightbox-nav prev" onClick={(e) => { e.stopPropagation(); const idx = FOTOS.indexOf(fotoAberta); setFotoAberta(FOTOS[(idx - 1 + FOTOS.length) % FOTOS.length]); }}>‹</button>
            <img className="wa-lightbox-img" src={fotoAberta} alt="foto ampliada" onClick={(e) => e.stopPropagation()} />
            <button className="wa-lightbox-nav next" onClick={(e) => { e.stopPropagation(); const idx = FOTOS.indexOf(fotoAberta); setFotoAberta(FOTOS[(idx + 1) % FOTOS.length]); }}>›</button>
            <div className="wa-lightbox-counter">{FOTOS.indexOf(fotoAberta) + 1} / {FOTOS.length}</div>
          </div>
        )}


        {/* ── BACKDROP — fecha painéis ao clicar fora ── */}
        {(showEmojiPanel || showAttachPanel || showMenuPanel) && (
          <div
            className="wa-panel-backdrop"
            onClick={() => { setShowEmojiPanel(false); setShowAttachPanel(false); setShowMenuPanel(false); }}
          />
        )}

        {/* ── PAINEL DE EMOJI ── */}
          {showEmojiPanel && (
            <EmojiPanel
              onSelect={(emoji) => {
                setInput(prev => prev + emoji);
                inputRef.current?.focus();
              }}
            />
          )}

          {/* ── PAINEL DE ANEXO ── */}
          {showAttachPanel && (
            <AttachPanel onClose={() => setShowAttachPanel(false)} />
          )}

          {/* ── MENU ⋮ ── */}
          {showMenuPanel && (
            <MenuPanel onClose={() => setShowMenuPanel(false)} />
          )}

        {/* ── CHAMADA DE VÍDEO ── */}
        {callState !== "idle" && (
          <div className={`wa-call-overlay ${callState}`}>

            {/* Vídeo de fundo (só quando conectado) */}
            {callState === "connected" && callVideo && (
              <>
                <video
                  className="wa-call-video"
                  src={callVideo}
                  autoPlay
                  playsInline
                  onEnded={encerrarChamada}
                />
                <div className="wa-call-video-gradient" />
                {/* Mini preview "câmera do usuário" — canto superior direito */}
                <div className="wa-call-self-preview">
                  <img src={FOTO_USUARIO} alt="Você" />
                </div>
              </>
            )}

            {/* Ondas de pulso ao redor do avatar (só durante ring) */}
            {callState === "ringing" && (
              <div className="wa-call-rings">
                <div className="wa-call-ring" />
                <div className="wa-call-ring" />
                <div className="wa-call-ring" />
              </div>
            )}

            {/* Conteúdo central */}
            <div className="wa-call-content">
              {(callState === "ringing" || callState === "ended") && (
                <div className="wa-call-avatar">
                  <img src={FOTOS[0]} alt="Thiago" />
                </div>
              )}
              <div className="wa-call-name">Thiago 2.0</div>
              <div className="wa-call-status">
                {callState === "ringing" && (
                  <>Chamada de vídeo<span className="wa-call-dots" /></>
                )}
                {callState === "connected" && formatCallTimer(callSeconds)}
                {callState === "ended" && "Chamada encerrada"}
              </div>
            </div>

            {/* Botões */}
            {(callState === "ringing" || callState === "connected") && (
              <div className="wa-call-actions">
                {callState === "connected" && (
                  <div className="wa-call-btn-wrap">
                    <button className="wa-call-btn mute"><IconMicOff /></button>
                    <span className="wa-call-btn-label">Mudo</span>
                  </div>
                )}
                <div className="wa-call-btn-wrap">
                  <button className="wa-call-btn end" onClick={encerrarChamada}>
                    <IconEndCall />
                  </button>
                  <span className="wa-call-btn-label">
                    {callState === "ringing" ? "Cancelar" : "Encerrar"}
                  </span>
                </div>
                {callState === "connected" && (
                  <div className="wa-call-btn-wrap">
                    <button className="wa-call-btn flip"><IconFlipCamera /></button>
                    <span className="wa-call-btn-label">Virar</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </>
  );
}
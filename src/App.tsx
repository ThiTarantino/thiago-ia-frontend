import { useState, useRef, useEffect } from "react";
import GameHub from "./GameHub.tsx";
import { respostaModoOffline } from "./respostas";

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
// DADOS DOS PAINÉIS
// ─────────────────────────────────────────────────────────────────────────────
const EMOJI_TABS = [
  { icon: "🕐", label: "Recentes" },
  { icon: "😀", label: "Smileys" },
  { icon: "🐶", label: "Animais" },
  { icon: "🍕", label: "Comida" },
  { icon: "⚽", label: "Atividades" },
  { icon: "✈️", label: "Viagens" },
  { icon: "💡", label: "Objetos" },
  { icon: "❤️", label: "Símbolos" },
];

const EMOJIS_POR_CATEGORIA: string[][] = [
  // Recentes
  ["😂","❤️","🥰","😍","😭","🙏","😘","🥺","😊","🔥","💯","🎉","💚","🤣","✨","😅","🤔","😎","🥳","💕"],
  // Smileys
  ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺️","😚",
   "😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄",
   "😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥸",
   "😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱",
   "😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻"],
  // Animais
  ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧",
   "🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷️","🦂",
   "🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆"],
  // Comida
  ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦",
   "🥬","🥒","🌶️","🌽","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇",
   "🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🥘","🫕","🍝","🍜"],
  // Atividades
  ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🏓","🏸","🏒","🥅","⛳","🎿","🛷","🥌","🎯","🎱",
   "🎮","🕹️","🎰","🎲","🧩","♟️","🎭","🎨","🖼️","🎪","🎤","🎧","🎼","🎵","🎶","🎸","🎹","🥁","🎷","🎺"],
  // Viagens
  ["🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍️","🛵","🛺","🚲","🛴","🛹",
   "🚁","🛸","✈️","🛩️","🚀","🛶","⛵","🚤","🛥️","🛳️","⛴️","🚢","⚓","🚉","🚊","🚝","🚞","🚋","🚃","🚂",
   "🗺️","🧭","🏔️","⛰️","🌋","🗻","🏕️","🏖️","🏜️","🏝️","🏟️","🏛️","🏗️","🧱","🏘️","🏚️","🏠","🏡","🏢","🏣"],
  // Objetos
  ["⌚","📱","📲","💻","⌨️","🖥️","🖨️","🖱️","🖲️","💽","💾","💿","📀","📷","📸","📹","🎥","📽️","🎞️","📞",
   "☎️","📟","📠","📺","📻","🧭","⏱️","⏲️","⏰","🕰️","⌛","⏳","📡","🔋","🔌","💡","🔦","🕯️","🪔","🧯",
   "🛢️","💰","💵","💴","💶","💷","💸","💳","🪙","💹","📈","📉","📊","📋","🗒️","🗓️","📆","📅","📇","📁"],
  // Símbolos
  ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️",
   "✝️","☪️","🕉️","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐",
   "✨","⭐","🌟","💫","⚡","☄️","💥","🔥","🌈","☀️","🌤️","⛅","🌦️","🌧️","⛈️","🌩️","🌨️","❄️","☃️","⛄"],
];

const ATTACH_OPCOES = [
  { icon: "📄", label: "Documento",  cor: "#5b6af0" },
  { icon: "📷", label: "Câmera",     cor: "#ff6b6b" },
  { icon: "🖼️", label: "Galeria",    cor: "#f7b731" },
  { icon: "🎵", label: "Áudio",      cor: "#a55eea" },
  { icon: "📍", label: "Localização",cor: "#20bf6b" },
  { icon: "👤", label: "Contato",    cor: "#0fb9b1" },
];

const MENU_OPCOES = [
  { label: "Novo grupo" },
  { label: "Dispositivos conectados" },
  { label: "Mensagens favoritas" },
  { label: "Limpar conversa" },
  { label: "Silenciar notificações" },
  { label: "Denunciar" },
];

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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Oi! Sou o Thiago 2.0 — o original, mas melhorado. Pode falar! 🤖",
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
  const [emojiSearch, setEmojiSearch]         = useState("");
  const [emojiTab, setEmojiTab]               = useState(0);

  // ── Estados da chamada de vídeo ──
  const [callState, setCallState] = useState<CallState>("idle");
  const [callSeconds, setCallSeconds] = useState(0);
  const [callVideo, setCallVideo] = useState<string>("");
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
    const videoSorteado = VIDEOS_CHAMADA[Math.floor(Math.random() * VIDEOS_CHAMADA.length)];
    setCallVideo(videoSorteado);
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

  if (showGames) return <GameHub onBack={() => setShowGames(false)} />;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        html, body { width: 100%; height: 100%; font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif; background: #111b21; overscroll-behavior: none; overflow: hidden; -webkit-text-size-adjust: 100%; }
        #root { width: 100%; height: 100%; }

        .wa-app { position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh; max-width: 100vw; display: flex; flex-direction: column; background: #111b21; overflow: hidden; }

        /* ── HEADER ── */
        .wa-header { display: flex; align-items: center; gap: 10px; padding: 0 6px 0 4px; background: #1f2c34; height: 58px; min-height: 58px; box-shadow: 0 1px 0 rgba(0,0,0,.3); position: relative; z-index: 10; flex-shrink: 0; }
        .wa-header-left { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; cursor: pointer; padding: 8px 4px; border-radius: 8px; transition: background 0.15s; -webkit-tap-highlight-color: transparent; }
        .wa-header-left:active { background: rgba(255,255,255,.06); }
        .wa-avatar { width: 40px; height: 40px; min-width: 40px; border-radius: 50%; overflow: hidden; background: #2a3942; position: relative; flex-shrink: 0; }
        .wa-avatar::after { content: ''; position: absolute; inset: 0; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
        .wa-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .wa-header-info { flex: 1; min-width: 0; }
        .wa-header-name { font-size: 15.5px; font-weight: 600; color: #e9edef; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.1px; }
        .wa-header-status { font-size: 13px; color: #8696a0; display: flex; align-items: center; gap: 4px; transition: color 0.3s; white-space: nowrap; overflow: hidden; }
        .wa-header-status.typing { color: #00a884; }
        .wa-status-dot { width: 7px; height: 7px; min-width: 7px; border-radius: 50%; background: #00a884; display: inline-block; flex-shrink: 0; animation: statusPulse 2.5s ease-in-out infinite; }
        @keyframes statusPulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(.85)} }
        .wa-header-actions { display: flex; align-items: center; flex-shrink: 0; }
        .wa-icon-btn { background: none; border: none; color: #aebac1; cursor: pointer; padding: 10px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.15s, color 0.15s; -webkit-tap-highlight-color: transparent; flex-shrink: 0; }
        .wa-icon-btn:hover { background: rgba(255,255,255,.07); color: #e9edef; }
        .wa-icon-btn:active { background: rgba(255,255,255,.12); }

        /* ── BANNER ── */
        .wa-banner { background: #2a2a1e; border-bottom: 1px solid rgba(245,158,11,.2); padding: 7px 16px; display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #d4a017; animation: slideDown 0.25s ease; flex-shrink: 0; }
        @keyframes slideDown { from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1} }
        .wa-banner-dot { width: 6px; height: 6px; min-width: 6px; border-radius: 50%; background: #f59e0b; flex-shrink: 0; animation: statusPulse 1.5s ease-in-out infinite; }

        /* ── CHAT ── */
        .wa-chat { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px 3% 10px; display: flex; flex-direction: column; gap: 3px; background-color: #0b141a; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.022'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); -webkit-overflow-scrolling: touch; }
        .wa-chat::-webkit-scrollbar { width: 5px; }
        .wa-chat::-webkit-scrollbar-track { background: transparent; }
        .wa-chat::-webkit-scrollbar-thumb { background: #2a3942; border-radius: 3px; }

        /* ── DATE CHIP ── */
        .wa-date-chip { align-self: center; background: #182229; color: #8696a0; font-size: 12px; font-weight: 500; padding: 5px 12px; border-radius: 8px; margin: 8px 0 6px; letter-spacing: 0.3px; box-shadow: 0 1px 3px rgba(0,0,0,.3); flex-shrink: 0; }

        /* ── TEXTO BUBBLE ── */
        .wa-bubble-row { display: flex; width: 100%; animation: msgIn 0.22s cubic-bezier(.2,.6,.3,1) both; flex-shrink: 0; }
        .wa-bubble-row.user { justify-content: flex-end; }
        .wa-bubble-row.bot  { justify-content: flex-start; }
        @keyframes msgIn { from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)} }
        .wa-bubble { max-width: min(78%,480px); min-width: 72px; padding: 6px 7px 8px 9px; border-radius: 7.5px; font-size: 14.5px; line-height: 1.5; position: relative; word-break: break-word; overflow-wrap: break-word; }
        .wa-bubble.bot { background: #202c33; color: #e9edef; border-top-left-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,.25); }
        .wa-bubble.bot::before { content:''; position:absolute; top:0; left:-8px; width:0; height:0; border-style:solid; border-width:0 8px 8px 0; border-color:transparent #202c33 transparent transparent; }
        .wa-bubble.user { background: #005c4b; color: #e9edef; border-top-right-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,.25); }
        .wa-bubble.user::before { content:''; position:absolute; top:0; right:-8px; width:0; height:0; border-style:solid; border-width:0 0 8px 8px; border-color:transparent transparent transparent #005c4b; }
        .wa-bubble-text { display: block; padding-right: 54px; letter-spacing: 0.01em; }
        .wa-bubble-meta { display: flex; align-items: center; justify-content: flex-end; gap: 3px; float: right; margin-left: 8px; margin-top: -4px; position: relative; bottom: -2px; }
        .wa-timestamp { font-size: 11px; color: rgba(134,150,160,.9); white-space: nowrap; letter-spacing: 0.2px; }

        /* ── ÁUDIO BUBBLE ── */
        .wa-audio-bubble-row { display: flex; width: 100%; flex-shrink: 0; animation: msgIn 0.22s cubic-bezier(.2,.6,.3,1) both; }
        .wa-audio-bubble-row.user { justify-content: flex-end; }
        .wa-audio-bubble-row.bot  { justify-content: flex-start; }

        .wa-audio-bubble {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px 24px 8px;
          border-radius: 7.5px;
          position: relative;
          min-width: 200px;
          max-width: min(78%, 320px);
          box-shadow: 0 1px 2px rgba(0,0,0,.25);
        }
        .wa-audio-bubble.bot { background: #202c33; border-top-left-radius: 2px; }
        .wa-audio-bubble.bot::before { content:''; position:absolute; top:0; left:-8px; width:0; height:0; border-style:solid; border-width:0 8px 8px 0; border-color:transparent #202c33 transparent transparent; }
        .wa-audio-bubble.user { background: #005c4b; border-top-right-radius: 2px; }
        .wa-audio-bubble.user::before { content:''; position:absolute; top:0; right:-8px; width:0; height:0; border-style:solid; border-width:0 0 8px 8px; border-color:transparent transparent transparent #005c4b; }

        /* Avatar na bolha de áudio */
        .wa-audio-avatar { width: 38px; height: 38px; min-width: 38px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
        .wa-audio-avatar.bot-avatar { background: #2a3942; }
        .wa-audio-avatar.bot-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        /* Usuário: só um círculo verde escuro, sem ícone, igual ao WhatsApp */
        .wa-audio-avatar.user-avatar { background: #005040; }
        .wa-audio-avatar.user-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* Play button */
        .wa-audio-play-btn { width: 34px; height: 34px; min-width: 34px; border-radius: 50%; border: none; background: #00a884; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s, transform 0.1s; flex-shrink: 0; padding-left: 2px; }
        .wa-audio-play-btn:hover { background: #06c9a0; }
        .wa-audio-play-btn:active { transform: scale(0.92); }

        /* Onda */
        .wa-audio-wave { flex: 1; display: flex; align-items: center; gap: 2px; height: 26px; overflow: hidden; }
        .wa-audio-bar { width: 3px; border-radius: 2px; background: rgba(255,255,255,.25); transition: background 0.15s; flex-shrink: 0; }
        .wa-audio-bar.active { background: #00a884; }
        .wa-audio-bubble.user .wa-audio-bar { background: rgba(255,255,255,.35); }
        .wa-audio-bubble.user .wa-audio-bar.active { background: #fff; }

        /* Duração */
        .wa-audio-duration { font-size: 11.5px; color: rgba(134,150,160,.9); white-space: nowrap; min-width: 30px; text-align: right; }
        .wa-audio-bubble.user .wa-audio-duration { color: rgba(255,255,255,.7); }

        /* Meta (hora+tick) */
        .wa-audio-meta { position: absolute; bottom: 5px; right: 10px; display: flex; align-items: center; gap: 3px; }

        /* ── TYPING ── */
        .wa-typing { display: flex; align-items: flex-end; gap: 3px; padding: 10px 14px 12px; min-width: 52px; }
        .wa-dot { width: 7px; height: 7px; border-radius: 50%; background: #8696a0; animation: dotBounce 1.4s ease-in-out infinite; }
        .wa-dot:nth-child(2){animation-delay:.16s} .wa-dot:nth-child(3){animation-delay:.32s}
        @keyframes dotBounce { 0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1} }

        /* ── INPUT BAR ── */
        .wa-inputbar { display: flex; align-items: center; gap: 8px; padding: 7px 10px; background: #1f2c34; position: relative; z-index: 10; flex-shrink: 0; padding-bottom: max(7px, env(safe-area-inset-bottom, 0px)); }
        .wa-input-wrapper { flex: 1; min-width: 0; display: flex; align-items: center; background: #2a3942; border-radius: 24px; padding: 0 6px 0 14px; gap: 4px; transition: box-shadow 0.2s; min-height: 44px; }
        .wa-input-wrapper.focused { box-shadow: 0 0 0 1.5px rgba(0,168,132,.35); }
        .wa-emoji-btn { background: none; border: none; color: #8696a0; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%; transition: color 0.15s; flex-shrink: 0; }
        .wa-emoji-btn:hover { color: #aebac1; }
        .wa-text-input { flex: 1; min-width: 0; background: none; border: none; color: #e9edef; font-size: 15px; outline: none; font-family: inherit; padding: 10px 0; line-height: 1.4; caret-color: #00a884; }
        .wa-text-input::placeholder { color: #8696a0; }
        .wa-attach-btn { background: none; border: none; color: #8696a0; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%; transition: color 0.15s; flex-shrink: 0; }
        .wa-attach-btn:hover { color: #aebac1; }
        .wa-send-btn { width: 46px; height: 46px; min-width: 46px; border-radius: 50%; border: none; background: #00a884; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s, transform 0.12s; box-shadow: 0 2px 6px rgba(0,168,132,.35); flex-shrink: 0; }
        .wa-send-btn:hover { background: #06c9a0; }
        .wa-send-btn:active { transform: scale(0.92); }
        .wa-send-btn:disabled { background: #2a3942; box-shadow: none; cursor: not-allowed; }
        .wa-send-btn:disabled svg { opacity: 0.45; }
        .wa-send-btn.mic { background: transparent; color: #8696a0; box-shadow: none; }
        .wa-send-btn.mic:hover { color: #aebac1; background: rgba(255,255,255,.06); }

        /* ── RECORDING BAR ── */
        .wa-recording-bar { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; background: #2a3942; border-radius: 24px; padding: 0 14px; min-height: 44px; animation: fadeInBar 0.18s ease; }
        @keyframes fadeInBar { from{opacity:0;transform:scaleX(.95)}to{opacity:1;transform:scaleX(1)} }
        .wa-rec-dot { width: 10px; height: 10px; min-width: 10px; border-radius: 50%; background: #ef4444; animation: recPulse 0.9s ease-in-out infinite; flex-shrink: 0; }
        @keyframes recPulse { 0%,100%{opacity:1;transform:scale(1);box-shadow:0 0 0 0 rgba(239,68,68,.5)}50%{opacity:.75;transform:scale(.88);box-shadow:0 0 0 5px rgba(239,68,68,0)} }
        .wa-rec-timer { font-size: 14px; color: #ef4444; font-variant-numeric: tabular-nums; min-width: 34px; font-weight: 500; flex-shrink: 0; }
        .wa-rec-wave { flex: 1; display: flex; align-items: center; gap: 2px; height: 28px; overflow: hidden; }
        .wa-rec-bar { width: 3px; border-radius: 2px; background: #00a884; transition: height 0.09s ease; flex-shrink: 0; }
        .wa-rec-cancel { background: none; border: none; color: #8696a0; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 6px; border-radius: 50%; transition: color 0.15s, background 0.15s; flex-shrink: 0; }
        .wa-rec-cancel:hover { color: #ef4444; background: rgba(239,68,68,.12); }
        .wa-send-btn.recording { background: #00a884; box-shadow: 0 2px 10px rgba(0,168,132,.5); animation: sendPulse 1.2s ease-in-out infinite; }
        @keyframes sendPulse { 0%,100%{box-shadow:0 2px 10px rgba(0,168,132,.5)}50%{box-shadow:0 2px 18px rgba(0,168,132,.85)} }

        /* ── PROFILE ── */
        .wa-profile { position: absolute; inset: 0; background: #111b21; z-index: 100; display: flex; flex-direction: column; animation: slideInRight 0.28s cubic-bezier(.3,.7,.3,1) both; overflow: hidden; }
        @keyframes slideInRight { from{transform:translateX(100%)}to{transform:translateX(0)} }
        .wa-profile-header { display: flex; align-items: center; gap: 14px; padding: 0 8px 0 2px; background: #1f2c34; height: 58px; min-height: 58px; box-shadow: 0 1px 0 rgba(0,0,0,.3); flex-shrink: 0; }
        .wa-profile-title { color: #e9edef; font-size: 16px; font-weight: 600; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .wa-profile-cover { background: linear-gradient(180deg,#1f2c34 0%,#111b21 100%); display: flex; flex-direction: column; align-items: center; padding: 28px 16px 22px; border-bottom: 1px solid #1f2c34; gap: 12px; flex-shrink: 0; }
        .wa-profile-avatar { width: 130px; height: 130px; border-radius: 50%; overflow: hidden; background: #2a3942; position: relative; box-shadow: 0 4px 20px rgba(0,0,0,.5); cursor: pointer; transition: transform 0.2s; flex-shrink: 0; }
        .wa-profile-avatar:hover { transform: scale(1.03); }
        .wa-profile-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .wa-profile-avatar-overlay { position: absolute; inset: 0; border-radius: 50%; background: rgba(0,0,0,.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
        .wa-profile-avatar:hover .wa-profile-avatar-overlay { opacity: 1; }
        .wa-profile-name { color: #e9edef; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; text-align: center; }
        .wa-profile-sub { color: #8696a0; font-size: 14px; margin-top: -6px; }
        .wa-profile-body { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; }
        .wa-profile-body::-webkit-scrollbar { width: 4px; }
        .wa-profile-body::-webkit-scrollbar-thumb { background: #2a3942; border-radius: 2px; }
        .wa-profile-section { padding: 14px 20px; border-bottom: 1px solid #1f2c34; }
        .wa-profile-section-label { color: #00a884; font-size: 12.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
        .wa-profile-section-value { color: #e9edef; font-size: 15px; line-height: 1.5; }
        .wa-profile-section-hint { color: #8696a0; font-size: 12px; margin-top: 3px; }
        .wa-profile-action { display: flex; align-items: center; gap: 14px; cursor: pointer; padding: 4px 0; border-radius: 6px; transition: background 0.15s; }
        .wa-profile-action:hover { background: rgba(255,255,255,.04); }
        .wa-profile-action-icon { width: 36px; height: 36px; border-radius: 50%; background: #00a88422; display: flex; align-items: center; justify-content: center; color: #00a884; flex-shrink: 0; }
        .wa-profile-action-text { color: #00a884; font-size: 15px; font-weight: 500; }
        .wa-fotos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .wa-foto-item { aspect-ratio: 1; overflow: hidden; cursor: pointer; background: #1f2c34; position: relative; }
        .wa-foto-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.25s; }
        .wa-foto-item:hover img { transform: scale(1.06); }
        .wa-foto-item::after { content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0); transition: background 0.2s; }
        .wa-foto-item:hover::after { background: rgba(0,0,0,.15); }

        /* ── LIGHTBOX ── */
        .wa-lightbox { position: fixed; inset: 0; background: rgba(0,0,0,.94); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; backdrop-filter: blur(8px); }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        .wa-lightbox-img { max-width: 92vw; max-height: 84vh; object-fit: contain; border-radius: 6px; box-shadow: 0 8px 40px rgba(0,0,0,.8); animation: zoomIn 0.2s cubic-bezier(.2,.8,.3,1); }
        @keyframes zoomIn { from{transform:scale(.92);opacity:0}to{transform:scale(1);opacity:1} }
        .wa-lightbox-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,.12); border: none; color: #fff; font-size: 18px; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
        .wa-lightbox-close:hover { background: rgba(255,255,255,.22); }
        .wa-lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,.1); border: none; color: #fff; font-size: 22px; width: 46px; height: 46px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.15s; backdrop-filter: blur(4px); }
        .wa-lightbox-nav:hover { background: rgba(255,255,255,.2); }
        .wa-lightbox-nav.prev { left: 14px; }
        .wa-lightbox-nav.next { right: 14px; }
        .wa-lightbox-counter { position: absolute; bottom: 18px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,.7); font-size: 13px; background: rgba(0,0,0,.4); padding: 3px 12px; border-radius: 20px; white-space: nowrap; }


        /* ── EMOJI PANEL ── */
        .wa-panel-backdrop { position: absolute; inset: 0; z-index: 50; }
        .wa-emoji-panel {
          position: absolute; bottom: 62px; left: 0; right: 0; z-index: 51;
          background: #1f2c34; border-top: 1px solid #2a3942;
          display: flex; flex-direction: column;
          height: 340px; animation: panelUp 0.22s cubic-bezier(.2,.8,.3,1);
        }
        @keyframes panelUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }

        .wa-emoji-search {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px 8px; flex-shrink: 0;
        }
        .wa-emoji-search input {
          flex: 1; background: #2a3942; border: none; border-radius: 20px;
          color: #e9edef; font-size: 14px; padding: 7px 14px; outline: none;
          caret-color: #00a884;
        }
        .wa-emoji-search input::placeholder { color: #8696a0; }

        .wa-emoji-tabs {
          display: flex; gap: 0; border-bottom: 1px solid #2a3942; flex-shrink: 0;
          overflow-x: auto; scrollbar-width: none;
        }
        .wa-emoji-tabs::-webkit-scrollbar { display: none; }
        .wa-emoji-tab {
          flex: 1; min-width: 40px; padding: 8px 4px; background: none; border: none;
          font-size: 18px; cursor: pointer; border-bottom: 2px solid transparent;
          transition: border-color 0.15s; display: flex; align-items: center; justify-content: center;
        }
        .wa-emoji-tab.active { border-bottom-color: #00a884; }

        .wa-emoji-grid {
          flex: 1; overflow-y: auto; padding: 8px 6px;
          display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px;
          scrollbar-width: thin; scrollbar-color: #2a3942 transparent;
        }
        .wa-emoji-grid::-webkit-scrollbar { width: 4px; }
        .wa-emoji-grid::-webkit-scrollbar-thumb { background: #2a3942; border-radius: 2px; }

        .wa-emoji-item {
          font-size: 24px; text-align: center; padding: 6px 2px;
          border-radius: 8px; cursor: pointer; transition: background 0.12s;
          border: none; background: none; line-height: 1;
          display: flex; align-items: center; justify-content: center;
        }
        .wa-emoji-item:hover { background: rgba(255,255,255,.08); }
        .wa-emoji-item:active { background: rgba(255,255,255,.14); transform: scale(0.9); }

        /* ── ATTACH PANEL ── */
        .wa-attach-panel {
          position: absolute; bottom: 62px; left: 0; right: 0; z-index: 51;
          background: #111b21; padding: 20px 16px 24px;
          animation: panelUp 0.22s cubic-bezier(.2,.8,.3,1);
          border-top: 1px solid #1f2c34;
        }
        .wa-attach-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px 8px;
        }
        .wa-attach-item {
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          cursor: pointer; -webkit-tap-highlight-color: transparent;
        }
        .wa-attach-item:active .wa-attach-icon { transform: scale(0.9); }
        .wa-attach-icon {
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; transition: transform 0.12s;
          box-shadow: 0 2px 8px rgba(0,0,0,.3);
        }
        .wa-attach-label { color: #e9edef; font-size: 12.5px; text-align: center; }

        /* ── MENU PANEL ── */
        .wa-menu-panel {
          position: absolute; top: 58px; right: 6px; z-index: 200;
          background: #233138; border-radius: 4px;
          min-width: 200px;
          box-shadow: 0 4px 20px rgba(0,0,0,.5);
          animation: menuFadeIn 0.15s ease;
          overflow: hidden;
        }
        @keyframes menuFadeIn { from{opacity:0;transform:scale(.95) translateY(-6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .wa-menu-item {
          display: block; width: 100%; padding: 14px 20px;
          background: none; border: none; color: #e9edef;
          font-size: 15px; text-align: left; cursor: pointer;
          transition: background 0.12s; white-space: nowrap;
        }
        .wa-menu-item:hover { background: rgba(255,255,255,.06); }
        .wa-menu-item:active { background: rgba(255,255,255,.1); }
        .wa-menu-item.danger { color: #ff6b6b; }

        /* ── VIDEO CALL ── */
        .wa-call-overlay {
          position: absolute;
          inset: 0;
          z-index: 300;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: callFadeIn 0.3s ease;
        }
        @keyframes callFadeIn { from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:scale(1)} }

        /* Fundo de chamada em espera — gradiente escuro igual WhatsApp */
        .wa-call-overlay.ringing {
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
        }
        /* Fundo quando conectado — o vídeo ocupa tudo */
        .wa-call-overlay.connected {
          background: #000;
        }
        .wa-call-overlay.ended {
          background: linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%);
          animation: callFadeOut 1.5s ease forwards;
        }
        @keyframes callFadeOut { 0%{opacity:1}80%{opacity:0.3}100%{opacity:0} }

        /* Vídeo de fundo (quando conectado) */
        .wa-call-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        /* Gradiente sobre o vídeo para legibilidade dos botões */
        .wa-call-video-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.55) 0%,
            transparent 35%,
            transparent 60%,
            rgba(0,0,0,0.75) 100%
          );
          z-index: 1;
        }

        /* Conteúdo da tela de chamada */
        .wa-call-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 60px 24px 0;
          gap: 14px;
        }

        /* Avatar grande durante ring */
        .wa-call-avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 0 0 4px rgba(255,255,255,.15), 0 0 0 8px rgba(255,255,255,.07);
          animation: callAvatarPulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes callAvatarPulse {
          0%,100% { box-shadow: 0 0 0 4px rgba(255,255,255,.15), 0 0 0 8px rgba(255,255,255,.07); }
          50%      { box-shadow: 0 0 0 8px rgba(255,255,255,.2), 0 0 0 18px rgba(255,255,255,.06); }
        }
        .wa-call-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .wa-call-name {
          color: #fff;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.3px;
          text-align: center;
          text-shadow: 0 1px 4px rgba(0,0,0,.4);
        }

        .wa-call-status {
          color: rgba(255,255,255,.75);
          font-size: 15px;
          text-align: center;
          letter-spacing: 0.2px;
        }

        /* Pontinhos animados "Chamada de vídeo..." */
        .wa-call-dots::after {
          content: '';
          animation: callDots 1.4s steps(4, end) infinite;
        }
        @keyframes callDots {
          0%   { content: ''; }
          25%  { content: '.'; }
          50%  { content: '..'; }
          75%  { content: '...'; }
          100% { content: ''; }
        }

        /* Ondas de pulso ao redor do avatar (igual WhatsApp) */
        .wa-call-rings {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 110px;
          border-radius: 50%;
          pointer-events: none;
        }
        .wa-call-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,.18);
          animation: ringExpand 2s ease-out infinite;
        }
        .wa-call-ring:nth-child(2) { animation-delay: 0.66s; }
        .wa-call-ring:nth-child(3) { animation-delay: 1.32s; }
        @keyframes ringExpand {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }

        /* Barra de botões inferior */
        .wa-call-actions {
          position: absolute;
          bottom: max(40px, env(safe-area-inset-bottom, 40px));
          left: 0;
          right: 0;
          z-index: 3;
          display: flex;
          justify-content: center;
          gap: 40px;
          align-items: flex-end;
          padding: 0 24px;
        }

        .wa-call-btn-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .wa-call-btn-label {
          color: rgba(255,255,255,.8);
          font-size: 12px;
          letter-spacing: 0.2px;
          text-shadow: 0 1px 3px rgba(0,0,0,.5);
        }

        .wa-call-btn {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.12s, filter 0.15s;
          flex-shrink: 0;
        }
        .wa-call-btn:active { transform: scale(0.92); }

        .wa-call-btn.end {
          background: #ef4444;
          box-shadow: 0 4px 16px rgba(239,68,68,.5);
        }
        .wa-call-btn.end:hover { filter: brightness(1.1); }

        .wa-call-btn.mute {
          background: rgba(255,255,255,.18);
          backdrop-filter: blur(8px);
        }
        .wa-call-btn.flip {
          background: rgba(255,255,255,.18);
          backdrop-filter: blur(8px);
        }

        /* Mini preview "câmera de você" (canto superior direito, igual WA) */
        .wa-call-self-preview {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 80px;
          height: 110px;
          border-radius: 12px;
          background: #1a2a34;
          overflow: hidden;
          z-index: 4;
          box-shadow: 0 2px 12px rgba(0,0,0,.5);
          border: 1.5px solid rgba(255,255,255,.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wa-call-self-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* ── RESPONSIVO ── */
        @media (max-width: 340px) {
          .wa-header-name{font-size:13.5px} .wa-header-status{font-size:11px}
          .wa-icon-btn{padding:7px} .wa-send-btn{width:40px;height:40px;min-width:40px}
          .wa-bubble{font-size:13.5px;max-width:85%} .wa-profile-avatar{width:96px;height:96px}
          .wa-profile-name{font-size:18px} .wa-inputbar{gap:6px;padding:6px 8px}
        }
        @media (min-width:341px) and (max-width:390px) {
          .wa-header-name{font-size:14.5px} .wa-bubble{max-width:82%}
        }
        @media (min-width:900px) {
          body{background:#0b141a;display:flex;align-items:center;justify-content:center}
          .wa-app{position:relative;width:420px;max-width:420px;height:100dvh;box-shadow:0 0 60px rgba(0,0,0,.7)}
        }
      `}</style>

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
                <div className="wa-profile-section-value">Dev, otaku e apaixonado pela Isabela 💚</div>
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
                <div className="wa-profile-section-label">Fotos e vídeos</div>
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
          <div className="wa-emoji-panel">
            <div className="wa-emoji-search">
              <input
                placeholder="Pesquisar emoji"
                value={emojiSearch}
                onChange={e => { setEmojiSearch(e.target.value); setEmojiTab(0); }}
                autoFocus
              />
            </div>
            {!emojiSearch && (
              <div className="wa-emoji-tabs">
                {EMOJI_TABS.map((tab, i) => (
                  <button
                    key={i}
                    className={`wa-emoji-tab ${emojiTab === i ? "active" : ""}`}
                    onClick={() => setEmojiTab(i)}
                    title={tab.label}
                  >
                    {tab.icon}
                  </button>
                ))}
              </div>
            )}
            <div className="wa-emoji-grid">
              {(emojiSearch
                ? EMOJIS_POR_CATEGORIA.flat().filter(e =>
                    e.includes(emojiSearch) ||
                    e.codePointAt(0)?.toString(16).includes(emojiSearch.toLowerCase())
                  )
                : EMOJIS_POR_CATEGORIA[emojiTab]
              ).map((emoji, i) => (
                <button
                  key={i}
                  className="wa-emoji-item"
                  onClick={() => {
                    setInput(prev => prev + emoji);
                    inputRef.current?.focus();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PAINEL DE ANEXO ── */}
        {showAttachPanel && (
          <div className="wa-attach-panel">
            <div className="wa-attach-grid">
              {ATTACH_OPCOES.map((op, i) => (
                <div key={i} className="wa-attach-item" onClick={() => setShowAttachPanel(false)}>
                  <div className="wa-attach-icon" style={{ background: op.cor }}>
                    {op.icon}
                  </div>
                  <span className="wa-attach-label">{op.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MENU ⋮ ── */}
        {showMenuPanel && (
          <div className="wa-menu-panel">
            {MENU_OPCOES.map((op, i) => (
              <button
                key={i}
                className={`wa-menu-item${op.label === "Denunciar" ? " danger" : ""}`}
                onClick={() => setShowMenuPanel(false)}
              >
                {op.label}
              </button>
            ))}
          </div>
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
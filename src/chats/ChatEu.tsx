import { useState, useRef, useEffect } from "react";
import AttachPanel from "../components/AttachPanel";
import EmojiPanel  from "../components/EmojiPanel";
import MenuPanel   from "../components/MenuPanel";
import '../WhatsApp.css';
import { resolveCloudAssetSrc } from '../cloudAssets';

type Message = {
  role: "user";
  text: string;
  time: string;
};

function getTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const FOTO_USUARIO = resolveCloudAssetSrc("/imagens/foto_isabela.jpg");

// Ícones SVG iguais aos dos outros chats
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

export default function ChatEu({
  onBack,
  onUltimaMensagem,
}: {
  onBack: () => void;
  onUltimaMensagem?: (texto: string) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      text: "Mensagens para você mesmo 📝",
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  // Painéis flutuantes
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [showAttachPanel, setShowAttachPanel] = useState(false);
  const [showMenuPanel, setShowMenuPanel] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    onUltimaMensagem?.(text);
  }

  return (
    <div className="wa-app">
      {/* ── HEADER ── */}
      <header className="wa-header">
        <button className="wa-icon-btn" title="Voltar" onClick={onBack}>
          <IconBack />
        </button>
        <div className="wa-header-left">
          <div className="wa-avatar">
            <img src={FOTO_USUARIO} alt="Eu (Você)" />
          </div>
          <div className="wa-header-info">
            <span className="wa-header-name">Eu (Você)</span>
            <span className="wa-header-status">
              Mensagens para você mesmo
            </span>
          </div>
        </div>
        <div className="wa-header-actions">
          <button
            className="wa-icon-btn"
            title="Menu"
            onClick={() => {
              setShowMenuPanel((p) => !p);
              setShowEmojiPanel(false);
              setShowAttachPanel(false);
            }}
          >
            <IconMore />
          </button>
        </div>
      </header>
      

      {/* ── CHAT ── */}
      <main className="wa-chat">
        <div className="wa-date-chip">Hoje</div>

        {messages.map((msg, i) => (
          <div key={i} className="wa-bubble-row user">
            <div className="wa-bubble user">
              <span className="wa-bubble-text">{msg.text}</span>
              <div className="wa-bubble-meta">
                <span className="wa-timestamp">{msg.time}</span>
                <IconDone />
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </main>

      {/* ── INPUT BAR ── */}
      <footer className="wa-inputbar">
        <div className={`wa-input-wrapper ${inputFocused ? "focused" : ""}`}>
          <button
            className="wa-emoji-btn"
            tabIndex={-1}
            onClick={() => {
              setShowEmojiPanel((p) => !p);
              setShowAttachPanel(false);
              setShowMenuPanel(false);
            }}
          >
            <IconEmoji />
          </button>
          <input
            ref={inputRef}
            className="wa-text-input"
            placeholder="Mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          {!input.trim() && (
            <button
              className="wa-attach-btn"
              tabIndex={-1}
              onClick={() => {
                setShowAttachPanel((p) => !p);
                setShowEmojiPanel(false);
                setShowMenuPanel(false);
              }}
            >
              <IconAttach />
            </button>
          )}
        </div>
        <button className="wa-send-btn" onClick={() => sendMessage(input)} disabled={!input.trim()}>
          <IconSend />
        </button>
      </footer>

      {/* ── BACKDROP ── */}
      {(showEmojiPanel || showAttachPanel || showMenuPanel) && (
        <div
          className="wa-panel-backdrop"
          onClick={() => {
            setShowEmojiPanel(false);
            setShowAttachPanel(false);
            setShowMenuPanel(false);
          }}
        />
      )}

      {/* ── PAINÉIS FLUTUANTES ── */}
      {showEmojiPanel && (
        <EmojiPanel
          onSelect={(emoji) => {
            setInput((prev) => prev + emoji);
            inputRef.current?.focus();
          }}
        />
      )}

      {showAttachPanel && <AttachPanel onClose={() => setShowAttachPanel(false)} />}
      {showMenuPanel && <MenuPanel onClose={() => setShowMenuPanel(false)} />}
    </div>
  );
}
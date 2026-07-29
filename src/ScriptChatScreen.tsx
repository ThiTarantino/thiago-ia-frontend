import { useState, useRef, useEffect } from "react";
import type { ChatExemplo } from "./types";
import "./WhatsApp.css";

type Message = { role: "user" | "bot"; text: string; time: string };
type CallState = "idle" | "ringing" | "connected";

function getTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}
function formatCallTimer(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);
const IconSend = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);
const IconCallAudio = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
  </svg>
);
const IconEndCall = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
  </svg>
);

export default function ScriptChatScreen({
  chat,
  onBack,
}: {
  chat: ChatExemplo;
  onBack: () => void;
}) {
  const isEuVoce = chat.id === "eu-voce";

  const [messages, setMessages] = useState<Message[]>(() => {
    if (chat.respostasScript && chat.respostasScript.length > 0 && chat.respostasScript[0]) {
      return [{ role: "bot", text: chat.respostasScript[0], time: getTime() }];
    }
    return [];
  });

  const respostaIndexRef = useRef(1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [callState, setCallState] = useState<CallState>("idle");
  const [callSeconds, setCallSeconds] = useState(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (callState !== "connected") return;
    const t = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [callState]);

  function proximaResposta() {
    if (!chat.respostasScript || chat.respostasScript.length === 0) return "";
    const r = chat.respostasScript[respostaIndexRef.current % chat.respostasScript.length];
    respostaIndexRef.current += 1;
    return r;
  }

  function sendMessage() {
    if (!input.trim() || loading) return;

    // Se for o chat "Eu (Você)", adiciona a mensagem como do próprio usuário e não responde nada
    if (isEuVoce) {
      setMessages((prev) => [...prev, { role: "user", text: input, time: getTime() }]);
      setInput("");
      return;
    }

    // Para os outros chats, envia a mensagem e agenda a resposta
    setMessages((prev) => [...prev, { role: "user", text: input, time: getTime() }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: proximaResposta(), time: getTime() }]);
      setLoading(false);
    }, 600 + Math.random() * 700);
  }

  function iniciarChamada() {
    setCallSeconds(0);
    setCallState("ringing");
    setTimeout(() => setCallState("connected"), 2500);
  }

  function encerrarChamada() {
    setCallState("idle");
  }

  return (
    <div className="wa-app">
      <header className="wa-header">
        <button className="wa-icon-btn" title="Voltar" onClick={onBack}>
          <IconBack />
        </button>
        <div className="wa-header-left">
          <div className="wa-avatar">
            <img src={chat.avatar} alt={chat.nome} />
          </div>
          <div className="wa-header-info">
            <span className="wa-header-name">{chat.nome}</span>
            <span className="wa-header-status">
              {loading ? (
                "digitando..."
              ) : (
                <>
                  <span className="wa-status-dot" />
                  {isEuVoce ? "Mensagens para você mesmo" : "online agora"}
                </>
              )}
            </span>
          </div>
        </div>
        <div className="wa-header-actions">
          {!isEuVoce && (
            <button className="wa-icon-btn" title="Chamada de áudio" onClick={iniciarChamada}>
              <IconCallAudio />
            </button>
          )}
        </div>
      </header>

      <main className="wa-chat">
        <div className="wa-date-chip">Hoje</div>
        {messages.map((msg, i) => (
          <div key={i} className={`wa-bubble-row ${msg.role}`}>
            <div className={`wa-bubble ${msg.role}`}>
              <span className="wa-bubble-text">{msg.text}</span>
              <div className="wa-bubble-meta">
                <span className="wa-timestamp">{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="wa-bubble-row bot">
            <div className="wa-bubble bot">
              <div className="wa-typing">
                <div className="wa-dot" />
                <div className="wa-dot" />
                <div className="wa-dot" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      <footer className="wa-inputbar">
        <div className="wa-input-wrapper">
          <input
            className="wa-text-input"
            placeholder="Mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
          />
        </div>
        <button className="wa-send-btn" onClick={sendMessage} disabled={loading}>
          <IconSend />
        </button>
      </footer>

      {/* ── CHAMADA DE ÁUDIO ── */}
      {callState !== "idle" && (
        <div className={`wa-call-overlay ${callState}`}>
          {callState === "connected" && (
            <audio src={chat.chamadaAudio} autoPlay onEnded={encerrarChamada} />
          )}
          <div className="wa-call-rings">
            <div className="wa-call-ring" />
            <div className="wa-call-ring" />
            <div className="wa-call-ring" />
          </div>
          <div className="wa-call-content">
            <div className="wa-call-avatar">
              <img src={chat.avatar} alt={chat.nome} />
            </div>
            <div className="wa-call-name">{chat.nome}</div>
            <div className="wa-call-status">
              {callState === "ringing" && (
                <>
                  Chamada de áudio<span className="wa-call-dots" />
                </>
              )}
              {callState === "connected" && formatCallTimer(callSeconds)}
            </div>
          </div>
          <div className="wa-call-actions">
            <div className="wa-call-btn-wrap">
              <button className="wa-call-btn end" onClick={encerrarChamada}>
                <IconEndCall />
              </button>
              <span className="wa-call-btn-label">
                {callState === "ringing" ? "Cancelar" : "Encerrar"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
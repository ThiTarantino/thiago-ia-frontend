import { useState, useRef, useEffect } from "react";
import GameHub from "./GameHub.tsx";
import { respostaModoOffline } from "./respostas";

type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
};

function getTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const FOTOS = [
  "https://picsum.photos/seed/t1/400/400",
  "https://picsum.photos/seed/t2/400/400",
  "https://picsum.photos/seed/t3/400/400",
  "https://picsum.photos/seed/t4/400/400",
  "https://picsum.photos/seed/t5/400/400",
  "https://picsum.photos/seed/t6/400/400",
  "https://picsum.photos/seed/t7/400/400",
  "https://picsum.photos/seed/t8/400/400",
  "https://picsum.photos/seed/t9/400/400",
  "https://picsum.photos/seed/t10/400/400",
];

// ────────────────────────────────────────────────────────────────────────────

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
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const historyToSend = messages.map((msg) => ({
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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #111b21; }

        .app { width: 100%; height: 100dvh; display: flex; flex-direction: column; background: #111b21; overflow: hidden; position: relative; }

        .header { display: flex; align-items: center; gap: 12px; padding: 10px 16px; background: #202c33; min-height: 60px; }
        .header-left { display: flex; align-items: center; gap: 12px; flex: 1; cursor: pointer; }
        .header-left:active { opacity: 0.7; }

        .avatar { width: 40px; height: 40px; min-width: 40px; border-radius: 50%; background: linear-gradient(135deg, #00a884, #005c4b); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; color: #fff; overflow: hidden; }
        .avatar img { width: 100%; height: 100%; object-fit: cover; }

        .header-info { flex: 1; }
        .header-name { font-size: 16px; font-weight: 600; color: #e9edef; display: block; }
        .header-sub { font-size: 13px; color: #8696a0; transition: color 0.3s; }
        .header-sub.offline { color: #f59e0b; }

        .header-actions { display: flex; align-items: center; gap: 4px; }
        .icon-btn { background: none; border: none; color: #aebac1; font-size: 20px; cursor: pointer; padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
        .icon-btn:hover { background: #374045; }

        .chat { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; background-color: #0b141a; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1' fill='%23ffffff08'/%3E%3C/svg%3E"); }
        .chat::-webkit-scrollbar { width: 6px; }
        .chat::-webkit-scrollbar-thumb { background: #374045; border-radius: 3px; }

        .date-chip { align-self: center; background: #182229; color: #8696a0; font-size: 12px; padding: 5px 12px; border-radius: 8px; margin: 8px 0; }

        .offline-chip { align-self: center; background: #78350f22; border: 1px solid #f59e0b44; color: #f59e0b; font-size: 12px; padding: 5px 14px; border-radius: 8px; margin: 4px 0; }

        .bubble-row { display: flex; margin-bottom: 2px; width: 100%; }
        .bubble-row.user { justify-content: flex-end; }
        .bubble-row.bot { justify-content: flex-start; }

        .bubble { max-width: 75%; padding: 6px 9px 8px 9px; border-radius: 7.5px; font-size: 14.5px; line-height: 1.5; position: relative; word-break: break-word; overflow-wrap: break-word; animation: fadeIn 0.2s ease; }
        .bubble.bot { background: #202c33; color: #e9edef; border-top-left-radius: 0; }
        .bubble.user { background: #005c4b; color: #e9edef; border-top-right-radius: 0; }
        .bubble.bot::before { content: ''; position: absolute; top: 0; left: -8px; border-width: 0 8px 8px 0; border-style: solid; border-color: transparent #202c33 transparent transparent; }
        .bubble.user::before { content: ''; position: absolute; top: 0; right: -8px; border-width: 0 0 8px 8px; border-style: solid; border-color: transparent transparent transparent #005c4b; }

        .bubble-text { display: block; padding-right: 52px; }
        .bubble-meta { display: flex; align-items: center; justify-content: flex-end; gap: 3px; float: right; margin-left: 8px; margin-top: -4px; }
        .timestamp { font-size: 11px; color: #8696a0; white-space: nowrap; }
        .checks { color: #53bdeb; font-size: 13px; }

        .typing-dots { display: flex; align-items: center; gap: 4px; padding: 10px 14px; height: 38px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; background: #8696a0; animation: blink 1.4s infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes blink { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .input-bar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #202c33; }
        .text-input { flex: 1; background: #2a3942; border: none; border-radius: 24px; padding: 10px 16px; color: #e9edef; font-size: 15px; outline: none; font-family: inherit; }
        .text-input::placeholder { color: #8696a0; }
        .send-btn { width: 44px; height: 44px; min-width: 44px; border-radius: 50%; border: none; background: #00a884; color: #fff; font-size: 20px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s; }
        .send-btn:hover { background: #02b893; }
        .send-btn:disabled { background: #374045; cursor: not-allowed; }

        /* PERFIL */
        .profile { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #111b21; z-index: 100; display: flex; flex-direction: column; animation: slideIn 0.3s ease; }
        .profile-header { display: flex; align-items: center; gap: 16px; padding: 14px 16px; background: #202c33; min-height: 56px; }
        .back-btn { background: none; border: none; color: #00a884; font-size: 22px; cursor: pointer; padding: 4px; display: flex; align-items: center; }
        .profile-header-title { color: #e9edef; font-size: 16px; font-weight: 600; }
        .profile-cover { background: linear-gradient(135deg, #00a884, #005c4b); height: 220px; display: flex; align-items: flex-end; padding: 16px; position: relative; overflow: hidden; }
        .profile-cover img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .profile-cover-info { position: relative; z-index: 1; width: 100%; padding: 8px 0 0; }
        .profile-cover-name { color: #fff; font-size: 22px; font-weight: 700; text-shadow: 0 1px 4px #000; }
        .profile-cover-sub { color: #ffffffaa; font-size: 13px; }
        .profile-body { flex: 1; overflow-y: auto; }
        .profile-section { padding: 16px; border-bottom: 1px solid #1f2c34; }
        .profile-section-title { color: #00a884; font-size: 13px; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .profile-info-text { color: #e9edef; font-size: 15px; }
        .profile-info-sub { color: #8696a0; font-size: 12px; margin-top: 2px; }
        .fotos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .foto-item { aspect-ratio: 1; overflow: hidden; cursor: pointer; background: #1f2c34; }
        .foto-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s; }
        .foto-item:active img { transform: scale(0.95); }

        /* LIGHTBOX */
        .lightbox { position: fixed; inset: 0; background: #000000ee; z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
        .lightbox img { max-width: 95vw; max-height: 90vh; object-fit: contain; border-radius: 4px; }
        .lightbox-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: #fff; font-size: 28px; cursor: pointer; }
        .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); background: #ffffff22; border: none; color: #fff; font-size: 24px; padding: 12px 16px; cursor: pointer; border-radius: 50%; }
        .lightbox-nav.prev { left: 12px; }
        .lightbox-nav.next { right: 12px; }
      `}</style>

      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="header-left" onClick={() => setShowProfile(true)}>
            <div className="avatar"><img src={FOTOS[0]} alt="Thiago" /></div>
            <div className="header-info">
              <span className="header-name">Thiago 2.0</span>
              <span className={`header-sub ${modoOffline ? "offline" : ""}`}>
                {modoOffline ? "online 💚" : "online agora"}
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn" title="Jogos" onClick={() => setShowGames(true)}>🎮</button>
            <button className="icon-btn" title="Menu">⋮</button>
          </div>
        </header>

        {/* CHAT */}
        <main className="chat">
          <div className="date-chip">Hoje</div>
          {modoOffline && (
            <div className="offline-chip">💚 Respondendo no modo local — pode demorar um pouquinho</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`bubble-row ${msg.role}`}>
              <div className={`bubble ${msg.role}`}>
                <span className="bubble-text">{msg.text}</span>
                <div className="bubble-meta">
                  <span className="timestamp">{msg.time}</span>
                  {msg.role === "user" && <span className="checks">✓✓</span>}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="bubble-row bot">
              <div className="bubble bot">
                <div className="typing-dots">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </main>

        {/* INPUT */}
        <footer className="input-bar">
          <input
            className="text-input"
            placeholder="Mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            disabled={loading}
          />
          <button className="send-btn" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>➤</button>
        </footer>

        {/* PERFIL */}
        {showProfile && (
          <div className="profile">
            <div className="profile-header">
              <button className="back-btn" onClick={() => setShowProfile(false)}>←</button>
              <span className="profile-header-title">Informações do contato</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
                <button className="icon-btn" title="Jogos" onClick={() => { setShowProfile(false); setShowGames(true); }}>🎮</button>
              </div>
            </div>
            <div className="profile-body">
              <div className="profile-cover">
                <img src={FOTOS[0]} alt="capa" />
                <div className="profile-cover-info">
                  <div className="profile-cover-name">Thiago 2.0</div>
                  <div className="profile-cover-sub">Clone Digital</div>
                </div>
              </div>
              <div className="profile-section">
                <div className="profile-section-title">Sobre</div>
                <div className="profile-info-text">Dev, otaku e apaixonado pela Isabela 💚</div>
                <div className="profile-info-sub">Descrição</div>
              </div>
              <div className="profile-section">
                <div className="profile-section-title">Jogos</div>
                <div
                  className="profile-info-text"
                  style={{ color: "#00a884", cursor: "pointer" }}
                  onClick={() => { setShowProfile(false); setShowGames(true); }}
                >
                  🎮 Jogar com o Thiago 2.0
                </div>
              </div>
              <div className="profile-section">
                <div className="profile-section-title">Fotos e vídeos</div>
              </div>
              <div className="fotos-grid">
                {FOTOS.map((foto, i) => (
                  <div key={i} className="foto-item" onClick={() => setFotoAberta(foto)}>
                    <img src={foto} alt={`foto ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LIGHTBOX */}
        {fotoAberta && (
          <div className="lightbox" onClick={() => setFotoAberta(null)}>
            <button className="lightbox-close" onClick={() => setFotoAberta(null)}>✕</button>
            <button className="lightbox-nav prev" onClick={(e) => { e.stopPropagation(); const idx = FOTOS.indexOf(fotoAberta); setFotoAberta(FOTOS[(idx - 1 + FOTOS.length) % FOTOS.length]); }}>‹</button>
            <img src={fotoAberta} alt="foto" onClick={(e) => e.stopPropagation()} />
            <button className="lightbox-nav next" onClick={(e) => { e.stopPropagation(); const idx = FOTOS.indexOf(fotoAberta); setFotoAberta(FOTOS[(idx + 1) % FOTOS.length]); }}>›</button>
          </div>
        )}
      </div>
    </>
  );
}
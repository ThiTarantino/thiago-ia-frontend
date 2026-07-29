import { useState } from "react";
import "../WhatsApp.css"; // Usa os mesmos estilos globais do app

interface Chamada {
  id: string;
  nome: string;
  avatar: string;
  tipo: "video" | "audio";
  direcao: "entrada" | "saida" | "perdida";
  dataHora: string;
}

const HISTORICO_MOCK: Chamada[] = [
  {
    id: "1",
    nome: "Mariana",
    avatar: "https://via.placeholder.com/150",
    tipo: "video",
    direcao: "entrada",
    dataHora: "Hoje, 14:32",
  },
  {
    id: "2",
    nome: "Mãe ❤️",
    avatar: "https://via.placeholder.com/150",
    tipo: "audio",
    direcao: "perdida",
    dataHora: "Hoje, 11:15",
  },
  {
    id: "3",
    nome: "Lucas",
    avatar: "https://via.placeholder.com/150",
    tipo: "audio",
    direcao: "saida",
    dataHora: "Ontem, 20:45",
  },
  {
    id: "4",
    nome: "Mariana",
    avatar: "https://via.placeholder.com/150",
    tipo: "video",
    direcao: "saida",
    dataHora: "24 de julho, 18:00",
  },
];

// Ícones SVG do WhatsApp
const IconLink = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

const IconVideo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const IconCallIncoming = () => (
  <svg viewBox="0 0 24 24" fill="#00a884" width="16" height="16">
    <path d="M20 5.41L18.59 4 7 15.59V9H5v10h10v-2H8.41z" />
  </svg>
);

const IconCallOutgoing = () => (
  <svg viewBox="0 0 24 24" fill="#00a884" width="16" height="16">
    <path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z" />
  </svg>
);

const IconCallMissed = () => (
  <svg viewBox="0 0 24 24" fill="#f15c6d" width="16" height="16">
    <path d="M19.59 7L12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z" />
  </svg>
);

export default function LigacoesPage() {
  const [historico] = useState<Chamada[]>(HISTORICO_MOCK);

  return (
    <div className="wa-home-scroll" style={{ paddingBottom: 80 }}>
      {/* ── Criar link de chamada ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "14px 16px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            backgroundColor: "#00a884",
            color: "#111b21",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconLink />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#e9edef", fontSize: 16, fontWeight: 500 }}>
            Criar link de chamada
          </div>
          <div style={{ color: "#8696a0", fontSize: 14, marginTop: 2 }}>
            Compartilhe um link para sua chamada do WhatsApp
          </div>
        </div>
      </div>

      {/* ── Título da Seção ── */}
      <div
        style={{
          color: "#e9edef",
          fontSize: 15,
          fontWeight: 600,
          padding: "16px 16px 8px 16px",
        }}
      >
        Recentes
      </div>

      {/* ── Lista de Chamadas ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {historico.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              cursor: "pointer",
            }}
          >
            {/* Avatar */}
            <img
              src={item.avatar}
              alt={item.nome}
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            {/* Info da Chamada */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: item.direcao === "perdida" ? "#f15c6d" : "#e9edef",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                {item.nome}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#8696a0",
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                {item.direcao === "entrada" && <IconCallIncoming />}
                {item.direcao === "saida" && <IconCallOutgoing />}
                {item.direcao === "perdida" && <IconCallMissed />}
                <span>{item.dataHora}</span>
              </div>
            </div>

            {/* Ícone Áudio / Vídeo */}
            <button
              style={{
                background: "none",
                border: "none",
                color: "#00a884",
                cursor: "pointer",
                padding: 8,
              }}
            >
              {item.tipo === "video" ? <IconVideo /> : <IconPhone />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
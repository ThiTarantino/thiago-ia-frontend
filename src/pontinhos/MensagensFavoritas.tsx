interface Props {
  onBack: () => void;
}

export default function MensagensFavoritas({ onBack }: Props) {
  return (
    <div style={{ padding: 16, color: "#e9edef", backgroundColor: "#111b21", minHeight: "100vh" }}>
      <button onClick={onBack} style={{ background: "transparent", border: "none", color: "#00a884", cursor: "pointer", fontSize: 16 }}>
        ← Voltar
      </button>
      <h2 style={{ marginTop: 16 }}>Mensagens favoritas</h2>
      <p style={{ color: "#8696a0", marginTop: 8 }}>Nenhuma mensagem marcada como favorita ainda.</p>
    </div>
  );
}
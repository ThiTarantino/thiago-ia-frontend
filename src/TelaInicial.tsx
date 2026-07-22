type TelaInicialProps = {
  onEntrar: () => void;
};

export default function TelaInicial({ onEntrar }: TelaInicialProps) {
  return (
    <div className="wa-initial-screen">
      <div className="wa-initial-card">
        <div className="wa-initial-icon">🤖</div>
        <h1 className="wa-initial-title">Thiago 2.0</h1>
        <p className="wa-initial-subtitle">
          Bem-vindo(a). Entre para acessar a conversa principal.
        </p>
        <button className="wa-initial-button" onClick={onEntrar}>
          Entrar
        </button>
      </div>
    </div>
  );
}

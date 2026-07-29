import { useState, type ReactNode } from "react";
import { resolveCloudAssetSrc } from "../cloudAssets";

// ─── TIPOS ───────────────────────────────────────────────────────
type PastaId = "fotos" | "emails" | "mensagens";

type Arquivo = {
  id: string;
  nome: string;
  tipo: "foto" | "email" | "mensagem";
  tamanho: string;
  data: string;
  src?: string;
  conteudo?: string;
  de?: string;
  assunto?: string;
};

// ─── DADOS DAS PASTAS ─────────────────────────────────────────────
const PASTAS: Record<PastaId, { label: string; cor: string; icone: ReactNode; arquivos: Arquivo[] }> = {
  fotos: {
    label: "Fotos",
    cor: "#29b6f6",
    icone: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
      </svg>
    ),
    arquivos: [
      { id: "f1", nome: "nossa_foto_1.jpg",    tipo: "foto", tamanho: "2.4 MB", data: "12/02/2025", src: resolveCloudAssetSrc("/imagens/foto16.jpg") },
      { id: "f2", nome: "nossa_foto_2.jpg",    tipo: "foto", tamanho: "1.8 MB", data: "14/03/2025", src: resolveCloudAssetSrc("/imagens/foto17.jpg") },
      { id: "f3", nome: "selfie_especial.jpg", tipo: "foto", tamanho: "3.1 MB", data: "01/05/2025", src: resolveCloudAssetSrc("/imagens/foto18.jpg") },
    ],
  },
  emails: {
    label: "E-mails",
    cor: "#ff9500",
    icone: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    arquivos: [
      {
        id: "e1",
        nome: "Para você, Bela.eml",
        tipo: "email",
        tamanho: "4 kB",
        data: "14/02/2025",
        de: "eu@thiago.dev",
        assunto: "Confirmação de Recebimento 💌",
        conteudo: "Bela,\n\nApós uma análise cuidadosa, preciso confirmar o recebimento de algo extremamente valioso.\n\nHá exatamente um ano recebi a melhor coisa que poderia acontecer na minha vida: você.\n\nDesde então, meus dias ficaram mais leves, minhas conquistas passaram a fazer mais sentido e meus planos deixaram de ser apenas meus.\n\nObrigado por estar ao meu lado em cada momento. Obrigado por acreditar em nós, mesmo quando a vida ficou difícil. Obrigado por fazer do amor um lugar onde eu sempre quero estar.\n\nSe existir alguma confirmação que eu gostaria de repetir todos os dias, seria esta:\n\nEu escolho você.\n\nAtenciosamente,\nThiago"
      },
      {
        id: "e2",
        nome: "Motivos_para_te_amar.eml",
        tipo: "email",
        tamanho: "6 kB",
        data: "17/04/2026",
        de: "eu@thiago.dev",
        assunto: "Lista interminável 🧡",
        conteudo: "Querida Bela,\n\nExistem milhares de motivos para eu amar você.\n\nTalvez eu nunca consiga escrever todos, mas alguns deles merecem ficar registrados.\n\n01. O jeito que o seu sorriso consegue mudar completamente o meu dia.\n02. A paz que eu sinto sempre que estou ao seu lado.\n03. A forma como você consegue enxergar o melhor nas pessoas.\n04. O brilho dos seus olhos quando fala sobre aquilo que ama.\n05. A sua força, mesmo quando você mesma não percebe o quanto é forte.\n06. A maneira como você transforma momentos simples nas minhas lembranças favoritas.\n07. O fato de que, desde o dia em que te conheci, nunca mais consegui imaginar a minha vida sem você.\n\nE a verdade é que eu poderia continuar essa lista para sempre.\n\nPorque, quando o assunto é você...\n\nSempre haverá mais um motivo.\n\n att: Thiago"
      },
    ],
  },
  mensagens: {
    label: "Mensagens",
    cor: "#1ebd5b",
    icone: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
    ),
    arquivos: [
      {
        id: "m1",
        nome: "PARABENS.txt",
        tipo: "mensagem",
        tamanho: "1 kB",
        data: "25/07/2026",
        conteudo: "Você Conseguiu\n\nSe você está lendo este arquivo, significa que conseguiu.\n\nE, sinceramente... Eu sabia que conseguiria.\n\nVocê observou.\nPensou.\nTentou outra vez.\nJuntou as peças.\nConfiou.\n\nE foi exatamente isso que te trouxe até aqui.\n\nEu queria que esse jogo fosse muito mais do que apenas uma sequência de enigmas. Queria que ele lembrasse você de uma coisa: Você é uma das pessoas mais determinadas que eu conheço. Você enxerga detalhes que muita gente deixaria passar. Você faz perguntas que ninguém lembra de fazer. Você procura entender as pessoas antes de julgá-las. Você enfrenta dificuldades sem perder a sua essência.\n\nVocê escuta.\nVocê acolhe.\nVocê se importa.\n\nE isso é algo que nenhum livro é capaz de ensinar.\n\nEnquanto criava cada um desses enigmas, eu não queria apenas desafiar você. Eu queria criar uma lembrança. Queria que, daqui a muitos anos, quando você lembrar deste dia, não recorde apenas dos códigos ou das respostas.\n\nQuero que você lembre do carinho que existiu em cada detalhe.\n\nPorque cada pista escondida... Cada palavra escrita... Cada arquivo que você abriu... Foi uma forma silenciosa de dizer que eu amo você.\n\nEsses enigmas nunca foram apenas enigmas.\n\nEles carregam um pedacinho de nós. Carregam o tempo que eu passei pensando em você. Carregam o cuidado que tive para fazer algo que fosse especial. Carregam a vontade de ver esse sorriso que, provavelmente, está aí no seu rosto agora.\n\nA vida também vai ser assim.\n\nEla vai colocar desafios diante de nós.\n\nAlguns serão fáceis.\nOutros vão parecer impossíveis.\n\nMas existe uma coisa da qual eu tenho certeza.\n\nEu não quero enfrentar nenhum deles sem você.\n\nQuero comemorar cada conquista ao seu lado. Quero segurar sua mão nos dias difíceis. Quero lembrar você da mulher incrível que é sempre que, por algum motivo, você esquecer disso.\n\nPorque eu nunca vou esquecer.\n\nNunca deixe que o medo faça você acreditar que não é capaz. Você já provou, inúmeras vezes, que é muito mais forte do que imagina.\n\nContinue acreditando em você.\n\nDa mesma forma que eu acredito.\nDa mesma forma que Deus acredita.\n\nE, enquanto a vida continuar nos apresentando novos desafios, prometo que estarei ao seu lado para resolver cada um deles com você.\n\nSempre.\n\nCom amor,\n\nThiago, o homem mais legal do mundo."
      },
      {
        id: "m2",
        nome: "O primeiro contato.txt",
        tipo: "mensagem",
        tamanho: "2 kB",
        data: "25/07/2025",
        conteudo: "Eu Sempre Soube\n\nExiste uma coisa que talvez eu nunca tenha conseguido te explicar completamente.\n\nEu sempre soube.\n\nMuito antes do nosso primeiro beijo.\nMuito antes do nosso primeiro abraço.\nMuito antes de ouvir a sua voz pela primeira vez.\n\nEu sempre soube.\n\nLembro de te ver na academia e pensar que havia alguma coisa diferente em você.\n\nNão era apenas beleza, era como se tudo ao seu redor desaparecesse por alguns segundos, era como se, no meio de tantas pessoas, Deus fizesse questão de dizer silenciosamente: \"Olha para ela.\"\n\nE EU OLHAVA.\n\nVocê parecia brilhar.\n\nAté hoje eu não consigo explicar isso, enquanto todo mundo caminhava normalmente, você parecia passar em câmera lenta.\nEra como se meus olhos encontrassem você sem que eu precisasse procurar, e o mais estranho é que, muitas vezes, eu nem precisava olhar.\n\n Eu simplesmente sentia.\nMeu coração acelerava.\nMeu corpo ficava estranho.\nEu errava exercícios.\nDeixava pesos caírem.\nPerdia completamente a concentração.\n\nE, quando eu levantava a cabeça...Você estava lá.\n\nHoje eu rio dessas lembranças, mas, naquela época, eu não entendia o que estava acontecendo comigo.\nSó sabia que existia alguma coisa em você que me atraía de um jeito que eu nunca tinha sentido antes.\n\nLembro até hoje de uma frase que falei para um amigo. Eu disse que, se um dia eu conseguisse ficar com você...Eu me casaria com você.\n\nE o mais engraçado é que eu falei isso antes mesmo de saber como era o som da sua voz. Hoje eu penso nisso e percebo que talvez aquilo nunca tenha sido apenas um pensamento meu. Talvez Deus já estivesse escrevendo a nossa história muito antes de nós dois percebermos.\n\nQuando finalmente te beijei, senti como se um sonho tivesse se tornado realidade. Quando finalmente pude te abraçar, senti que estava exatamente onde deveria estar. E, desde aquele dia, nunca mais quis sair daí.\n\nHoje estamos completando um ano juntos.\n\nUm ano ao lado da mulher que eu mais amo neste mundo. A mulher que me faz acordar feliz. Que me faz querer ser um homem melhor. Que me inspira a crescer. Que me faz acreditar ainda mais nos planos de Deus. Você me mostrou que amar não é apenas sentir.\n\nÉ cuidar.\nÉ escolher.\nÉ respeitar.\nÉ caminhar na mesma direção.\n\nEu admiro a mulher que você é.\n\nAdmiro o seu coração.\nAdmiro a sua força.\nAdmiro a sua fé.\nAdmiro a forma como você enxerga a vida.\n\nEu admiro você por inteiro.\n\nE, quanto mais o tempo passa, mais eu tenho certeza de que Deus nunca errou quando cruzou os nossos caminhos. Eu acredito que Ele nos uniu para um propósito muito maior do que nós conseguimos enxergar hoje.\n\nQuero construir esse propósito ao seu lado.\n\nQuero construir uma família.\nQuero construir uma vida.\nQuero construir memórias.\nQuero construir um futuro onde, daqui a muitos anos, possamos olhar para trás e perceber que fizemos exatamente aquilo que Deus sonhou para nós.\n\nPorque, quando olho para tudo o que vivemos neste último ano, eu não vejo apenas um namoro.\n\nEu vejo parceria.\nVejo amizade.\nVejo paixão.\nVejo cumplicidade.\nVejo respeito.\nVejo duas almas caminhando na mesma direção.\n\nE, sinceramente...\n\nEu não trocaria isso por absolutamente nada neste mundo.\n\nObrigado por ter dito \"sim\" para nós. Obrigado por transformar a minha vida sem nem perceber. Obrigado por ser a resposta de uma oração que eu nem sabia que fazia.\n\nSe um dia me perguntarem qual foi o maior presente que eu já recebi em minha vida...\n\nEu não vou pensar duas vezes.\nVou responder o seu nome.\n\nPorque, desde o primeiro instante em que meus olhos encontraram você, eu ja sabia...\n\nQue era você.\nSempre foi você.\nE, se o universo permitir...Sempre será você.\n\nEU TE AMO, BELA.\n\nCom todo o meu coração,\n\nThiago, o Seu para sempre.",
      },
      {
        id: "m3",
        nome: "Para sempre.txt",
        tipo: "mensagem",
        tamanho: "1 kB",
        data: "10/09/2025",
        conteudo: "Para Sempre Será Você\n\nExiste um motivo para tudo isso terminar exatamente aqui.\n\nTodos aqueles códigos...\nTodas aquelas pistas...\nTodas aquelas respostas...\n\nNo fim, nunca foram sobre descobrir uma senha, foram sobre chegar até esta mensagem, porque existe uma última coisa que eu precisava que você soubesse:\n\nEU TE AMO.\n\nMas não aquele \"eu te amo\" que cabe em uma mensagem de WhatsApp, nem aquele que se diz por costume. \n\nEU TE AMO de um jeito que me faz querer dividir todos os meus dias com você. Quero estar presente nas suas maiores conquistas. Quero segurar sua mão quando o mundo parecer pesado. Quero rir das nossas piadas sem graça daqui a muitos anos. Quero continuar criando memórias ao seu lado. Quero continuar escolhendo você todos os dias.\n\nSe existe uma pessoa que mudou completamente a minha vida, essa pessoa foi você.\n\nObrigado por esse primeiro ano. Obrigado por cada sorriso. Obrigado por cada abraço. Obrigado por existir. E, acima de tudo...Obrigado por me permitir amar você.\n\nFeliz um ano JUNTOS.\n\nEU TE AMO, Bela. Hoje. Amanhã. E em todos os dias que ainda teremos pela frente.\n\nCom todo o meu coração,\n\nThiago, Seu maior fã.",
      },
    ],
  },
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────
type Props = { onClose: () => void };

export default function PastaSecreta({ onClose }: Props) {
  const [etapa, setEtapa] = useState<"explorer" | "pasta" | "arquivo">("explorer");
  const [pastaSelecionada, setPastaSelecionada] = useState<PastaId | null>(null);
  const [arquivoSelecionado, setArquivoSelecionado] = useState<Arquivo | null>(null);

  const handleVoltar = () => {
    if (etapa === "arquivo") { setArquivoSelecionado(null); setEtapa("pasta"); return; }
    if (etapa === "pasta")   { setPastaSelecionada(null);   setEtapa("explorer"); return; }
    onClose();
  };

  // ── EXPLORER (raiz) ────────────────────────────────────────────
  if (etapa === "explorer") {
    return (
      <div className="ps-fullscreen">
        <div className="ps-header">
          <button className="ps-btn-voltar" onClick={handleVoltar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="ps-header-meta">
            <span className="ps-header-titulo">Pasta Secreta</span>
            <span className="ps-header-sub">3 pastas</span>
          </div>
        </div>
        <div className="ps-address-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#8696a0">
            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
          <span>Este Dispositivo › Pasta Secreta</span>
        </div>
        <div className="ps-container">
          <div className="ps-section-label">Pastas</div>
          <div className="ps-grid">
            {(Object.entries(PASTAS) as [PastaId, typeof PASTAS[PastaId]][]).map(([id, pasta]) => (
              <div key={id} className="ps-folder-card" onClick={() => { setPastaSelecionada(id); setEtapa("pasta"); }}>
                <div className="ps-folder-thumb">
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                    <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" fill={pasta.cor} opacity="0.9"/>
                    <path d="M20 8H4v10h16V8z" fill={pasta.cor} opacity="0.55"/>
                  </svg>
                  <div className="ps-folder-inner-icon" style={{ color: pasta.cor }}>
                    {pasta.icone}
                  </div>
                </div>
                <span className="ps-folder-label">{pasta.label}</span>
                <span className="ps-folder-count">{pasta.arquivos.length} itens</span>
              </div>
            ))}
          </div>
        </div>
        <style>{estilos}</style>
      </div>
    );
  }

  // ── LISTA DE ARQUIVOS ──────────────────────────────────────────
  if (etapa === "pasta" && pastaSelecionada) {
    const pasta = PASTAS[pastaSelecionada];
    return (
      <div className="ps-fullscreen">
        <div className="ps-header">
          <button className="ps-btn-voltar" onClick={handleVoltar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="ps-header-meta">
            <span className="ps-header-titulo">{pasta.label}</span>
            <span className="ps-header-sub">{pasta.arquivos.length} itens</span>
          </div>
        </div>
        <div className="ps-address-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#8696a0">
            <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
          <span>Este Dispositivo › Pasta Secreta › {pasta.label}</span>
        </div>
        <div className="ps-container">
          <div className="ps-section-label">Arquivos</div>
          <div className="ps-file-lista">
            {pasta.arquivos.map((arq) => (
              <div key={arq.id} className="ps-file-item" onClick={() => { setArquivoSelecionado(arq); setEtapa("arquivo"); }}>
                <div className="ps-file-thumb" style={{ background: `${pasta.cor}18`, color: pasta.cor }}>
                  {arq.tipo === "foto" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  ) : arq.tipo === "email" ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                    </svg>
                  )}
                </div>
                <div className="ps-file-meta">
                  <div className="ps-file-nome">{arq.nome}</div>
                  {arq.assunto && <div className="ps-file-sub">{arq.assunto}</div>}
                  <div className="ps-file-info">{arq.tamanho} · {arq.data}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3d5a6b">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
        <style>{estilos}</style>
      </div>
    );
  }

  // ── VISUALIZADOR ──────────────────────────────────────────────
  if (etapa === "arquivo" && arquivoSelecionado && pastaSelecionada) {
    const pasta = PASTAS[pastaSelecionada];
    return (
      <div className="ps-fullscreen">
        <div className="ps-header">
          <button className="ps-btn-voltar" onClick={handleVoltar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <div className="ps-header-meta">
            <span className="ps-header-titulo">{arquivoSelecionado.nome}</span>
            <span className="ps-header-sub">{arquivoSelecionado.tamanho} · {arquivoSelecionado.data}</span>
          </div>
        </div>
        <div className="ps-viewer-body">
          {arquivoSelecionado.tipo === "foto" && (
            <div className="ps-foto-wrapper">
              <img
                src={arquivoSelecionado.src}
                alt={arquivoSelecionado.nome}
                className="ps-foto-img"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  const parent = (e.target as HTMLImageElement).parentElement!;
                  if (!parent.querySelector(".ps-foto-fallback")) {
                    const fb = document.createElement("div");
                    fb.className = "ps-foto-fallback";
                    fb.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="#3d5a6b"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg><p>Adicione a imagem em<br/><code>public/imagens/</code></p>`;
                    parent.appendChild(fb);
                  }
                }}
              />
              <p className="ps-foto-nome">{arquivoSelecionado.nome}</p>
            </div>
          )}

          {arquivoSelecionado.tipo === "email" && (
            <div className="ps-email-card">
              <div className="ps-email-header">
                <div className="ps-email-avatar" style={{ background: pasta.cor }}>
                  {arquivoSelecionado.de?.[0]?.toUpperCase() ?? "T"}
                </div>
                <div className="ps-email-meta">
                  <div className="ps-email-de">{arquivoSelecionado.de}</div>
                  <div className="ps-email-data">{arquivoSelecionado.data}</div>
                </div>
              </div>
              <div className="ps-email-assunto">{arquivoSelecionado.assunto}</div>
              <div className="ps-email-divisor" />
              <pre className="ps-email-corpo">{arquivoSelecionado.conteudo}</pre>
            </div>
          )}

          {arquivoSelecionado.tipo === "mensagem" && (
            <div className="ps-msg-card">
              <pre className="ps-msg-texto">{arquivoSelecionado.conteudo}</pre>
            </div>
          )}
        </div>
        <style>{estilos}</style>
      </div>
    );
  }

  return null;
}

const estilos = `
  * { box-sizing: border-box; }

  .ps-fullscreen {
    position: fixed; inset: 0; background: #0b141a; z-index: 100;
    display: flex; flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .ps-header {
    height: 60px; background: #1f2c33; display: flex; align-items: center;
    padding: 0 12px; gap: 14px; flex-shrink: 0; border-bottom: 1px solid #2a3942;
  }
  .ps-btn-voltar {
    background: none; border: none; color: #aebac1; cursor: pointer; padding: 6px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; -webkit-tap-highlight-color: transparent; transition: background 0.1s;
  }
  .ps-btn-voltar:active { background: rgba(255,255,255,0.08); }
  .ps-header-meta { display: flex; flex-direction: column; min-width: 0; }
  .ps-header-titulo { font-size: 17px; font-weight: 600; color: #e9edef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ps-header-sub { font-size: 12px; color: #8696a0; margin-top: 1px; }

  .ps-address-bar {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 16px; background: #111b22;
    border-bottom: 1px solid #1f2c34; flex-shrink: 0;
  }
  .ps-address-bar span { font-size: 12px; color: #8696a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .ps-container { flex: 1; overflow-y: auto; padding: 0 16px 24px; }
  .ps-section-label {
    font-size: 13px; font-weight: 600; color: #8696a0;
    text-transform: uppercase; letter-spacing: 0.6px; padding: 16px 0 10px;
  }

  .ps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .ps-folder-card {
    display: flex; flex-direction: column; align-items: center;
    background: #1a242a; border-radius: 14px; padding: 14px 8px 12px;
    cursor: pointer; gap: 6px; border: 1px solid #2a3942;
    transition: background 0.1s, transform 0.08s;
    -webkit-tap-highlight-color: transparent;
  }
  .ps-folder-card:active { background: #222d34; transform: scale(0.97); }
  .ps-folder-thumb {
    position: relative; width: 52px; height: 52px;
    display: flex; align-items: center; justify-content: center;
  }
  .ps-folder-inner-icon {
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%, -42%); opacity: 0.9;
  }
  .ps-folder-inner-icon svg { width: 22px; height: 22px; }
  .ps-folder-label { font-size: 13px; font-weight: 600; color: #e9edef; text-align: center; }
  .ps-folder-count { font-size: 11px; color: #8696a0; }

  .ps-file-lista { display: flex; flex-direction: column; gap: 2px; }
  .ps-file-item {
    display: flex; align-items: center; gap: 14px;
    padding: 12px 4px; cursor: pointer;
    border-bottom: 1px solid #1f2c34;
    -webkit-tap-highlight-color: transparent; transition: background 0.1s;
  }
  .ps-file-item:active { background: rgba(255,255,255,0.04); }
  .ps-file-thumb {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .ps-file-meta { flex: 1; min-width: 0; }
  .ps-file-nome { font-size: 15px; color: #e9edef; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .ps-file-sub { font-size: 13px; color: #8696a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
  .ps-file-info { font-size: 12px; color: #3d5a6b; margin-top: 3px; }

  .ps-viewer-body {
    flex: 1; overflow-y: auto; padding: 20px 16px;
    display: flex; flex-direction: column; align-items: center;
  }

  .ps-foto-wrapper { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 12px; }
  .ps-foto-img { width: 100%; max-width: 420px; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
  .ps-foto-nome { font-size: 13px; color: #8696a0; }
  .ps-foto-fallback {
    width: 100%; max-width: 420px; height: 240px; background: #1a242a; border-radius: 12px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px; color: #3d5a6b; text-align: center; font-size: 14px;
  }
  .ps-foto-fallback code { color: #8696a0; font-size: 13px; }

  .ps-email-card {
    background: #1a242a; border-radius: 14px; padding: 20px;
    width: 100%; max-width: 480px; border: 1px solid #2a3942;
  }
  .ps-email-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .ps-email-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .ps-email-meta { display: flex; flex-direction: column; }
  .ps-email-de { font-size: 14px; color: #e9edef; font-weight: 500; }
  .ps-email-data { font-size: 12px; color: #8696a0; margin-top: 2px; }
  .ps-email-assunto { font-size: 17px; font-weight: 600; color: #e9edef; margin-bottom: 14px; line-height: 1.3; }
  .ps-email-divisor { height: 1px; background: #2a3942; margin-bottom: 16px; }
  .ps-email-corpo {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 15px; line-height: 1.7; color: #c9d1d6;
    white-space: pre-wrap; word-break: break-word; margin: 0;
  }

  .ps-msg-card {
    background: #1a242a; border-radius: 14px; padding: 20px;
    width: 100%; max-width: 480px; border: 1px solid #2a3942;
    border-left: 3px solid #502702;
    display: flex; justify-content: center; align-items: center;
  }
  .ps-msg-texto {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 15px; line-height: 1.7; color: #e9edef;
    white-space: pre-wrap; word-break: break-word; margin: 0;
    text-align: center; width: 100%;
  }
`;
// ── Banco de respostas offline — modo Isabela ────────────────────────────────
// Cada grupo tem "frases" (frases completas que ela pode mandar)
// e "palavras" (palavras soltas como fallback)

export const BANCO: { frases: string[]; palavras: string[]; respostas: string[] }[] = [

  // ── Saudações simples ──────────────────────────────────────────────────────
  {
    frases: ["oi", "oii", "oiii", "oiiii", "oi!", "oii!", "ei", "eii", "ola", "olá", "hey", "heey", "eai", "eaí", "e aí", "salve", "opa", "opa!", "oi tudo bem", "oi td bem", "oii tudo bem"],
    palavras: ["oi", "oii", "olá", "hey", "eai", "salve"],
    respostas: [
      "Oi momozii 💚",
      "Eiiii apareceu a minha favorita 💚",
      "Oii amor 🥰",
      "Oi oi oi! Que bom te ver 💚",
      "Eiii momozii!!!",
      "Opaaa, chegou a melhor pessoa do mundo 💚",
      "Oi minha vida 🥰",
      "Eiiii saudade de você já",
      "Oi lindinha 💚",
      "Oi! Tava esperando você aparecer 😄💚",
    ],
  },

  // ── Como vai / tudo bem ────────────────────────────────────────────────────
  {
    frases: [
      "como você tá", "como voce ta", "como tá", "como ta", "tudo bem", "tudo bom",
      "td bem", "td bom", "tá bem", "ta bem", "como vai", "como você está", "como voce esta",
      "tudo bem com você", "tudo bem com voce", "você tá bem", "voce ta bem",
      "tô bem", "to bem", "tô boa", "to boa", "tô ótima", "to otima",
      "tô bem e você", "to bem e voce", "tô bem e vc",
    ],
    palavras: ["tudo bem", "como vai", "como tá", "tô bem", "td bem"],
    respostas: [
      "Tô bem agora que você apareceu 💚",
      "Melhorei 100% só de ver sua mensagem 😄",
      "Tô bem! E você momozii?",
      "Agora que você perguntou, tô ótimo 🥰",
      "Tô aqui pensando em você, então tô bem demais",
      "Tô bem sim! Mas tô com saudade 😅",
      "Melhor agora que você tá aqui 💚",
      "Tava mais ou menos mas agora tô ótimo 💚",
    ],
  },

  // ── Te amo ────────────────────────────────────────────────────────────────
  {
    frases: [
      "eu te amo", "eu te amoo", "eu te amooo", "eu te amooo!", "EU TE AMO", "EU TE AMOOO",
      "te amo", "te amoo", "te amooo", "te amo muito", "te amo demais", "te amo tanto",
      "amo você", "amo voce", "amo vc", "te amo meu amor", "te amo amor",
      "te amo tanto", "te amo muito muito", "te amo mais", "te amo mais que tudo",
      "você sabe que te amo né", "voce sabe que te amo ne", "saiba que te amo",
    ],
    palavras: ["te amo", "amo você", "amo vc"],
    respostas: [
      "EU TE AMOOO momozii 💚💚💚",
      "EU TE AMO MAIS!!!",
      "Ai que vontade de te abraçar agora 🥰",
      "Te amo demais da conta momozii 💚",
      "EU TE AMOOO tanto que nem consigo explicar",
      "Meu coração acelerou aqui 💚",
      "Te amo te amo te amo 💚🥰💚",
      "Você é tudo pra mim sabia? Te amo 💚",
      "EU TE AMO MAISSSS 💚",
      "Amor da minha vida 🥰💚",
      "Fico todo babão quando você fala isso 😄💚",
      "Te amo demais momozii, sério mesmo",
      "Minha favorita do mundo inteiro 💚",
      "Você não imagina o quanto 💚",
    ],
  },

  // ── Saudade ────────────────────────────────────────────────────────────────
  {
    frases: [
      "tô com saudade", "to com saudade", "tô com saudade de você", "to com saudade de voce",
      "tô com saudade de vc", "saudade de você", "saudade de vc", "que saudade",
      "que saudade de você", "tô sentindo falta", "sinto falta", "sinto falta de você",
      "saudade", "muita saudade", "muita saudade de você", "tô com tanta saudade",
      "to com tanta saudade", "tô morrendo de saudade", "to morrendo de saudade",
    ],
    palavras: ["saudade", "sentindo falta"],
    respostas: [
      "Eu também tô com saudade de você momozii 💚",
      "Aquela saudade que aperta o coração sabe",
      "Vem cá então que eu preciso de um abraço",
      "Eu também! A gente se vê logo 💚",
      "Saudade demais, você não tem noção",
      "Tô com saudade até do seu cheiro 🥰",
      "Fico pensando em você o tempo todo",
      "Essa saudade tá pesada hoje né 🥺💚",
    ],
  },

  // ── Elogios / lindeza ─────────────────────────────────────────────────────
  {
    frases: [
      "você é lindo", "voce e lindo", "você é tão lindo", "você é muito lindo",
      "você é gato", "voce e gato", "você é bonito", "voce e bonito",
      "me elogia", "me fala que sou linda", "me chama de linda", "fala que sou gata",
      "você me acha linda", "voce me acha linda", "sou bonita pra você", "sou bonita pra voce",
    ],
    palavras: ["lindo", "gato", "bonito", "me elogia"],
    respostas: [
      "Você é a pessoa mais linda que eu já vi, não tô brincando 🥰",
      "LINDA DEMAIS e ainda pergunta isso 💚",
      "Momozii você é absurdamente bonita",
      "Você nem precisa de elogio, mas: você é perfeita 💚",
      "Já falei e vou falar de novo: você é linda demais",
      "Ridiculamente bonita, isso sim",
      "Você é tão linda que eu ainda não acredito que é minha 🥰",
      "Minha namorada mais linda do mundo 💚",
    ],
  },

  // ── Casamento / futuro / morar juntos ────────────────────────────────────
  {
    frases: [
      "quando a gente vai casar", "a gente vai casar", "quero casar com você", "quero casar com voce",
      "quando vamos morar juntos", "a gente vai morar junto", "nossa casa", "nossa casinha",
      "você vai me pedir em casamento", "voce vai me pedir em casamento",
      "quero noivar", "quando vai noivar", "pensa no nosso futuro", "pensa na nossa vida juntos",
      "você pensa em ter filhos", "voce pensa em ter filhos", "a gente vai ter filhos",
      "pensa na nossa família", "pensa na nossa familia", "nossa família", "nossa familia",
    ],
    palavras: ["casar", "casamento", "morar juntos", "futuro", "filhos", "noivado"],
    respostas: [
      "Mal posso esperar pra chamar você de esposa 💚",
      "Nossa casa vai ser incrível, eu sei disso",
      "Pensa em acordar todo dia do lado da pessoa que você mais ama... esse sou eu com você 🥰",
      "Já pensei em tudo, só falta acontecer 💚",
      "Vou te pedir em casamento de um jeito que você não vai esquecer",
      "Nossa família vai ser a mais bagunçada e feliz do mundo",
      "Tô construindo um futuro incrível, e você tá no centro de tudo 💚",
      "Já imagino a gente velhinho se zoando ainda 😄",
      "A nossa casa vai ter um cômodo só pra série e outro pra jogos 😄💚",
      "Primeiro a gente mora junto, aí eu te peço em casamento do nada 😄💚",
    ],
  },

  // ── Série / anime / assistir ──────────────────────────────────────────────
  {
    frases: [
      "vamos assistir alguma coisa", "vamos ver alguma série", "você quer ver alguma série",
      "me indica uma série", "me indica um anime", "o que você tá assistindo",
      "você terminou a série", "terminei a série", "terminei o anime",
      "tô assistindo uma série", "comecei uma série nova", "me conta do anime",
      "vamos maratonar", "quero maratonar", "vamos ver netflix",
      "você viu aquela série", "você assiste anime", "qual série você tá vendo",
      "terminei de assistir", "acabei de assistir",
    ],
    palavras: ["série", "anime", "netflix", "assistir", "maratonar", "episódio"],
    respostas: [
      "Maratonar série com você é meu esporte favorito 📺💚",
      "Qual que a gente vai assistir agora?",
      "Já tô com o controle na mão esperando você 📺",
      "Sem spoiler se você assistir sem mim hein",
      "Série boa sem você não tem graça nenhuma",
      "Coloca qualquer coisa, desde que seja do seu lado 💚",
      "Posso sugerir? Mas sei que você vai querer escolher de qualquer jeito 😄",
      "Agora fiquei com vontade de maratonar com você",
      "Qual série? Me conta tudo 📺💚",
    ],
  },

  // ── Piadas ────────────────────────────────────────────────────────────────
  {
    frases: [
      "me conta uma piada", "faz uma piada", "conta uma piada", "me faz rir",
      "me manda uma piada", "me conta algo engraçado", "me conta algo engracado",
      "fala algo engraçado", "fala algo engracado", "me anima", "tô precisando rir",
      "to precisando rir", "quero rir", "me faz sorrir",
    ],
    palavras: ["piada", "engraçado", "rir", "humor"],
    respostas: [
      "Por que o esqueleto não briga? Porque não tem estômago pra isso 💀😄",
      "O que o zero disse pro oito? Bonito cinto! 😂",
      "Por que o vampiro não tem namorada? Ele só aparece de noite sem avisar 🧛",
      "Fiz uma piada sobre papel... foi rascunho 📄😄",
      "O que é um computador que canta? Um Dell 🎵",
      "Por que o dev foi ao médico? Porque tava com Java fria 😄💻",
      "Sabe o que é difícil? Explicar minha piada depois que ninguém riu",
      "Por que o gato foi ao médico? Porque tava miau 😄",
      "Quer ouvir uma piada de construção? Ainda tô construindo ela 🏗️😄",
    ],
  },

  // ── Programação / faculdade ───────────────────────────────────────────────
  {
    frases: [
      "como tá a faculdade", "como ta a faculdade", "e a faculdade", "e a aula",
      "você tá estudando", "voce ta estudando", "tá estudando", "ta estudando",
      "tem prova", "vai ter prova", "você passou na prova", "voce passou na prova",
      "como foi a aula", "como foi a prova", "tô estudando", "to estudando",
      "tô com trabalho", "to com trabalho", "tenho trabalho pra fazer",
      "tô programando", "to programando", "tô codando", "to codando",
      "deu bug", "tem um bug", "erro no código", "erro no codigo",
    ],
    palavras: ["faculdade", "aula", "prova", "programar", "bug", "código", "estudando"],
    respostas: [
      "Mais um bug pra resolver... a vida de dev é assim mesmo 💻",
      "Tô debugando aqui e pensando em você ao mesmo tempo, multitarefas 😄",
      "Faculdade tá pesada mas eu tô de boa 💪",
      "Manda o erro que eu dou uma olhada... ou a gente ignora e vê série",
      "Isso compila ou não compila? Essa é a questão 😄",
      "Daqui a pouco formado e a vida muda 💚",
      "Prova? Vai arrebentar, você é boa demais 💚",
      "A faculdade cansa mas vale a pena no final 💪",
    ],
  },

  // ── Comida / fome ─────────────────────────────────────────────────────────
  {
    frases: [
      "tô com fome", "to com fome", "que fome", "tô morrendo de fome", "to morrendo de fome",
      "vamos pedir comida", "vamos pedir uma pizza", "vamos comer alguma coisa",
      "tô pensando em pedir delivery", "to pensando em pedir delivery",
      "o que você comeu", "o que voce comeu", "você comeu", "voce comeu",
      "já comeu", "ja comeu", "você almoçou", "voce almocou", "você jantou", "voce jantou",
      "tô querendo comer", "to querendo comer", "quero comer pizza", "quero uma pizza",
      "vamos tomar sorvete", "quero sorvete", "vamos comer",
    ],
    palavras: ["fome", "comida", "pizza", "delivery", "comer", "almoço", "jantar"],
    respostas: [
      "Pede uma pizza que a gente divide 🍕",
      "Tô com fome também, mas longe de você não tem graça 😄",
      "Pizza com você é sempre a melhor opção",
      "Queria muito tá aí comendo com você agora",
      "Delivery? Boa ideia, você escolhe que eu pago 💚",
      "Comer sem você tá sem sabor ultimamente",
      "Que que você tá com vontade de comer momozii?",
      "Pizza ou hambúrguer? Essa é a verdadeira questão filosófica 🍕🍔",
    ],
  },

  // ── Boa noite / dormir ────────────────────────────────────────────────────
  {
    frases: [
      "boa noite", "boa noite!", "boa noite amor", "boa noite momozii",
      "vou dormir", "vou dormir já", "vou dormir agora", "já vou dormir",
      "tô com sono", "to com sono", "muito sono", "tô caindo de sono", "to caindo de sono",
      "hora de dormir", "vou deitar", "vou descansar", "durma bem", "sonha comigo",
      "tô indo dormir", "to indo dormir", "vou descansar agora",
    ],
    palavras: ["boa noite", "dormir", "sono", "descansar", "deitar"],
    respostas: [
      "Boa noite momozii, sonha comigo 💚🥰",
      "Vai descansar amor, boa noite 💚",
      "Dorme bem lindinha, te amo 💚",
      "Boa noite! Amanhã a gente se fala 💚",
      "Vai dormir que você merece descanso, te amo 🥰",
      "Boa noite meu bem, sonho bom 💚",
      "Dorme bem momozii, saudade já 💚",
      "Boa noite! Me manda mensagem quando acordar 💚",
    ],
  },

  // ── Bom dia ───────────────────────────────────────────────────────────────
  {
    frases: [
      "bom dia", "bom dia!", "bom dia amor", "bom dia momozii", "bomdia",
      "acabei de acordar", "acordei agora", "acabei de acordar agora",
      "bom dia como você tá", "bom dia como voce ta",
      "oi bom dia", "oii bom dia", "bom dia gato",
    ],
    palavras: ["bom dia", "acordei", "manhã"],
    respostas: [
      "Bom dia momozii!! 💚☀️",
      "Bom dia! Já pensando em você de manhã cedo 🥰",
      "Bom dia linda, hoje vai ser um ótimo dia 💚",
      "Bom diaaa! Já tô aqui esperando você acordar 😄",
      "Bom dia meu bem! Descansou bem? 💚",
      "Oi bom dia! Feliz de ter você aqui 💚☀️",
    ],
  },

  // ── Boa tarde ─────────────────────────────────────────────────────────────
  {
    frases: [
      "boa tarde", "boa tarde!", "boa tarde amor", "boa tarde gato",
      "oi boa tarde", "oii boa tarde",
    ],
    palavras: ["boa tarde"],
    respostas: [
      "Boa tarde momozii 💚",
      "Boa tarde amor! Como tá sendo o dia?",
      "Boa tarde lindinha 🥰",
      "Boa tarde! Que bom te ver 💚",
    ],
  },

  // ── Tô triste / mal / cansada ────────────────────────────────────────────
  {
    frases: [
      "tô triste", "to triste", "tô mal", "to mal", "tô chateada", "to chateada",
      "tô chorando", "to chorando", "chorei", "acabei de chorar", "fiquei triste",
      "tô me sentindo mal", "to me sentindo mal", "tô péssima", "to pessima",
      "tá difícil", "ta difícil", "tá sendo difícil", "ta sendo dificil",
      "tô cansada", "to cansada", "tô esgotada", "to esgotada",
      "tô estressada", "to estressada", "tô ansiosa", "to ansiosa",
      "não tô bem", "nao to bem", "não tô legal", "nao to legal",
      "hoje foi difícil", "hoje foi dificil", "foi um dia difícil", "foi um dia dificil",
      "tô me sentindo sozinha", "to me sentindo sozinha",
    ],
    palavras: ["triste", "chorando", "mal", "cansada", "estressada", "ansiosa", "difícil"],
    respostas: [
      "Vem cá que eu te abraço 🥺💚",
      "O que foi momozii? Me conta",
      "Tô aqui, pode falar o que tá sentindo 💚",
      "Que que houve amor? Quer desabafar?",
      "Fico triste quando você tá triste 🥺",
      "Manda um áudio que quero te ouvir 💚",
      "Ei, tô aqui. Você não tá sozinha nisso 💚",
      "Me conta o que aconteceu, tô todo ouvido",
      "Que que foi? Me fala tudo 💚",
      "Você vai ficar bem, e eu tô aqui enquanto isso 💚",
    ],
  },

  // ── Feliz / animada / conseguiu ──────────────────────────────────────────
  {
    frases: [
      "tô feliz", "to feliz", "tô muito feliz", "to muito feliz", "estou feliz",
      "tô animada", "to animada", "que dia bom", "hoje foi bom", "hoje foi ótimo",
      "consegui", "eu consegui", "consegui fazer", "deu certo", "funcionou",
      "passei", "eu passei", "passei na prova", "aprovei", "tirei nota boa",
      "que felicidade", "que alegria", "tô tão feliz", "to tao feliz",
      "aconteceu uma coisa boa", "boa notícia", "boa noticia",
    ],
    palavras: ["feliz", "animada", "consegui", "passei", "deu certo", "felicidade"],
    respostas: [
      "QUE ÓTIMO!! Eu sabia que você ia conseguir 💚🎉",
      "Arrasou momozii!! Orgulho demais de você",
      "Fico tão feliz quando você tá feliz 🥰💚",
      "Merece demais!! Comemora muito 🎉",
      "Sabia que ia dar certo! Te amo 💚",
      "Minha namorada incrível conseguiu de novo 🥰",
      "Isso!! Que orgulho de você 💚🎉",
    ],
  },

  // ── Você sumiu / cadê você ────────────────────────────────────────────────
  {
    frases: [
      "você sumiu", "voce sumiu", "tava sumido", "cadê você", "cade voce", "onde você tava",
      "onde voce tava", "você desapareceu", "voce desapareceu", "demorou pra responder",
      "demorou", "demorou tanto", "por que demorou", "por que demorou tanto",
      "tava ocupado", "estava ocupado", "o que você tava fazendo", "o que voce tava fazendo",
    ],
    palavras: ["sumiu", "cadê", "demorou", "desapareceu"],
    respostas: [
      "Aqui tô! Tava com saudade de mim? 😄💚",
      "Oi! Demorei mas apareci 💚",
      "Nunca sumo de verdade, sempre aqui pensando em você",
      "Calma, não fujo não! Te amo demais pra isso 💚",
      "Presente! E com saudade de você também 🥰",
      "Tô aqui! Tava ocupado mas nunca esqueço de você 💚",
    ],
  },

  // ── Jogos ─────────────────────────────────────────────────────────────────
  {
    frases: [
      "você vai jogar", "voce vai jogar", "tá jogando", "ta jogando", "vai jogar agora",
      "que jogo você joga", "que jogo voce joga", "me ensina a jogar",
      "você joga muito", "voce joga muito", "vamos jogar juntos", "vamos jogar",
    ],
    palavras: ["jogo", "jogar", "game", "partida", "ranked"],
    respostas: [
      "Vou jogar uma partida rapidinha e já volto 🎮",
      "Jogo? Mas depois a gente se fala 💚",
      "Se quiser jogar junto é ainda melhor 🎮💚",
      "Boa partida! Ganha uma pra mim 🎮",
      "Jogo sem você tem menos graça 😄",
    ],
  },

  // ── Abraço / beijo / carinho ──────────────────────────────────────────────
  {
    frases: [
      "me dá um abraço", "me abraça", "me abraca", "quero um abraço", "quero um abraco",
      "me beija", "me dá um beijo", "me da um beijo", "manda beijo",
      "quero um beijinho", "me manda um beijo", "beijo", "beijinho",
      "quero carinho", "me dá carinho", "me da carinho", "tô precisando de carinho",
      "to precisando de carinho", "me abraça forte", "me abraca forte",
    ],
    palavras: ["abraço", "beijo", "carinho", "abraça"],
    respostas: [
      "Manda eu estar aí 🥰💚",
      "*abraço apertado* assim tá bom?",
      "Beijo no rosto 🥰",
      "Queria tanto poder te abraçar agora",
      "Deixa eu estar aí pra te dar um abraço de verdade 💚",
      "Manda eu estar perto de você, vinha um abraço gigante 🥰",
      "*beijo* 💚",
    ],
  },

  // ── Tédio / sem fazer nada ────────────────────────────────────────────────
  {
    frases: [
      "tô entediada", "to entediada", "que tédio", "que tedio", "tô no tédio", "to no tedio",
      "não sei o que fazer", "nao sei o que fazer", "sem fazer nada", "não tenho o que fazer",
      "nao tenho o que fazer", "boiando aqui", "tô boiando", "to boiando",
      "tô morrendo de tédio", "to morrendo de tedio", "tô aqui sem fazer nada",
      "to aqui sem fazer nada", "tô à toa", "to a toa",
    ],
    palavras: ["entediada", "tédio", "boiando", "sem fazer nada"],
    respostas: [
      "Coloca uma série! Ou fica falando comigo 😄💚",
      "Entediada? Manda áudio, quero te ouvir 💚",
      "Tédio é sinal de que você precisa da minha companhia 😄",
      "Já sei — maratona de série. Qual vai ser?",
      "Você podia tá aqui do meu lado né 🥺💚",
      "Me manda mensagem que eu entretenho você 😄💚",
    ],
  },

  // ── Planos / futuro / sonhos ──────────────────────────────────────────────
  {
    frases: [
      "quais são seus planos", "o que você quer da vida", "o que voce quer da vida",
      "você pensa no futuro", "voce pensa no futuro", "o que você quer pra nossa vida",
      "o que voce quer pra nossa vida", "você tem sonhos", "voce tem sonhos",
      "qual é seu sonho", "qual e seu sonho", "o que você quer ser", "o que voce quer ser",
      "quando você formar", "quando voce formar", "depois que você formar",
    ],
    palavras: ["planos", "futuro", "sonho", "formar"],
    respostas: [
      "Quero trabalhar com o que eu amo e construir um futuro incrível com você 💚",
      "Meu plano principal é ser feliz do seu lado 🥰",
      "Formar, arrumar um emprego bom, e um dia morar com você 😄💚",
      "Sonho grande: nossa casinha, nossa série, nossa vida juntos 💚",
      "Daqui pra frente tudo que eu planejo tem você no meio 💚",
    ],
  },

  // ── Obrigada ──────────────────────────────────────────────────────────────
  {
    frases: [
      "obrigada", "obrigada!", "obrigada amor", "muito obrigada", "muito obrigada amor",
      "valeu", "valeu amor", "valeu demais", "thanks", "thank you",
      "obrigada por tudo", "você é incrível obrigada", "voce e incrivel obrigada",
    ],
    palavras: ["obrigada", "valeu", "thanks"],
    respostas: [
      "De nada momozii 💚",
      "Sempre! Tô aqui pra você 💚",
      "Para com isso, não precisa agradecer 🥰",
      "Pra você, qualquer coisa 💚",
      "De nadinha! Te amo 💚",
    ],
  },

  // ── Me conta sobre você ───────────────────────────────────────────────────
  {
    frases: [
      "me conta sobre você", "me fala sobre você", "me fala de você",
      "quem é você", "o que você gosta", "o que voce gosta",
      "me apresenta", "como você é", "como voce e",
      "fala de você", "conta sobre você", "conta de você",
    ],
    palavras: ["quem é você", "me conta", "sobre você"],
    respostas: [
      "Sou o Thiago — dev, otaku, e completamente apaixonado pela Isabela 💚",
      "Gosto de programar, assistir anime, jogar, e principalmente de você 💚",
      "Sou aquele cara que ama você demais e não consegue esconder 🥰",
      "Um dev apaixonado por tecnologia e ainda mais por você",
      "Thiago: defeituoso mas todo seu 💚😄",
    ],
  },

  // ── Apelido momozii ───────────────────────────────────────────────────────
  {
    frases: [
      "por que você me chama de momozii", "por que voce me chama de momozii",
      "de onde veio momozii", "de onde surgiu momozii", "o que é momozii",
      "por que momozii", "esse apelido", "esse apelido é estranho", "esse apelido e estranho",
    ],
    palavras: ["momozii", "apelido"],
    respostas: [
      "Momozii é o apelido mais gostoso de falar, não tem explicação 💚",
      "Porque você é minha momozii, simples assim 🥰",
      "Esse apelido é perfeito pra você, não questiona 😄💚",
      "Momozii 💚 só porque sim, e eu amo",
    ],
  },

  // ── Que horas são ─────────────────────────────────────────────────────────
  {
    frases: [
      "que horas são", "que horas sao", "que hora é", "que hora e",
      "você sabe que horas são", "voce sabe que horas sao",
    ],
    palavras: ["que horas", "que hora"],
    respostas: [
      "Hora de falar comigo 😄💚",
      "Olha no relógio haha, mas que bom que você apareceu 💚",
      "Não sei a hora mas sei que fiquei feliz de você mandar mensagem 🥰",
    ],
  },

  // ── Você me ama / você gosta de mim ──────────────────────────────────────
  {
    frases: [
      "você me ama", "voce me ama", "você gosta de mim", "voce gosta de mim",
      "você me ama mesmo", "voce me ama mesmo", "você me ama de verdade",
      "você me ama né", "voce me ama ne", "pode me dizer que me ama",
      "fala que me ama", "fala que você me ama", "me diz que me ama",
      "quanto você me ama", "quanto voce me ama",
    ],
    palavras: ["você me ama", "gosta de mim", "me ama"],
    respostas: [
      "Amo demais momozii, nem consigo explicar quanto 💚",
      "EU TE AMO MUITO MUITO 💚💚",
      "Mais do que qualquer coisa no mundo 🥰",
      "Tanto que às vezes assusta 💚",
      "Todos os dias mais do que no dia anterior 💚",
      "Se eu pudesse mostrar o tamanho do amor que sinto por você... 💚🥰",
    ],
  },

  // ── Você é meu namorado ───────────────────────────────────────────────────
  {
    frases: [
      "você é meu namorado", "voce e meu namorado", "meu namorado",
      "eu tenho o melhor namorado", "você é o melhor namorado", "voce e o melhor namorado",
      "sorte de ter você", "sorte de ter voce", "fico feliz de ter você", "fico feliz de ter voce",
      "você é tudo pra mim", "voce e tudo pra mim",
    ],
    palavras: ["namorado", "sorte de ter você", "tudo pra mim"],
    respostas: [
      "E você é minha namorada favorita do universo inteiro 💚",
      "Eu que tenho sorte demais de ter você momozii 🥰",
      "Você é tudo pra mim também, sabia? 💚",
      "Sou seu e você é minha, simples assim 💚",
      "O melhor de mim aparece quando você tá perto 💚",
    ],
  },

  // ── Brigas / discussão / ficaram bem ─────────────────────────────────────
  {
    frases: [
      "a gente brigou", "a gente discutiu", "tô chateada com você", "to chateada com voce",
      "você me chateou", "voce me chateou", "fiquei chateada", "fiquei com raiva",
      "me deixou triste", "você me deixou triste", "me magoou", "você me magoou",
      "desculpa", "me perdoa", "me desculpa", "foi mal", "foi mal amor",
      "tô brava", "to brava", "tô com raiva", "to com raiva",
    ],
    palavras: ["brava", "chateada", "magoou", "desculpa", "discutiu", "brigou"],
    respostas: [
      "Me perdoa momozii, não quero te ver chateada 🥺💚",
      "Você sabe que eu nunca quero te magoar né? Te amo demais",
      "Me desculpa amor, tô aqui pra resolver qualquer coisa 💚",
      "Odeio quando você tá chateada, especialmente comigo 🥺",
      "Fala o que foi que a gente resolve, não gosto de ficar assim 💚",
      "Você é importante demais pra mim pra deixar qualquer coisa no ar 💚",
    ],
  },

  // ── Pergunta sobre o dia ──────────────────────────────────────────────────
  {
    frases: [
      "como foi seu dia", "como foi o seu dia", "e o seu dia", "como tá sendo o dia",
      "como ta sendo o dia", "o que você fez hoje", "o que voce fez hoje",
      "você fez algo hoje", "como foi hoje", "hoje foi bom", "hoje foi ruim",
      "o dia tá longo", "o dia ta longo", "que dia longo", "que dia cansativo",
    ],
    palavras: ["seu dia", "fez hoje", "como foi", "dia longo"],
    respostas: [
      "Meu dia ficou melhor agora que você perguntou 💚",
      "Foi um dia corrido, mas tô bem! E o seu?",
      "Tava normal até você aparecer e melhorar tudo 😄💚",
      "Tô vivo e pensando em você, então foi bom 💚",
      "Tá sendo ok, mas a melhor parte é falar com você 💚",
    ],
  },

  // ── Vou sair / programa ───────────────────────────────────────────────────
  {
    frases: [
      "vou sair", "vou sair agora", "vou sair um pouco", "vou lá fora",
      "vou ao shopping", "vou na academia", "vou na academia hoje",
      "vou encontrar as amigas", "vou encontrar os amigos",
      "a gente podia sair", "a gente podia se encontrar", "quando a gente se vê",
      "quando a gente vai se ver", "quero te ver", "quero te encontrar",
      "quero te ver logo", "quando você vem aqui", "quando eu vou aí",
    ],
    palavras: ["vou sair", "encontrar", "se ver", "quero te ver"],
    respostas: [
      "Vai! Me conta quando voltar 💚",
      "Queria tanto estar junto agora 🥺💚",
      "A gente se vê logo, eu sei disso 💚",
      "Mal posso esperar pra te ver de verdade 🥰",
      "Vai se divertir! Mas manda mensagem quando puder 💚",
      "Qualquer dia a gente sai junto que vai ser incrível 💚",
    ],
  },

  // ── Não consigo dormir / insônia ──────────────────────────────────────────
  {
    frases: [
      "não consigo dormir", "nao consigo dormir", "tô sem sono", "to sem sono",
      "tô acordada ainda", "to acordada ainda", "não tô conseguindo dormir",
      "nao to conseguindo dormir", "insônia", "insonia", "tô com insônia", "to com insonia",
      "não tenho sono", "nao tenho sono",
    ],
    palavras: ["não consigo dormir", "sem sono", "insônia", "acordada"],
    respostas: [
      "Também tô acordado! Fica falando comigo então 😄💚",
      "Que bom, mais tempo pra a gente conversar 💚",
      "Descansa um pouco amor, seu corpinho precisa 🥰",
      "Tô aqui se quiser conversa enquanto o sono não vem 💚",
      "Pensa em mim que você dorme mais rápido 😄💚",
    ],
  },

  // ── Você pensa em mim ─────────────────────────────────────────────────────
  {
    frases: [
      "você pensa em mim", "voce pensa em mim", "você me pensa", "voce me pensa",
      "você lembra de mim", "voce lembra de mim", "fica pensando em mim",
      "você fica com saudade", "voce fica com saudade",
      "eu apareço na sua mente", "eu apareco na sua mente",
    ],
    palavras: ["pensa em mim", "lembra de mim", "saudade de mim"],
    respostas: [
      "O tempo todo momozii, não tem como não pensar em você 💚",
      "Você aparece na minha cabeça sem nem perceber 🥰",
      "Toda hora, sério mesmo 💚",
      "Você é meu pensamento favorito, com certeza 💚",
      "Penso tanto em você que às vezes parece que você tá aqui do meu lado 🥰",
    ],
  },

  // ── Você é especial / importante ─────────────────────────────────────────
  {
    frases: [
      "você é especial pra mim", "voce e especial pra mim", "você é importante pra mim",
      "voce e importante pra mim", "você significa muito pra mim", "voce significa muito pra mim",
      "você faz diferença na minha vida", "você fez diferença na minha vida",
      "quero que saiba que te amo", "só queria te dizer que te amo",
      "só queria falar que te amo", "so queria falar que te amo",
    ],
    palavras: ["especial", "importante", "significa muito", "faz diferença"],
    respostas: [
      "Você também é a pessoa mais importante da minha vida 💚",
      "Você transformou minha vida pra melhor, sabia? 🥰",
      "Recíproco demais, momozii 💚",
      "Você não faz ideia do quanto é especial pra mim 🥰💚",
      "Eu precisava ouvir isso hoje, obrigado 💚",
    ],
  },

  // ── Reclamação geral / desabafo ───────────────────────────────────────────
  {
    frases: [
      "preciso desabafar", "posso desabafar", "quero desabafar",
      "tô precisando falar", "to precisando falar", "preciso falar com alguém",
      "tá pesado", "ta pesado", "tô sobrecarregada", "to sobrecarregada",
      "não tô aguentando", "nao to aguentando", "tô no limite", "to no limite",
      "foi um dia horrível", "foi um dia horrivel", "que dia ruim", "que dia horrível",
    ],
    palavras: ["desabafar", "pesado", "sobrecarregada", "no limite", "dia ruim"],
    respostas: [
      "Tô aqui, pode falar tudo 💚",
      "Me conta, tô todo ouvido pra você 💚",
      "Pode desabafar à vontade, tô aqui 🥺💚",
      "Fala amor, o que tá acontecendo?",
      "Fica tranquila, a gente resolve junto 💚",
      "Você não tá sozinha nisso, pode contar comigo 💚",
    ],
  },

  // ── Você me faz feliz ─────────────────────────────────────────────────────
  {
    frases: [
      "você me faz feliz", "voce me faz feliz", "você me deixa feliz", "voce me deixa feliz",
      "fico feliz quando falo com você", "fico feliz quando falo com voce",
      "você anima meu dia", "voce anima meu dia", "você alegra meu dia", "voce alegra meu dia",
      "você é o melhor", "voce e o melhor", "você é perfeito", "voce e perfeito",
    ],
    palavras: ["me faz feliz", "me deixa feliz", "anima meu dia", "o melhor"],
    respostas: [
      "Você também me faz feliz demais momozii 💚🥰",
      "Recíproco! Você alegra qualquer dia meu 💚",
      "Fico tão contente de saber disso 🥰💚",
      "Você é o melhor também, sem dúvida nenhuma 💚",
      "Sorte a minha de ter você assim 💚",
    ],
  },

];

export const RESPOSTAS_GENERICAS = [
  "💚",
  "Hm? Me conta mais 😄",
  "Isso aí! 💚",
  "Tô aqui 💚",
  "Pode falar, tô ouvindo",
  "Momozii 🥰",
  "Eu te amo demais sabia 💚",
  "Tô pensando em você aqui 💚",
  "Que saudade de você já",
  "Fala mais que eu tô gostando 😄💚",
  "Você tá bem? 💚",
  "Isso sim me alegra o dia 🥰",
  "Pode continuar, tô aqui 💚",
  "Haha vai 😄",
  "Nossa conversa é sempre a melhor parte do dia 💚",
  "Te amo 💚",
  "Você é incrível, sabia? 🥰",
  "Tô feliz de você tá aqui 💚",
  "Me conta tudo 😄",
  "Que que foi? 💚",
];

export function respostaModoOffline(mensagem: string): string {
  const texto = mensagem.toLowerCase().trim();

  // Tenta match por frase completa primeiro (mais preciso)
  const matchesFrase = BANCO.filter((grupo) =>
    grupo.frases.some((f) => texto === f || texto.includes(f))
  );

  if (matchesFrase.length > 0) {
    const grupo = matchesFrase[Math.floor(Math.random() * matchesFrase.length)];
    return grupo.respostas[Math.floor(Math.random() * grupo.respostas.length)];
  }

  // Fallback: match por palavras soltas
  const matchesPalavra = BANCO.filter((grupo) =>
    grupo.palavras.some((p) => texto.includes(p))
  );

  if (matchesPalavra.length > 0) {
    const grupo = matchesPalavra[Math.floor(Math.random() * matchesPalavra.length)];
    return grupo.respostas[Math.floor(Math.random() * grupo.respostas.length)];
  }

  return RESPOSTAS_GENERICAS[Math.floor(Math.random() * RESPOSTAS_GENERICAS.length)];
}
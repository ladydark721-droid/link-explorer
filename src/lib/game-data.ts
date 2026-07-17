export type Character = {
  id: string;
  name: string;
  title: string;
  ability: string;
  abilityDesc: string;
  color: string;
  glyph: string;
};

export const CHARACTERS: Character[] = [
  {
    id: "kael",
    name: "Kael",
    title: "O Sensitivo",
    ability: "Sentir",
    abilityDesc: "Uma vez por sala, revela se sua próxima resposta está correta antes de confirmar.",
    color: "oklch(0.6 0.2 265)",
    glyph: "☾",
  },
  {
    id: "elara",
    name: "Elara",
    title: "A Curandeira",
    ability: "Curar",
    abilityDesc: "Uma vez por jogo, recupera 2 pontos de vida.",
    color: "oklch(0.75 0.2 145)",
    glyph: "✦",
  },
  {
    id: "serena",
    name: "Serena",
    title: "A Ouvinte",
    ability: "Escutar",
    abilityDesc: "Uma vez por sala, elimina uma resposta errada.",
    color: "oklch(0.7 0.15 200)",
    glyph: "◐",
  },
  {
    id: "marcus",
    name: "Marcus",
    title: "O Transmutador",
    ability: "Transmutar",
    abilityDesc: "Uma vez por jogo, transforma um erro em acerto.",
    color: "oklch(0.72 0.18 55)",
    glyph: "✧",
  },
];

export type Question = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Room = {
  id: number;
  element: "Fogo" | "Água" | "Terra" | "Ar";
  title: string;
  theme: string;
  intro: string;
  outro: string;
  color: string;
  questions: Question[];
};

export const ROOMS: Room[] = [
  {
    id: 1,
    element: "Fogo",
    title: "Sala do Fogo",
    theme: "Combustão e Reações Químicas",
    color: "oklch(0.65 0.2 40)",
    intro:
      "A chama dança no centro da sala. O calor é real. A luz é real. O fogo transforma — Marcus segura a mão. — A combustão é a reação mais antiga e mais perigosa que existe.",
    outro:
      "Você aprendeu: combustão é uma reação química entre um combustível e o oxigênio, liberando luz e calor.",
    questions: [
      {
        q: "Qual dos seguintes é um combustível fóssil?",
        options: ["Álcool", "Petróleo", "Madeira", "Carvão"],
        answer: 1,
        explain: "Petróleo é um combustível fóssil, formado por restos de seres vivos.",
      },
      {
        q: "Um átomo neutro tem distribuição 1s² 2s² 2p⁶ 3s² 3p⁵. A qual período e família ele pertence?",
        options: ["3° período, família 5A (Fósforo)", "2° período, família 5A (Nitrogênio)", "3° período, família 7A (Cloro)", "4° período, família 7A (Bromo)"],
        answer: 2,
        explain: "A camada de valência 3s² 3p⁵ tem 7 elétrons — isso é a família dos halogênios.",
      },
      {
        q: "Sobre a organização da tabela periódica, qual afirmação é CORRETA?",
        options: ["Os gases nobres são estáveis e pouco reativos", "Todos os metais são líquidos", "Os ametais ficam no lado esquerdo", "O hidrogênio é um metal alcalino"],
        answer: 0,
        explain: "Gases nobres têm camada de valência completa — por isso quase não reagem.",
      },
      {
        q: "Qual elemento é usado como combustível em reatores nucleares?",
        options: ["Ferro", "Urânio", "Sódio", "Cálcio"],
        answer: 1,
        explain: "O urânio-235 é físsil e usado como combustível em reatores nucleares.",
      },
      {
        q: "Um átomo neutro possui Z = 19 e A = 39. Quantos prótons, nêutrons e elétrons?",
        options: [
          "19 prótons, 20 nêutrons e 19 elétrons",
          "19 prótons, 19 nêutrons e 20 elétrons",
          "20 prótons, 19 nêutrons e 19 elétrons",
          "39 prótons, 20 nêutrons e 39 elétrons"
        ],
        answer: 0,
        explain: "Z = prótons = 19. Nêutrons = A − Z = 20.",
      },
    ],
  },
  {
    id: 2,
    element: "Água",
    title: "Sala da Água",
    theme: "Eletroquímica",
    color: "oklch(0.6 0.18 220)",
    intro:
      "Água negra escorre pelas paredes. No centro, dois metais mergulhados em soluções zumbem. — Uma pilha viva — diz Elara.",
    outro:
      "Penas negras riscam o pergaminho. 's, p, d, f... a ordem energética é a chave.",
    questions: [
      {
        q: "Qual é a camada de valência do Cálcio (Z = 20) e quantos elétrons?",
        options: [
          "camada M (n=3) com 8 elétrons",
          "camada N (n=4) com 2 elétrons",
          "camada N (n=4) com 8 elétrons",
          "camada L (n=2) com 2 elétrons"
        ],
        answer: 1,
        explain: "Ca (Z=20): 1s² 2s² 2p⁶ 3s² 3p⁶ 4s² — última camada N com 2 elétrons.",
      },
      {
        q: "Oxidação é o processo em que uma espécie:",
        options: ["Ganha elétrons", "Perde elétrons", "Ganha prótons", "Perde nêutrons"],
        answer: 1,
        explain: "OxIdação = perde elétrons.",
      },
      {
        q: "A água do mar conduz eletricidade. Por quê?",
        options: [
          "Porque a água é um metal líquido",
          "Porque contém sais dissolvidos (íons)",
          "Porque a água pura é condutora",
          "Porque o oxigênio da água conduz",
        ],
        answer: 1,
        explain: "A água do mar tem sais dissolvidos (Na⁺ e Cl⁻) que conduzem corrente.",
      },
      {
        q: "O que acontece com o pH da água da chuva quando o CO₂ se dissolve?",
        options: ["Fica mais ácida", "Fica mais básica", "Não se altera", "Congela"],
        answer: 0,
        explain: "CO₂ + H₂O = ácido carbônico → água fica mais ácida.",
      },
      {
        q: "O que acontece com os íons Na⁺ e Cl⁻ quando a água do mar evapora?",
        options: [
          "Viram gás e somem",
          "Se juntam formando sal (NaCl)",
          "Viram água pura",
          "Viram oxigênio e hidrogênio"
        ],
        answer: 1,
        explain: "Os íons se aproximam e formam novamente o sal (NaCl).",
      },
    ],
  },
  {
    id: 3,
    element: "Terra",
    title: "Sala da Terra",
    theme: "Tabela Periódica",
    color: "oklch(0.55 0.12 100)",
    intro:
      "Raízes de pedra rastejam pelo chão. Um relógio de areia gigante marca o tempo. — Aqui — Serena escuta — velocidade é vida.",
    outro:
      "Os períodos são horizontais, as famílias são verticais. A Tabela Periódica é o mapa de tudo.",
    questions: [
      {
        q: "As colunas verticais da Tabela Periódica são chamadas de:",
        options: ["Períodos", "Famílias ou grupos", "Séries", "Camadas eletrônicas"],
        answer: 1,
        explain: "As colunas verticais são as famílias ou grupos.",
      },
      {
        q: "As linhas horizontais da Tabela Periódica são chamadas de:",
        options: ["Famílias", "Grupos", "Períodos", "Séries"],
        answer: 2,
        explain: "As linhas horizontais são os períodos.",
      },
      {
        q: "O número atômico (Z) de um elemento representa:",
        options: ["Número de nêutrons", "Número de prótons", "Massa do átomo", "Elétrons na valência"],
        answer: 1,
        explain: "Z = número de prótons no núcleo.",
      },
      {
        q: "Onde estão localizados os metais na Tabela Periódica?",
        options: ["Lado esquerdo", "Lado direito", "Centro", "Em todas as posições"],
        answer: 0,
        explain: "Os metais ocupam o lado esquerdo e o centro da Tabela.",
      },
      {
        q: "Onde estão localizados os ametais?",
        options: ["Lado esquerdo", "Lado direito", "Centro", "Em todas as posições"],
        answer: 1,
        explain: "Os ametais estão no lado direito da Tabela Periódica.",
      },
    ],
  },
  {
    id: 4,
    element: "Ar",
    title: "Sala do Ar",
    theme: "Gases e Estado Físico",
    color: "oklch(0.7 0.12 200)",
    intro:
      "O vento sussurra fórmulas. O ar está invisível, mas está aqui. — Quem respira — Serena sussurra — precisa entender o que o ar tem.",
    outro:
      "Gases têm massa, ocupam volume, se expandem e se comprimem.",
    questions: [
      {
        q: "O ar é formado principalmente por qual gás?",
        options: ["Oxigênio (O₂)", "Nitrogênio (N₂)", "Gás carbônico (CO₂)", "Hidrogênio (H₂)"],
        answer: 1,
        explain: "O ar é composto principalmente por nitrogênio (78%).",
      },
      {
        q: "Qual gás é liberado na respiração e absorvido pelas plantas?",
        options: ["Oxigênio (O₂)", "Nitrogênio (N₂)", "Gás carbônico (CO₂)", "Hidrogênio (H₂)"],
        answer: 2,
        explain: "Na respiração liberamos CO₂. Na fotossíntese as plantas absorvem CO₂.",
      },
      {
        q: "O ar ocupa espaço. Isso significa que ele tem:",
        options: ["Volume", "Cor", "Cheiro", "Sabor"],
        answer: 0,
        explain: "Gases ocupam volume.",
      },
      {
        q: "O ar quente sobe. Isso acontece porque:",
        options: ["O ar quente é mais denso", "O ar quente é menos denso", "O ar quente tem mais peso", "O ar quente não se move"],
        answer: 1,
        explain: "Ar quente é menos denso que o ar frio, por isso sobe.",
      },
      {
        q: "A pressão atmosférica é maior:",
        options: ["No topo das montanhas", "Ao nível do mar", "No espaço", "No interior da Terra"],
        answer: 1,
        explain: "A pressão é maior ao nível do mar porque há mais ar acima.",
      },
    ],
  },
];

export const ALGRIM_LINES = [
  "Ah, pelo amor... Acertem as malditas perguntas! A torre não quer saber se você é corajoso. Quer saber se você sabe química.",
  "Já pensou em ler um livro? Não? Pois é. Nem eu.",
  "Dica? Toda resposta certa parece óbvia depois. Foque no VERBO da pergunta.",
  "Se a pergunta tem número, olhe os números das opções. Se tem palavra, olhe o significado.",
  "Elimine o absurdo primeiro. Sobra menos coisa para errar.",
];

export const MONK_HINTS: Record<number, string[]> = {
  1: [
    "Petróleo, carvão e gás natural. Tudo veio de seres vivos antigos.",
    "Combustão precisa de três coisas. Sem uma, o fogo morre.",
    "O oxigênio é o que sustenta a chama. Sem ele, só fumaça.",
  ],
  2: [
    "Na água salgada, o que conduz não é a água. São os íons.",
    "Sal na água vira Na⁺ e Cl⁻. É isso que a eletricidade ama.",
    "Água pura não conduz. É a sujeira que faz o trabalho.",
  ],
  3: [
    "A Tabela Periódica tem linhas e colunas. Cada uma tem um nome.",
    "Metais à esquerda. Ametais à direita. Gases nobres à extrema direita.",
    "O número atômico é a identidade do átomo. Não confunda com a massa.",
  ],
  4: [
    "O ar é invisível. Mas ele pesa. Ele ocupa espaço. Ele existe.",
    "Nitrogênio é o que mais tem no ar. Oxigênio vem depois.",
    "Ar quente sobe porque é mais leve que o ar frio. Sempre.",
  ],
};

export type CharacterChallenge = {
  characterId: string;
  title: string;
  description: string;
  type: "find-object" | "identify-poison" | "decode-text" | "forge-item";
  data: any;
  consequence: {
    success: string;
    failure: string;
  };
};

export const CHARACTER_CHALLENGES: CharacterChallenge[] = [
  {
    characterId: "kael",
    title: "A Sala dos Fragmentos",
    description: "Kael sente a radiação. O objeto perdido está aqui, escondido entre os destroços. Encontre-o antes que o tempo acabe.",
    type: "find-object",
    data: {
      objects: [
        { id: "chave", name: "🔑 Chave de bronze", isCorrect: false },
        { id: "amuleto", name: "☢️ Amuleto de chumbo", isCorrect: true },
        { id: "frasco", name: "🧪 Frasco de vidro", isCorrect: false },
        { id: "livro", name: "📖 Livro antigo", isCorrect: false },
      ],
      timeLimit: 15,
    },
    consequence: {
      success: "Kael encontra o amuleto de chumbo! A radiação diminui. Todos ganham +1 PV.",
      failure: "Kael pega o objeto errado. Radiação atinge o grupo. Todos perdem -2 PV.",
    },
  },
 {
    characterId: "elara",
    title: "A Câmara dos Venenos",
    description: "Elara está diante de três frascos. Um contém um veneno mortal. Identifique o veneno pela descrição.",
    type: "identify-poison",
    data: {
      frascos: [
        { id: "frasco1", descricao: "Líquido incolor, cheiro de amêndoas amargas", isPoison: true },
        { id: "frasco2", descricao: "Líquido azul, cheiro de flores", isPoison: false },
        { id: "frasco3", descricao: "Líquido transparente, sem cheiro", isPoison: false },
      ],
    },
    consequence: {
      success: "Elara identifica o veneno! Ela o neutraliza. Todos ganham +1 PV.",
      failure: "Elara escolhe o frasco errado. O veneno se espalha. Todos perdem -1 PV.",
    },
  },
  {
    characterId: "serena",
    title: "O Livro Proibido",
    description: "Serena ouve sussurros. O grimório está à sua frente. As palavras estão embaralhadas. Decodifique a mensagem.",
    type: "decode-text",
    data: {
      encoded: "A T O R R E S E N T R E A P E D R A",
      options: [
        "A TORRE SENTE A PEDRA",
        "A PEDRA SENTE A TORRE",
        "A TORRE GUARDA A PEDRA",
        "A PEDRA GUARDA A TORRE",
      ],
      correctIndex: 0,
    },
    consequence: {
      success: "Serena decodifica a mensagem! Os sussurros se acalmam. Ela ganha uma visão do futuro (+1 dica).",
      failure: "Serena falha. Os sussurros ficam mais altos. Ela perde -1 PV.",
    },
  },
  {
    characterId: "marcus",
    title: "A Forja da Tormenta",
    description: "Marcus precisa forjar uma chave para abrir a porta. Escolha a temperatura correta para aquecer o metal.",
    type: "forge-item",
    data: {
      steps: [
        { id: "step1", descricao: "🔥 Aqueça até 500°C", isCorrect: false },
        { id: "step2", descricao: "🔥 Aqueça até 800°C", isCorrect: true },
        { id: "step3", descricao: "🔥 Aqueça até 1000°C", isCorrect: false },
      ],
    },
    consequence: {
      success: "Marcus forja a chave perfeita! A porta se abre. Todos ganham +2 PV.",
      failure: "Marcus erra a temperatura. O metal quebra. Ele perde -1 PV.",
    },
  },
];

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
  answer: number; // index
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
      "A chama dança no centro da sala. O calor é real. A luz é real. — O fogo transforma — Marcus segura a mão. — A combustão é a reação mais antiga e mais perigosa que existe.",
    outro:
      "Você aprendeu: combustão é uma reação química entre um combustível e o oxigênio, liberando luz e calor. Combustíveis podem ser sólidos, líquidos ou gasosos. O gás carbônico (CO₂) e a água (H₂O) são produtos comuns da combustão completa.",
      {
       q: "Qual dos seguintes é um combustível fóssil?",
  options: [
    "Álcool",
    "Petróleo",
    "Madeira",
    "Carvão",
  ],
  answer: 1, // Petróleo
  explain: "Petróleo é um combustível fóssil, formado por restos de seres vivos ao longo de milhões de anos.",
      },
      {
        q: "Um átomo neutro tem distribuição 1s² 2s² 2p⁶ 3s² 3p⁵. A qual período e família ele pertence?",
        options: ["3° perído, família 5A (Fósforo)", "2° período, família 5A (Nitrogênio) ", "3° período, família 7A (Cloro)", "4° período, família 7A (Bromo)"],
        answer: 2,
        explain: "A camada de valência 3s² 3p⁵ tem 7 elétrons — isso é a família dos halogênios. Esse átomo é o Cloro!",
      },
      {
        q: "Sobre a organização da tabela periódica, qual afirmação é CORRETA?",
        options: ["Os gases nobres da (família 8°A) são estáveis e pouco reativos", "Todos os metais são líquidos à temperatura ambiente", "Os ametais ficam no lado esquerdo da tabela", "O hidrogênio é um metal alcalino típico"],
        answer: 0,
        explain: "Gases nobres (He, Ne, Ar, Kr, Xe, Rn) têm camada de valência completa — por isso quase não reagem.",
      },
      {
        q: "Qual elemento é usado como combustível em reatores nucleares e possui isótopos radioativos naturais?",
        options: ["Ferro", "Urânio", "Sódio", "Cálcio"],
        answer: 1,
        explain: "O urânio-235 é físsil e usado como combustível em reatores nucleares.",
      },
      {
        q: "Um átomo neutro possui número atômico Z = 19 e número de massa A = 39. Quantos prótons, nêutrons e elétrons ele possui?",
        options: [
          "19 prótons, 20 nêutrons e 19 elétrons",
          "19 prótons, 19 nêutrons e 20 elétrons",
          "20 prótons, 19 nêutrons e 19 elétrons",
          "39 prótons, 20 nêutrons e 39 elétrons",
        ],
        answer: 0,
        explain: "Z = prótons = elétrons (átomo neutro) = 19. Nêutrons = A − Z = 39 − 19 = 20. É o Potássio (K).",
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
      "Água negra escorre pelas paredes. No centro, dois metais mergulhados em soluções zumbem. — Uma pilha viva — diz Elara. — Só passa quem entende para onde os elétrons fluem.",
    outro:
      "Penas negras riscam o pergaminho seguindo o diagrama de Linus Pauling. 's, p, d, f... a ordem energética é a chave.",
    questions: [
      {
        q: "Segundo o diagrama de Pauling, qual é a camada de valência do Cálcio (Z = 20) e quantos elétrons ela possui?",
        options: [
          "camada M (n=3) com 8 elétrons",
          "camada N (n=4) com 2 elétrons",
          "camada N (n=4), com 8 elétrons",
          "camada L (n=2), com 2 elétrons",
        ],
        answer: 1,
        explain: "Ca (Z=20): 1s² 2s² 2p⁶ 3s² 3p⁶ 4s². A última camada é N (n=4), com 2 elétrons — por isso é da família 2A.",
      },
      {
        q: "Oxidação é o processo em que uma espécie:",
        options: [
          "Ganha elétrons",
          "Perde elétrons",
          "Ganha prótons",
          "Perde nêutrons",
        ],
        answer: 1,
        explain: "OxIdação = perde elétrons. Mnemônico: OIL RIG (Oxidation Is Loss).",
      },
      {
       q: "A água do mar conduz eletricidade. Qual é o principal motivo para isso?",
      options: [
        "Porque a água é um metal líquido",
        "Porque contém sais dissolvidos (íons)",
        "Porque a água pura é condutora",
        "Porque o oxigênio da água conduz",
      ],
      answer: 1,
      explain: "A água do mar conduz eletricidade porque contém sais dissolvidos (NaCl) que se separam em íons (Na⁺ e Cl⁻), permitindo a passagem da corrente elétrica."
    },
    {
        q: "O que acontece com o pH da água da chuva quando o CO₂ se dissolve?",
      options: [
        "A água fica mais ácida",
        "A água fica mais básica",
        "O pH não se altera",
        "A água congela",
      ],
      answer: 0,
      explain: "O CO₂ reage com a água formando ácido carbônico (H₂CO₃), que libera íons H⁺ e deixa a água mais ácida (pH menor)."
    },
    {
        q: "O que acontece com os íons Na⁺ e Cl⁻ quando a água do mar evapora?",
  options: [
    "Eles viram gás e somem",
    "Eles se juntam de volta formando sal (NaCl)",
    "Eles se transformam em água pura",
    "Eles viram oxigênio e hidrogênio",
  ],
  answer: 1,
  explain: "Quando a água evapora, os íons Na⁺ e Cl⁻ se aproximam e formam novamente o sal (NaCl), que fica depositado."
},
    ],
  },
  {
    id: 3,
    element: "Terra",
    title: "Sala da Terra",
    theme: "TABELA PERIÓDICA",
    color: "oklch(0.55 0.12 100)",
    intro:
      "Raízes de pedra rastejam pelo chão. Um relógio de areia gigante marca o tempo. — Aqui — Serena escuta — velocidade é vida. Quem reage tarde… vira estátua.",
    outro:
      "A rocha se abre. A tabela brilha. A porta se revela. O último sussurro ecoa: 'Os períodos são horizontais, as famílias, verticais. A Tabela Periódica é o mapa de tudo.",
    questions: [
      {
        q: "Na Tabela Periódica, as colunas verticais são chamadas de:",
      options: [
        "Períodos",
        "Famílias ou grupos",
        "Séries",
        "Camadas eletrônicas",
      ],
      answer: 1,
      explain: "As colunas verticais são as famílias ou grupos. As linhas horizontais são os períodos."
      },
      {
       q: "Na Tabela Periódica, as linhas horizontais são chamadas de:",
      options: [
        "Famílias",
        "Grupos",
        "Períodos",
        "Séries químicas",
      ],
      answer: 2,
      explain: "As linhas horizontais são os períodos. Eles indicam o número de camadas eletrônicas."
      },
      {
       q: "O número atômico (Z) de um elemento representa:",
      options: [
        "Número de nêutrons",
        "Número de prótons",
        "Massa do átomo",
        "Número de elétrons na valência",
      ],
      answer: 1,
      explain: "Z = número de prótons no núcleo. É a identidade do elemento."
      },
      {
        q: "Onde estão localizados os metais na Tabela Periódica?",
      options: [
        "Lado esquerdo",
        "Lado direito",
        "Centro",
        "Em todas as posições",
      ],
      answer: 0,
      explain: "Os metais ocupam o lado esquerdo e o centro da Tabela Periódica."
      },
      {
       q: "Onde estão localizados os ametais na Tabela Periódica?",
      options: [
        "Lado esquerdo",
        "Lado direito",
        "Centro",
        "Em todas as posições",
      ],
      answer: 1,
      explain: "Os ametais estão localizados no lado direito da Tabela Periódica.",
      },
    ],
  },
  {
    id: 4,
    element: "Ar",
    title: "Sala do Ar",
    theme: "Gases e Estado Físico da Matéria",
    color: "oklch(0.7 0.12 200)",
    intro:
      "O vento sussurra fórmulas. O ar está invisível, mas está aqui. — Quem respira — Serena sussurra — precisa entender o que o ar tem. E o que ele não tem.",
    outro:
      "Você aprendeu: gases têm massa, ocupam volume, se expandem, se comprimem. O ar é uma mistura de gases. A atmosfera é a camada de ar ao redor da Terra.",
    questions: [
      {
        q: "O ar é formado principalmente por qual gás?",
      options: [
        "Oxigênio (O₂)",
        "Nitrogênio (N₂)",
        "Gás carbônico (CO₂)",
        "Hidrogênio (H₂)",
      ],
      answer: 1,
      explain: "O ar é composto principalmente por nitrogênio (78%), seguido de oxigênio (21%).",
      },
      {
         q: "Qual gás é liberado na respiração e absorvido pelas plantas na fotossíntese?",
      options: [
        "Oxigênio (O₂)",
        "Nitrogênio (N₂)",
        "Gás carbônico (CO₂)",
        "Hidrogênio (H₂)",
      ],
      answer: 2,
      explain: "Na respiração, liberamos CO₂. Na fotossíntese, as plantas absorvem CO₂ para produzir oxigênio.",
      },
      {
      q: "O ar ocupa espaço. Isso significa que ele tem:",
      options: [
        "Volume",
        "Cor",
        "Cheiro",
        "Sabor",
      ],
      answer: 0,
      explain: "Gases ocupam volume. O ar tem massa, ocupa espaço e pode ser comprimido e expandido.",
      },
      {
       q: "O ar quente sobe. Isso acontece porque:",
      options: [
        "O ar quente é mais denso",
        "O ar quente é menos denso",
        "O ar quente tem mais peso",
        "O ar quente não se move",
      ],
      answer: 1,
      explain: "Ar quente é menos denso que o ar frio, por isso sobe.",
      },
      {
          q: "A pressão atmosférica é maior:",
      options: [
        "No topo das montanhas",
        "Ao nível do mar",
        "No espaço",
        "No interior da Terra",
      ],
      answer: 1,
      explain: "A pressão atmosférica é maior ao nível do mar porque há mais ar acima.",
      },
    ],
  },
];

export const ALGRIM_LINES = [
  "Ah, pelo amor... Acertem as malditas perguntas! A torre não quer saber se você é corajoso. Quer saber se você sabe química.",
  "Já pensou em ler um livro? Não? Pois é. Nem eu.",
  "Dica? Toda resposta certa parece óbvia depois. Foque no VERBO da pergunta.",
  "Se a pergunta tem número, olhe os números das opções. Se tem palavra, olhe o significado. Simples.",
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
    "Sal na água vira Na⁺ e Cl⁻. Isso que a eletricidade ama.",
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

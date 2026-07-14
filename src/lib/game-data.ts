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
    theme: "Radioatividade",
    color: "oklch(0.65 0.2 40)",
    intro:
      "A pedra púrpura pulsa no centro da sala. Kael sente o gosto amargo na língua. — Está aqui — sussurra. A radiação. A porta só abre para quem entende o que decai.",
    outro:
      "Você aprendeu: radioatividade é a emissão espontânea de partículas (α, β) e radiação (γ) por núcleos instáveis. A meia-vida é o tempo para metade dos núcleos decaírem.",
    questions: [
      {
        q: "O que é a meia-vida de um elemento radioativo?",
        options: [
          "O tempo total até todos os átomos decaírem",
          "O tempo para metade dos núcleos radioativos decaírem",
          "A metade da massa atômica do elemento",
          "O tempo em que o elemento emite luz",
        ],
        answer: 1,
        explain: "Meia-vida (t½) é o intervalo em que 50% dos núcleos instáveis se desintegram.",
      },
      {
        q: "Qual dessas partículas tem MAIOR poder de penetração?",
        options: ["Alfa (α)", "Beta (β)", "Gama (γ)", "Nêutron térmico"],
        answer: 2,
        explain: "Radiação gama é onda eletromagnética de alta energia — atravessa até chumbo fino.",
      },
      {
        q: "Um isótopo tem meia-vida de 10 anos. Após 30 anos, que fração da amostra original resta?",
        options: ["1/2", "1/4", "1/8", "1/16"],
        answer: 2,
        explain: "3 meias-vidas: (1/2)³ = 1/8 da amostra original.",
      },
      {
        q: "Qual elemento é usado como combustível em reatores nucleares e possui isótopos radioativos naturais?",
        options: ["Ferro", "Urânio", "Sódio", "Cálcio"],
        answer: 1,
        explain: "O urânio-235 é físsil e usado como combustível em reatores nucleares.",
      },
      {
        q: "Ao emitir uma partícula alfa, o núcleo perde:",
        options: [
          "1 próton e 1 nêutron",
          "2 prótons e 2 nêutrons",
          "1 elétron apenas",
          "Somente energia, sem partículas",
        ],
        answer: 1,
        explain: "Partícula α é um núcleo de hélio: 2 prótons + 2 nêutrons.",
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
      "Você aprendeu: em pilhas, oxidação (perde elétrons) ocorre no ânodo e redução (ganha elétrons) no cátodo. Os elétrons fluem do ânodo para o cátodo pelo fio externo.",
    questions: [
      {
        q: "Em uma pilha galvânica, os elétrons fluem pelo fio externo:",
        options: [
          "Do cátodo para o ânodo",
          "Do ânodo para o cátodo",
          "Nos dois sentidos alternadamente",
          "Não fluem — só há íons",
        ],
        answer: 1,
        explain: "Ânodo (oxida, perde e⁻) → Cátodo (reduz, ganha e⁻).",
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
        q: "Numa pilha de Daniell (Zn/Cu²⁺), qual é o ânodo?",
        options: ["Cobre (Cu)", "Zinco (Zn)", "A ponte salina", "O eletrodo padrão de hidrogênio"],
        answer: 1,
        explain: "Zn tem maior potencial de oxidação, sofre oxidação — é o ânodo.",
      },
      {
        q: "A função da ponte salina em uma pilha é:",
        options: [
          "Conduzir elétrons entre os eletrodos",
          "Manter o equilíbrio de cargas nas soluções",
          "Aumentar a voltagem da pilha",
          "Impedir a oxidação",
        ],
        answer: 1,
        explain: "A ponte salina permite migração de íons, mantendo neutralidade elétrica.",
      },
      {
        q: "Se E°(Cu²⁺/Cu) = +0,34 V e E°(Zn²⁺/Zn) = −0,76 V, a ddp padrão da pilha Zn|Cu é:",
        options: ["+0,42 V", "+1,10 V", "−1,10 V", "+0,76 V"],
        answer: 1,
        explain: "ΔE° = E°cátodo − E°ânodo = 0,34 − (−0,76) = +1,10 V.",
      },
    ],
  },
  {
    id: 3,
    element: "Terra",
    title: "Sala da Terra",
    theme: "Cinética Química",
    color: "oklch(0.55 0.12 100)",
    intro:
      "Raízes de pedra rastejam pelo chão. Um relógio de areia gigante marca o tempo. — Aqui — Serena escuta — velocidade é vida. Quem reage tarde… vira estátua.",
    outro:
      "Você aprendeu: cinética estuda a velocidade das reações. Catalisadores diminuem a energia de ativação sem serem consumidos. Temperatura, concentração e superfície de contato também afetam a velocidade.",
    questions: [
      {
        q: "Um catalisador atua em uma reação:",
        options: [
          "Aumentando a energia de ativação",
          "Diminuindo a energia de ativação",
          "Sendo totalmente consumido",
          "Mudando os produtos formados",
        ],
        answer: 1,
        explain: "Catalisadores oferecem um caminho de menor energia de ativação, sem serem consumidos.",
      },
      {
        q: "Ao AUMENTAR a temperatura, a velocidade de uma reação geralmente:",
        options: ["Diminui", "Aumenta", "Não muda", "Zera"],
        answer: 1,
        explain: "Mais energia cinética → mais colisões efetivas → reação mais rápida.",
      },
      {
        q: "Qual fator NÃO afeta a velocidade de uma reação química?",
        options: [
          "Concentração dos reagentes",
          "Superfície de contato",
          "Cor do recipiente",
          "Presença de catalisador",
        ],
        answer: 2,
        explain: "A cor do recipiente não altera colisões nem energia de ativação.",
      },
      {
        q: "Um comprimido efervescente triturado reage mais rápido que inteiro porque:",
        options: [
          "A massa aumenta",
          "A superfície de contato aumenta",
          "A temperatura sobe",
          "O pH muda",
        ],
        answer: 1,
        explain: "Mais superfície exposta → mais colisões por segundo com a água.",
      },
      {
        q: "Energia de ativação (Ea) é:",
        options: [
          "A energia liberada pelos produtos",
          "A energia mínima necessária para iniciar a reação",
          "A diferença entre reagentes e produtos",
          "A energia cinética média das moléculas",
        ],
        answer: 1,
        explain: "Ea é a barreira energética mínima para formar o complexo ativado.",
      },
    ],
  },
  {
    id: 4,
    element: "Ar",
    title: "Sala do Ar",
    theme: "Equilíbrio & Termoquímica",
    color: "oklch(0.7 0.12 200)",
    intro:
      "O vento sussurra fórmulas. Marcus sente o ar denso, quente e frio ao mesmo tempo. — Le Chatelier vigia esta sala — murmura. — Cada escolha desloca o mundo.",
    outro:
      "Você aprendeu: sistemas em equilíbrio respondem a perturbações (Le Chatelier). Reações exotérmicas liberam calor (ΔH < 0); endotérmicas absorvem calor (ΔH > 0).",
    questions: [
      {
        q: "Segundo Le Chatelier, aumentar a concentração de um reagente desloca o equilíbrio:",
        options: [
          "Para os reagentes",
          "Para os produtos",
          "Não afeta o equilíbrio",
          "Interrompe a reação",
        ],
        answer: 1,
        explain: "O sistema 'consome' o excesso, deslocando no sentido dos produtos.",
      },
      {
        q: "Uma reação exotérmica tem:",
        options: ["ΔH > 0", "ΔH < 0", "ΔH = 0", "ΔS < 0 sempre"],
        answer: 1,
        explain: "Exotérmica libera calor → entalpia dos produtos < reagentes → ΔH negativo.",
      },
      {
        q: "Na reação N₂ + 3H₂ ⇌ 2NH₃ (exotérmica), aumentar a temperatura:",
        options: [
          "Aumenta a produção de NH₃",
          "Diminui a produção de NH₃",
          "Não altera nada",
          "Congela a reação",
        ],
        answer: 1,
        explain: "Sistema absorve o calor extra, deslocando no sentido endotérmico (reagentes).",
      },
      {
        q: "A queima de combustível é um exemplo de reação:",
        options: [
          "Endotérmica",
          "Exotérmica",
          "Sem variação de energia",
          "Nuclear",
        ],
        answer: 1,
        explain: "Combustão libera calor e luz → exotérmica (ΔH < 0).",
      },
      {
        q: "Aumentar a pressão em N₂(g) + 3H₂(g) ⇌ 2NH₃(g) desloca o equilíbrio para:",
        options: [
          "Os reagentes (4 mols de gás)",
          "Os produtos (2 mols de gás)",
          "Não desloca",
          "Depende apenas da temperatura",
        ],
        answer: 1,
        explain: "Le Chatelier: pressão ↑ desloca para o lado com menos mols gasosos (produtos).",
      },
    ],
  },
];

export const ALGRIM_LINES = [
  "Ah, pelo amor... Acertem as malditas perguntas! A torre não quer saber se você é corajoso. Quer saber se você sabe química.",
  "Já pensou em ler um livro? Não? Pois é. Nem eu tenho paciência hoje.",
  "Dica? Toda resposta certa parece óbvia depois. Foque no VERBO da pergunta.",
  "Se a pergunta tem número, olhe os números das opções. Se tem palavra, olhe o significado. Simples.",
  "Elimine o absurdo primeiro. Sobra menos coisa para errar.",
];

export const MONK_HINTS: Record<number, string[]> = {
  1: [
    "Meia-vida é METADE. Não é o fim. É o meio.",
    "Gama > Beta > Alfa em penetração. Alfa é papel, gama é chumbo.",
    "Alfa carrega 2 prótons e 2 nêutrons — é um núcleo de hélio.",
  ],
  2: [
    "Ânodo oxida. Cátodo reduz. Elétrons vão do ânodo ao cátodo pelo fio.",
    "Quem tem MENOR potencial de redução é o ânodo (oxida mais fácil).",
    "ΔE° = E°(cátodo) − E°(ânodo). Sinais importam.",
  ],
  3: [
    "Catalisador não muda o produto. Muda o CAMINHO.",
    "Mais superfície → mais colisões. Sempre.",
    "Ea é a montanha. Catalisador cava um túnel mais baixo.",
  ],
  4: [
    "Le Chatelier: o sistema reage CONTRA a perturbação.",
    "Exo libera calor. Aumentar T é 'adicionar produto' num sentido — o equilíbrio foge.",
    "Pressão só afeta gases. Conte os mols gasosos dos dois lados.",
  ],
};

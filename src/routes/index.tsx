import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CHARACTERS, ROOMS, ALGRIM_LINES, MONK_HINTS, type Character } from "@/lib/game-data";
import { GameShell } from "@/components/game/GameShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "A Masmorra dos Elementos — Quiz RPG de Química" },
      {
        name: "description",
        content:
          "RPG dark fantasy educativo: avance pela Torre dos Quatro Ventos respondendo perguntas de química. Radioatividade, eletroquímica, cinética e equilíbrio.",
      },
      { property: "og:title", content: "A Masmorra dos Elementos" },
      { property: "og:description", content: "A masmorra pergunta. Você responde." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MasmorraGame,
});

type Screen =
  | { kind: "title" }
  | { kind: "credits" }
  | { kind: "intro" }
  | { kind: "choose" }
  | { kind: "room-intro"; roomIdx: number }
  | { kind: "playing"; roomIdx: number; qIdx: number; correctInRoom: number }
  | { kind: "room-outro"; roomIdx: number }
  | { kind: "victory" }
  | { kind: "twist" }
  | { kind: "gameover" };

type Feedback = "correct" | "wrong" | null;

const MAX_HP = 5;
const NEED_CORRECT = 3;

function MasmorraGame() {
  const [screen, setScreen] = useState<Screen>({ kind: "title" });
  const [character, setCharacter] = useState<Character | null>(null);
  const [hp, setHp] = useState(MAX_HP);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [monksUsed, setMonksUsed] = useState<number[]>([]);
  const [algrimIdx, setAlgrimIdx] = useState(0);
  const [showAlgrim, setShowAlgrim] = useState(false);
  const [showMonk, setShowMonk] = useState<number | null>(null);
  // Ability state
  const [healUsed, setHealUsed] = useState(false);
  const [transmuteUsed, setTransmuteUsed] = useState(false);
  const [senseUsedInRoom, setSenseUsedInRoom] = useState(false);
  const [listenUsedInRoom, setListenUsedInRoom] = useState(false);
  const [eliminated, setEliminated] = useState<number[]>([]);
  const [senseReveal, setSenseReveal] = useState<null | { idx: number; correct: boolean }>(null);

  function resetGame() {
    setCharacter(null);
    setHp(MAX_HP);
    setFeedback(null);
    setSelected(null);
    setLocked(false);
    setMonksUsed([]);
    setAlgrimIdx(0);
    setShowAlgrim(false);
    setShowMonk(null);
    setHealUsed(false);
    setTransmuteUsed(false);
    setSenseUsedInRoom(false);
    setListenUsedInRoom(false);
    setEliminated([]);
    setSenseReveal(null);
  }

  function startRoom(roomIdx: number) {
    setSenseUsedInRoom(false);
    setListenUsedInRoom(false);
    setEliminated([]);
    setSenseReveal(null);
    setScreen({ kind: "room-intro", roomIdx });
  }

  function enterRoom(roomIdx: number) {
    setScreen({ kind: "playing", roomIdx, qIdx: 0, correctInRoom: 0 });
  }

  function advanceQuestion(playing: Extract<Screen, { kind: "playing" }>, gotIt: boolean) {
    const newCorrect = playing.correctInRoom + (gotIt ? 1 : 0);
    // Room clear condition
    if (newCorrect >= NEED_CORRECT) {
      setScreen({ kind: "room-outro", roomIdx: playing.roomIdx });
      return;
    }
    const room = ROOMS[playing.roomIdx];
    const nextQ = playing.qIdx + 1;
    if (nextQ >= room.questions.length) {
      // Ran out of questions without hitting 3
      setScreen({ kind: "gameover" });
      return;
    }
    setScreen({ kind: "playing", roomIdx: playing.roomIdx, qIdx: nextQ, correctInRoom: newCorrect });
    setEliminated([]);
    setSenseReveal(null);
  }

  function submitAnswer(idx: number) {
    if (locked || screen.kind !== "playing") return;
    const room = ROOMS[screen.roomIdx];
    const question = room.questions[screen.qIdx];
    const correct = idx === question.answer;

    setSelected(idx);
    setLocked(true);

    if (correct) {
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
        setLocked(false);
        advanceQuestion(screen, true);
      }, 900);
    } else {
      // Check transmute ability
      let effectiveHp = hp - 1;
      let gotIt = false;
      if (character?.id === "marcus" && !transmuteUsed) {
        // Auto-offer? We'll make Marcus's ability manual (button). So no auto here.
      }
      setFeedback("wrong");
      setHp(effectiveHp);
      setTimeout(() => {
        setFeedback(null);
        setSelected(null);
        setLocked(false);
        if (effectiveHp <= 0) {
          setScreen({ kind: "gameover" });
          return;
        }
        advanceQuestion(screen, gotIt);
      }, 1100);
    }
  }

  function useHeal() {
    if (healUsed || hp >= MAX_HP) return;
    setHealUsed(true);
    setHp(Math.min(MAX_HP, hp + 2));
  }

  function useTransmute() {
    if (transmuteUsed || screen.kind !== "playing" || !locked || feedback !== "wrong") return;
    // Convert wrong to right: cancel HP loss, mark correct.
    setTransmuteUsed(true);
    setHp((h) => Math.min(MAX_HP, h + 1)); // refund the lost HP
    setFeedback("correct");
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setLocked(false);
      if (screen.kind === "playing") advanceQuestion(screen, true);
    }, 700);
  }

  function useSense() {
    if (senseUsedInRoom || screen.kind !== "playing" || selected === null || locked) return;
    const room = ROOMS[screen.roomIdx];
    const q = room.questions[screen.qIdx];
    setSenseUsedInRoom(true);
    setSenseReveal({ idx: selected, correct: selected === q.answer });
  }

  function useListen() {
    if (listenUsedInRoom || screen.kind !== "playing") return;
    const room = ROOMS[screen.roomIdx];
    const q = room.questions[screen.qIdx];
    // Eliminate one wrong option (that isn't already eliminated)
    const wrongs = q.options.map((_, i) => i).filter((i) => i !== q.answer && !eliminated.includes(i));
    if (wrongs.length === 0) return;
    const pick = wrongs[Math.floor(Math.random() * wrongs.length)];
    setEliminated([...eliminated, pick]);
    setListenUsedInRoom(true);
  }

  function askAlgrim() {
    setAlgrimIdx((i) => (i + 1) % ALGRIM_LINES.length);
    setShowAlgrim(true);
  }

  function askMonk(idx: number) {
    if (monksUsed.includes(idx) || screen.kind !== "playing") return;
    setMonksUsed([...monksUsed, idx]);
    setShowMonk(idx);
  }

  return (
    <GameShell>
      {screen.kind === "title" && (
        <TitleScreen onStart={() => setScreen({ kind: "intro" })} onCredits={() => setScreen({ kind: "credits" })} />
      )}
      {screen.kind === "credits" && <Credits onBack={() => setScreen({ kind: "title" })} />}
      {screen.kind === "intro" && <IntroScreen onNext={() => setScreen({ kind: "choose" })} />}
      {screen.kind === "choose" && (
        <ChooseCharacter
          onPick={(c) => {
            setCharacter(c);
            startRoom(0);
          }}
        />
      )}
      {screen.kind === "room-intro" && (
        <RoomIntro
          roomIdx={screen.roomIdx}
          onEnter={() => enterRoom(screen.roomIdx)}
        />
      )}
      {screen.kind === "playing" && character && (
        <PlayingScreen
          roomIdx={screen.roomIdx}
          qIdx={screen.qIdx}
          correctInRoom={screen.correctInRoom}
          hp={hp}
          character={character}
          selected={selected}
          feedback={feedback}
          locked={locked}
          eliminated={eliminated}
          senseReveal={senseReveal}
          onSelect={(i) => !locked && setSelected(i)}
          onSubmit={() => selected !== null && submitAnswer(selected)}
          healUsed={healUsed}
          transmuteUsed={transmuteUsed}
          senseUsedInRoom={senseUsedInRoom}
          listenUsedInRoom={listenUsedInRoom}
          onHeal={useHeal}
          onTransmute={useTransmute}
          onSense={useSense}
          onListen={useListen}
          onAskAlgrim={askAlgrim}
          onAskMonk={askMonk}
          monksUsed={monksUsed}
        />
      )}
      {screen.kind === "room-outro" && (
        <RoomOutro
          roomIdx={screen.roomIdx}
          onNext={() => {
            const next = screen.roomIdx + 1;
            if (next >= ROOMS.length) setScreen({ kind: "twist" });
            else startRoom(next);
          }}
        />
      )}
      {screen.kind === "twist" && <TwistScreen onNext={() => setScreen({ kind: "victory" })} />}
      {screen.kind === "victory" && (
        <EndScreen
          title="Heróis da Masmorra"
          message="Você achou o Coração de Glacia. Dizem os mais velhos que, naquele dia, o céu de Aetheria voltou a ser azul. E nunca mais ficou verde."
          tone="victory"
          onRestart={() => {
            resetGame();
            setScreen({ kind: "title" });
          }}
        />
      )}
      {screen.kind === "gameover" && (
        <EndScreen
          title="O Destino de Quem Errou"
          message="Seus nomes agora são apenas um eco nas paredes da masmorra. Mas toda derrota é uma lição. A torre ainda está lá. Esperando."
          tone="loss"
          onRestart={() => {
            resetGame();
            setScreen({ kind: "title" });
          }}
        />
      )}

      {/* NPC modals */}
      {showAlgrim && (
        <NpcModal
          name="Algrim"
          subtitle="o velho rabugento"
          line={ALGRIM_LINES[algrimIdx]}
          onClose={() => setShowAlgrim(false)}
        />
      )}
      {showMonk !== null && screen.kind === "playing" && (
        <NpcModal
          name={`Monge ${["Ígneo", "Fluído", "Terreno", "Etéreo"][showMonk]}`}
          subtitle="dica certeira, uma única vez"
          line={MONK_HINTS[ROOMS[screen.roomIdx].id]?.[showMonk] ?? "O silêncio também ensina."}
          onClose={() => setShowMonk(null)}
        />
      )}
    </GameShell>
  );
}

/* ---------- Screens ---------- */

function TitleScreen({ onStart, onCredits }: { onStart: () => void; onCredits: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center animate-rise">
      <div className="animate-flicker">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/80">Torre dos Quatro Ventos</p>
        <h1 className="mt-3 text-4xl font-bold text-foreground drop-shadow-[0_0_20px_var(--color-poison)]">
          A Masmorra
          <br />
          dos Elementos
        </h1>
        <p className="mt-4 text-sm italic text-muted-foreground">A masmorra pergunta. Você responde.</p>
      </div>
      <div className="my-4 h-px w-32 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="flex w-full flex-col gap-3">
        <PrimaryButton onClick={onStart}>Iniciar Jornada</PrimaryButton>
        <GhostButton onClick={onCredits}>Créditos</GhostButton>
      </div>
      <p className="mt-6 text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Química · Ensino Médio · Singleplayer
      </p>
    </div>
  );
}

function Credits({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-6 animate-rise">
      <h2 className="text-center text-2xl">Créditos</h2>
      <div className="stone-panel rounded-xl p-5 text-sm leading-relaxed text-muted-foreground">
        <p className="mb-3 text-foreground">Um jogo educativo de Química.</p>
        <p><span className="text-primary">Design & Narrativa:</span> Dark Lady</p>
        <p><span className="text-primary">Conteúdo:</span> Radioatividade, Eletroquímica, Cinética, Equilíbrio & Termoquímica</p>
        <p><span className="text-primary">Público:</span> Ensino Médio (16-18)</p>
        <p className="mt-3 italic">"Quem acerta as perguntas, volta. Quem erra, vira história."</p>
      </div>
      <GhostButton onClick={onBack}>Voltar</GhostButton>
    </div>
  );
}

function IntroScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-6 py-4 animate-rise">
      <h2 className="text-center text-xl">Dizem os mais velhos…</h2>
      <div className="stone-panel rounded-xl p-5 text-sm leading-relaxed">
        <p>O reino de <span className="text-primary">Aetheria</span> já foi lindo.</p>
        <p className="mt-2">Mas tudo mudou quando o <span className="text-[color:var(--color-poison)]">Sussurro Verde</span> despertou. Um gás chamado <b>Cloro</b>. Invisível. Mortal.</p>
        <p className="mt-2">Os rios viraram veneno. Os pássaros caíram do céu.</p>
        <p className="mt-2">No fundo da <b>Torre dos Quatro Ventos</b> existe uma pedra que pode purificar tudo: o <span className="text-[color:var(--color-arcane)]">Coração de Glacia</span>.</p>
        <p className="mt-2">Muitos tentaram. Nenhum voltou.</p>
        <p className="mt-3 italic text-muted-foreground">Vocês são aprendizes de alquimia. Não heróis. Mas a torre não liga para títulos.</p>
        <p className="mt-2 italic text-muted-foreground">Que a química esteja com vocês.</p>
      </div>
      <PrimaryButton onClick={onNext}>Escolher personagem</PrimaryButton>
    </div>
  );
}

function ChooseCharacter({ onPick }: { onPick: (c: Character) => void }) {
  return (
    <div className="flex flex-1 flex-col gap-4 py-2 animate-rise">
      <div className="text-center">
        <h2 className="text-2xl">Escolha sua Alma</h2>
        <p className="mt-1 text-xs text-muted-foreground">A torre respeita quem sabe o que carrega.</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c)}
            className="stone-panel group flex items-center gap-4 rounded-xl p-4 text-left transition hover:scale-[1.02] hover:border-primary/60"
            style={{ borderColor: c.color + "55" }}
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl animate-pulse-glow"
              style={{ background: `radial-gradient(circle, ${c.color}33, transparent 70%)`, color: c.color }}
            >
              {c.glyph}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <p className="text-lg text-foreground">{c.name}</p>
                <p className="text-xs italic text-muted-foreground">{c.title}</p>
              </div>
              <p className="mt-1 text-xs text-primary">{c.ability}</p>
              <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{c.abilityDesc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RoomIntro({ roomIdx, onEnter }: { roomIdx: number; onEnter: () => void }) {
  const room = ROOMS[roomIdx];
  return (
    <div className="flex flex-1 flex-col justify-between gap-6 py-4 animate-rise">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70">Andar {room.id} — {room.element}</p>
        <h2 className="mt-2 text-2xl" style={{ color: room.color }}>{room.title}</h2>
        <p className="text-xs italic text-muted-foreground">{room.theme}</p>
      </div>
      <div className="stone-panel rounded-xl p-5 text-sm leading-relaxed">
        <p>{room.intro}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <span>Acerte <b className="text-primary">{NEED_CORRECT}</b> perguntas</span>
          <span>Perde 1 PV por erro</span>
        </div>
      </div>
      <PrimaryButton onClick={onEnter}>Entrar na sala</PrimaryButton>
    </div>
  );
}

function PlayingScreen(props: {
  roomIdx: number;
  qIdx: number;
  correctInRoom: number;
  hp: number;
  character: Character;
  selected: number | null;
  feedback: Feedback;
  locked: boolean;
  eliminated: number[];
  senseReveal: null | { idx: number; correct: boolean };
  onSelect: (i: number) => void;
  onSubmit: () => void;
  healUsed: boolean;
  transmuteUsed: boolean;
  senseUsedInRoom: boolean;
  listenUsedInRoom: boolean;
  onHeal: () => void;
  onTransmute: () => void;
  onSense: () => void;
  onListen: () => void;
  onAskAlgrim: () => void;
  onAskMonk: (i: number) => void;
  monksUsed: number[];
}) {
  const room = ROOMS[props.roomIdx];
  const question = room.questions[props.qIdx];
  const bg = props.feedback === "correct" ? "animate-correct" : props.feedback === "wrong" ? "animate-wrong" : "";

  const monkIdx = props.roomIdx; // one monk per room

  return (
    <div className={`flex flex-1 flex-col gap-4 py-2 ${bg}`}>
      {/* HUD */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{room.title}</p>
          <p className="text-primary">Acertos: {props.correctInRoom}/{NEED_CORRECT}</p>
        </div>
        <div className="flex items-center gap-1" aria-label={`Vida: ${props.hp} de ${MAX_HP}`}>
          {Array.from({ length: MAX_HP }).map((_, i) => (
            <span
              key={i}
              className="text-lg leading-none transition"
              style={{ color: i < props.hp ? "var(--color-blood)" : "oklch(0.3 0.02 240)" }}
            >
              ♥
            </span>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="stone-panel rune-border rounded-xl p-4 animate-rise">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{room.theme}</p>
        <h3 className="mt-1 text-base leading-snug text-foreground">{question.q}</h3>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2">
        {question.options.map((opt, i) => {
          const isSelected = props.selected === i;
          const isEliminated = props.eliminated.includes(i);
          const revealHere = props.senseReveal && props.senseReveal.idx === i;
          const showCorrect = props.feedback === "correct" && isSelected;
          const showWrong = props.feedback === "wrong" && isSelected;
          return (
            <button
              key={i}
              disabled={props.locked || isEliminated}
              onClick={() => props.onSelect(i)}
              className={`stone-panel rounded-lg px-3 py-3 text-left text-sm transition disabled:opacity-40 ${
                isSelected ? "border-primary ring-2 ring-primary/60" : ""
              } ${showCorrect ? "!border-[color:var(--color-poison)] ring-[color:var(--color-poison)]" : ""} ${
                showWrong ? "!border-[color:var(--color-blood)] ring-[color:var(--color-blood)]" : ""
              } ${isEliminated ? "line-through" : ""}`}
            >
              <span className="mr-2 text-primary/70">{String.fromCharCode(65 + i)}.</span>
              {opt}
              {revealHere && (
                <span className="ml-2 text-[10px] italic text-muted-foreground">
                  ({props.senseReveal!.correct ? "sinto verdade" : "sinto engano"})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation on wrong (brief) */}
      {props.feedback === "wrong" && (
        <p className="text-xs italic text-[color:var(--color-blood)]/90">{question.explain}</p>
      )}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2">
        <PrimaryButton onClick={props.onSubmit} disabled={props.selected === null || props.locked}>
          Confirmar resposta
        </PrimaryButton>

        {/* Ability row */}
        <div className="flex flex-wrap gap-2">
          {props.character.id === "kael" && (
            <MiniButton onClick={props.onSense} disabled={props.senseUsedInRoom || props.selected === null || props.locked}>
              ☾ Sentir
            </MiniButton>
          )}
          {props.character.id === "elara" && (
            <MiniButton onClick={props.onHeal} disabled={props.healUsed || props.hp >= MAX_HP}>
              ✦ Curar (+2 PV)
            </MiniButton>
          )}
          {props.character.id === "serena" && (
            <MiniButton onClick={props.onListen} disabled={props.listenUsedInRoom || props.locked}>
              ◐ Escutar (−1 errada)
            </MiniButton>
          )}
          {props.character.id === "marcus" && (
            <MiniButton
              onClick={props.onTransmute}
              disabled={props.transmuteUsed || props.feedback !== "wrong"}
            >
              ✧ Transmutar erro
            </MiniButton>
          )}
          <MiniButton onClick={props.onAskAlgrim}>Perguntar a Algrim</MiniButton>
          <MiniButton onClick={() => props.onAskMonk(monkIdx)} disabled={props.monksUsed.includes(monkIdx)}>
            Monge {["Ígneo","Fluído","Terreno","Etéreo"][monkIdx]}
          </MiniButton>
        </div>
      </div>
    </div>
  );
}

function RoomOutro({ roomIdx, onNext }: { roomIdx: number; onNext: () => void }) {
  const room = ROOMS[roomIdx];
  const isLast = roomIdx === ROOMS.length - 1;
  return (
    <div className="flex flex-1 flex-col justify-between gap-6 py-4 animate-rise">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70">Porta aberta</p>
        <h2 className="mt-2 text-2xl" style={{ color: room.color }}>Sala do {room.element} completada</h2>
      </div>
      <div className="stone-panel rounded-xl p-5 text-sm leading-relaxed">
        <p className="text-primary">O que você aprendeu:</p>
        <p className="mt-2">{room.outro}</p>
      </div>
      <PrimaryButton onClick={onNext}>{isLast ? "Alcançar o topo" : "Subir mais um andar"}</PrimaryButton>
    </div>
  );
}

function TwistScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-6 py-4 animate-rise">
      <h2 className="text-center text-2xl text-[color:var(--color-arcane)]">O Coração de Glacia</h2>
      <div className="stone-panel rune-border rounded-xl p-5 text-sm leading-relaxed animate-flicker">
        <p>No altar, a pedra brilha. Fria. Simples. Você a toca…</p>
        <p className="mt-2 italic text-muted-foreground">…e ela é apenas <b>gelo</b>. Água comum, cristalizada.</p>
        <p className="mt-3">Um sussurro ecoa pela torre:</p>
        <p className="mt-2 text-primary">"A pedra não purifica nada. Nunca purificou."</p>
        <p className="mt-3">Você entende. O gás verde não some com magia. Some com <b>conhecimento</b> — sabendo o que ele é, como reage, como neutralizá-lo.</p>
        <p className="mt-2 italic">O verdadeiro Coração de Glacia sempre foi a química que você aprendeu para chegar até aqui.</p>
      </div>
      <PrimaryButton onClick={onNext}>Descer da torre</PrimaryButton>
    </div>
  );
}

function EndScreen({
  title,
  message,
  tone,
  onRestart,
}: {
  title: string;
  message: string;
  tone: "victory" | "loss";
  onRestart: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center animate-rise">
      <h2
        className="text-3xl"
        style={{ color: tone === "victory" ? "var(--color-poison)" : "var(--color-blood)" }}
      >
        {title}
      </h2>
      <p className="stone-panel rounded-xl p-5 text-sm leading-relaxed">{message}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">Fim do jogo</p>
      <PrimaryButton onClick={onRestart}>Jogar novamente</PrimaryButton>
    </div>
  );
}

function NpcModal({
  name,
  subtitle,
  line,
  onClose,
}: {
  name: string;
  subtitle: string;
  line: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="stone-panel w-full max-w-md rounded-xl p-5 animate-rise"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-lg text-primary">{name}</p>
            <p className="text-xs italic text-muted-foreground">{subtitle}</p>
          </div>
          <button className="text-muted-foreground" onClick={onClose} aria-label="Fechar">✕</button>
        </div>
        <p className="mt-4 text-sm leading-relaxed">{line}</p>
        <button
          className="mt-4 w-full rounded-md border border-border py-2 text-xs uppercase tracking-widest text-muted-foreground hover:border-primary"
          onClick={onClose}
        >
          Voltar à sala
        </button>
      </div>
    </div>
  );
}

/* ---------- Buttons ---------- */

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-md border border-primary/60 bg-primary/15 py-3 text-sm uppercase tracking-widest text-primary transition hover:bg-primary/25 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md border border-border py-3 text-xs uppercase tracking-widest text-muted-foreground transition hover:border-primary hover:text-primary"
    >
      {children}
    </button>
  );
}

function MiniButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-border bg-secondary/40 px-2.5 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-40"
    >
      {children}
    </button>
  );
}

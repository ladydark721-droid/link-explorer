import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CHARACTERS, ROOMS, ALGRIM_LINES, MONK_HINTS, type Character } from "@/lib/game-data";
import { GameShell } from "@/components/game/GameShell";
import charKael from "@/assets/char-kael.jpg";
import charElara from "@/assets/char-elara.jpg";
import charSerena from "@/assets/char-serena.jpg";
import charMarcus from "@/assets/char-marcus.jpg";
import roomFire from "@/assets/room-fire.jpg";
import roomWater from "@/assets/room-water.jpg";
import roomEarth from "@/assets/room-earth.jpg";
import roomAir from "@/assets/room-air.jpg";
import heartGlacia from "@/assets/heart-glacia.jpg";
import { ChallengeScreen } from "@/components/ChallengeScreen";
import { CHARACTER_CHALLENGES } from "@/lib/game-data";

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

const CHAR_IMAGES: Record<string, string> = {
  kael: charKael,
  elara: charElara,
  serena: charSerena,
  marcus: charMarcus,
};

const ROOM_IMAGES = [roomFire, roomWater, roomEarth, roomAir];

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
  const [challengeCompleted, setChallengeCompleted] = useState<Record<string, boolean>>({});
const [challengeResult, setChallengeResult] = useState<Record<string, "success" | "failure" | null>>({});
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [monksUsed, setMonksUsed] = useState<number[]>([]);
  const [algrimIdx, setAlgrimIdx] = useState(0);
  const [showAlgrim, setShowAlgrim] = useState(false);
  const [showMonk, setShowMonk] = useState<number | null>(null);
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
    setChallengeCompleted({});
setChallengeResult({});
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
    if (newCorrect >= NEED_CORRECT) {
      setScreen({ kind: "room-outro", roomIdx: playing.roomIdx });
      return;
    }
    const room = ROOMS[playing.roomIdx];
    const nextQ = playing.qIdx + 1;
    if (nextQ >= room.questions.length) {
      setScreen({ kind: "gameover" });
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
  setChallengeCompleted({});
  setChallengeResult({});
  setScreen({ kind: "title" });
}
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
      const effectiveHp = hp - 1;
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
        advanceQuestion(screen, false);
      }, 1200);
    }
  }

  function useHeal() {
    if (healUsed || hp >= MAX_HP) return;
    setHealUsed(true);
    setHp(Math.min(MAX_HP, hp + 2));
  }

  function useTransmute() {
    if (transmuteUsed || screen.kind !== "playing" || !locked || feedback !== "wrong") return;
    setTransmuteUsed(true);
    setHp((h) => Math.min(MAX_HP, h + 1));
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
        <RoomIntro roomIdx={screen.roomIdx} onEnter={() => enterRoom(screen.roomIdx)} />
      )}
      {character && !challengeCompleted[character.id] && (
  <ChallengeScreen
    challenge={CHARACTER_CHALLENGES.find(c => c.characterId === character.id)!}
    characterName={character.name}
    onComplete={(result) => {
      setChallengeCompleted(prev => ({ ...prev, [character.id]: true }));
      setChallengeResult(prev => ({ ...prev, [character.id]: result }));
      const challenge = CHARACTER_CHALLENGES.find(c => c.characterId === character.id);
      if (challenge) {
        if (result === "success") {
          setHp(prev => Math.min(MAX_HP, prev + 1));
        } else {
          setHp(prev => Math.max(0, prev - 2));
        }
      }
      startRoom(0);
    }}
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

/* ---------- Reusable ---------- */

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`parchment illuminated rounded-md p-5 ${className}`}>
      <span className="illum-corner tl" />
      <span className="illum-corner tr" />
      <span className="illum-corner bl" />
      <span className="illum-corner br" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------- Screens ---------- */

function TitleScreen({ onStart, onCredits }: { onStart: () => void; onCredits: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center animate-rise">
      <div className="animate-flicker">
        <p className="gothic-serif text-[11px] uppercase tracking-[0.5em] text-[color:var(--color-blood)]">
          Torre dos Quatro Ventos
        </p>
        <h1 className="blackletter mt-4 text-5xl leading-[0.95] text-[color:var(--color-ink)]">
          A Masmorra
          <br />
          dos Elementos
        </h1>
        <div className="gilded-rule mx-auto mt-5 w-48" />
        <p className="mt-4 gothic-serif text-sm italic text-[color:var(--color-blood)]/80">
          A masmorra pergunta. Você responde.
        </p>
      </div>
      <div className="flex w-full flex-col gap-3">
        <button onClick={onStart} className="btn-seal w-full">Iniciar Jornada</button>
        <button onClick={onCredits} className="btn-ghost w-full">Créditos</button>
      </div>
      <p className="mt-2 gothic-serif text-[10px] uppercase tracking-[0.35em] text-[color:var(--color-ink)]/60">
        Química · Ensino Médio · Singleplayer
      </p>
    </div>
  );
}

function Credits({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-6 animate-rise">
      <h2 className="text-center text-3xl blackletter">Créditos</h2>
      <Panel>
        <p className="mb-3 gothic-serif text-[color:var(--color-blood)]">Um jogo educativo de Química.</p>
        <p><span className="gothic-serif text-[color:var(--color-blood)]">Design & Narrativa:</span> Dark Lady</p>
        <p><span className="gothic-serif text-[color:var(--color-blood)]">Conteúdo:</span> Radioatividade, Eletroquímica, Cinética, Equilíbrio & Termoquímica</p>
        <p><span className="gothic-serif text-[color:var(--color-blood)]">Público:</span> Ensino Médio (16–18)</p>
        <p className="mt-3 italic">"Quem acerta as perguntas, volta. Quem erra, vira história."</p>
      </Panel>
      <button onClick={onBack} className="btn-ghost">Voltar</button>
    </div>
  );
}

function IntroScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-6 py-2 animate-rise">
      <h2 className="text-center text-2xl blackletter">Dizem os mais velhos…</h2>
      <Panel className="text-[15px] leading-relaxed">
        <p className="dropcap">
          O reino de <b>Aetheria</b> já foi belo. Mas tudo mudou quando o <span className="text-[color:var(--color-poison)] font-semibold">Sussurro Verde</span> despertou —
          um gás chamado <b>Cloro</b>. Invisível. Mortal.
        </p>
        <p className="mt-3">Os rios viraram veneno. Os pássaros caíram do céu.</p>
        <p className="mt-3">
          No fundo da <b>Torre dos Quatro Ventos</b> existe uma pedra capaz de purificar tudo:
          o <span className="text-[color:var(--color-ice)] font-semibold">Coração de Glacia</span>.
        </p>
        <p className="mt-3">Muitos tentaram. Nenhum voltou.</p>
        <p className="mt-4 italic">
          Vocês são aprendizes de alquimia. Não heróis. Mas a torre não liga para títulos.
        </p>
        <p className="mt-2 italic">Que a química esteja com vocês.</p>
      </Panel>
      <button onClick={onNext} className="btn-seal">Escolher personagem</button>
    </div>
  );
}

function ChooseCharacter({ onPick }: { onPick: (c: Character) => void }) {
  return (
    <div className="flex flex-1 flex-col gap-4 py-2 animate-rise">
      <div className="text-center">
        <h2 className="text-3xl blackletter">Escolha sua Alma</h2>
        <p className="mt-1 gothic-serif text-xs text-[color:var(--color-ink)]/70">
          A torre respeita quem sabe o que carrega.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {CHARACTERS.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c)}
            className="parchment illuminated group flex items-center gap-4 rounded-md p-3 text-left transition hover:-translate-y-[2px] hover:shadow-2xl"
          >
            <span className="illum-corner tl" />
            <span className="illum-corner tr" />
            <span className="illum-corner bl" />
            <span className="illum-corner br" />
            <div className="plate relative h-24 w-20 shrink-0 overflow-hidden rounded">
              <img
                src={CHAR_IMAGES[c.id]}
                alt={c.name}
                width={768}
                height={1024}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative flex-1">
              <div className="flex items-baseline gap-2">
                <p className="gothic-serif text-xl text-[color:var(--color-ink)]">{c.name}</p>
                <p className="text-xs italic text-[color:var(--color-ink)]/70">— {c.title}</p>
              </div>
              <p className="mt-1 gothic-serif text-xs uppercase tracking-widest text-[color:var(--color-blood)]">
                {c.ability}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-[color:var(--color-ink)]/85">
                {c.abilityDesc}
              </p>
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
    <div className="flex flex-1 flex-col justify-between gap-5 py-2 animate-rise">
      <div className="text-center">
        <p className="gothic-serif text-xs uppercase tracking-[0.4em] text-[color:var(--color-blood)]/80">
          Andar {room.id} — {room.element}
        </p>
        <h2 className="mt-2 text-3xl blackletter">{room.title}</h2>
        <p className="gothic-serif text-xs italic text-[color:var(--color-ink)]/70">{room.theme}</p>
      </div>
      <div className="plate mx-auto w-full overflow-hidden rounded animate-ember">
        <img
          src={ROOM_IMAGES[roomIdx]}
          alt={room.title}
          width={1024}
          height={768}
          loading="lazy"
          className="h-40 w-full object-cover"
        />
      </div>
      <Panel className="text-[15px] leading-relaxed">
        <p className="dropcap">{room.intro}</p>
        <div className="gilded-rule my-3" />
        <div className="flex items-center justify-between gothic-serif text-xs text-[color:var(--color-ink)]/80">
          <span>Acerte <b>{NEED_CORRECT}</b> perguntas</span>
          <span>Perde 1 PV por erro</span>
        </div>
      </Panel>
      <button onClick={onEnter} className="btn-seal">Entrar na sala</button>
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
  const monkIdx = props.roomIdx;

  return (
    <div className={`flex flex-1 flex-col gap-3 py-2 ${bg}`}>
      {/* HUD */}
      <div className="flex items-center justify-between">
        <div>
          <p className="gothic-serif text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-ink)]/70">
            {room.title}
          </p>
          <p className="gothic-serif text-sm text-[color:var(--color-blood)]">
            Acertos: <b>{props.correctInRoom}/{NEED_CORRECT}</b>
          </p>
        </div>
        <div className="flex items-center gap-1" aria-label={`Vida: ${props.hp} de ${MAX_HP}`}>
          {Array.from({ length: MAX_HP }).map((_, i) => (
            <span
              key={i}
              className="text-lg leading-none transition"
              style={{ color: i < props.hp ? "var(--color-blood)" : "oklch(0.55 0.03 40 / 45%)" }}
            >
              ♥
            </span>
          ))}
        </div>
      </div>

      {/* Room banner */}
      <div className="plate overflow-hidden rounded">
        <img
          src={ROOM_IMAGES[props.roomIdx]}
          alt={room.title}
          width={1024}
          height={768}
          loading="lazy"
          className="h-24 w-full object-cover"
        />
      </div>

      {/* Question */}
      <Panel className="animate-rise">
        <p className="gothic-serif text-[10px] uppercase tracking-[0.35em] text-[color:var(--color-blood)]/80">
          {room.theme}
        </p>
        <h3 className="mt-1 gothic-serif text-lg leading-snug text-[color:var(--color-ink)]">
          {question.q}
        </h3>
      </Panel>

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
              className={`rune-btn rounded-md px-3 py-3 text-left text-[15px] ${
                isSelected && !showCorrect && !showWrong
                  ? "ring-2 ring-[color:var(--color-blood)]"
                  : ""
              } ${showCorrect ? "is-correct" : ""} ${showWrong ? "is-wrong" : ""} ${
                isEliminated ? "is-eliminated" : ""
              }`}
            >
              <span className="mr-2 gothic-serif text-[color:var(--color-blood)]">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
              {revealHere && (
                <span className="ml-2 text-[11px] italic text-[color:var(--color-ink)]/70">
                  ({props.senseReveal!.correct ? "sinto verdade" : "sinto engano"})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {props.feedback === "wrong" && (
        <p className="gothic-serif text-xs italic text-[color:var(--color-blood)]">
          {question.explain}
        </p>
      )}

      {/* Actions */}
      <div className="mt-auto flex flex-col gap-2 pt-2">
        <button
          onClick={props.onSubmit}
          disabled={props.selected === null || props.locked}
          className="btn-seal disabled:opacity-40"
        >
          Confirmar resposta
        </button>

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
              ◐ Escutar
            </MiniButton>
          )}
          {props.character.id === "marcus" && (
            <MiniButton
              onClick={props.onTransmute}
              disabled={props.transmuteUsed || props.feedback !== "wrong"}
            >
              ✧ Transmutar
            </MiniButton>
          )}
          <MiniButton onClick={props.onAskAlgrim}>Algrim</MiniButton>
          <MiniButton onClick={() => props.onAskMonk(monkIdx)} disabled={props.monksUsed.includes(monkIdx)}>
            Monge {["Ígneo", "Fluído", "Terreno", "Etéreo"][monkIdx]}
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
    <div className="flex flex-1 flex-col justify-between gap-6 py-2 animate-rise">
      <div className="text-center">
        <p className="gothic-serif text-xs uppercase tracking-[0.4em] text-[color:var(--color-blood)]/80">
          Porta aberta
        </p>
        <h2 className="mt-2 text-2xl blackletter">Sala do {room.element} completada</h2>
      </div>
      <Panel>
        <p className="gothic-serif uppercase tracking-widest text-xs text-[color:var(--color-blood)]">
          Ex libris — O que você aprendeu
        </p>
        <div className="gilded-rule my-2" />
        <p className="text-[15px] leading-relaxed">{room.outro}</p>
      </Panel>
      <button onClick={onNext} className="btn-seal">
        {isLast ? "Alcançar o topo" : "Subir mais um andar"}
      </button>
    </div>
  );
}

function TwistScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-4 py-2 animate-rise">
      <h2 className="text-center text-3xl blackletter text-[color:var(--color-ice)]">
        O Coração de Glacia
      </h2>
      <div className="plate mx-auto w-full overflow-hidden rounded">
        <img
          src={heartGlacia}
          alt="Coração de Glacia — uma pedra de gelo comum"
          width={1024}
          height={768}
          loading="lazy"
          className="h-48 w-full object-cover"
        />
      </div>
      <Panel className="animate-flicker text-[15px] leading-relaxed">
        <p className="dropcap">No altar, a pedra brilha. Fria. Simples. Você a toca…</p>
        <p className="mt-2 italic">…e ela é apenas <b>gelo</b>. Água comum, cristalizada.</p>
        <p className="mt-3">Um sussurro ecoa pela torre:</p>
        <p className="mt-2 gothic-serif text-[color:var(--color-blood)]">
          "A pedra não purifica nada. Nunca purificou."
        </p>
        <p className="mt-3">
          Você entende. O gás verde não some com magia. Some com <b>conhecimento</b> —
          sabendo o que ele é, como reage, como neutralizá-lo.
        </p>
        <p className="mt-2 italic">
          O verdadeiro Coração de Glacia sempre foi a química que você aprendeu para chegar até aqui.
        </p>
      </Panel>
      <button onClick={onNext} className="btn-seal">Descer da torre</button>
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
        className="text-4xl blackletter"
        style={{ color: tone === "victory" ? "var(--color-poison)" : "var(--color-blood)" }}
      >
        {title}
      </h2>
      <Panel className="text-[15px] leading-relaxed">
        <p>{message}</p>
      </Panel>
      <p className="gothic-serif text-xs uppercase tracking-[0.4em] text-[color:var(--color-ink)]/60">
        Finis
      </p>
      <button onClick={onRestart} className="btn-seal">Jogar novamente</button>
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="parchment illuminated w-full max-w-md rounded-md p-5 animate-rise" onClick={(e) => e.stopPropagation()}>
        <span className="illum-corner tl" />
        <span className="illum-corner tr" />
        <span className="illum-corner bl" />
        <span className="illum-corner br" />
        <div className="relative">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="gothic-serif text-xl text-[color:var(--color-blood)]">{name}</p>
              <p className="text-xs italic text-[color:var(--color-ink)]/70">— {subtitle}</p>
            </div>
            <button className="text-[color:var(--color-ink)]/70 hover:text-[color:var(--color-blood)]" onClick={onClose} aria-label="Fechar">
              ✕
            </button>
          </div>
          <div className="gilded-rule my-3" />
          <p className="text-[15px] leading-relaxed">{line}</p>
          <button onClick={onClose} className="btn-ghost mt-4 w-full">Voltar à sala</button>
        </div>
      </div>
    </div>
  );
}

function MiniButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="gothic-serif rounded-full border border-[color:var(--color-ink)]/40 bg-[color:var(--color-parchment)]/60 px-3 py-1.5 text-[11px] uppercase tracking-wider text-[color:var(--color-ink)] transition hover:border-[color:var(--color-blood)] hover:text-[color:var(--color-blood)] disabled:opacity-35"
    >
      {children}
    </button>
  );
}

import type { ReactNode } from "react";
import parchmentBg from "@/assets/parchment.jpg";

export function GameShell({ children }: { children: ReactNode }) {
  return (
   <div className="relative min-h-[100dvh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.22_0.05_45)_0%,oklch(0.08_0.02_30)_75%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 h-64 mist-poison blur-2xl animate-smoke opacity-60" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 mist-poison blur-3xl animate-smoke opacity-40" style={{ animationDelay: "-4s" }} />

      <div
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-md flex-col px-5 py-6"
        style={{
          backgroundImage: `url(${parchmentBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          boxShadow: "0 0 60px oklch(0 0 0 / 70%), inset 0 0 80px oklch(0.3 0.08 35 / 50%)",
        }}
      >
        <div className="relative flex flex-1 flex-col">
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

          {screen.kind === "room-intro" && (
            <RoomIntro roomIdx={screen.roomIdx} onEnter={() => enterRoom(screen.roomIdx)} />
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
        </div>
      </div>
    </div>
  )}

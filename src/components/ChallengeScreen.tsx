import { useState, useEffect } from "react";
import { CharacterChallenge } from "@/lib/game-data";

type ChallengeScreenProps = {
  challenge: CharacterChallenge;
  characterName: string;
  onComplete: (result: "success" | "failure") => void;
};

export function ChallengeScreen({ challenge, characterName, onComplete }: ChallengeScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showResult, setShowResult] = useState<"success" | "failure" | null>(null);

  // ==========================================
  // DESAFIO 1: ACHAR OBJETO (KAEL)
  // ==========================================
  if (challenge.type === "find-object") {
    const objects = challenge.data.objects;
    const timeLimit = challenge.data.timeLimit || 15;

    useEffect(() => {
      setTimeLeft(timeLimit);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            if (selected === null) {
              onComplete("failure");
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const handleSelect = (obj: any) => {
      if (selected !== null) return;
      setSelected(obj.id);
      setShowResult(obj.isCorrect ? "success" : "failure");
      setTimeout(() => {
        onComplete(obj.isCorrect ? "success" : "failure");
      }, 1500);
    };

    return (
      <div className="flex flex-col gap-4 p-6 max-w-md mx-auto min-h-screen justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-amber-400">{challenge.title}</h2>
          <p className="text-sm text-gray-300 mt-2">{challenge.description}</p>
          <p className="text-lg mt-2">🎯 Personagem: {characterName}</p>
          {timeLeft !== null && (
            <p className={`text-2xl font-bold mt-2 ${timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-amber-300"}`}>
              ⏱️ {timeLeft}s
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {objects.map((obj: any) => (
            <button
              key={obj.id}
              onClick={() => handleSelect(obj)}
              disabled={selected !== null}
              className={`
                bg-gray-800/70 rounded-lg p-4 text-center transition-all text-sm border-2
                ${selected === obj.id && showResult === "success" ? "border-green-500 bg-green-900/30" : "border-gray-600"}
                ${selected === obj.id && showResult === "failure" ? "border-red-500 bg-red-900/30" : "border-gray-600"}
                ${selected !== null && selected !== obj.id ? "opacity-50" : "hover:scale-105 hover:border-amber-400"}
                disabled:cursor-not-allowed
              `}
            >
              <span className="text-2xl block">{obj.name.split(" ")[0]}</span>
              <span className="text-sm">{obj.name.split(" ").slice(1).join(" ")}</span>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`text-center p-3 rounded-lg ${showResult === "success" ? "text-green-400" : "text-red-400"}`}>
            {showResult === "success" ? "✅ Correto! O objeto foi encontrado!" : "❌ Objeto errado!"}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // DESAFIO 2: IDENTIFICAR VENENO (ELARA)
  // ==========================================
  if (challenge.type === "identify-poison") {
    const frascos = challenge.data.frascos;

    const handleSelect = (frasco: any) => {
      if (selected !== null) return;
      setSelected(frasco.id);
      setShowResult(frasco.isPoison ? "success" : "failure");
      setTimeout(() => {
        onComplete(frasco.isPoison ? "success" : "failure");
      }, 1500);
    };

    return (
      <div className="flex flex-col gap-4 p-6 max-w-md mx-auto min-h-screen justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-400">{challenge.title}</h2>
          <p className="text-sm text-gray-300 mt-2">{challenge.description}</p>
          <p className="text-lg mt-2">🩺 Personagem: {characterName}</p>
        </div>

        <div className="grid grid-cols-1 gap-3 mt-4">
          {frascos.map((frasco: any) => (
            <button
              key={frasco.id}
              onClick={() => handleSelect(frasco)}
              disabled={selected !== null}
              className={`
                bg-gray-800/70 rounded-lg p-4 text-left transition-all border-2
                ${selected === frasco.id && showResult === "success" ? "border-green-500 bg-green-900/30" : "border-gray-600"}
                ${selected === frasco.id && showResult === "failure" ? "border-red-500 bg-red-900/30" : "border-gray-600"}
                ${selected !== null && selected !== frasco.id ? "opacity-50" : "hover:scale-[1.02] hover:border-emerald-400"}
                disabled:cursor-not-allowed
              `}
            >
              <p className="font-bold">🧪 {frasco.descricao}</p>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`text-center p-3 rounded-lg ${showResult === "success" ? "text-green-400" : "text-red-400"}`}>
            {showResult === "success" ? "✅ Elara neutralizou o veneno!" : "❌ O veneno se espalhou..."}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // DESAFIO 3: DECODIFICAR TEXTO (SERENA)
  // ==========================================
  if (challenge.type === "decode-text") {
    const options = challenge.data.options;

    const handleSelect = (index: number) => {
      if (selected !== null) return;
      setSelected(String(index));
      const isCorrect = index === challenge.data.correctIndex;
      setShowResult(isCorrect ? "success" : "failure");
      setTimeout(() => {
        onComplete(isCorrect ? "success" : "failure");
      }, 1500);
    };

    return (
      <div className="flex flex-col gap-4 p-6 max-w-md mx-auto min-h-screen justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-400">{challenge.title}</h2>
          <p className="text-sm text-gray-300 mt-2">{challenge.description}</p>
          <p className="text-lg mt-2">📜 Personagem: {characterName}</p>
          <div className="bg-gray-800/70 p-3 rounded-lg mt-3 border border-purple-500/30">
            <p className="text-2xl tracking-[0.3em] font-mono text-purple-300">
              {challenge.data.encoded}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 mt-2">
          {options.map((opt: string, index: number) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={selected !== null}
              className={`
                bg-gray-800/70 rounded-lg p-3 text-center transition-all border-2
                ${selected === String(index) && showResult === "success" ? "border-green-500 bg-green-900/30" : "border-gray-600"}
                ${selected === String(index) && showResult === "failure" ? "border-red-500 bg-red-900/30" : "border-gray-600"}
                ${selected !== null && selected !== String(index) ? "opacity-50" : "hover:scale-[1.02] hover:border-purple-400"}
                disabled:cursor-not-allowed
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`text-center p-3 rounded-lg ${showResult === "success" ? "text-green-400" : "text-red-400"}`}>
            {showResult === "success" ? "✅ Serena decodificou a mensagem!" : "❌ A mensagem permanece um mistério..."}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // DESAFIO 4: FORJAR ITEM (MARCUS)
  // ==========================================
  if (challenge.type === "forge-item") {
    const steps = challenge.data.steps;

    const handleSelect = (step: any) => {
      if (selected !== null) return;
      setSelected(step.id);
      setShowResult(step.isCorrect ? "success" : "failure");
      setTimeout(() => {
        onComplete(step.isCorrect ? "success" : "failure");
      }, 1500);
    };

    return (
      <div className="flex flex-col gap-4 p-6 max-w-md mx-auto min-h-screen justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-400">{challenge.title}</h2>
          <p className="text-sm text-gray-300 mt-2">{challenge.description}</p>
          <p className="text-lg mt-2">⚡ Personagem: {characterName}</p>
          <div className="bg-gray-800/50 p-3 rounded-lg mt-3 border border-orange-500/30">
            <p className="text-2xl">🔨 ⚒️ 🔥</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 mt-2">
          {steps.map((step: any) => (
            <button
              key={step.id}
              onClick={() => handleSelect(step)}
              disabled={selected !== null}
              className={`
                bg-gray-800/70 rounded-lg p-3 text-center transition-all border-2
                ${selected === step.id && showResult === "success" ? "border-green-500 bg-green-900/30" : "border-gray-600"}
                ${selected === step.id && showResult === "failure" ? "border-red-500 bg-red-900/30" : "border-gray-600"}
                ${selected !== null && selected !== step.id ? "opacity-50" : "hover:scale-[1.02] hover:border-orange-400"}
                disabled:cursor-not-allowed
              `}
            >
              {step.descricao}
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`text-center p-3 rounded-lg ${showResult === "success" ? "text-green-400" : "text-red-400"}`}>
            {showResult === "success" ? "✅ Marcus forjou a chave!" : "❌ O metal quebrou..."}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center text-gray-400 bg-gray-800/50 p-6 rounded-lg">
        ⚠️ Desafio não encontrado para este personagem.
      </div>
    </div>
  );
v

"use client";

import { useState } from "react";
import { Play, CheckCircle, XCircle, Lightbulb } from "lucide-react";

interface CodeExercise {
  title: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  difficulty: string;
}

export function CodeSandbox({ exercise }: { exercise: CodeExercise }) {
  const [userCode, setUserCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  const handleCheck = () => {
    const cleaned = userCode.trim().replace(/\s+/g, " ");
    const expected = exercise.expectedOutput.trim().replace(/\s+/g, " ");
    const correct = cleaned.includes(expected) || expected.includes(cleaned);
    setIsCorrect(correct);
    setOutput(correct ? exercise.expectedOutput : "Output doesn't match expected. Try again!");
  };

  return (
    <div className="space-y-4">
      <div className="comic-panel bg-[#141414] p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 border-2 border-[#00d4ff] text-[#00d4ff]">
            {exercise.difficulty}
          </span>
          <h3 className="font-black uppercase tracking-wider">{exercise.title}</h3>
        </div>
        <p className="text-sm text-white/80 mb-4">{exercise.description}</p>
        <div className="bg-[#0a0a0a] border-2 border-[#333] p-3 font-mono text-xs text-muted-foreground">
          <span className="text-[#facc15]">Expected output:</span> {exercise.expectedOutput}
        </div>
      </div>

      <div className="comic-panel bg-[#0a0a0a] border-3 border-[#333]">
        <div className="bg-[#1a1a1a] px-4 py-2 border-b-3 border-[#333] text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
          <div className="w-2 h-2 bg-[#ff2d6f]" />
          <div className="w-2 h-2 bg-[#facc15]" />
          <div className="w-2 h-2 bg-[#22c55e]" />
          <span className="ml-2">python</span>
        </div>
        <textarea
          value={userCode}
          onChange={(e) => { setUserCode(e.target.value); setIsCorrect(null); setOutput(""); }}
          className="w-full min-h-[200px] bg-transparent p-4 font-mono text-sm text-[#c8ff00] resize-none focus:outline-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCheck}
          className="flex-1 bg-[#c8ff00] text-black py-3 font-bold uppercase tracking-wider border-2 border-[#c8ff00] hover:shadow-[4px_4px_0px_0px] hover:shadow-[#c8ff00]/30 flex items-center justify-center gap-2"
        >
          <Play className="h-4 w-4" />
          Check Solution
        </button>
        <button
          onClick={() => { setShowHints(!showHints); }}
          className="py-3 px-4 border-2 border-[#facc15] text-[#facc15] font-bold uppercase tracking-wider hover:bg-[#facc15]/10"
        >
          <Lightbulb className="h-4 w-4" />
        </button>
      </div>

      {isCorrect !== null && (
        <div className={`p-4 border-2 flex items-center gap-3 ${isCorrect ? "border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]" : "border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]"}`}>
          {isCorrect ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <span className="font-bold text-sm">{isCorrect ? "Correct!" : "Not quite — try again"}</span>
        </div>
      )}

      {output && !isCorrect && (
        <div className="p-3 border-2 border-[#333] bg-[#0a0a0a] font-mono text-xs text-muted-foreground">
          {output}
        </div>
      )}

      {showHints && (
        <div className="comic-panel bg-[#facc15]/5 border-[#facc15]/30 p-4">
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#facc15] mb-2">Hint {currentHint + 1}/{exercise.hints.length}</p>
          <p className="text-sm text-white/80">{exercise.hints[currentHint]}</p>
          {currentHint < exercise.hints.length - 1 && (
            <button
              onClick={() => setCurrentHint(currentHint + 1)}
              className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#facc15] mt-2 hover:underline"
            >
              Next Hint →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Zap, CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface WarmupQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function WarmupQuiz({ questions, onComplete }: { questions: WarmupQuestion[]; onComplete?: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) return null;

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="comic-panel bg-[#141414] p-6 text-center">
        <Zap className="h-10 w-10 mx-auto mb-3 text-[#facc15]" />
        <h3 className="text-xl font-black uppercase tracking-wider mb-1">Warm-Up Complete</h3>
        <p className="text-3xl font-black text-[#facc15] mb-2">{correctCount}/{questions.length}</p>
        <p className="text-muted-foreground text-sm">
          {pct >= 80 ? "Strong foundation — you're ready!" : pct >= 50 ? "Decent — review the weak spots in the lesson." : "Review the lesson carefully — some gaps to fill."}
        </p>
      </div>
    );
  }

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correctIndex) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
      onComplete?.(correctCount);
    }
  };

  return (
    <div className="comic-panel bg-[#141414] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#facc15]" />
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Warm-Up {current + 1}/{questions.length}
          </span>
        </div>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`w-2 h-2 ${i < current ? "bg-[#22c55e]" : i === current ? "bg-[#facc15]" : "bg-white/10"}`} />
          ))}
        </div>
      </div>

      <p className="text-lg font-bold">{q.question}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = "border-[#333] text-white/80";
          if (showResult) {
            if (i === q.correctIndex) cls = "border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]";
            else if (i === selected) cls = "border-[#ef4444] bg-[#ef4444]/10 text-[#ef4444]";
          } else if (selected === i) {
            cls = "border-[#facc15] bg-[#facc15]/10 text-[#facc15]";
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showResult}
              className={`w-full text-left p-3 border-2 ${cls} font-mono text-sm transition-all hover:translate-x-1 disabled:cursor-default`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="space-y-3">
          <div className={`p-3 border-2 flex items-center gap-2 ${selected === q.correctIndex ? "border-[#22c55e] text-[#22c55e]" : "border-[#ef4444] text-[#ef4444]"}`}>
            {selected === q.correctIndex ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <span className="text-sm font-bold">{selected === q.correctIndex ? "Correct!" : "Wrong"}</span>
          </div>
          <p className="text-xs text-muted-foreground">{q.explanation}</p>
          <button
            onClick={handleNext}
            className="w-full py-3 bg-[#facc15] text-black font-bold uppercase tracking-wider border-2 border-[#facc15] flex items-center justify-center gap-2"
          >
            {current < questions.length - 1 ? <>Next <ArrowRight className="h-4 w-4" /></> : "See Results"}
          </button>
        </div>
      )}
    </div>
  );
}

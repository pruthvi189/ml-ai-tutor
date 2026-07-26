"use client";

import { Card, CardContent } from "@/components/ui/card";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
}

interface QuizCardProps {
  question: QuizQuestion;
  index: number;
  selectedAnswer: number | null;
  showResult: boolean;
  onSelect: (index: number) => void;
}

export function QuizCard({
  question,
  index,
  selectedAnswer,
  showResult,
  onSelect,
}: QuizCardProps) {
  const isCorrect = selectedAnswer === question.correctIndex;
  const difficultyColor =
    question.difficulty === "easy" ? "#22c55e"
      : question.difficulty === "medium" ? "#f97316" : "#ef4444";

  return (
    <div className="comic-panel bg-[#141414] p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Q{index + 1}
        </span>
        <span
          className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 border-2"
          style={{ borderColor: difficultyColor, color: difficultyColor }}
        >
          {question.difficulty}
        </span>
      </div>

      <p className="text-lg font-bold mb-6">{question.question}</p>

      <div className="space-y-2">
        {question.options.map((option, i) => {
          let borderClass = "border-[#333]";
          let bgClass = "bg-transparent";
          let textClass = "text-white/80";

          if (showResult) {
            if (i === question.correctIndex) {
              borderClass = "border-[#22c55e]";
              bgClass = "bg-[#22c55e]/10";
              textClass = "text-[#22c55e]";
            } else if (i === selectedAnswer && !isCorrect) {
              borderClass = "border-[#ef4444]";
              bgClass = "bg-[#ef4444]/10";
              textClass = "text-[#ef4444]";
            }
          } else if (selectedAnswer === i) {
            borderClass = "border-[#c8ff00]";
            bgClass = "bg-[#c8ff00]/10";
            textClass = "text-[#c8ff00]";
          }

          return (
            <button
              key={i}
              onClick={() => !showResult && onSelect(i)}
              disabled={showResult}
              className={`w-full text-left p-3 border-2 ${borderClass} ${bgClass} ${textClass} font-mono text-sm transition-all hover:translate-x-1 disabled:cursor-default`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-4 p-4 border-2 border-[#333] bg-[#0f0f0f]">
          <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            Explanation
          </p>
          <p className="text-sm text-white/80">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { RotateCcw, Check, X } from "lucide-react";

interface Flashcard {
  id: number;
  front: string;
  back: string;
  box: number;
}

export function FlashcardDeck({ cards, onReview }: { cards: Flashcard[]; onReview?: (id: number, known: boolean) => void }) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="comic-panel bg-[#141414] p-8 text-center">
        <p className="text-muted-foreground font-mono text-sm">No flashcards yet. Complete a lesson first.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="comic-panel bg-[#141414] p-8 text-center">
        <Check className="h-12 w-12 mx-auto mb-4 text-[#22c55e]" />
        <h3 className="text-xl font-black uppercase tracking-wider mb-2">All Done!</h3>
        <p className="text-muted-foreground text-sm mb-4">You reviewed all {cards.length} flashcards.</p>
        <button
          onClick={() => { setCurrent(0); setFlipped(false); setDone(false); }}
          className="bg-[#c8ff00] text-black px-4 py-2 font-bold uppercase tracking-wider border-2 border-[#c8ff00]"
        >
          <RotateCcw className="inline mr-2 h-4 w-4" />
          Review Again
        </button>
      </div>
    );
  }

  const card = cards[current];

  const handleKnow = () => {
    onReview?.(card.id, true);
    goNext();
  };

  const handleDontKnow = () => {
    onReview?.(card.id, false);
    goNext();
  };

  const goNext = () => {
    setFlipped(false);
    if (current < cards.length - 1) {
      setCurrent(current + 1);
    } else {
      setDone(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Card {current + 1} / {cards.length}
        </span>
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 ${i === current ? "bg-[#c8ff00]" : i < current ? "bg-[#22c55e]" : "bg-white/10"}`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => setFlipped(!flipped)}
        className="w-full min-h-[250px] comic-panel bg-[#141414] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#c8ff00]/50 transition-all"
      >
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
          {flipped ? "Answer" : "Question"}
        </span>
        <p className="text-lg font-bold leading-relaxed">
          {flipped ? card.back : card.front}
        </p>
        {!flipped && (
          <span className="text-[9px] font-mono text-muted-foreground mt-6">
            Click to reveal answer
          </span>
        )}
      </button>

      {flipped && (
        <div className="flex gap-3">
          <button
            onClick={handleDontKnow}
            className="flex-1 py-3 border-2 border-[#ef4444] text-[#ef4444] font-bold uppercase tracking-wider hover:bg-[#ef4444]/10 transition-colors flex items-center justify-center gap-2"
          >
            <X className="h-4 w-4" />
            Still Learning
          </button>
          <button
            onClick={handleKnow}
            className="flex-1 py-3 border-2 border-[#22c55e] text-[#22c55e] font-bold uppercase tracking-wider hover:bg-[#22c55e]/10 transition-colors flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            Got It
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, User, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget({ lessonId, courseId }: { lessonId: number; courseId: number }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Network error — try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#c8ff00] border-4 border-black flex items-center justify-center hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_0px] hover:shadow-[#c8ff00] transition-all"
      >
        {open ? <X className="h-6 w-6 text-black" /> : <MessageSquare className="h-6 w-6 text-black" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-h-[500px] comic-panel bg-[#0f0f0f] border-3 border-[#333] flex flex-col">
          <div className="bg-[#1a1a1a] px-4 py-3 border-b-3 border-[#333] flex items-center gap-2">
            <Bot className="h-4 w-4 text-[#c8ff00]" />
            <span className="text-xs font-black uppercase tracking-wider">AI Tutor</span>
            <span className="text-[9px] font-mono text-muted-foreground ml-auto">Ask about this lesson</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[350px]">
            {messages.length === 0 && (
              <p className="text-center text-muted-foreground text-xs font-mono py-8">
                Ask me anything about this lesson...
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && <Bot className="h-4 w-4 text-[#c8ff00] mt-1 shrink-0" />}
                <div className={`max-w-[80%] p-3 text-sm ${msg.role === "user" ? "bg-[#c8ff00]/10 border border-[#c8ff00]/20 text-white" : "bg-white/5 border border-white/10 text-white/80"}`}>
                  {msg.content}
                </div>
                {msg.role === "user" && <User className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <Bot className="h-4 w-4 text-[#c8ff00] mt-1" />
                <div className="bg-white/5 border border-white/10 p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#c8ff00] animate-bounce" />
                    <div className="w-2 h-2 bg-[#c8ff00] animate-bounce [animation-delay:0.1s]" />
                    <div className="w-2 h-2 bg-[#c8ff00] animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          <div className="p-3 border-t-3 border-[#333]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent border-2 border-white/10 px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus:border-[#c8ff00] focus:outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="bg-[#c8ff00] text-black px-3 py-2 border-2 border-[#c8ff00] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

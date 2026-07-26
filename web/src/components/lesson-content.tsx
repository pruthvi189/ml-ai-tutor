"use client";

import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";

SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);

export function LessonContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1({ children }) {
            return (
              <h1 className="text-3xl font-black uppercase tracking-wider border-b-4 border-[#c8ff00] pb-4 mb-6">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-2xl font-black uppercase tracking-wider mt-12 mb-4 text-[#c8ff00] border-l-6 border-[#c8ff00] pl-4">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-xl font-bold uppercase tracking-wider mt-8 mb-3 text-[#ff2d6f]">
                {children}
              </h3>
            );
          },
          p({ children }) {
            return (
              <p className="text-base leading-relaxed mb-4 text-white/80">
                {children}
              </p>
            );
          },
          ul({ children }) {
            return <ul className="mb-4 space-y-2 text-white/80">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="mb-4 space-y-2 text-white/80 list-decimal list-inside">{children}</ol>;
          },
          li({ children }) {
            return (
              <li className="text-base flex items-start gap-2">
                <span className="text-[#c8ff00] font-black mt-1">→</span>
                <span>{children}</span>
              </li>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-6 border-[#ff2d6f] pl-4 my-6 bg-[#ff2d6f]/5 p-4">
                {children}
              </blockquote>
            );
          },
          strong({ children }) {
            return <strong className="text-white font-black">{children}</strong>;
          },
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const inline = !match;
            if (inline) {
              return (
                <code
                  className="bg-[#c8ff00]/10 border-2 border-[#c8ff00]/20 px-1.5 py-0.5 font-mono text-sm text-[#c8ff00]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <div className="my-6 comic-panel border-3 border-[#333]">
                <div className="bg-[#1a1a1a] px-4 py-2 border-b-3 border-[#333] text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff2d6f]" />
                  <div className="w-2 h-2 bg-[#facc15]" />
                  <div className="w-2 h-2 bg-[#22c55e]" />
                  <span className="ml-2">{match?.[1] || "code"}</span>
                </div>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match?.[1] || "text"}
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: "#0a0a0a",
                    fontSize: "13px",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          },
          hr() {
            return <hr className="my-8 border-[#333] border-t-4" />;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c8ff00] underline underline-offset-4 decoration-2 hover:text-[#c8ff00]/80"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

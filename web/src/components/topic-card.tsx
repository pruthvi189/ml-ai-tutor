"use client";

import Link from "next/link";
import { LucideIcon, Search, Link as LinkIcon, Cpu, Brain, Sliders, Server } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Search,
  Link: LinkIcon,
  Cpu,
  Brain,
  Sliders,
  Server,
};

interface TopicCardProps {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
  icon: string;
  color: string;
}

export function TopicCard({ id, title, description, subtopics, icon, color }: TopicCardProps) {
  const Icon = iconMap[icon] || Brain;

  return (
    <Link href={`/courses/${id}`}>
      <div
        className="group relative comic-panel halftone bg-[#141414] p-6 overflow-hidden comic-hover cursor-pointer h-full"
        style={{ borderColor: color, boxShadow: `6px 6px 0px 0px ${color}` }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 opacity-10 blur-2xl" style={{ background: color }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 flex items-center justify-center border-3 border-black"
              style={{ background: color }}
            >
              <Icon className="h-5 w-5 text-black" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-wider leading-tight">
              {title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="flex flex-wrap gap-1">
            {subtopics.slice(0, 3).map((st) => (
              <span
                key={st}
                className="text-[8px] font-mono uppercase tracking-widest px-2 py-1 border-2 border-white/10 text-muted-foreground"
              >
                {st}
              </span>
            ))}
            {subtopics.length > 3 && (
              <span className="text-[8px] font-mono uppercase tracking-widest px-2 py-1 border-2 border-white/10 text-muted-foreground">
                +{subtopics.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

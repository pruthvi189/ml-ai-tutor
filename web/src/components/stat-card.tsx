import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color?: string;
}

export function StatCard({ title, value, description, icon: Icon, color = "#c8ff00" }: StatCardProps) {
  return (
    <div className="relative halftone comic-panel bg-[#141414] p-5 overflow-hidden comic-hover">
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10" style={{ background: color }} />
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </span>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div className="text-5xl font-black tracking-tight relative z-10" style={{ color }}>
        {value}
      </div>
      <p className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mt-2 relative z-10">
        {description}
      </p>
    </div>
  );
}

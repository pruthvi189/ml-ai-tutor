"use client";

import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <DashboardShell>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="h-16 w-16 text-[#facc15] mb-6" />
        <h1 className="text-4xl font-black uppercase tracking-wider mb-4">
          Something Broke
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md font-mono text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        <Button
          onClick={reset}
          className="bg-[#c8ff00] text-black hover:bg-[#c8ff00]/80 font-bold uppercase tracking-wider border-2 border-[#c8ff00]"
        >
          Try Again
        </Button>
      </div>
    </DashboardShell>
  );
}

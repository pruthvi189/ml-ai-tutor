import { DashboardShell } from "@/components/dashboard-shell";

export default function Loading() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-[#c8ff00] border-t-transparent rounded-full" />
      </div>
    </DashboardShell>
  );
}

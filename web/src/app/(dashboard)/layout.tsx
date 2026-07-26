"use client";

import { UserProvider } from "@/components/user-provider";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/components/user-provider";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const user = useUser();

  return (
    <>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b-4 border-black px-4 bg-[#0f0f0f]">
          <SidebarTrigger className="-ml-1 hover:text-[#c8ff00] transition-colors" />
          <div className="h-4 w-px bg-[#333] mx-2" />
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
            ML AI Tutor
          </span>
          {user && (
            <span className="ml-auto text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              {user.name}
            </span>
          )}
        </header>
        <main className="flex-1 p-4 pt-6 md:p-6 md:pt-8">{children}</main>
      </SidebarInset>
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </UserProvider>
  );
}

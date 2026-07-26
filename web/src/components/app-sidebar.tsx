"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { navItems } from "@/lib/navigation";

interface User {
  name: string;
  email: string;
}

export function AppSidebar({ user }: { user?: User | null }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <Sidebar className="border-r-4 border-black">
      <SidebarHeader className="border-b-4 border-black p-4 bg-[#c8ff00]">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black">
            <GraduationCap className="h-5 w-5 text-[#c8ff00]" />
          </div>
          <div>
            <span className="text-lg font-black uppercase tracking-wider block text-black">
              ML Tutor
            </span>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-black/60">
              AI Learning Platform
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="speed-lines">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground px-4 pt-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href} className="px-2">
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.href} />}
                      className={`border-l-4 transition-all ${
                        isActive
                          ? "border-[#c8ff00] bg-[#c8ff00]/10 text-[#c8ff00] font-black"
                          : "border-transparent hover:border-white/30 hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-bold uppercase tracking-wider text-xs">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-4 border-black p-4 bg-[#141414]">
        {user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#c8ff00] border-2 border-black flex items-center justify-center">
                <span className="text-xs font-black text-black">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{user.name}</p>
                <p className="text-[9px] text-muted-foreground truncate font-mono">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 border-2 border-white/10 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:border-[#ef4444] hover:text-[#ef4444] transition-colors"
            >
              <LogOut className="h-3 w-3" />
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#c8ff00] border border-black" />
            <div className="w-2 h-2 bg-[#ff2d6f] border border-black" />
            <div className="w-2 h-2 bg-[#00d4ff] border border-black" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

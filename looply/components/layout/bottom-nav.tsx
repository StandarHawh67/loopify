"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Home, Search, Settings, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/components/providers/current-user-provider";

const items = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/notifications", label: "Alertas", icon: Bell },
  { href: "/settings/profile", label: "Ajustes", icon: Settings },
  { href: "/profile", label: "Perfil", icon: UserRound }
];

export function BottomNav({ notificationsCount }: { notificationsCount: number }) {
  const pathname = usePathname();
  const { currentUser } = useCurrentUser();

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
      <nav className="grid grid-cols-5 rounded-[1.75rem] border border-white/10 bg-[#09111f]/90 p-2 shadow-float backdrop-blur-xl">
        {items.map((item) => {
          const href = item.label === "Perfil" ? `/u/${currentUser.username}` : item.href;
          const isActive = pathname === href;

          return (
            <Link
              key={`${item.label}-${href}`}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-xs transition",
                isActive ? "bg-white text-slate-950" : "text-mist"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.label === "Alertas" && notificationsCount > 0 ? (
                <span className="absolute right-3 top-2 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-slate-950">
                  {notificationsCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

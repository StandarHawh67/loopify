"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Home,
  LogOut,
  Search,
  Settings,
  UserRound
} from "lucide-react";
import { useState, useTransition } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCurrentUser } from "@/components/providers/current-user-provider";

const items = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/search", label: "Buscar", icon: Search },
  { href: "/notifications", label: "Notificaciones", icon: Bell },
  { href: "/settings/profile", label: "Perfil", icon: UserRound },
  { href: "/settings/profile", label: "Ajustes", icon: Settings }
];

export function Sidebar({ notificationsCount }: { notificationsCount: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleLogout() {
    setError("");
    const response = await fetch("/api/auth/logout", {
      method: "POST"
    });

    if (!response.ok) {
      setError("No pudimos cerrar la sesión.");
      return;
    }

    startTransition(() => {
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <div className="sticky top-6 flex h-[calc(100vh-3rem)] flex-col rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <Link href="/feed" className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-slate-950">
          <span className="font-display text-lg font-bold">L</span>
        </div>
        <div>
          <p className="font-display text-2xl font-semibold">Looply</p>
          <p className="text-sm text-mist">Tu red social visual</p>
        </div>
      </Link>

      <div className="mb-6 rounded-[1.75rem] border border-white/10 bg-[#09111f]/80 p-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={currentUser.avatarUrl}
            alt={currentUser.username}
            name={currentUser.username}
            className="h-14 w-14 rounded-[1.25rem]"
          />
          <div>
            <Link href={`/u/${currentUser.username}`} className="font-medium text-white">
              @{currentUser.username}
            </Link>
            <p className="mt-1 line-clamp-2 text-sm text-mist">{currentUser.bio || "Sin bio todavía."}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const isProfile = item.label === "Perfil";
          const href = isProfile ? `/u/${currentUser.username}` : item.href;
          const isActive = pathname === href;

          return (
            <Link
              key={`${item.label}-${href}`}
              href={href}
              className={cn(
                "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
                isActive
                  ? "bg-white text-slate-950"
                  : "text-mist hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
              {item.label === "Notificaciones" && notificationsCount > 0 ? (
                <span
                  className={cn(
                    "min-w-6 rounded-full px-2 py-1 text-center text-xs font-semibold",
                    isActive ? "bg-slate-950 text-white" : "bg-accent text-slate-950"
                  )}
                >
                  {notificationsCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3">
        {error ? <p className="text-sm text-coral">{error}</p> : null}
        <Button
          type="button"
          variant="secondary"
          className="w-full justify-center"
          onClick={handleLogout}
          disabled={isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isPending ? "Saliendo..." : "Cerrar sesión"}
        </Button>
      </div>
    </div>
  );
}

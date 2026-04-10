import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { CurrentUserProvider } from "@/components/providers/current-user-provider";
import type { SessionUser } from "@/types";

export function AppShell({
  currentUser,
  notificationsCount,
  children
}: {
  currentUser: SessionUser;
  notificationsCount: number;
  children: React.ReactNode;
}) {
  return (
    <CurrentUserProvider initialUser={currentUser}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-[320px] shrink-0 lg:block">
          <Sidebar notificationsCount={notificationsCount} />
        </aside>
        <main className="min-w-0 flex-1 pb-24 lg:pb-6">{children}</main>
      </div>
      <BottomNav notificationsCount={notificationsCount} />
    </CurrentUserProvider>
  );
}

import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth";
import { getUnreadNotificationsCount } from "@/lib/queries";

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  const notificationsCount = await getUnreadNotificationsCount(currentUser.id);

  return (
    <AppShell currentUser={currentUser} notificationsCount={notificationsCount}>
      {children}
    </AppShell>
  );
}

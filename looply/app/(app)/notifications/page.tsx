import { NotificationsList } from "@/components/profile/notifications-list";
import { requireCurrentUser } from "@/lib/auth";
import { markNotificationsAsRead } from "@/lib/notifications";
import { getNotificationsPage } from "@/lib/queries";

export default async function NotificationsPage() {
  const currentUser = await requireCurrentUser();
  const notifications = await getNotificationsPage({
    userId: currentUser.id
  });

  await markNotificationsAsRead(currentUser.id);

  return (
    <div className="space-y-5">
      <section className="panel p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-mist">Notifications</p>
        <h1 className="mt-2 text-3xl font-semibold">Tu actividad reciente</h1>
        <p className="mt-2 text-sm leading-6 text-mist">
          Aquí verás nuevos follows, likes y comentarios tan pronto como ocurran.
        </p>
      </section>

      <NotificationsList
        initialItems={notifications.items}
        initialCursor={notifications.nextCursor}
      />
    </div>
  );
}

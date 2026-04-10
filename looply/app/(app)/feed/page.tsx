import { DiscoveryPanel } from "@/components/feed/discovery-panel";
import { FeedColumn } from "@/components/feed/feed-column";
import { requireCurrentUser } from "@/lib/auth";
import { getDiscoveryUsers, getFeedPage } from "@/lib/queries";

export default async function FeedPage() {
  const currentUser = await requireCurrentUser();
  const [feed, discoveryUsers] = await Promise.all([
    getFeedPage({
      viewerId: currentUser.id
    }),
    getDiscoveryUsers(currentUser.id)
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-5">
        <div className="panel p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-mist">Feed</p>
          <h1 className="mt-2 text-3xl font-semibold">Tu loop de hoy</h1>
          <p className="mt-2 text-sm leading-6 text-mist">
            Publicaciones cronológicas, interacción directa y una interfaz pensada para quedarse.
          </p>
        </div>
        <FeedColumn initialPosts={feed.items} initialCursor={feed.nextCursor} />
      </section>

      <DiscoveryPanel users={discoveryUsers} />
    </div>
  );
}

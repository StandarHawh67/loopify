import Link from "next/link";
import { FollowButton } from "@/components/profile/follow-button";
import { Avatar } from "@/components/ui/avatar";
import { formatCount } from "@/lib/utils";
import type { SearchUserItem } from "@/types";

export function DiscoveryPanel({ users }: { users: SearchUserItem[] }) {
  return (
    <aside className="space-y-5 xl:sticky xl:top-6">
      <section className="panel p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-mist">Descubre perfiles</p>
        <div className="mt-4 space-y-4">
          {users.map((user) => (
            <div key={user.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Avatar src={user.avatarUrl} alt={user.username} name={user.username} />
                <div className="min-w-0 flex-1">
                  <Link href={`/u/${user.username}`} className="font-medium text-white">
                    @{user.username}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm text-mist">
                    {user.bio || "Listo para entrar en el loop."}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.18em] text-mist">
                  {formatCount(user.counts.followers)} followers
                </span>
                <FollowButton username={user.username} initialFollowing={user.isFollowing} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-mist">Ritmo de la comunidad</p>
        <div className="mt-4 space-y-3 text-sm leading-6 text-mist">
          <p>Publica texto corto cuando quieras abrir conversación.</p>
          <p>Añade imagen para dar más presencia visual a tu contenido.</p>
          <p>Sigue perfiles para convertir una interacción en relación continua.</p>
        </div>
      </section>
    </aside>
  );
}

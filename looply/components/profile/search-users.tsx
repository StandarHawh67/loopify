"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { FollowButton } from "@/components/profile/follow-button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { formatCount } from "@/lib/utils";
import type { SearchUserItem } from "@/types";

export function SearchUsers({ initialUsers }: { initialUsers: SearchUserItem[] }) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    let ignore = false;

    async function runSearch() {
      setError("");
      setIsSearching(true);

      const response = await fetch(`/api/users/search?q=${encodeURIComponent(deferredQuery)}`);
      const result = await response.json();

      if (ignore) return;

      if (!response.ok) {
        setError(result.error ?? "No pudimos buscar usuarios.");
        setIsSearching(false);
        return;
      }

      setUsers(result.users);
      setIsSearching(false);
    }

    void runSearch();

    return () => {
      ignore = true;
    };
  }, [deferredQuery]);

  return (
    <section className="space-y-5">
      <div className="panel p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-mist">Busca personas</p>
        <div className="mt-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Escribe un username..."
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-mist">
          <span>{isSearching ? "Buscando..." : "Resultados en tiempo real"}</span>
          {error ? <span className="text-coral">{error}</span> : null}
        </div>
      </div>

      {users.length ? (
        <div className="grid gap-4">
          {users.map((user) => (
            <article
              key={user.id}
              className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <Avatar src={user.avatarUrl} alt={user.username} name={user.username} />
                <div>
                  <Link
                    href={`/u/${user.username}`}
                    className="font-display text-xl font-semibold text-white"
                  >
                    @{user.username}
                  </Link>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-mist">
                    {user.bio || "Perfil listo para empezar a compartir."}
                  </p>
                  <div className="mt-2 flex gap-4 text-xs uppercase tracking-[0.18em] text-mist">
                    <span>{formatCount(user.counts.followers)} followers</span>
                    <span>{formatCount(user.counts.posts)} posts</span>
                  </div>
                </div>
              </div>
              <FollowButton username={user.username} initialFollowing={user.isFollowing} />
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No encontramos coincidencias"
          description="Prueba otro username o vuelve más tarde para descubrir nuevos perfiles."
        />
      )}
    </section>
  );
}

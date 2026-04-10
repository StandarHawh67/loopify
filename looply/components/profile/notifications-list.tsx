"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelativeTime } from "@/lib/utils";
import type { NotificationItem } from "@/types";

function getNotificationCopy(notification: NotificationItem) {
  switch (notification.type) {
    case "FOLLOW":
      return "empezó a seguirte.";
    case "LIKE":
      return "le dio like a una de tus publicaciones.";
    case "COMMENT":
      return "comentó en una de tus publicaciones.";
    default:
      return "interactuó contigo.";
  }
}

export function NotificationsList({
  initialItems,
  initialCursor
}: {
  initialItems: NotificationItem[];
  initialCursor: number | null;
}) {
  const [items, setItems] = useState(initialItems);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!nextCursor) return;
    setLoading(true);

    const response = await fetch(`/api/notifications?cursor=${nextCursor}`);
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      return;
    }

    setItems((current) => [...current, ...result.items]);
    setNextCursor(result.nextCursor);
  }

  if (!items.length) {
    return (
      <EmptyState
        title="Todo está en calma"
        description="Cuando alguien te siga, te dé like o te comente, aparecerá aquí."
      />
    );
  }

  return (
    <section className="space-y-4">
      {items.map((notification) => (
        <article
          key={notification.id}
          className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
        >
          <Avatar
            src={notification.actor.avatarUrl}
            alt={notification.actor.username}
            name={notification.actor.username}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-7 text-white">
              <Link
                href={`/u/${notification.actor.username}`}
                className="font-semibold text-accent"
              >
                @{notification.actor.username}
              </Link>{" "}
              {getNotificationCopy(notification)}
            </p>
            {notification.comment?.content ? (
              <p className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist">
                “{notification.comment.content}”
              </p>
            ) : notification.post?.content ? (
              <p className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-mist">
                {notification.post.content}
              </p>
            ) : null}
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-mist">
            {formatRelativeTime(notification.createdAt)}
          </p>
        </article>
      ))}

      {nextCursor ? (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={loadMore} disabled={loading}>
            {loading ? "Cargando..." : "Cargar más"}
          </Button>
        </div>
      ) : null}
    </section>
  );
}

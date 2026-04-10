"use client";

import { useEffect, useRef, useState } from "react";
import { CreatePostComposer } from "@/components/feed/create-post-composer";
import { PostCard } from "@/components/feed/post-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { FeedPost } from "@/types";

export function FeedColumn({
  initialPosts,
  initialCursor
}: {
  initialPosts: FeedPost[];
  initialCursor: number | null;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [nextCursor, setNextCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  async function loadMore() {
    if (!nextCursor || loading) return;

    setLoading(true);
    const response = await fetch(`/api/feed?cursor=${nextCursor}`);
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "No pudimos cargar más posts.");
      return;
    }

    setPosts((current) => [...current, ...result.items]);
    setNextCursor(result.nextCursor);
  }

  useEffect(() => {
    if (!sentinelRef.current || !nextCursor) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "320px"
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, nextCursor]);

  return (
    <div className="space-y-5">
      <CreatePostComposer onCreated={(post) => setPosts((current) => [post, ...current])} />

      {posts.length ? (
        <div className="space-y-5">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="El feed está listo para arrancar"
          description="Publica el primer post o ejecuta el seed para llenar Looply con contenido demo."
        />
      )}

      {error ? <p className="text-sm text-coral">{error}</p> : null}
      <div ref={sentinelRef} />

      {nextCursor ? (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => void loadMore()} disabled={loading}>
            {loading ? "Cargando..." : "Cargar más"}
          </Button>
        </div>
      ) : posts.length ? (
        <p className="text-center text-sm text-mist">Has llegado al final del loop, por ahora...</p>
      ) : null}
    </div>
  );
}

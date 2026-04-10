"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";
import type { PostComment } from "@/types";

type CommentsPanelProps = {
  open: boolean;
  postId: number;
  previewComments: PostComment[];
  onCommentCreated: (payload: {
    comment: PostComment;
    commentsCount: number;
  }) => void;
};

export function CommentsPanel({
  open,
  postId,
  previewComments,
  onCommentCreated
}: CommentsPanelProps) {
  const [comments, setComments] = useState<PostComment[]>(previewComments);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setComments(previewComments);
  }, [previewComments]);

  useEffect(() => {
    if (!open || hasFetched) return;

    let ignore = false;

    async function loadInitialComments() {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      const result = await response.json();
      if (ignore) return;
      setLoading(false);

      if (!response.ok) {
        setError(result.error ?? "No pudimos cargar los comentarios.");
        return;
      }

      setComments(result.items);
      setNextCursor(result.nextCursor);
      setHasFetched(true);
    }

    void loadInitialComments();

    return () => {
      ignore = true;
    };
  }, [hasFetched, open, postId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError("");

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content
      })
    });

    const result = await response.json();
    setSubmitting(false);

    if (!response.ok) {
      setError(result.error ?? "No pudimos comentar.");
      return;
    }

    setContent("");
    setComments((current) => [...current, result.comment]);
    onCommentCreated({
      comment: result.comment,
      commentsCount: result.commentsCount
    });
  }

  async function loadMore() {
    if (!nextCursor) return;
    setLoading(true);

    const response = await fetch(`/api/posts/${postId}/comments?cursor=${nextCursor}`);
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error ?? "No pudimos cargar más comentarios.");
      return;
    }

    setComments((current) => [...result.items, ...current]);
    setNextCursor(result.nextCursor);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-[#07101e]/80 p-4">
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <Input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Escribe un comentario..."
          className="h-11"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enviando..." : "Comentar"}
        </Button>
      </form>

      {error ? <p className="mt-3 text-sm text-coral">{error}</p> : null}

      <div className="mt-4 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start gap-3">
              <Avatar
                src={comment.author.avatarUrl}
                alt={comment.author.username}
                name={comment.author.username}
                className="h-10 w-10 rounded-xl"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium text-white">@{comment.author.username}</span>
                  <span className="text-mist">{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-mist">{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading ? <p className="mt-4 text-sm text-mist">Cargando comentarios...</p> : null}

      {nextCursor ? (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={loadMore} disabled={loading}>
            Ver más comentarios
          </Button>
        </div>
      ) : null}
    </div>
  );
}

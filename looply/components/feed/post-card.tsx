"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { CommentsPanel } from "@/components/feed/comments-panel";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { FeedPost, PostComment } from "@/types";

export function PostCard({ post }: { post: FeedPost }) {
  const [currentPost, setCurrentPost] = useState(post);
  const [showComments, setShowComments] = useState(false);
  const [likePending, setLikePending] = useState(false);
  const [error, setError] = useState("");

  async function handleLike() {
    setError("");
    setLikePending(true);

    const response = await fetch(`/api/posts/${currentPost.id}/like`, {
      method: currentPost.viewerHasLiked ? "DELETE" : "POST"
    });

    const result = await response.json();
    setLikePending(false);

    if (!response.ok) {
      setError(result.error ?? "No pudimos actualizar el like.");
      return;
    }

    setCurrentPost((current) => ({
      ...current,
      viewerHasLiked: result.viewerHasLiked,
      counts: {
        ...current.counts,
        likes: result.likesCount
      }
    }));
  }

  function handleCommentCreated(payload: { comment: PostComment; commentsCount: number }) {
    setCurrentPost((current) => ({
      ...current,
      counts: {
        ...current.counts,
        comments: payload.commentsCount
      },
      previewComments: [...current.previewComments, payload.comment].slice(-2)
    }));
  }

  return (
    <article className="panel p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <Avatar
          src={currentPost.author.avatarUrl}
          alt={currentPost.author.username}
          name={currentPost.author.username}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/u/${currentPost.author.username}`}
              className="font-display text-xl font-semibold text-white"
            >
              @{currentPost.author.username}
            </Link>
            <span className="text-xs uppercase tracking-[0.18em] text-mist">
              {formatRelativeTime(currentPost.createdAt)}
            </span>
          </div>
          {currentPost.content ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-mist">
              {currentPost.content}
            </p>
          ) : null}
        </div>
      </div>

      {currentPost.imageUrl ? (
        <div className="relative mt-5 overflow-hidden rounded-[1.75rem] border border-white/10">
          <Image
            src={currentPost.imageUrl}
            alt={currentPost.content || "Looply post"}
            width={1200}
            height={900}
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleLike}
          disabled={likePending}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition",
            currentPost.viewerHasLiked
              ? "bg-coral text-white"
              : "border border-white/10 bg-white/5 text-mist hover:text-white"
          )}
        >
          <Heart className={cn("h-4 w-4", currentPost.viewerHasLiked ? "fill-current" : "")} />
          {currentPost.counts.likes}
        </button>

        <button
          type="button"
          onClick={() => setShowComments((current) => !current)}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-mist transition hover:text-white"
        >
          <MessageCircle className="h-4 w-4" />
          {currentPost.counts.comments}
        </button>

        {error ? <p className="text-sm text-coral">{error}</p> : null}
      </div>

      {currentPost.previewComments.length > 0 && !showComments ? (
        <div className="mt-4 space-y-2">
          {currentPost.previewComments.map((comment) => (
            <p key={comment.id} className="text-sm text-mist">
              <span className="font-medium text-white">@{comment.author.username}</span> {comment.content}
            </p>
          ))}
        </div>
      ) : null}

      <CommentsPanel
        open={showComments}
        postId={currentPost.id}
        previewComments={currentPost.previewComments}
        onCommentCreated={handleCommentCreated}
      />
    </article>
  );
}

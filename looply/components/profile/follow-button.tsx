"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

type FollowButtonProps = {
  username: string;
  initialFollowing: boolean;
  size?: "sm" | "md";
  className?: string;
  onChange?: (payload: {
    isFollowing: boolean;
    counts: {
      followers: number;
      following: number;
      posts: number;
    };
  }) => void;
};

export function FollowButton({
  username,
  initialFollowing,
  size = "md",
  className,
  onChange
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleClick() {
    setError("");

    const method = isFollowing ? "DELETE" : "POST";
    const response = await fetch(`/api/users/${username}/follow`, {
      method
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "No pudimos actualizar el follow.");
      return;
    }

    startTransition(() => {
      setIsFollowing(result.isFollowing);
      onChange?.({
        isFollowing: result.isFollowing,
        counts: result.counts
      });
    });
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={isFollowing ? "secondary" : "primary"}
        size={size}
        className={className}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Actualizando..." : isFollowing ? "Siguiendo" : "Seguir"}
      </Button>
      {error ? <p className="text-xs text-coral">{error}</p> : null}
    </div>
  );
}

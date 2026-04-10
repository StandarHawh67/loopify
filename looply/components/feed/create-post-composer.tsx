"use client";

import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useCurrentUser } from "@/components/providers/current-user-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { FeedPost } from "@/types";

export function CreatePostComposer({
  onCreated
}: {
  onCreated: (post: FeedPost) => void;
}) {
  const { currentUser } = useCurrentUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleUpload(file: File) {
    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });
    const result = await response.json();
    setUploading(false);

    if (!response.ok) {
      setError(result.error ?? "No pudimos subir la imagen.");
      return;
    }

    setImageUrl(result.imageUrl);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content,
        imageUrl
      })
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "No pudimos publicar.");
      return;
    }

    startTransition(() => {
      setContent("");
      setImageUrl("");
      onCreated(result.post);
    });
  }

  return (
    <form className="panel space-y-5 p-5 sm:p-6" onSubmit={handleSubmit}>
      <div className="flex gap-4">
        <Avatar src={currentUser.avatarUrl} alt={currentUser.username} name={currentUser.username} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl font-semibold text-white">Comparte algo nuevo</p>
          <p className="mt-1 text-sm text-mist">
            Texto, imagen o ambos. Mantén la energía del feed en movimiento.
          </p>
        </div>
      </div>

      <Textarea
        value={content}
        maxLength={280}
        onChange={(event) => setContent(event.target.value)}
        placeholder="¿Qué está pasando en tu loop hoy?"
      />

      {imageUrl ? (
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10">
          <Image
            src={imageUrl}
            alt="Preview"
            width={1200}
            height={900}
            className="h-auto w-full object-cover"
          />
          <button
            type="button"
            onClick={() => setImageUrl("")}
            className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/20">
          <ImagePlus className="h-4 w-4" />
          {uploading ? "Subiendo imagen..." : "Añadir imagen"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleUpload(file);
              }
            }}
          />
        </label>

        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.18em] text-mist">{content.length}/280</span>
          <Button type="submit" disabled={isPending || uploading}>
            {isPending ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-coral">{error}</p> : null}
    </form>
  );
}

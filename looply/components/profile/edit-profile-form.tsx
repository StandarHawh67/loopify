"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useCurrentUser } from "@/components/providers/current-user-provider";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function EditProfileForm() {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [form, setForm] = useState({
    username: currentUser.username,
    bio: currentUser.bio,
    avatarUrl: currentUser.avatarUrl ?? ""
  });
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setForm({
      username: currentUser.username,
      bio: currentUser.bio,
      avatarUrl: currentUser.avatarUrl ?? ""
    });
  }, [currentUser]);

  async function handleAvatarUpload(file: File) {
    setStatus("");
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
      setStatus(result.error ?? "No pudimos subir el avatar.");
      return;
    }

    setForm((current) => ({
      ...current,
      avatarUrl: result.imageUrl
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");

    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const result = await response.json();
    if (!response.ok) {
      setStatus(result.error ?? "No pudimos guardar el perfil.");
      return;
    }

    startTransition(() => {
      setCurrentUser(result.user);
      setStatus("Perfil actualizado.");
      router.refresh();
    });
  }

  return (
    <form className="panel space-y-6 p-6 sm:p-8" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar
          src={form.avatarUrl}
          alt={form.username}
          name={form.username}
          className="h-20 w-20 rounded-[1.75rem] text-xl"
        />
        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-semibold">Identidad visual</h2>
            <p className="mt-1 text-sm text-mist">
              Sube un avatar para darle presencia a tu perfil.
            </p>
          </div>
          <label className="inline-flex cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:border-white/20">
            {uploading ? "Subiendo..." : "Subir avatar"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void handleAvatarUpload(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white" htmlFor="username">
            Username
          </label>
          <Input
            id="username"
            value={form.username}
            onChange={(event) =>
              setForm((current) => ({ ...current, username: event.target.value }))
            }
            placeholder="loopmaker"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white" htmlFor="bio">
            Bio
          </label>
          <Textarea
            id="bio"
            maxLength={180}
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            placeholder="Cuenta quién eres, qué compartes o qué te inspira."
            className="min-h-[140px]"
          />
        </div>
      </div>

      {status ? (
        <p className={`text-sm ${status.includes("actualizado") ? "text-accent" : "text-coral"}`}>
          {status}
        </p>
      ) : null}

      <Button type="submit" disabled={isPending || uploading}>
        {isPending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}

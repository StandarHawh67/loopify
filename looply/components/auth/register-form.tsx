"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "No pudimos crear la cuenta.");
      return;
    }

    startTransition(() => {
      router.push("/feed");
      router.refresh();
    });
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
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
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          placeholder="tu@looply.com"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white" htmlFor="password">
          Contraseña
        </label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({ ...current, password: event.target.value }))
          }
          placeholder="Mínimo 8 caracteres"
          required
        />
      </div>

      {error ? <p className="text-sm text-coral">{error}</p> : null}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <Link href="/" className="block text-center text-sm text-mist transition hover:text-white">
        Volver al inicio
      </Link>
    </form>
  );
}

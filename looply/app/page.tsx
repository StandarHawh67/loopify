import Link from "next/link";
import { Layers3, Sparkles, Zap } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const features = [
  {
    title: "Feed vivo",
    description: "Publica texto, imagen y entra al ritmo de una comunidad que se mueve en tiempo real.",
    icon: Layers3
  },
  {
    title: "Interacciones fluidas",
    description: "Likes, comentarios, follows y notificaciones en una experiencia limpia y ligera.",
    icon: Zap
  },
  {
    title: "Perfiles con identidad",
    description: "Bio, avatar, grid visual y presencia propia para cada creador.",
    icon: Sparkles
  }
];

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8 sm:px-10 lg:px-12">
      <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
        <div className="font-display text-xl font-semibold tracking-tight">Looply</div>
        <nav className="flex items-center gap-3 text-sm text-mist">
          <Link
            href={currentUser ? "/feed" : "/login"}
            className="rounded-full border border-white/10 px-4 py-2 text-ink transition hover:border-accent/50 hover:bg-white/5"
          >
            {currentUser ? "Entrar al feed" : "Iniciar sesión"}
          </Link>
          {!currentUser ? (
            <Link
              href="/register"
              className="rounded-full bg-accent px-4 py-2 font-medium text-slate-950 transition hover:scale-[1.02]"
            >
              Crear cuenta
            </Link>
          ) : null}
        </nav>
      </header>

      <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="animate-fade space-y-8">
          <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
            Social media moderna, lista para desplegar
          </span>
          <div className="space-y-5">
            <h1 className="font-display text-5xl font-semibold leading-tight text-white sm:text-6xl">
              La red social donde cada publicación deja huella y vuelve a conectar.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-mist">
              Looply combina la inmediatez de un timeline, la presencia visual de una galería y
              una interfaz elegante pensada para desktop y móvil.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href={currentUser ? "/feed" : "/register"}
              className="rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
            >
              {currentUser ? "Abrir Looply" : "Crear mi espacio"}
            </Link>
            <Link
              href={currentUser ? "/search" : "/login"}
              className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-medium text-white transition hover:border-white/20"
            >
              Explorar perfiles
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-x-10 top-8 h-52 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between rounded-3xl border border-white/10 bg-surface-soft/60 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-mist">Live pulse</p>
                <p className="font-display text-xl font-semibold text-white">Looply Feed</p>
              </div>
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent">
                Dark mode
              </span>
            </div>
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="animate-float rounded-[1.5rem] border border-white/10 bg-[#09111f]/85 p-4"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-accent">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h2 className="font-display text-xl font-semibold text-white">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-mist">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

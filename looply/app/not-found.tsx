import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
      <div className="panel w-full p-10 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-mist">404</p>
        <h1 className="mt-4 text-4xl font-semibold">Esa página se perdió en el loop.</h1>
        <p className="mt-4 text-sm leading-6 text-mist">
          Puede que el perfil no exista o que el enlace ya no sea válido.
        </p>
        <Link
          href="/feed"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-slate-950 transition hover:brightness-110"
        >
          Volver al feed
        </Link>
      </div>
    </main>
  );
}

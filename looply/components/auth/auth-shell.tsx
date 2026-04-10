import Link from "next/link";

export function AuthShell({
  title,
  subtitle,
  children,
  altHref,
  altLabel,
  altText
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  altHref: string;
  altLabel: string;
  altText: string;
}) {
  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl items-center gap-12 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
      <section className="hidden space-y-6 lg:block">
        <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-accent">
          Looply social experience
        </span>
        <div className="space-y-5">
          <h1 className="font-display max-w-3xl text-6xl font-semibold leading-tight text-white">
            Publica. Conecta. Vuelve a aparecer en el loop correcto.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-mist">
            Feed infinito, perfiles visuales y una interfaz suave que mezcla la energía de
            Instagram con la conversación de Twitter.
          </p>
        </div>
        <div className="grid max-w-2xl gap-4 md:grid-cols-2">
          <div className="panel p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-mist">Visual first</p>
            <p className="mt-3 text-lg text-white">Comparte imágenes y microhistorias en un mismo lugar.</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-mist">Built to flow</p>
            <p className="mt-3 text-lg text-white">Responsive, oscuro por defecto y con transiciones suaves.</p>
          </div>
        </div>
      </section>

      <section className="panel mx-auto w-full max-w-xl p-7 sm:p-9">
        <div className="mb-8 space-y-3">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-slate-950">
              <span className="font-display text-lg font-bold">L</span>
            </div>
            <span className="font-display text-2xl font-semibold">Looply</span>
          </Link>
          <div>
            <h2 className="text-3xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-mist">{subtitle}</p>
          </div>
        </div>

        {children}

        <p className="mt-8 text-sm text-mist">
          {altText}{" "}
          <Link href={altHref} className="font-medium text-accent">
            {altLabel}
          </Link>
        </p>
      </section>
    </main>
  );
}

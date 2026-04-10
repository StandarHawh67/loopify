import { SearchUsers } from "@/components/profile/search-users";
import { requireCurrentUser } from "@/lib/auth";
import { getDiscoveryUsers } from "@/lib/queries";

export default async function SearchPage() {
  const currentUser = await requireCurrentUser();
  const users = await getDiscoveryUsers(currentUser.id);

  return (
    <div className="space-y-5">
      <section className="panel p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-mist">Search</p>
        <h1 className="mt-2 text-3xl font-semibold">Encuentra a tu próxima conexión</h1>
        <p className="mt-2 text-sm leading-6 text-mist">
          Busca por username y descubre perfiles listos para entrar en tu círculo.
        </p>
      </section>

      <SearchUsers initialUsers={users} />
    </div>
  );
}

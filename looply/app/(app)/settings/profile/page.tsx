import { EditProfileForm } from "@/components/profile/edit-profile-form";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-5">
      <section className="panel p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-mist">Profile settings</p>
        <h1 className="mt-2 text-3xl font-semibold">Edita tu identidad</h1>
        <p className="mt-2 text-sm leading-6 text-mist">
          Ajusta tu username, tu bio y tu avatar para que tu perfil refleje mejor tu estilo.
        </p>
      </section>

      <EditProfileForm />
    </div>
  );
}

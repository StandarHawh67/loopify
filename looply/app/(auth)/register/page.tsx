import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Abre tu espacio, comparte texto e imagen y empieza a construir tu comunidad."
      altHref="/login"
      altLabel="Iniciar sesión"
      altText="¿Ya tienes una cuenta?"
    >
      <RegisterForm />
    </AuthShell>
  );
}

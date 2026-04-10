import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Bienvenido de vuelta"
      subtitle="Accede a tu feed, tus notificaciones y tu perfil visual en Looply."
      altHref="/register"
      altLabel="Crear cuenta"
      altText="¿Todavía no tienes cuenta?"
    >
      <LoginForm />
    </AuthShell>
  );
}

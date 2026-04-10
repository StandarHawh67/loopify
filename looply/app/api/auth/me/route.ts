import { getCurrentUser } from "@/lib/auth";
import { handleApiError, jsonError, jsonSuccess } from "@/lib/api";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return jsonError("No hay una sesión activa.", 401);
    }

    return jsonSuccess({ user });
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError, jsonSuccess } from "@/lib/api";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookie();
    return jsonSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}

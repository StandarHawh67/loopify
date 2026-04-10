import { getCurrentUser } from "@/lib/auth";
import { handleApiError, jsonSuccess } from "@/lib/api";
import { searchUsers } from "@/lib/queries";
import { searchSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const currentUser = await getCurrentUser();
    const { q } = searchSchema.parse({
      q: url.searchParams.get("q") ?? ""
    });

    const users = await searchUsers({
      query: q,
      viewerId: currentUser?.id
    });

    return jsonSuccess({ users });
  } catch (error) {
    return handleApiError(error);
  }
}

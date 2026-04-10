import { getCurrentUser } from "@/lib/auth";
import { ApiError, handleApiError, jsonSuccess } from "@/lib/api";
import { getProfileByUsername } from "@/lib/queries";

type RouteContext = {
  params: Promise<{
    username: string;
  }>;
};

export async function GET(_: Request, context: RouteContext) {
  try {
    const { username } = await context.params;
    const currentUser = await getCurrentUser();

    const profile = await getProfileByUsername({
      username: decodeURIComponent(username).toLowerCase(),
      viewerId: currentUser?.id
    });

    if (!profile) {
      throw new ApiError(404, "No encontramos ese perfil.");
    }

    return jsonSuccess({ profile });
  } catch (error) {
    return handleApiError(error);
  }
}

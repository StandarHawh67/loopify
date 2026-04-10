import { getCurrentUser } from "@/lib/auth";
import { handleApiError, jsonSuccess, parseCursor, parseLimit } from "@/lib/api";
import { getFeedPage } from "@/lib/queries";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const cursor = parseCursor(url.searchParams.get("cursor"));
    const limit = parseLimit(url.searchParams.get("limit"), 8, 12);
    const currentUser = await getCurrentUser();

    const feed = await getFeedPage({
      cursor,
      limit,
      viewerId: currentUser?.id
    });

    return jsonSuccess(feed);
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError, jsonSuccess, parseCursor, parseLimit, requireApiUser } from "@/lib/api";
import { getNotificationsPage } from "@/lib/queries";
import { markNotificationsAsRead } from "@/lib/notifications";

export async function GET(request: Request) {
  try {
    const currentUser = await requireApiUser();
    const url = new URL(request.url);
    const cursor = parseCursor(url.searchParams.get("cursor"));
    const limit = parseLimit(url.searchParams.get("limit"), 10, 20);

    const notifications = await getNotificationsPage({
      cursor,
      limit,
      userId: currentUser.id
    });

    await markNotificationsAsRead(currentUser.id);

    return jsonSuccess(notifications);
  } catch (error) {
    return handleApiError(error);
  }
}

import { ApiError, handleApiError, jsonSuccess, requireApiUser } from "@/lib/api";
import { saveImageFile } from "@/lib/upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireApiUser();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ApiError(400, "No encontramos ningún archivo para subir.");
    }

    const imageUrl = await saveImageFile(file);

    return jsonSuccess(
      {
        imageUrl
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError, jsonError, jsonSuccess, requireApiUser } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return jsonError("No hay una sesión activa.", 401);
    }

    return jsonSuccess({ user: currentUser });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const currentUser = await requireApiUser();
    const body = profileSchema.parse(await request.json());

    const existingUser = await prisma.user.findFirst({
      where: {
        username: body.username,
        id: {
          not: currentUser.id
        }
      },
      select: {
        id: true
      }
    });

    if (existingUser) {
      return jsonError("Ese username ya está en uso.", 409);
    }

    const user = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        username: body.username,
        bio: body.bio,
        avatarUrl: body.avatarUrl
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true
      }
    });

    return jsonSuccess({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

import { handleApiError, jsonError, jsonSuccess } from "@/lib/api";
import { setAuthCookie, signAuthToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());

    const user = await prisma.user.findUnique({
      where: {
        email: body.email
      },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        avatarUrl: true,
        bio: true,
        createdAt: true
      }
    });

    if (!user) {
      return jsonError("No encontramos una cuenta con ese email.", 401);
    }

    const passwordMatches = await verifyPassword(body.password, user.passwordHash);
    if (!passwordMatches) {
      return jsonError("La contraseña no es correcta.", 401);
    }

    const token = await signAuthToken({
      userId: user.id,
      email: user.email
    });

    await setAuthCookie(token);

    return jsonSuccess({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    return handleApiError(error);
  }
}

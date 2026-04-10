import { handleApiError, jsonError, jsonSuccess } from "@/lib/api";
import { hashPassword, setAuthCookie, signAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: body.email }, { username: body.username }]
      },
      select: {
        email: true,
        username: true
      }
    });

    if (existingUser?.email === body.email) {
      return jsonError("Ese email ya está registrado.", 409);
    }

    if (existingUser?.username === body.username) {
      return jsonError("Ese username ya está en uso.", 409);
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        username: body.username,
        passwordHash: await hashPassword(body.password)
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

    const token = await signAuthToken({
      userId: user.id,
      email: user.email
    });

    await setAuthCookie(token);

    return jsonSuccess(
      {
        user: {
          ...user,
          createdAt: user.createdAt.toISOString()
        }
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

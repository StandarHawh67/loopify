import { ApiError, handleApiError, jsonSuccess, requireApiUser } from "@/lib/api";
import { createNotification } from "@/lib/notifications";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    username: string;
  }>;
};

async function getFollowSnapshot(targetUserId: string, viewerId: string) {
  const snapshot = await prisma.user.findUnique({
    where: {
      id: targetUserId
    },
    select: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      },
      followers: {
        where: {
          followerId: viewerId
        },
        select: {
          id: true
        }
      }
    }
  });

  if (!snapshot) {
    throw new ApiError(404, "No encontramos ese perfil.");
  }

  return {
    counts: snapshot._count,
    isFollowing: snapshot.followers.length > 0
  };
}

export async function POST(_: Request, context: RouteContext) {
  try {
    const currentUser = await requireApiUser();
    const { username } = await context.params;

    const targetUser = await prisma.user.findUnique({
      where: {
        username: decodeURIComponent(username).toLowerCase()
      },
      select: {
        id: true
      }
    });

    if (!targetUser) {
      throw new ApiError(404, "No encontramos ese perfil.");
    }

    if (targetUser.id === currentUser.id) {
      throw new ApiError(400, "No puedes seguirte a ti mismo.");
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: targetUser.id
        }
      }
    });

    if (!existingFollow) {
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: targetUser.id
        }
      });

      await createNotification({
        type: "FOLLOW",
        userId: targetUser.id,
        actorId: currentUser.id
      });
    }

    return jsonSuccess(await getFollowSnapshot(targetUser.id, currentUser.id));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const currentUser = await requireApiUser();
    const { username } = await context.params;

    const targetUser = await prisma.user.findUnique({
      where: {
        username: decodeURIComponent(username).toLowerCase()
      },
      select: {
        id: true
      }
    });

    if (!targetUser) {
      throw new ApiError(404, "No encontramos ese perfil.");
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: currentUser.id,
        followingId: targetUser.id
      }
    });

    return jsonSuccess(await getFollowSnapshot(targetUser.id, currentUser.id));
  } catch (error) {
    return handleApiError(error);
  }
}

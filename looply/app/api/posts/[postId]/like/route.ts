import { ApiError, handleApiError, jsonSuccess, requireApiUser } from "@/lib/api";
import { prisma } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

type RouteContext = {
  params: Promise<{
    postId: string;
  }>;
};

function parsePostId(rawValue: string) {
  const postId = Number(rawValue);
  if (!Number.isInteger(postId) || postId < 1) {
    throw new ApiError(400, "El identificador del post no es válido.");
  }

  return postId;
}

export async function POST(_: Request, context: RouteContext) {
  try {
    const currentUser = await requireApiUser();
    const { postId: rawPostId } = await context.params;
    const postId = parsePostId(rawPostId);

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
      select: {
        id: true,
        authorId: true
      }
    });

    if (!post) {
      throw new ApiError(404, "No encontramos ese post.");
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: currentUser.id,
          postId
        }
      }
    });

    if (!existingLike) {
      await prisma.like.create({
        data: {
          userId: currentUser.id,
          postId
        }
      });

      await createNotification({
        type: "LIKE",
        userId: post.authorId,
        actorId: currentUser.id,
        postId
      });
    }

    const likesCount = await prisma.like.count({
      where: {
        postId
      }
    });

    return jsonSuccess({
      viewerHasLiked: true,
      likesCount
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, context: RouteContext) {
  try {
    const currentUser = await requireApiUser();
    const { postId: rawPostId } = await context.params;
    const postId = parsePostId(rawPostId);

    await prisma.like.deleteMany({
      where: {
        userId: currentUser.id,
        postId
      }
    });

    const likesCount = await prisma.like.count({
      where: {
        postId
      }
    });

    return jsonSuccess({
      viewerHasLiked: false,
      likesCount
    });
  } catch (error) {
    return handleApiError(error);
  }
}

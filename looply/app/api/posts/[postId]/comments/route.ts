import { ApiError, handleApiError, jsonSuccess, parseCursor, parseLimit, requireApiUser } from "@/lib/api";
import { createNotification } from "@/lib/notifications";
import { getPostComments } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { commentSchema } from "@/lib/validations";

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

export async function GET(request: Request, context: RouteContext) {
  try {
    const { postId: rawPostId } = await context.params;
    const postId = parsePostId(rawPostId);
    const url = new URL(request.url);
    const cursor = parseCursor(url.searchParams.get("cursor"));
    const limit = parseLimit(url.searchParams.get("limit"), 8, 12);

    const comments = await getPostComments({
      postId,
      cursor,
      limit
    });

    return jsonSuccess(comments);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const currentUser = await requireApiUser();
    const { postId: rawPostId } = await context.params;
    const postId = parsePostId(rawPostId);
    const body = commentSchema.parse(await request.json());

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

    const comment = await prisma.comment.create({
      data: {
        content: body.content,
        authorId: currentUser.id,
        postId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            bio: true
          }
        }
      }
    });

    await createNotification({
      type: "COMMENT",
      userId: post.authorId,
      actorId: currentUser.id,
      postId,
      commentId: comment.id
    });

    const commentsCount = await prisma.comment.count({
      where: {
        postId
      }
    });

    return jsonSuccess(
      {
        comment: {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt.toISOString(),
          author: {
            id: comment.author.id,
            username: comment.author.username,
            avatarUrl: comment.author.avatarUrl,
            bio: comment.author.bio
          }
        },
        commentsCount
      },
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

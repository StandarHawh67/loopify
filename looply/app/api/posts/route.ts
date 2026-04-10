import { ApiError, handleApiError, jsonSuccess, requireApiUser } from "@/lib/api";
import { prisma } from "@/lib/db";
import { getPostById } from "@/lib/queries";
import { postSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const currentUser = await requireApiUser();
    const body = postSchema.parse(await request.json());

    if (!body.content.trim() && !body.imageUrl) {
      throw new ApiError(422, "Tu publicación necesita texto, imagen o ambas cosas.");
    }

    const createdPost = await prisma.post.create({
      data: {
        authorId: currentUser.id,
        content: body.content.trim(),
        imageUrl: body.imageUrl
      },
      select: {
        id: true
      }
    });

    const post = await getPostById({
      postId: createdPost.id,
      viewerId: currentUser.id
    });

    return jsonSuccess({ post }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

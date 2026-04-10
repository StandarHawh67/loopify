import { prisma } from "@/lib/db";
import type { NotificationKind } from "@/types";

type CreateNotificationInput = {
  type: NotificationKind;
  userId: string;
  actorId: string;
  postId?: number;
  commentId?: number;
};

export async function createNotification(input: CreateNotificationInput) {
  if (input.userId === input.actorId) {
    return null;
  }

  return prisma.notification.create({
    data: {
      type: input.type,
      userId: input.userId,
      actorId: input.actorId,
      postId: input.postId,
      commentId: input.commentId
    }
  });
}

export async function markNotificationsAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: {
      userId,
      readAt: null
    },
    data: {
      readAt: new Date()
    }
  });
}

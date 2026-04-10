import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type {
  CompactUser,
  FeedPost,
  NotificationKind,
  NotificationItem,
  PaginatedResult,
  PostComment,
  ProfileData,
  ProfilePost,
  SearchUserItem
} from "@/types";

const EMPTY_VIEWER_ID = "__looply_viewer_missing__";

const baseUserSelect = {
  id: true,
  username: true,
  avatarUrl: true,
  bio: true
} satisfies Prisma.UserSelect;

const commentInclude = {
  author: {
    select: baseUserSelect
  }
} satisfies Prisma.CommentInclude;

function viewerIdOrFallback(viewerId?: string | null) {
  return viewerId ?? EMPTY_VIEWER_ID;
}

function serializeCompactUser(user: {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string;
}): CompactUser {
  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio
  };
}

function serializeComment(comment: {
  id: number;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
    bio: string;
  };
}): PostComment {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    author: serializeCompactUser(comment.author)
  };
}

function serializePost(post: {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  author: {
    id: string;
    username: string;
    avatarUrl: string | null;
    bio: string;
  };
  comments: Array<{
    id: number;
    content: string;
    createdAt: Date;
    author: {
      id: string;
      username: string;
      avatarUrl: string | null;
      bio: string;
    };
  }>;
  likes: Array<{ id: number }>;
  _count: {
    likes: number;
    comments: number;
  };
}): FeedPost {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt.toISOString(),
    author: serializeCompactUser(post.author),
    counts: post._count,
    viewerHasLiked: post.likes.length > 0,
    previewComments: [...post.comments].reverse().map(serializeComment)
  };
}

function serializeProfilePost(post: {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  _count: {
    likes: number;
    comments: number;
  };
}): ProfilePost {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt.toISOString(),
    counts: post._count
  };
}

export async function getFeedPage({
  cursor,
  limit = 8,
  viewerId
}: {
  cursor?: number | null;
  limit?: number;
  viewerId?: string | null;
}): Promise<PaginatedResult<FeedPost>> {
  const posts = await prisma.post.findMany({
    take: limit + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1
        }
      : {}),
    orderBy: {
      id: "desc"
    },
    include: {
      author: {
        select: baseUserSelect
      },
      comments: {
        take: 2,
        orderBy: {
          id: "desc"
        },
        include: commentInclude
      },
      likes: {
        where: {
          userId: viewerIdOrFallback(viewerId)
        },
        select: {
          id: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  });

  const hasMore = posts.length > limit;
  const visiblePosts = hasMore ? posts.slice(0, limit) : posts;

  return {
    items: visiblePosts.map(serializePost),
    nextCursor: hasMore ? visiblePosts[visiblePosts.length - 1]?.id ?? null : null
  };
}

export async function getPostById({
  postId,
  viewerId
}: {
  postId: number;
  viewerId?: string | null;
}) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      author: {
        select: baseUserSelect
      },
      comments: {
        take: 2,
        orderBy: {
          id: "desc"
        },
        include: commentInclude
      },
      likes: {
        where: {
          userId: viewerIdOrFallback(viewerId)
        },
        select: {
          id: true
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  });

  return post ? serializePost(post) : null;
}

export async function getPostComments({
  postId,
  cursor,
  limit = 8
}: {
  postId: number;
  cursor?: number | null;
  limit?: number;
}): Promise<PaginatedResult<PostComment>> {
  const comments = await prisma.comment.findMany({
    where: { postId },
    take: limit + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1
        }
      : {}),
    orderBy: {
      id: "desc"
    },
    include: commentInclude
  });

  const hasMore = comments.length > limit;
  const visibleComments = hasMore ? comments.slice(0, limit) : comments;

  return {
    items: [...visibleComments].reverse().map(serializeComment),
    nextCursor: hasMore ? visibleComments[visibleComments.length - 1]?.id ?? null : null
  };
}

export async function getDiscoveryUsers(viewerId?: string | null): Promise<SearchUserItem[]> {
  const users = await prisma.user.findMany({
    where: viewerId
      ? {
          id: {
            not: viewerId
          }
        }
      : undefined,
    take: 5,
    orderBy: {
      createdAt: "desc"
    },
    select: {
      ...baseUserSelect,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      },
      followers: {
        where: {
          followerId: viewerIdOrFallback(viewerId)
        },
        select: {
          id: true
        }
      }
    }
  });

  return users.map((user) => ({
    ...serializeCompactUser(user),
    counts: user._count,
    isFollowing: user.followers.length > 0
  }));
}

export async function searchUsers({
  query,
  viewerId
}: {
  query: string;
  viewerId?: string | null;
}): Promise<SearchUserItem[]> {
  const normalizedQuery = query.toLowerCase();

  const users = await prisma.user.findMany({
    where: {
      ...(viewerId
        ? {
            id: {
              not: viewerId
            }
          }
        : {}),
      ...(query
        ? {
            username: {
              contains: normalizedQuery
            }
          }
        : {})
    },
    take: 12,
    orderBy: {
      createdAt: "desc"
    },
    select: {
      ...baseUserSelect,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      },
      followers: {
        where: {
          followerId: viewerIdOrFallback(viewerId)
        },
        select: {
          id: true
        }
      }
    }
  });

  return users.map((user) => ({
    ...serializeCompactUser(user),
    counts: user._count,
    isFollowing: user.followers.length > 0
  }));
}

export async function getProfileByUsername({
  username,
  viewerId
}: {
  username: string;
  viewerId?: string | null;
}): Promise<ProfileData | null> {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      ...baseUserSelect,
      createdAt: true,
      posts: {
        orderBy: {
          id: "desc"
        },
        select: {
          id: true,
          content: true,
          imageUrl: true,
          createdAt: true,
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        }
      },
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      },
      followers: {
        where: {
          followerId: viewerIdOrFallback(viewerId)
        },
        select: {
          id: true
        }
      }
    }
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
    counts: user._count,
    isFollowing: user.followers.length > 0,
    posts: user.posts.map(serializeProfilePost)
  };
}

export async function getNotificationsPage({
  cursor,
  limit = 12,
  userId
}: {
  cursor?: number | null;
  limit?: number;
  userId: string;
}): Promise<PaginatedResult<NotificationItem>> {
  const notifications = await prisma.notification.findMany({
    where: {
      userId
    },
    take: limit + 1,
    ...(cursor
      ? {
          cursor: { id: cursor },
          skip: 1
        }
      : {}),
    orderBy: {
      id: "desc"
    },
    include: {
      actor: {
        select: baseUserSelect
      },
      post: {
        select: {
          id: true,
          content: true,
          imageUrl: true
        }
      },
      comment: {
        select: {
          id: true,
          content: true
        }
      }
    }
  });

  const hasMore = notifications.length > limit;
  const visibleNotifications = hasMore ? notifications.slice(0, limit) : notifications;

  return {
    items: visibleNotifications.map((notification) => ({
      id: notification.id,
      type: notification.type as NotificationKind,
      createdAt: notification.createdAt.toISOString(),
      readAt: notification.readAt ? notification.readAt.toISOString() : null,
      actor: serializeCompactUser(notification.actor),
      post:
        notification.post && notification.postId
          ? {
              id: notification.post.id,
              content: notification.post.content,
              imageUrl: notification.post.imageUrl
            }
          : null,
      comment:
        notification.comment && notification.commentId
          ? {
              id: notification.comment.id,
              content: notification.comment.content
            }
          : null
    })),
    nextCursor: hasMore ? visibleNotifications[visibleNotifications.length - 1]?.id ?? null : null
  };
}

export async function getUnreadNotificationsCount(userId: string) {
  return prisma.notification.count({
    where: {
      userId,
      readAt: null
    }
  });
}

export type PaginatedResult<T> = {
  items: T[];
  nextCursor: number | null;
};

export type CompactUser = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string;
};

export type SessionUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  bio: string;
  createdAt: string;
};

export type PostComment = {
  id: number;
  content: string;
  createdAt: string;
  author: CompactUser;
};

export type FeedPost = {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: CompactUser;
  counts: {
    likes: number;
    comments: number;
  };
  viewerHasLiked: boolean;
  previewComments: PostComment[];
};

export type ProfilePost = {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  counts: {
    likes: number;
    comments: number;
  };
};

export type ProfileData = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string;
  createdAt: string;
  counts: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing: boolean;
  posts: ProfilePost[];
};

export type SearchUserItem = CompactUser & {
  counts: {
    followers: number;
    following: number;
    posts: number;
  };
  isFollowing: boolean;
};

export type NotificationItem = {
  id: number;
  type: NotificationKind;
  createdAt: string;
  readAt: string | null;
  actor: CompactUser;
  post: {
    id: number;
    content: string;
    imageUrl: string | null;
  } | null;
  comment: {
    id: number;
    content: string;
  } | null;
};

export type NotificationKind = "FOLLOW" | "LIKE" | "COMMENT";

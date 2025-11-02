export interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string; // ISO string from backend
}

export interface CreateCommentInput {
  postId: number;
  author: string;
  content: string;
}

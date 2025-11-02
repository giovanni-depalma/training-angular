import { Comment } from './comment';

export interface Post {
  id: number;
  title: string;
  body: string;
  createdAt: string; // ISO UTC string from backend
  comments: Comment[];
}

export interface CreatePostInput {
  title: string;
  body: string;
}

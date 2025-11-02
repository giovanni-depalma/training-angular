import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { PostsApi } from '../api/posts.api';
import { CommentsApi } from '../api/comments.api';
import { CreatePostInput, Post } from '../models/post';
import { CreateCommentInput } from '../models/comment';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly postsApi = inject(PostsApi);
  private readonly commentsApi = inject(CommentsApi);

  private readonly _posts: WritableSignal<Post[]> = signal<Post[]>([]);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  readonly posts = this._posts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this._loading.set(true);
    this._error.set(null);
    this.postsApi.list().subscribe({
      next: (data) => this._posts.set(data),
      error: () => this._error.set('Errore nel caricamento dei post'),
      complete: () => this._loading.set(false)
    });
  }

  createPost(input: CreatePostInput): void {
    this._loading.set(true);
    this.postsApi.create(input).subscribe({
      next: () => this.refresh(),
      error: () => {
        this._error.set('Errore nella creazione del post');
        this._loading.set(false);
      }
    });
  }

  deletePost(id: number): void {
    this._loading.set(true);
    this.postsApi.delete(id).subscribe({
      next: () => this.refresh(),
      error: () => {
        this._error.set("Errore nell'eliminazione del post");
        this._loading.set(false);
      }
    });
  }

  createComment(input: CreateCommentInput): void {
    this._loading.set(true);
    this.commentsApi.create(input).subscribe({
      next: () => this.refresh(),
      error: () => {
        this._error.set('Errore nella creazione del commento');
        this._loading.set(false);
      }
    });
  }
}

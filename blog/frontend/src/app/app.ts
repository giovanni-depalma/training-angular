import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PostsService } from './services/posts.service';
import { PostForm } from './components/post-form/post-form';
import { PostList } from './components/post-list/post-list';
import { CreatePostInput } from './models/post';
import { CreateCommentInput } from './models/comment';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatToolbarModule, MatCardModule, MatProgressSpinnerModule, PostForm, PostList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: { class: 'app-root' }
})
export class App {
  private readonly postsService = inject(PostsService);

  readonly posts = this.postsService.posts;
  readonly loading = this.postsService.loading;
  readonly error = this.postsService.error;

  // Delegation to service
  onCreatePost(input: CreatePostInput): void {
    this.postsService.createPost(input);
  }

  onDeletePost(id: number): void {
    this.postsService.deletePost(id);
  }

  onCreateComment(input: CreateCommentInput): void {
    this.postsService.createComment(input);
  }
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../models/post';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommentsList } from '../comments-list/comments-list';
import { CommentForm } from '../comment-form/comment-form';
import { CreateCommentInput } from '../../models/comment';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, CommentsList, CommentForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
  host: { class: 'post-list' }
})
export class PostList {
  readonly posts = input<Post[]>([]);
  readonly deleteClicked = output<number>();
  readonly commentSubmitted = output<CreateCommentInput>();
}

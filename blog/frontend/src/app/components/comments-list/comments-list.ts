import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../models/comment';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-comments-list',
  imports: [CommonModule, MatListModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './comments-list.html',
  styleUrl: './comments-list.css',
  host: { class: 'comments-list' }
})
export class CommentsList {
  readonly comments = input<Comment[]>([]);
}

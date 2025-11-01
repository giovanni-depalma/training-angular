import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
  host: { class: 'todo-list' }
})
export class TodoList {
  readonly todos = input<Todo[]>([]);
  readonly deleteClicked = output<number>();
}

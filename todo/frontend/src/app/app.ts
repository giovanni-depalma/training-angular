import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTodoInput } from './models/todo';
import { TodoFilter } from './components/todo-filter/todo-filter';
import { TodoList } from './components/todo-list/todo-list';
import { TodoForm } from './components/todo-form/todo-form';
import { TodosService } from './services/todos.service';
import { CategoriesService } from './services/categories.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatToolbarModule, MatCardModule, MatProgressSpinnerModule, TodoFilter, TodoList, TodoForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  host: { class: 'app-root' }
})
export class App {
  private readonly todosService = inject(TodosService);
  private readonly categoriesService = inject(CategoriesService);

  // Expose readonly signals from services to the template
  readonly categories = this.categoriesService.categories;
  readonly selectedCategoryId = this.todosService.selectedCategoryId;
  readonly todos = this.todosService.todos;

  // Merge loading and error from both stores for a simple UI indicator
  readonly loading = computed(() => this.categoriesService.loading() || this.todosService.loading());
  readonly error = computed(() => this.todosService.error() ?? this.categoriesService.error());

  // Event handlers delegate to the stores
  onCategoryChange(categoryId: number | null): void {
    this.todosService.setCategory(categoryId);
  }

  onDelete(id: number): void {
    this.todosService.delete(id);
  }

  onCreate(input: CreateTodoInput): void {
    this.todosService.create(input);
  }
}

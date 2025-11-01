import { Injectable, inject, signal, WritableSignal, effect } from '@angular/core';
import { TodosApi } from '../api/todos.api';
import { CreateTodoInput, Todo } from '../models/todo';

@Injectable({ providedIn: 'root' })
export class TodosService {
  private readonly api = inject(TodosApi);

  // Internal writable signals
  private readonly _selectedCategoryId: WritableSignal<number | null> = signal<number | null>(null);
  private readonly _todos: WritableSignal<Todo[]> = signal<Todo[]>([]);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  // Public readonly signals
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();
  readonly todos = this._todos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    // Auto-fetch when the category changes
    effect(() => {
      const catId = this._selectedCategoryId();
      this.refresh(catId);
    });
  }

  setCategory(categoryId: number | null): void {
    this._selectedCategoryId.set(categoryId);
  }

  refresh(categoryId: number | null = this._selectedCategoryId()): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.list({ categoryId }).subscribe({
      next: (data) => this._todos.set(data),
      error: () => this._error.set('Errore nel caricamento dei To‑Do'),
      complete: () => this._loading.set(false)
    });
  }

  create(input: CreateTodoInput): void {
    this._loading.set(true);
    this.api.create(input).subscribe({
      next: () => this.refresh(),
      error: () => {
        this._error.set('Errore nella creazione del To‑Do');
        this._loading.set(false);
      }
    });
  }

  delete(id: number): void {
    this._loading.set(true);
    this.api.delete(id).subscribe({
      next: () => this.refresh(),
      error: () => {
        this._error.set("Errore nell'eliminazione del To‑Do");
        this._loading.set(false);
      }
    });
  }
}

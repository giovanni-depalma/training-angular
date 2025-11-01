import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { CategoriesApi } from '../api/categories.api';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private readonly api = inject(CategoriesApi);

  // Internal writable signals
  private readonly _categories: WritableSignal<Category[]> = signal<Category[]>([]);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  // Public readonly signals
  readonly categories = this._categories.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    // Autoload on service construction
    this.refresh();
  }

  refresh(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.list().subscribe({
      next: (data) => this._categories.set(data),
      error: () => this._error.set('Errore nel caricamento delle categorie'),
      complete: () => this._loading.set(false)
    });
  }
}

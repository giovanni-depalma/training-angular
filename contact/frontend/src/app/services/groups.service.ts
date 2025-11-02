import { Injectable, inject, signal, WritableSignal } from '@angular/core';
import { GroupsApi } from '../api/groups.api';
import { Group } from '../models/group';

@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly api = inject(GroupsApi);

  private readonly _groups: WritableSignal<Group[]> = signal<Group[]>([]);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  readonly groups = this._groups.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    this.refresh();
  }

  refresh(): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.list().subscribe({
      next: (data) => this._groups.set(data),
      error: () => this._error.set('Errore nel caricamento dei gruppi'),
      complete: () => this._loading.set(false)
    });
  }
}

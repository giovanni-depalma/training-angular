import { Injectable, inject, signal, WritableSignal, effect } from '@angular/core';
import { ContactsApi } from '../api/contacts.api';
import { Contact, CreateContactInput } from '../models/contact';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly api = inject(ContactsApi);

  // Internal writable signals
  private readonly _selectedGroupId: WritableSignal<number | null> = signal<number | null>(null);
  private readonly _contacts: WritableSignal<Contact[]> = signal<Contact[]>([]);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  // Public readonly signals
  readonly selectedGroupId = this._selectedGroupId.asReadonly();
  readonly contacts = this._contacts.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    // Auto-fetch when the group changes
    effect(() => {
      const gid = this._selectedGroupId();
      this.refresh(gid);
    });
  }

  setGroup(groupId: number | null): void {
    this._selectedGroupId.set(groupId);
  }

  refresh(groupId: number | null = this._selectedGroupId()): void {
    this._loading.set(true);
    this._error.set(null);
    this.api.list({ groupId }).subscribe({
      next: (data) => this._contacts.set(data),
      error: () => this._error.set('Errore nel caricamento dei contatti'),
      complete: () => this._loading.set(false)
    });
  }

  create(input: CreateContactInput): void {
    this._loading.set(true);
    this.api.create(input).subscribe({
      next: () => this.refresh(),
      error: () => {
        this._error.set('Errore nella creazione del contatto');
        this._loading.set(false);
      }
    });
  }

  delete(id: number): void {
    this._loading.set(true);
    this.api.delete(id).subscribe({
      next: () => this.refresh(),
      error: () => {
        this._error.set("Errore nell'eliminazione del contatto");
        this._loading.set(false);
      }
    });
  }
}

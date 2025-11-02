import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, CreateContactInput } from '../models/contact';

@Injectable({ providedIn: 'root' })
export class ContactsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/contacts';

  list(params?: { groupId?: number | null }): Observable<Contact[]> {
    const url = this.baseUrl + (params?.groupId ? `?groupId=${params.groupId}` : '');
    return this.http.get<Contact[]>(url);
  }

  create(input: CreateContactInput): Observable<Contact> {
    return this.http.post<Contact>(this.baseUrl, input);
    }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

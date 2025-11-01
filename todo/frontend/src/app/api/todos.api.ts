import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTodoInput, Todo } from '../models/todo';

@Injectable({ providedIn: 'root' })
export class TodosApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/todos'; // dev proxy -> backend

  list(params?: { categoryId?: number | null }): Observable<Todo[]> {
    const url = this.baseUrl + (params?.categoryId ? `?categoryId=${params.categoryId}` : '');
    return this.http.get<Todo[]>(url);
  }

  create(input: CreateTodoInput): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, input);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

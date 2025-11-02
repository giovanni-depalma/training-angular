import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreatePostInput, Post } from '../models/post';

@Injectable({ providedIn: 'root' })
export class PostsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/posts'; // dev proxy -> backend

  list(): Observable<Post[]> {
    return this.http.get<Post[]>(this.baseUrl);
  }

  create(input: CreatePostInput): Observable<Post> {
    return this.http.post<Post>(this.baseUrl, input);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

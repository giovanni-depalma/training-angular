import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateCommentInput, Comment } from '../models/comment';

@Injectable({ providedIn: 'root' })
export class CommentsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/comments';

  create(input: CreateCommentInput): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, input);
  }
}

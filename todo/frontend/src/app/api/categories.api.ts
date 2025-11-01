import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root' })
export class CategoriesApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/categories';

  list(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
}

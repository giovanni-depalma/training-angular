import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group';

@Injectable({ providedIn: 'root' })
export class GroupsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/groups';

  list(): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl);
  }
}

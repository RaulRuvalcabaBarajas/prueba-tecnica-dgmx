import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Organization {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrgService {
  private apiUrl = environment.apiUrl + '/orgs';

  constructor(private http: HttpClient) {}

  list(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl);
  }

  create(data: Partial<Organization>): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, data);
  }

  get(id: string): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`);
  }

  update(id: string, data: Partial<Organization>): Observable<Organization> {
    return this.http.put<Organization>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

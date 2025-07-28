import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Member {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  invitedAt: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class MemberService {
  private apiUrl = environment.apiUrl + '/orgs';

  constructor(private http: HttpClient) {}

  list(orgId: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/${orgId}/members`);
  }

  add(orgId: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${orgId}/members`, { email });
  }

  updateRole(orgId: string, memberId: string, role: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${orgId}/members/${memberId}`, {
      role,
    });
  }

  remove(orgId: string, memberId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${orgId}/members/${memberId}`);
  }
}

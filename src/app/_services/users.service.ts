import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from '../_models/user';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) { }

  getUserByMaNV(manv: string): Observable<User> {
    return this.httpClient.get<User>(environment.baseUrl + 'users/' + manv);
  }

  updateUser(user: User) {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    return this.httpClient.put(environment.baseUrl + 'users', user, { headers: headers });
  }
}

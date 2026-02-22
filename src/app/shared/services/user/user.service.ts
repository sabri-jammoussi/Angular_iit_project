import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  isDisabled: boolean;
}

export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: number;
}

export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  role: number;
}

@Injectable({ providedIn: "root" })
export class UserService {
  private readonly apiUrl = "/api/User";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("auth_token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createUser(user: CreateUser): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: this.getAuthHeaders(),
    });
  }

  updateUser(id: number, user: UpdateUser): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  setUserStatus(id: number, isDisabled: boolean): Observable<void> {
    const payload = { isDisabled };
    return this.http.post<void>(`${this.apiUrl}/${id}/status`, payload, {
      headers: this.getAuthHeaders(),
    });
  }

  resetPassword(
    id: number,
  ): Observable<{ newPassword: string; message: string }> {
    return this.http.post<{ newPassword: string; message: string }>(
      `${this.apiUrl}/${id}/reset-password`,
      {},
      { headers: this.getAuthHeaders() },
    );
  }
}

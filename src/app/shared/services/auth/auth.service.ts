import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  login(auth: any): Observable<any> {
    const url = "/api/Auth/login";
    return this.http.post<any>(url, auth);
  }

  register(auth: any): Observable<any> {
    const url = "/api/Auth/register";
    return this.http.post(url, auth, { responseType: "text" as "json" });
  }
}

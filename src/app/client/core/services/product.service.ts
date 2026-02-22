import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";

@Injectable({ providedIn: "root" })
export class ProductService {
  private baseUrl = "/api/Product";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("auth_token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

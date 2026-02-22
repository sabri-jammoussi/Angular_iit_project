import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface AdminProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId?: number;
  categoryName?: string;
  createdAt?: string;
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

export interface UpdateProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

@Injectable({ providedIn: "root" })
export class AdminProductService {
  private readonly apiUrl = "/api/Product";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("auth_token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getProducts(): Observable<AdminProduct[]> {
    return this.http.get<AdminProduct[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getProductById(id: number): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createProduct(product: CreateProduct): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(this.apiUrl, product, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProduct(id: number, product: UpdateProduct): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${this.apiUrl}/${id}`, product, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateOrder, Order } from "../models/order.model";

@Injectable({ providedIn: "root" })
export class ClientOrderService {
  private baseUrl = "/api/Order";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("auth_token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  placeOrder(order: CreateOrder): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, order, {
      headers: this.getAuthHeaders(),
    });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/my-orders`, {
      headers: this.getAuthHeaders(),
    });
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

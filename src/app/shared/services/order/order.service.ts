import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface OrderDetail {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  customerId: number;
  customerName: string;
  orderDetails: OrderDetail[];
}

@Injectable({ providedIn: "root" })
export class OrderService {
  private readonly apiUrl = "/api/Order";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("auth_token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${id}/status`,
      { status },
      {
        headers: this.getAuthHeaders(),
      },
    );
  }
}

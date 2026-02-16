import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface NotificationDto {
  id: number;
  type: string;
  title: string;
  message: string;
  orderId: number;
  customerId: number;
  customerEmail: string;
  isRead: boolean;
  createdAt: string;
  sentAt: string;
}

@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly apiUrl = "/api/nf/Notifications";

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("auth_token");
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getNotifications(): Observable<NotificationDto[]> {
    return this.http.get<NotificationDto[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
    });
  }

  getNotificationById(id: number): Observable<NotificationDto> {
    return this.http.get<NotificationDto>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread/count`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Optional: mark as read (adjust API path if needed)
  markAsRead(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/read`, null, {
      headers: this.getAuthHeaders(),
    });
  }
}

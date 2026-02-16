import { Injectable } from "@angular/core";
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { Observable, Subject } from "rxjs";
import { NotificationDto } from "../notification/notification.service";

@Injectable({ providedIn: "root" })
export class SignalRService {
  private hubConnection!: HubConnection;
  private notificationSubject = new Subject<NotificationDto>();

  // Expose as observable for components to subscribe
  public notificationReceived$(): Observable<NotificationDto> {
    return this.notificationSubject.asObservable();
  }

  // Default hub URL - adjust if your backend exposes a different route
  private readonly hubUrl = "/hubs/notif";

  public startConnection(hubUrl?: string) {
    const url = hubUrl || this.hubUrl;
    const token = localStorage.getItem("auth_token") || "";

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => token,
        transport: HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log("SignalR connected to", url);
        this.registerOnServerEvents();
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.error(
            "Error while starting SignalR connection:",
            err.message,
            err,
          );
        } else {
          console.error("Error while starting SignalR connection:", err);
        }
      });
  }

  private registerOnServerEvents() {
    if (!this.hubConnection) return;

    // Expect the server to call one of a few event names with a NotificationDto payload.
    // Handle both "NewNotification" and server-side "ReceiveNotification" (common negotiate wrapper).
    const handlePayload = (raw: unknown) => {
      try {
        // normalize payload shapes (single object, array, or wrapper with arguments)
        let notif: any = null;
        if (!raw) return;
        if (Array.isArray(raw) && raw.length > 0) {
          notif = raw[0];
        } else if (
          typeof raw === "object" &&
          raw !== null &&
          "arguments" in (raw as any)
        ) {
          const a = (raw as any).arguments;
          if (Array.isArray(a) && a.length > 0) notif = a[0];
        } else {
          notif = raw;
        }

        if (notif) {
          this.notificationSubject.next(notif as NotificationDto);
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error("Error handling notification payload:", e.message, e);
        } else {
          console.error("Error handling notification payload:", e);
        }
      }
    };

    this.hubConnection.on("NewNotification", handlePayload);
    this.hubConnection.on("ReceiveNotification", handlePayload);
  }

  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch((e: unknown) => {
        if (e instanceof Error) {
          console.error("Error stopping SignalR connection", e.message, e);
        } else {
          console.error("Error stopping SignalR connection", e);
        }
      });
    }
  }
}

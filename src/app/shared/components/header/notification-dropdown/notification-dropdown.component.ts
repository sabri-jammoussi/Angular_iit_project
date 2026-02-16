import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  NotificationDto,
  NotificationService,
} from "../../../services/notification/notification.service";
import { SignalRService } from "../../../services/signalr/signalr.service";
import { DropdownItemComponent } from "../../ui/dropdown/dropdown-item/dropdown-item.component";
import { DropdownComponent } from "../../ui/dropdown/dropdown.component";

@Component({
  selector: "app-notification-dropdown",
  templateUrl: "./notification-dropdown.component.html",
  imports: [
    CommonModule,
    RouterModule,
    DropdownComponent,
    DropdownItemComponent,
  ],
})
export class NotificationDropdownComponent {
  isOpen = false;
  notifying = true;
  unreadCount = 0;

  notifications: NotificationDto[] = [];

  constructor(
    private notificationService: NotificationService,
    private signalRService: SignalRService,
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();

    // Subscribe to real-time notifications
    this.signalRService.notificationReceived$().subscribe({
      next: (n) => {
        // prepend new notification (if payload exists)
        if (n) this.notifications.unshift(n);

        // refresh authoritative unread count from server to avoid mismatch
        this.loadUnreadCount();
      },
      error: (err) => console.error("SignalR notification error", err),
    });
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.notifying = false;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  markAsRead(n: NotificationDto) {
    if (n.isRead) return;
    this.notificationService.markAsRead(n.id).subscribe({
      next: () => {
        n.isRead = true;
        this.unreadCount = Math.max(0, this.unreadCount - 1);
        this.notifying = this.unreadCount > 0;
      },
      error: (err) => console.error("Failed to mark as read", err),
    });
  }

  private loadNotifications() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data || [];
      },
      error: (err) => {
        console.error("Failed to load notifications", err);
      },
    });
  }

  private loadUnreadCount() {
    this.notificationService.getUnreadCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
        this.notifying = count > 0;
      },
      error: (err) => {
        console.error("Failed to load unread count", err);
      },
    });
  }

  formatTime(dateStr: string): string {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString();
    } catch {
      return dateStr;
    }
  }
}

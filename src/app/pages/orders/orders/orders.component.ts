import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { BadgeComponent } from "../../../shared/components/ui/badge/badge.component";
import {
  Order,
  OrderService,
} from "../../../shared/services/order/order.service";
import { OrderDetailsDialogComponent } from "../order-details-dialog/order-details-dialog.component";

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    PageBreadcrumbComponent,
    ComponentCardComponent,
    BadgeComponent,
    OrderDetailsDialogComponent,
  ],
  templateUrl: "./orders.component.html",
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = "";

  // Dialog state
  dialogOpen = false;
  selectedOrderId: number | null = null;
  selectedOrderDetails: any[] = [];

  // Status change state
  openStatusMenuId: number | null = null;
  updatingStatusId: number | null = null;
  readonly statuses = ["Pending", "Processing", "Delivered", "Cancelled"];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Failed to load orders", err);
        this.error = err?.error?.message || "Failed to load orders";
        this.loading = false;
      },
    });
  }

  getBadgeColor(status: string): "success" | "warning" | "error" {
    const s = status.toLowerCase();
    if (s === "completed" || s === "delivered") return "success";
    if (s === "pending" || s === "processing") return "warning";
    return "error";
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }

  openDetails(order: Order): void {
    this.selectedOrderId = order.id;
    this.selectedOrderDetails = order.orderDetails || [];
    this.dialogOpen = true;
  }

  closeDetails(): void {
    this.dialogOpen = false;
    this.selectedOrderId = null;
    this.selectedOrderDetails = [];
  }

  @HostListener("document:click")
  onDocumentClick(): void {
    this.openStatusMenuId = null;
  }

  toggleStatusMenu(orderId: number, event: Event): void {
    event.stopPropagation();
    this.openStatusMenuId = this.openStatusMenuId === orderId ? null : orderId;
  }

  changeStatus(order: Order, status: string): void {
    if (this.updatingStatusId === order.id) return;
    this.openStatusMenuId = null;
    this.updatingStatusId = order.id;
    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        order.status = status;
        this.updatingStatusId = null;
      },
      error: (err) => {
        console.error("Failed to update status", err);
        this.updatingStatusId = null;
      },
    });
  }

  getStatusMenuColor(status: string): string {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20";
      case "processing":
        return "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20";
      case "cancelled":
        return "text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20";
      default:
        return "text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20";
    }
  }
}

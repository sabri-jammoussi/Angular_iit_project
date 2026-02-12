import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { BadgeComponent } from "../../../shared/components/ui/badge/badge.component";
import {
  Order,
  OrderService,
} from "../../../shared/services/order/order.service";

@Component({
  selector: "app-orders",
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    PageBreadcrumbComponent,
    ComponentCardComponent,
    BadgeComponent,
  ],
  templateUrl: "./orders.component.html",
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = "";

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
}

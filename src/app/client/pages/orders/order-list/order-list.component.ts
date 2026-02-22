import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastService } from "../../../../shared/services/toast.service";
import { Order } from "../../../core/models/order.model";
import { ClientOrderService } from "../../../core/services/client-order.service";

@Component({
  selector: "app-order-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./order-list.component.html",
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private orderService: ClientOrderService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show("Failed to load orders", "error");
      },
    });
  }

  getStatusBadgeClasses(status: string): string {
    const s = status?.toLowerCase();
    if (s === "delivered" || s === "completed") {
      return "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400";
    }
    if (s === "pending" || s === "processing") {
      return "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-400";
    }
    if (s === "cancelled" || s === "rejected") {
      return "bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400";
    }
    return "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400";
  }
}

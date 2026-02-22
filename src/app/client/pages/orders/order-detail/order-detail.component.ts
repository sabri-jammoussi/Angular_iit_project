import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastService } from "../../../../shared/services/toast.service";
import { Order } from "../../../core/models/order.model";
import { ClientOrderService } from "../../../core/services/client-order.service";

@Component({
  selector: "app-order-detail",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./order-detail.component.html",
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: ClientOrderService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (!id) {
      this.router.navigate(["/shop/orders"]);
      return;
    }
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show("Order not found", "error");
        this.router.navigate(["/shop/orders"]);
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

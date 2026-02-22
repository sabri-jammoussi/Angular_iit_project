import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { Subscription } from "rxjs";
import { ToastService } from "../../../../shared/services/toast.service";
import { CartItem } from "../../../core/models/cart.model";
import { CartService } from "../../../core/services/cart.service";
import { ClientOrderService } from "../../../core/services/client-order.service";

@Component({
  selector: "app-checkout",
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./checkout.component.html",
  styles: ``,
})
export class CheckoutComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  checkoutForm: FormGroup;
  loading = false;
  private cartSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: ClientOrderService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.checkoutForm = this.fb.group({
      shippingAddress: ["", [Validators.required, Validators.minLength(10)]],
    });
  }

  ngOnInit() {
    this.cartSub = this.cartService.cart$.subscribe((items) => {
      this.items = items;
      if (items.length === 0 && !this.loading) {
        this.router.navigate(["/shop/cart"]);
      }
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  get itemCount(): number {
    return this.cartService.getItemCount();
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    if (this.items.length === 0) {
      this.toast.show("Your cart is empty", "error");
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    if (!token) {
      this.toast.show("Please sign in to place an order", "error");
      this.router.navigate(["/shop/login"]);
      return;
    }

    this.loading = true;
    const payload = {
      shippingAddress: this.checkoutForm.value.shippingAddress,
      orderDetails: this.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    this.orderService.placeOrder(payload).subscribe({
      next: (order) => {
        this.loading = false;
        this.cartService.clearCart();
        this.toast.show("Order placed successfully!", "success");
        this.router.navigate(["/shop/orders", order.id]);
      },
      error: (err) => {
        this.loading = false;
        const msg =
          err?.error?.message || err?.error || "Failed to place order";
        this.toast.show(
          typeof msg === "string" ? msg : "Failed to place order",
          "error",
        );
      },
    });
  }
}

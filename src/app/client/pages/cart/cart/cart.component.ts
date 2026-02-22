import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Subscription } from "rxjs";
import { CartItem } from "../../../core/models/cart.model";
import { CartService } from "../../../core/services/cart.service";

@Component({
  selector: "app-cart",
  imports: [CommonModule, RouterModule],
  templateUrl: "./cart.component.html",
  styles: ``,
})
export class CartComponent implements OnInit, OnDestroy {
  items: CartItem[] = [];
  private cartSub!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartSub = this.cartService.cart$.subscribe((items) => {
      this.items = items;
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

  increment(item: CartItem) {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  decrement(item: CartItem) {
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item.productId);
  }

  clearAll() {
    this.cartService.clearCart();
  }
}

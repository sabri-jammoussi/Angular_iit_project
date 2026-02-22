import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { CartItem } from "../models/cart.model";

const CART_KEY = "shop_cart";

@Injectable({ providedIn: "root" })
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  private loadCart() {
    const raw = localStorage.getItem(CART_KEY);
    this.cartItems = raw ? JSON.parse(raw) : [];
    this.cartSubject.next([...this.cartItems]);
  }

  private persist() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cartItems));
    this.cartSubject.next([...this.cartItems]);
  }

  getItems(): CartItem[] {
    return [...this.cartItems];
  }

  getItemCount(): number {
    return this.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  addItem(item: CartItem) {
    const existing = this.cartItems.find((i) => i.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.cartItems.push({ ...item });
    }
    this.persist();
  }

  updateQuantity(productId: number, quantity: number) {
    const item = this.cartItems.find((i) => i.productId === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.persist();
    }
  }

  removeItem(productId: number) {
    this.cartItems = this.cartItems.filter((i) => i.productId !== productId);
    this.persist();
  }

  clearCart() {
    this.cartItems = [];
    this.persist();
  }
}

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Subscription } from "rxjs";
import { CartService } from "../../core/services/cart.service";

@Component({
  selector: "app-client-navbar",
  imports: [CommonModule, RouterModule],
  templateUrl: "./client-navbar.component.html",
  styles: ``,
})
export class ClientNavbarComponent implements OnInit, OnDestroy {
  cartCount = 0;
  mobileMenuOpen = false;
  userDropdownOpen = false;

  get isLoggedIn(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  private cartSub!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cartSub = this.cartService.cart$.subscribe((items) => {
      this.cartCount = items.reduce((s, i) => s + i.quantity, 0);
    });
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleUserDropdown() {
    this.userDropdownOpen = !this.userDropdownOpen;
  }

  logout() {
    localStorage.removeItem("auth_token");
    this.userDropdownOpen = false;
    this.router.navigate(["/shop/login"]);
  }
}

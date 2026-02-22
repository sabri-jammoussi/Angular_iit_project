import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastService } from "../../../shared/services/toast.service";
import { Product } from "../../core/models/product.model";
import { CartService } from "../../core/services/cart.service";
import { ProductService } from "../../core/services/product.service";

@Component({
  selector: "app-home",
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.component.html",
  styles: ``,
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.featuredProducts = products.slice(0, 8);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  addToCart(product: Product) {
    this.cartService.addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
    this.toast.show(`${product.name} added to cart`, "success");
  }
}

import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ToastService } from "../../../../shared/services/toast.service";
import { Product } from "../../../core/models/product.model";
import { CartService } from "../../../core/services/cart.service";
import { ProductService } from "../../../core/services/product.service";

@Component({
  selector: "app-product-list",
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./product-list.component.html",
  styles: ``,
})
export class ProductListComponent implements OnInit {
  allProducts: Product[] = [];
  products: Product[] = [];
  loading = true;
  searchTerm = "";

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show("Failed to load products", "error");
      },
    });
  }

  onSearch() {
    this.applyFilter();
  }

  private applyFilter() {
    if (!this.searchTerm.trim()) {
      this.products = [...this.allProducts];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.products = this.allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term) ||
          p.categoryName?.toLowerCase().includes(term),
      );
    }
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

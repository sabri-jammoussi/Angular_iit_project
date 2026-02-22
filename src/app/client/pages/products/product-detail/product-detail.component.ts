import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ToastService } from "../../../../shared/services/toast.service";
import { Product } from "../../../core/models/product.model";
import { CartService } from "../../../core/services/cart.service";
import { ProductService } from "../../../core/services/product.service";

@Component({
  selector: "app-product-detail",
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./product-detail.component.html",
  styles: ``,
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    if (!id) {
      this.router.navigate(["/shop/products"]);
      return;
    }
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast.show("Product not found", "error");
        this.router.navigate(["/shop/products"]);
      },
    });
  }

  decrementQty() {
    if (this.quantity > 1) this.quantity--;
  }

  incrementQty() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  addToCart() {
    if (!this.product) return;
    this.cartService.addItem({
      productId: this.product.id,
      productName: this.product.name,
      price: this.product.price,
      quantity: this.quantity,
      imageUrl: this.product.imageUrl,
    });
    this.toast.show(`${this.product.name} added to cart`, "success");
  }
}

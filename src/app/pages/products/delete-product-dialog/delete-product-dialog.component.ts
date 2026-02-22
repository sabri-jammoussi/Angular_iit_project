import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  AdminProduct,
  AdminProductService,
} from "../../../shared/services/product/admin-product.service";

@Component({
  selector: "app-delete-product-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./delete-product-dialog.component.html",
})
export class DeleteProductDialogComponent {
  @Input() open = false;
  @Input() product: AdminProduct | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() productDeleted = new EventEmitter<void>();

  submitting = false;
  errorMessage = "";

  constructor(private productService: AdminProductService) {}

  close(): void {
    this.errorMessage = "";
    this.closed.emit();
  }

  confirm(): void {
    if (!this.product) return;

    this.submitting = true;
    this.errorMessage = "";

    this.productService.deleteProduct(this.product.id).subscribe({
      next: () => {
        this.submitting = false;
        this.productDeleted.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err?.error?.message || err?.error || "Failed to delete product";
      },
    });
  }
}

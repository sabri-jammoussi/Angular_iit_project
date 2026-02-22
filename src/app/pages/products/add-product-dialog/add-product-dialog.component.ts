import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AdminProductService } from "../../../shared/services/product/admin-product.service";

@Component({
  selector: "app-add-product-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add-product-dialog.component.html",
})
export class AddProductDialogComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() productAdded = new EventEmitter<void>();

  productForm: FormGroup;
  submitting = false;
  errorMessage = "";

  constructor(
    private fb: FormBuilder,
    private productService: AdminProductService,
  ) {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      imageUrl: ["", [Validators.required]],
    });
  }

  close(): void {
    this.productForm.reset({ price: 0, stock: 0 });
    this.errorMessage = "";
    this.closed.emit();
  }

  submit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = "";

    const formValue = this.productForm.value;
    this.productService
      .createProduct({
        name: formValue.name,
        description: formValue.description,
        price: Number(formValue.price),
        stock: Number(formValue.stock),
        imageUrl: formValue.imageUrl,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.productForm.reset({ price: 0, stock: 0 });
          this.productAdded.emit();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err?.error?.message || err?.error || "Failed to create product";
        },
      });
  }
}

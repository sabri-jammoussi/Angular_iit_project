import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  AdminProduct,
  AdminProductService,
} from "../../../shared/services/product/admin-product.service";

@Component({
  selector: "app-edit-product-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-product-dialog.component.html",
})
export class EditProductDialogComponent implements OnChanges {
  @Input() open = false;
  @Input() product: AdminProduct | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() productEdited = new EventEmitter<void>();

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["open"] && this.open && this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price,
        stock: this.product.stock,
        imageUrl: this.product.imageUrl,
      });
      this.errorMessage = "";
    }
  }

  close(): void {
    this.productForm.reset();
    this.errorMessage = "";
    this.closed.emit();
  }

  submit(): void {
    if (this.productForm.invalid || !this.product) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = "";

    const formValue = this.productForm.value;
    this.productService
      .updateProduct(this.product.id, {
        name: formValue.name,
        description: formValue.description,
        price: Number(formValue.price),
        stock: Number(formValue.stock),
        imageUrl: formValue.imageUrl,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.productForm.reset();
          this.productEdited.emit();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err?.error?.message || err?.error || "Failed to update product";
        },
      });
  }
}

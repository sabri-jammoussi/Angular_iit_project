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
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";

export interface OrderDetailItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  orderId: number;
}

@Component({
  selector: "app-order-details-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./order-details-dialog.component.html",
})
export class OrderDetailsDialogComponent implements OnChanges {
  @Input() orderId: number | null = null;
  @Input() orderDetails: OrderDetailItem[] = [];
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  detailsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.detailsForm = this.fb.group({
      items: this.fb.array([]),
    });
  }

  get items(): FormArray {
    return this.detailsForm.get("items") as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["open"] && this.open) {
      this.buildForm();
    }
  }

  private buildForm(): void {
    this.items.clear();
    (this.orderDetails || []).forEach((d) => {
      this.items.push(
        this.fb.group({
          id: [d.id],
          productId: [d.productId],
          productName: [d.productName],
          quantity: [d.quantity],
          unitPrice: [d.unitPrice],
          lineTotal: [d.lineTotal],
          orderId: [d.orderId],
        }),
      );
    });
  }

  close(): void {
    this.closed.emit();
  }

  formatCurrency(amount: number): string {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
}

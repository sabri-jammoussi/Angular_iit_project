import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ToastMessage, ToastService } from "../../services/toast.service";

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed right-4 top-4 z-50 flex flex-col gap-2 max-w-xs">
      <div
        *ngFor="let t of toasts"
        class="rounded-md px-4 py-3 shadow-lg text-sm"
        [ngClass]="getClass(t.type)"
      >
        {{ t.text }}
      </div>
    </div>
  `,
  styles: [``],
})
export class ToastComponent {
  toasts: ToastMessage[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.messages$.subscribe((m) => this.addToast(m));
  }

  addToast(msg: ToastMessage) {
    this.toasts.push(msg);
    setTimeout(() => this.removeToast(msg.id), 5000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  getClass(type: string | undefined) {
    if (type === "error") return "bg-red-500 text-white";
    if (type === "success") return "bg-green-500 text-white";
    return "bg-gray-800 text-white";
  }
}

import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { User, UserService } from "../../../shared/services/user/user.service";

@Component({
  selector: "app-delete-user-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./delete-user-dialog.component.html",
})
export class DeleteUserDialogComponent {
  @Input() open = false;
  @Input() user: User | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() userDeleted = new EventEmitter<void>();

  submitting = false;
  errorMessage = "";

  constructor(private userService: UserService) {}

  close(): void {
    this.errorMessage = "";
    this.closed.emit();
  }

  confirm(): void {
    if (!this.user) return;

    this.submitting = true;
    this.errorMessage = "";

    this.userService.deleteUser(this.user.id).subscribe({
      next: () => {
        this.submitting = false;
        this.userDeleted.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err?.error?.message || err?.error || "Failed to delete user";
      },
    });
  }
}

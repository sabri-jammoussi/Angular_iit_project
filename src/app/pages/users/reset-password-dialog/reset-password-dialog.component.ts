import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { User, UserService } from "../../../shared/services/user/user.service";

@Component({
  selector: "app-reset-password-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./reset-password-dialog.component.html",
})
export class ResetPasswordDialogComponent {
  @Input() open = false;
  @Input() user: User | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() passwordReset = new EventEmitter<void>();

  submitting = false;
  errorMessage = "";
  successMessage = "";
  newPassword = "";
  copied = false;

  constructor(private userService: UserService) {}

  close(): void {
    this.errorMessage = "";
    this.successMessage = "";
    this.newPassword = "";
    this.copied = false;
    this.closed.emit();
  }

  confirm(): void {
    if (!this.user) return;

    this.submitting = true;
    this.errorMessage = "";
    this.successMessage = "";
    this.newPassword = "";
    this.copied = false;

    this.userService.resetPassword(this.user.id).subscribe({
      next: (res) => {
        this.submitting = false;
        this.newPassword = res.newPassword;
        this.successMessage = res.message;
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err?.error?.message || err?.error || "Failed to reset password";
      },
    });
  }

  copyPassword(): void {
    navigator.clipboard.writeText(this.newPassword).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}

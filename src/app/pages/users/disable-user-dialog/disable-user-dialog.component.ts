import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { User, UserService } from "../../../shared/services/user/user.service";

@Component({
  selector: "app-disable-user-dialog",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./disable-user-dialog.component.html",
})
export class DisableUserDialogComponent {
  @Input() open = false;
  @Input() user: User | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() userToggled = new EventEmitter<void>();

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

    // Send the toggled disabled state: if currently disabled -> enable (false), else -> disable (true)
    const action = this.userService.setUserStatus(
      this.user.id,
      !this.user.isDisabled,
    );

    action.subscribe({
      next: () => {
        this.submitting = false;
        this.userToggled.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage =
          err?.error?.message ||
          err?.error ||
          `Failed to ${this.user?.isDisabled ? "enable" : "disable"} user`;
      },
    });
  }
}

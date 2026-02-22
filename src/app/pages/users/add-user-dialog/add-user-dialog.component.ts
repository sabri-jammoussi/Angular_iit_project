import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { UserService } from "../../../shared/services/user/user.service";

@Component({
  selector: "app-add-user-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./add-user-dialog.component.html",
})
export class AddUserDialogComponent {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<void>();

  userForm: FormGroup;
  submitting = false;
  errorMessage = "";

  roles = [
    { value: 1, label: "Admin" },
    { value: 4, label: "Client" },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    this.userForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(2)]],
      lastName: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      role: [4, [Validators.required]],
    });
  }

  close(): void {
    this.userForm.reset({ role: 4 });
    this.errorMessage = "";
    this.closed.emit();
  }

  submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = "";

    const formValue = this.userForm.value;
    this.userService
      .createUser({
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        role: Number(formValue.role),
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.userForm.reset({ role: 4 });
          this.userAdded.emit();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err?.error?.message || err?.error || "Failed to create user";
        },
      });
  }
}

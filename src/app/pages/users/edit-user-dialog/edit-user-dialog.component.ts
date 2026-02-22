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
import { User, UserService } from "../../../shared/services/user/user.service";

@Component({
  selector: "app-edit-user-dialog",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-user-dialog.component.html",
})
export class EditUserDialogComponent implements OnChanges {
  @Input() open = false;
  @Input() user: User | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() userEdited = new EventEmitter<void>();

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
      role: [4, [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["open"] && this.open && this.user) {
      this.userForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        role: this.user.role,
      });
      this.errorMessage = "";
    }
  }

  close(): void {
    this.userForm.reset();
    this.errorMessage = "";
    this.closed.emit();
  }

  submit(): void {
    if (this.userForm.invalid || !this.user) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = "";

    const formValue = this.userForm.value;
    this.userService
      .updateUser(this.user.id, {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        role: Number(formValue.role),
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.userForm.reset();
          this.userEdited.emit();
        },
        error: (err) => {
          this.submitting = false;
          this.errorMessage =
            err?.error?.message || err?.error || "Failed to update user";
        },
      });
  }
}

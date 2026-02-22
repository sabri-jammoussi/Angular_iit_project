import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth/auth.service";
import { ToastService } from "../../../../shared/services/toast.service";

@Component({
  selector: "app-client-register",
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./client-register.component.html",
  styles: ``,
})
export class ClientRegisterComponent {
  showPassword = false;
  registerForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.registerForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { firstName, lastName, email, password } = this.registerForm.value;
    this.authService
      .register({ firstName, lastName, email, password })
      .subscribe({
        next: () => {
          this.loading = false;
          this.toast.show(
            "Account created successfully! Please sign in.",
            "success",
          );
          this.router.navigate(["/shop/login"]);
        },
        error: (err: any) => {
          this.loading = false;
          const msg =
            err?.error?.message || err?.error || "Registration failed";
          this.toast.show(
            typeof msg === "string" ? msg : "Registration failed",
            "error",
          );
        },
      });
  }
}

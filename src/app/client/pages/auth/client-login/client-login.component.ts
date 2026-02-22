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
  selector: "app-client-login",
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./client-login.component.html",
  styles: ``,
})
export class ClientLoginComponent {
  showPassword = false;
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        const token =
          res?.token ?? res?.accessToken ?? res?.data?.token ?? null;
        if (token) {
          localStorage.setItem("auth_token", token);
          this.toast.show("Welcome back!", "success");
          this.router.navigate(["/shop"]);
        } else {
          this.toast.show("Login succeeded but no token returned", "error");
        }
      },
      error: (err: any) => {
        this.loading = false;
        const msg = err?.error?.message || err?.error || "Login failed";
        this.toast.show(
          typeof msg === "string" ? msg : "Login failed",
          "error",
        );
      },
    });
  }
}

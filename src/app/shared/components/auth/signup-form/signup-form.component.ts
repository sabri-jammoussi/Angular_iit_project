import { HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "../../../services/auth/auth.service";
import { ToastService } from "../../../services/toast.service";
import { CheckboxComponent } from "../../form/input/checkbox.component";
import { InputFieldComponent } from "../../form/input/input-field.component";
import { LabelComponent } from "../../form/label/label.component";

@Component({
  selector: "app-signup-form",
  imports: [
    LabelComponent,
    CheckboxComponent,
    InputFieldComponent,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: "./signup-form.component.html",
  styles: ``,
})
export class SignupFormComponent {
  showPassword = false;
  isChecked = false;
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.signUpForm = this.fb.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      agree: [false],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password } = this.signUpForm.value;
    const payload = { firstName, lastName, email, password };
    this.authService.register(payload).subscribe({
      next: (res) => {
        // on success redirect to signin
        this.router.navigate(["/signin"]);
      },
      error: (err) => {
        console.error("Register failed", err);
        const msg =
          err?.error?.message || err?.message || "Registration failed";
        this.toast.show(msg, "error");
      },
    });
  }
}

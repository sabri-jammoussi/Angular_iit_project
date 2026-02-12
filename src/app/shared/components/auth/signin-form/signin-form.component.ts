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
import { CheckboxComponent } from "../../form/input/checkbox.component";
import { InputFieldComponent } from "../../form/input/input-field.component";
import { LabelComponent } from "../../form/label/label.component";
import { ButtonComponent } from "../../ui/button/button.component";

@Component({
  selector: "app-signin-form",
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: "./signin-form.component.html",
  styles: ``,
})
export class SigninFormComponent {
  showPassword = false;
  signInForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.signInForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]],
      remember: [false],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    const { email, password, remember } = this.signInForm.value;
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Remember Me:", remember);

    this.authService.login(this.signInForm.value).subscribe({
      next: (res) => {
        const token =
          res?.token ?? res?.accessToken ?? res?.data?.token ?? null;
        if (token) {
          localStorage.setItem("auth_token", token);
          this.router.navigate(["/"]);
        } else {
          console.error("Login succeeded but no token returned", res);
        }
      },
      error: (err) => {
        console.error("Login failed", err);
      },
    });
  }
}

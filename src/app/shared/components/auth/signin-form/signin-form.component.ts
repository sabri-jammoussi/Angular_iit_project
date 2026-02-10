import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { Observable } from "rxjs";
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
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: "./signin-form.component.html",
  styles: ``,
})
export class SigninFormComponent {
  showPassword = false;
  isChecked = false;

  email = "";
  password = "";

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private login(): Observable<any> {
    const url = "/api/Auth/login";
    const body = { email: this.email, password: this.password };
    return this.http.post<any>(url, body);
  }

  onSignIn() {
    console.log("Email:", this.email);
    console.log("Password:", this.password);
    console.log("Remember Me:", this.isChecked);

    this.login().subscribe({
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

import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { JwtTokenService } from "../../../services/auth/jwt-token.service";
import { DropdownItemTwoComponent } from "../../ui/dropdown/dropdown-item/dropdown-item.component-two";
import { DropdownComponent } from "../../ui/dropdown/dropdown.component";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
  imports: [
    CommonModule,
    RouterModule,
    DropdownComponent,
    DropdownItemTwoComponent,
  ],
})
export class UserDropdownComponent implements OnInit {
  isOpen = false;
  displayName: string = "User";
  fullName: string = "User";
  email: string = "";

  constructor(
    private router: Router,
    private jwtTokenService: JwtTokenService,
  ) {}

  ngOnInit(): void {
    this.loadUserFromToken();
  }

  private loadUserFromToken() {
    try {
      this.displayName = this.jwtTokenService.getUserName();
      this.fullName = this.jwtTokenService.getUserFullName();
      this.email = this.jwtTokenService.getUserEmail();
    } catch (e) {
      // ignore decode errors and keep defaults
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout() {
    localStorage.removeItem("auth_token");
    this.closeDropdown();
    this.router.navigate(["/signin"]);
  }
}

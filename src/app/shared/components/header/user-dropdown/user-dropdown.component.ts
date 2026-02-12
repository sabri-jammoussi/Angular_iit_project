import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
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
export class UserDropdownComponent {
  isOpen = false;

  constructor(private router: Router) {}

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

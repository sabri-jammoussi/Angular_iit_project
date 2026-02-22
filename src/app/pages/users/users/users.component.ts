import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ComponentCardComponent } from "../../../shared/components/common/component-card/component-card.component";
import { PageBreadcrumbComponent } from "../../../shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { BadgeComponent } from "../../../shared/components/ui/badge/badge.component";
import { User, UserService } from "../../../shared/services/user/user.service";
import { AddUserDialogComponent } from "../add-user-dialog/add-user-dialog.component";
import { DeleteUserDialogComponent } from "../delete-user-dialog/delete-user-dialog.component";
import { DisableUserDialogComponent } from "../disable-user-dialog/disable-user-dialog.component";
import { EditUserDialogComponent } from "../edit-user-dialog/edit-user-dialog.component";
import { ResetPasswordDialogComponent } from "../reset-password-dialog/reset-password-dialog.component";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    PageBreadcrumbComponent,
    ComponentCardComponent,
    BadgeComponent,
    AddUserDialogComponent,
    EditUserDialogComponent,
    DeleteUserDialogComponent,
    DisableUserDialogComponent,
    ResetPasswordDialogComponent,
  ],
  templateUrl: "./users.component.html",
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error = "";

  // Dialog states
  addDialogOpen = false;
  editDialogOpen = false;
  deleteDialogOpen = false;
  disableDialogOpen = false;
  resetPasswordDialogOpen = false;

  selectedUser: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("Failed to load users", err);
        this.error = err?.error?.message || "Failed to load users";
        this.loading = false;
      },
    });
  }

  getRoleName(role: number): string {
    switch (role) {
      case 1:
        return "Admin";
      case 4:
        return "Client";
      default:
        return "Unknown";
    }
  }

  getRoleBadgeColor(role: number): "success" | "warning" | "error" {
    switch (role) {
      case 1:
        return "warning";
      case 4:
        return "success";
      default:
        return "error";
    }
  }

  getStatusBadgeColor(isDisabled: boolean): "success" | "error" {
    return isDisabled ? "error" : "success";
  }

  // Add User
  openAddDialog(): void {
    this.addDialogOpen = true;
  }

  closeAddDialog(): void {
    this.addDialogOpen = false;
  }

  onUserAdded(): void {
    this.addDialogOpen = false;
    this.loadUsers();
  }

  // Edit User
  openEditDialog(user: User): void {
    this.selectedUser = user;
    this.editDialogOpen = true;
  }

  closeEditDialog(): void {
    this.editDialogOpen = false;
    this.selectedUser = null;
  }

  onUserEdited(): void {
    this.editDialogOpen = false;
    this.selectedUser = null;
    this.loadUsers();
  }

  // Delete User
  openDeleteDialog(user: User): void {
    this.selectedUser = user;
    this.deleteDialogOpen = true;
  }

  closeDeleteDialog(): void {
    this.deleteDialogOpen = false;
    this.selectedUser = null;
  }

  onUserDeleted(): void {
    this.deleteDialogOpen = false;
    this.selectedUser = null;
    this.loadUsers();
  }

  // Disable/Enable User
  openDisableDialog(user: User): void {
    this.selectedUser = user;
    this.disableDialogOpen = true;
  }

  closeDisableDialog(): void {
    this.disableDialogOpen = false;
    this.selectedUser = null;
  }

  onUserDisableToggled(): void {
    this.disableDialogOpen = false;
    this.selectedUser = null;
    this.loadUsers();
  }

  // Reset Password
  openResetPasswordDialog(user: User): void {
    this.selectedUser = user;
    this.resetPasswordDialogOpen = true;
  }

  closeResetPasswordDialog(): void {
    this.resetPasswordDialogOpen = false;
    this.selectedUser = null;
  }

  onPasswordReset(): void {
    this.resetPasswordDialogOpen = false;
    this.selectedUser = null;
  }
}

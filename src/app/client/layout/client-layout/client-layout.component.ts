import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClientFooterComponent } from "../client-footer/client-footer.component";
import { ClientNavbarComponent } from "../client-navbar/client-navbar.component";

@Component({
  selector: "app-client-layout",
  imports: [RouterModule, ClientNavbarComponent, ClientFooterComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <app-client-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-client-footer />
    </div>
  `,
  styles: ``,
})
export class ClientLayoutComponent {}

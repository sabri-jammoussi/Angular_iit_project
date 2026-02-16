import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastComponent } from "./shared/components/toast/toast.component";
import { SignalRService } from "./shared/services/signalr/signalr.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, ToastComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "Angular Ecommerce Dashboard | TailAdmin";

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    // start SignalR connection (uses default hub url, adjust if needed)
    this.signalRService.startConnection();
  }
}

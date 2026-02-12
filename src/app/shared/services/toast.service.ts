import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export interface ToastMessage {
  id: number;
  text: string;
  type?: "success" | "error" | "info";
}

@Injectable({ providedIn: "root" })
export class ToastService {
  private messagesSubject = new Subject<ToastMessage>();
  private id = 0;

  get messages$(): Observable<ToastMessage> {
    return this.messagesSubject.asObservable();
  }

  show(text: string, type: "success" | "error" | "info" = "info") {
    this.id += 1;
    this.messagesSubject.next({ id: this.id, text, type });
  }
}

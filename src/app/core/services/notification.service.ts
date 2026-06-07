import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'warning' | 'error' | 'info';

export interface AppNotification {
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationSubject = new BehaviorSubject<AppNotification | null>(null);
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  readonly notification$ = this.notificationSubject.asObservable();

  show(message: string, type: NotificationType = 'info'): void {
    this.notificationSubject.next({ message, type });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => this.clear(), 3500);
  }

  clear(): void {
    this.notificationSubject.next(null);
    this.timeoutId = null;
  }
}

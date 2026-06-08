import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotificationService } from './core/services/notification.service';
import { CartSidebarComponent } from './shared/components/cart-sidebar/cart-sidebar.component';
import { SiteFooterComponent } from './shared/components/site-footer/site-footer.component';
import { SiteHeaderComponent } from './shared/components/site-header/site-header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, CartSidebarComponent, RouterOutlet, SiteFooterComponent, SiteHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly notificationService = inject(NotificationService);
}

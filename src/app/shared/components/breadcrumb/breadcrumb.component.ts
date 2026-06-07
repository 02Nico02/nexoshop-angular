import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  routerLink?: string | unknown[];
  queryParams?: Record<string, string>;
  action?: () => void;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html'
})
export class BreadcrumbComponent {
  @Input({ required: true }) items: BreadcrumbItem[] = [];

  isLast(index: number): boolean {
    return index === this.items.length - 1;
  }
}

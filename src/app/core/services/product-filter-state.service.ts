import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductFilterStateService {
  private readonly searchSubject = new BehaviorSubject<string>('');
  readonly search$ = this.searchSubject.asObservable();

  getSearch(): string {
    return this.searchSubject.value;
  }

  setSearch(search: string): void {
    this.searchSubject.next(search);
  }

  clearSearch(): void {
    this.setSearch('');
  }
}

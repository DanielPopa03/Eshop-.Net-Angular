import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private basketCountSubject = new BehaviorSubject<number>(0);
  basketCount$ = this.basketCountSubject.asObservable();

  updateBasketCount() {
    const basket = localStorage.getItem('basket');
    let count = 0;
    if (basket) {
      try {
        const items = JSON.parse(basket);
        count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      } catch {
        count = 0;
      }
    }
    this.basketCountSubject.next(count);
  }
}

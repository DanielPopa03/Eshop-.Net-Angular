import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private favoritesCountSubject = new BehaviorSubject<number>(0);
  favoritesCount$ = this.favoritesCountSubject.asObservable();

  updateFavoritesCount() {
    const favorites = localStorage.getItem('favorites');
    let count = 0;
    if (favorites) {
      try {
        const items = JSON.parse(favorites);
        count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      } catch {
        count = 0;
      }
    }
    this.favoritesCountSubject.next(count);
  }
}

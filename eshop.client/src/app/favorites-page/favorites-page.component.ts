import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.css']
})
export class FavoritesPageComponent {
  constructor(private router: Router) { }

  favorites: any[] = [];

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  }

  removeFromFavorites(productId: any) {
    this.favorites = this.favorites.filter(item => item.id !== productId);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  redirectToItem(itemId: number) {
    this.router.navigate(['/product'], { queryParams: { id: itemId } });
  }
}

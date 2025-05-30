import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  title = 'eshop.client';

  ngOnInit() {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.length) return;

    // Fetch latest data for all favorite products in parallel
    const requests = favorites.map((fav: any) =>
      this.http.get<any>(`https://localhost:7060/Product/GetProduct?productId=${fav.id}`)
    );

    Promise.all(requests.map((req: any) => req.toPromise()))
      .then((latestProducts) => {
        let updated = false;
        latestProducts.forEach((latest, idx) => {
          if (latest && favorites[idx].price !== latest.price) {
            alert(`Price of favorite item "${latest.name}" changed from ${favorites[idx].price} to ${latest.price}`);
            favorites[idx].price = latest.price;
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem('favorites', JSON.stringify(favorites));
        }
      })
      .catch(err => {
        // Optionally handle errors
        console.error('Error checking favorite prices', err);
      });
  }
}

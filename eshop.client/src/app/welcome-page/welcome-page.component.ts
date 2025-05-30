import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-welcome-page',
  standalone: false,
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.css'
})
export class WelcomePageComponent {
  images: string[] = [
    'promo/promo1.png',
    'promo/promo2.png',
    'promo/promo3.png',
  ];

  products: any[] = [];
  currentIndex = 0;
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadRecentlyViewed();
    this.productService.getBestSoldByCategory().subscribe(products => {
      this.products = products;
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }


  recentlyViewed: any[] = [];

  

  loadRecentlyViewed() {
    const viewed = localStorage.getItem('recentlyViewed');
    this.recentlyViewed = viewed ? JSON.parse(viewed) : [];
    console.log(this.recentlyViewed);
  }

  scrollRight() {
    const container = document.querySelector('.overflow-x-auto');
    container?.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft() {
    const container = document.querySelector('.overflow-x-auto');
    container?.scrollBy({ left: -300, behavior: 'smooth' });
  }

}

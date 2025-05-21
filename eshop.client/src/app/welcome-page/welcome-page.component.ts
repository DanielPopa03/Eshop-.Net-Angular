import { Component } from '@angular/core';

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

  currentIndex = 0;

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  goTo(index: number) {
    this.currentIndex = index;
  }


  products = [
    { title: 'Gaming PC Case', image: '/assets/images/case.jpg', price: 129.99, id: 1 },
    { title: 'Tool Kit', image: '/assets/images/tools.jpg', price: 89.50, id: 1 },
    { title: 'Solar Camera', image: '/assets/images/camera.jpg', price: 59.00, id: 1 },
    { title: 'White Storage Bench', image: '/assets/images/bench.jpg', price: 99.99, id: 1 },
    { title: 'Air Purifier', image: '/assets/images/purifier.jpg', price: 149.00, id: 1 },
    { title: 'Paint Sprayer', image: '/assets/images/sprayer.jpg', price: 199.00, id: 1 },
  ];

  scrollRight() {
    const container = document.querySelector('.overflow-x-auto');
    container?.scrollBy({ left: 300, behavior: 'smooth' });
  }

  scrollLeft() {
    const container = document.querySelector('.overflow-x-auto');
    container?.scrollBy({ left: -300, behavior: 'smooth' });
  }

}

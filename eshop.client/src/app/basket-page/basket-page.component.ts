import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { ProductService } from '../../services/product/product.service';
import { UserService } from '../../services/user/user.service';
import { BasketService } from '../../services/basket/basket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-basket-page',
  standalone: true,
  templateUrl: './basket-page.component.html',
  styleUrls: ['./basket-page.component.css'],
  imports: [CommonModule],
})
export class BasketPageComponent implements OnInit {
  basket: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductService,
    private userService: UserService,
    private basketService: BasketService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBasket();
  }

  loadBasket() {
    const storedBasket = localStorage.getItem('basket');
    this.basket = storedBasket ? JSON.parse(storedBasket) : [];
  }

  removeFromBasket(productId: number) {
    this.basket = this.basket.filter(item => item.id !== productId);
    this.updateBasketStorage();
    this.basketService.updateBasketCount();
  }

  updateBasketStorage() {
    localStorage.setItem('basket', JSON.stringify(this.basket));
  }

  getTotalPrice(): number {
    return this.basket.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  checkout() {
    // Implement your checkout flow here. For now, let's just clear the basket and redirect.
    alert('Thank you for your purchase!');
    this.basket = [];
    this.updateBasketStorage();
    this.basketService.updateBasketCount();
    this.router.navigate(['/']);
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.updateBasket();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateBasket();
    } else {
      this.removeFromBasket(item.id);
    }
  }

  updateBasket() {
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.basketService.updateBasketCount();  // Update basket count if you have this service
  }

  redirectToItem(itemId: number) {
    this.router.navigate(['/product'], { queryParams: { id: itemId } });
  }
}

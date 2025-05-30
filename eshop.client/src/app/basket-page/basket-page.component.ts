import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { ProductService } from '../../services/product/product.service';
import { UserService } from '../../services/user/user.service';
import { BasketService } from '../../services/basket/basket.service';
import { CommonModule } from '@angular/common';
import { CheckedOutItemDto } from '../../models/DTO/checked-out-item-dto/checked-out-item-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-basket-page',
  standalone: true,
  templateUrl: './basket-page.component.html',
  styleUrls: ['./basket-page.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BasketPageComponent implements OnInit {
  basket: any[] = [];
  showShippingModal = false;
  shippingCity: string = '';
  shippingStreet: string = '';
  shippingCounty: string = '';
  shippingPostalCode: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductService,
    private userService: UserService,
    private basketService: BasketService,
    private snackBar: MatSnackBar,
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

  openShippingModal() {
    this.showShippingModal = true;
  }

  closeShippingModal() {
    this.showShippingModal = false;
  }

 
  submitShipping() {
    this.showShippingModal = false;
    this.checkout();
  }

  checkout() {
    // Implement your checkout flow here. For now, let's just clear the basket and redirect.

    if (this.shippingCity === '' || this.shippingStreet === '' || this.shippingCounty === '' || this.shippingPostalCode === '')
    {
      alert('Please fill in all shipping details.');
      return;
    }

    let basketItems: CheckedOutItemDto[] = []

    this.basket.map(item =>
      basketItems.push(new CheckedOutItemDto(item.id, item.quantity))
    );

    this.productService.checkoutBasket(basketItems, this.shippingCounty, this.shippingCity, this.shippingStreet, this.shippingPostalCode).subscribe({
      next: (res: any) => {
        console.log(res);
        this.snackBar.open('Checkout successful! Thank you for your purchase.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success']
        });

        this.basket = [];
        this.updateBasketStorage();
        this.basketService.updateBasketCount();

        alert('Thank you for your purchase!');

        this.router.navigate(['/']);
      },
      error: (err: any) => {
        
        const errorMsg = err?.error || 'Checkout failed. Please try again.';
        this.snackBar.open(errorMsg, 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
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

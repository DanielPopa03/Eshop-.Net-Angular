import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { BasketService } from '../../services/basket/basket.service';

@Component({
  selector: 'app-nav-bar',
  standalone: false,
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  productsDropdown = false;
  userDropdown = false;
  basketItemCount = 0;

  constructor(public authService: AuthService, private router: Router, private basketService: BasketService){}
  


  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  redirectToBasket(): void {
    this.router.navigate(['/basket']);
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit() {
    this.basketService.basketCount$.subscribe(count => {
      this.basketItemCount = count;
    });
    this.basketService.updateBasketCount(); 
  }

}

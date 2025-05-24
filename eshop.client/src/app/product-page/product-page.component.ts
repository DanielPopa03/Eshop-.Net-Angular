import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-product-page',
  standalone: false,
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent {
  product: any = {};
  selectedImage: string = 'promo/promo1.png';
  rating: number = 0;
  reviewText: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    this.fetchProduct(productId);

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  fetchProduct(id: string | null) {
    if (!id) return;

    //this.productService.getProductById(id).subscribe(product => {
    //  this.product = product;
    //  this.selectedImage = product.image;
    //});
  }

  addToBasket(product: any) {
    console.log('Added to basket:', product);
    // your basket logic here
  }

  addToFavorites(product: any) {
    console.log('Added to favorites:', product);
    // your favorite logic here
  }

  submitReview() {
    if (!this.reviewText || !this.rating) return;
    console.log('Review submitted:', {
      productId: this.product.id,
      rating: this.rating,
      text: this.reviewText
    });
    // handle submission logic here
    this.reviewText = '';
    this.rating = 0;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}

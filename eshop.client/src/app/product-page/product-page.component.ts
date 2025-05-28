import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { ProductService } from '../../services/product/product.service';
import { UserService } from '../../services/user/user.service';
import { Review } from '../../models/review/review';
import { BasketService } from '../../services/basket/basket.service';
import { FavoritesService } from '../../services/favorites/favorites.service';

@Component({
  selector: 'app-product-page',
  standalone: false,
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent {
  product: any = {};
  selectedImage: string = 'promo/promo1.png';
  selectedImageIndex: number = 0;

  rating: number = 0;
  reviewText: string = '';
  isLoggedIn: boolean = false;

  currentReviewPage = 1;
  reviewsPerPage = 3;

  addingToBasket = false;
  showSnackbar = false;

  fetching = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductService,
    private userService: UserService,
    private basketService: BasketService,
    private favoritesService: FavoritesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.queryParamMap.get('id');
    if (!productId)
      this.router.navigate(['/index']);
    this.product.id = productId;
    this.fetchProduct(productId);

    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  fetchProduct(id: string | null) {
    if (!id) return;
    let idNumber = parseInt(id);
    this.productService.getProductById(idNumber).subscribe({
      next: (res: any) => {
        console.log(res);
        this.product = res;
        if (res.images && res.images.length > 0) {
          this.selectedImageIndex = 0;
          this.selectedImage = 'https://localhost:7060' + res.images[0].imageUrl;
        }

        this.fetching = false;

        this.product.reviews.forEach((review: Review) => {
          this.userService.getUserNameById(review.userId).subscribe(name => {
            review.userName = name;
          });
        });

        this.product.averageRating = this.calculateAverageRating();
      },
      error: (err: any) => { console.log(err); }
    });
  }

  calculateAverageRating() {
    if (!this.product || !this.product.reviews || this.product.reviews.length === 0) {
      return 0; // No reviews, average is 0
    }

    const sum = this.product.reviews.reduce((acc: number, review: Review) => acc + review.rating, 0);
    return sum / this.product.reviews.length;
  }



  addToBasket(product: any) {
    console.log('Added to basket:', product);
    this.addingToBasket = true;

    setTimeout(() => {
      this.addingToBasket = false; // Reset after 2 seconds
      this.showSnackbar = true;
    }, 500);

    let basket = JSON.parse(localStorage.getItem('basket') || '[]');

    // Check if the product already exists in the basket
    const existingItem = basket.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity
    } else {
      basket.push({ ...product, quantity: 1 }); // Add new item with quantity
    }

    localStorage.setItem('basket', JSON.stringify(basket));
    console.log('Basket updated:', basket);

    // Hide snackbar after 3 seconds
    setTimeout(() => {
      this.showSnackbar = false;
    }, 2000);

    this.basketService.updateBasketCount();
  }

  isInFavorites(product: any): boolean {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.some((item: any) => item.id === product.id);
  }



  addToFavorites(product: any) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    // Check if product is already in favorites
    const alreadyFavorited = favorites.some((item: any) => item.id === product.id);

    if (!alreadyFavorited) {
      favorites.push(product);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      console.log('Added to favorites:', product);
    } else {
      console.log('Product is already in favorites');
    }

    this.favoritesService.updateFavoritesCount();
  }

  removeFromFavorites(productId: number) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    // Filter out the product with the matching ID
    favorites = favorites.filter((item: any) => item.id !== productId);

    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log(`Removed product with ID ${productId} from favorites`);

    this.favoritesService.updateFavoritesCount();
  }



  submitReview() {
    if (!this.reviewText || !this.rating) return;
    console.log('Review submitted:', {
      productId: this.product.id,
      rating: this.rating,
      text: this.reviewText
    });

    this.productService.submitReview(this.product.id, this.rating, this.reviewText).subscribe({
      next: (res: any) => {
        console.log(res);
        const productId = this.route.snapshot.queryParamMap.get('id');
        if (!productId)
          this.router.navigate(['/index']);
        this.product.id = productId;
        this.fetchProduct(productId);
      },
      error: (err: any) => { console.log(err); }
    });

    // handle submission logic here
    this.reviewText = '';
    this.rating = 0;
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  prevImage(): void {
    if (this.product.images && this.product.images.length > 0) {
      this.selectedImageIndex =
        (this.selectedImageIndex - 1 + this.product.images.length) % this.product.images.length;
      this.updateSelectedImage();
    }
  }

  nextImage(): void {
    if (this.product.images && this.product.images.length > 0) {
      this.selectedImageIndex =
        (this.selectedImageIndex + 1) % this.product.images.length;
      this.updateSelectedImage();
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
    this.updateSelectedImage();
  }

  updateSelectedImage(): void {
    this.selectedImage = 'https://localhost:7060' + this.product.images[this.selectedImageIndex].imageUrl;
  }

  get totalImages(): number {
    return this.product.images?.length || 0;
  }

  get currentImageNumber(): number {
    return this.selectedImageIndex + 1;
  }

  get paginatedReviews() {
    const start = (this.currentReviewPage - 1) * this.reviewsPerPage;
    return this.product.reviews.slice(start, start + this.reviewsPerPage);
  }

  get totalReviewPages() {
    if (!this.product || !this.product.reviews) return 0;
    return Math.ceil(this.product.reviews.length / this.reviewsPerPage);
  }


  prevReviewPage() {
    if (this.currentReviewPage > 1) this.currentReviewPage--;
  }

  nextReviewPage() {
    if (this.currentReviewPage < this.totalReviewPages) this.currentReviewPage++;
  }
}

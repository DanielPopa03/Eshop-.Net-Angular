import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service/auth.service';
import { ProductService } from '../../services/product/product.service';
import { UserService } from '../../services/user/user.service';
import { Review } from '../../models/review/review';

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

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductService,
    private userService: UserService,
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

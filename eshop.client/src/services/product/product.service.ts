import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  submitReview(productId: number, rating: number, text: string): Observable<any> {
    return this.http.post<any>('https://localhost:7060/Product/SubmitReview', {
      productId: productId,
      rating: rating,
      text: text
    });
  }
}

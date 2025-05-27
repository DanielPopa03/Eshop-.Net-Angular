import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../../models/product/product';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = 'https://localhost:7060';

    constructor(private http: HttpClient, private authService: AuthService) { }

    addProduct(product: Product, imageFiles: File[]): Observable<any> {
        console.log(product);
        const formData = new FormData();
        formData.append('Name', product.name);

        formData.append('SupplierId', product.supplierId.toString());
        formData.append('CategoryId', product.categoryId.toString());
        formData.append('Stock', product.stock.toString());
        formData.append('Description', product.description);
        formData.append('Price', product.price.toString());


        imageFiles.forEach(file => {
            formData.append('productImages', file);
        });
        console.log(formData)
        return this.http.post(`${this.baseUrl}/Product/AddProduct`, formData);
    }

    updateProduct(product: Product, imageFiles: File[], deleteImgByUrl: string[]): Observable<any> {
        const formData = new FormData();
        if (product.id)
            formData.append('Id', product.id.toString());
        formData.append('Name', product.name);
        formData.append('Description', product.description);
        formData.append('CategoryId', product.categoryId.toString());
        formData.append('SupplierId', product.supplierId.toString());
        formData.append('Price', product.price.toString());
        formData.append('Stock', product.stock.toString());

        imageFiles.forEach(file => {
            formData.append('productImages', file);
        });

        deleteImgByUrl.forEach(img => {
            formData.append('deleteImgByUrl', img);
        })

        return this.http.post(`${this.baseUrl}/Product/UpdateProduct`, formData);
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/Product/DeleteProduct/${id}`);
    }

    getPagedProductsOfSupplier(supplierId: number, pageIndex: number, pageSize: number): any {
        return this.http.get(`${this.baseUrl}/Product/getPagedProductsOfSupplier`, {
            params: {
                supplierId,
                pageIndex,
                pageSize
            }
        });
    }

  getProductById(productId: number) : Observable<any> {
    return this.http.get(`${this.baseUrl}/Product/GetProduct`, {
      params: {
        productId
      }
    })
  }

    submitReview(productId: number, rating: number, text: string): Observable < any > {
        return this.http.post<any>('https://localhost:7060/Product/SubmitReview', {
            productId: productId,
            rating: rating,
            text: text
        });
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../../models/category/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>("https://localhost:7060/Category/getAllCategories");
  }

  addCategory(newCategory: Category): Observable<Category> {
    return this.http.post<Category>('https://localhost:7060/Category/AddCategory', newCategory);
  }

  updateCategory(id: number, category: Category) {
    return this.http.put<Category>(`https://localhost:7060/Category/UpdateCategory/${id}`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete(`https://localhost:7060/Category/DeleteCategory/${id}`);
  }
}

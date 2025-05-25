import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../../models/supplier/supplier';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>('https://localhost:7060/Supplier/getAllSuppliers', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authService.getToken()
      }
    });
  }

  getUserSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>('https://localhost:7060/Supplier/getAllSuppliers');
  }
}

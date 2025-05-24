import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../../models/supplier/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(private http: HttpClient) { }

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>('https://localhost:7060/Supplier/getAllSuppliers', {
      withCredentials: true
    });
  }

  getUserSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>('https://localhost:7060/Supplier/getAllSuppliers');
  }
}

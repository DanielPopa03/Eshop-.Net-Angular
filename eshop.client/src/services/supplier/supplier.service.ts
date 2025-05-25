import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Supplier } from '../../models/supplier/supplier';
import { AuthService } from '../auth-service/auth.service';
import { User } from '../../models/user/user';
import { HttpParams } from '@angular/common/http';

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
    return this.http.get<Supplier[]>('https://localhost:7060/Supplier/getUserSuppliers', {
        withCredentials: true
      });
  }

  getPagedModeratorsOfSupplier(supplierId: number, page: number, pageSize: number) : Observable<any> {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const params = new HttpParams()
      .set('supplierId', supplierId.toString())
      .set('startIdx', start.toString())
      .set('endIdx', end.toString());
      
    return this.http.get<any>('https://localhost:7060/Supplier/getPagedModeratorsOfSupplier', {
      params,
      withCredentials: true
    });
  }

  addModerator(supplierId: number, moderatorUserId: any) {
    return this.http.post<any>('https://localhost:7060/Supplier/addModerator',
      {
        supplierId: supplierId,
        moderatorUserId: moderatorUserId,
      },
      { withCredentials: true }
    )
  }
}

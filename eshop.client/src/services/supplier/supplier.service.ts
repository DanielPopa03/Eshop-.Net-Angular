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
    return this.http.get<Supplier[]>('https://localhost:7060/Supplier/getAllSuppliers');
  }

  getUserSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>('https://localhost:7060/Supplier/getUserSuppliers', {
      withCredentials: true
    });
  }

  getPagedModeratorsOfSupplier(supplierId: number, page: number, pageSize: number): Observable<any> {
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    console.log(start, end);
    const params = new HttpParams()
      .set('supplierId', supplierId.toString())
      .set('startIdx', start.toString())
      .set('endIdx', end.toString());

    return this.http.get<any>('https://localhost:7060/Supplier/getPagedModeratorsOfSupplier', {
      params
    });
  }

  addModeratorObservable(supplierId: number, moderatorUserId: number) {
    console.log('HTTP REQ');
    return this.http.post<any>('https://localhost:7060/Supplier/addModerator',
      {
        supplierId: supplierId,
        moderatorUserId: moderatorUserId,
      }
    );
  }

  deleteModeratorObservable(supplierId: number, moderatorUserId: number) : Observable<any> {
    console.log("REMOVING MODERATOR WITH {SUPPLIER, USERID}: " + supplierId + " " + moderatorUserId);

    return this.http.post<any>('https://localhost:7060/Supplier/removeModerator',
      {
        supplierId: supplierId,
        moderatorUserId: moderatorUserId,
      });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../../models/DTO/user-dto/user-dto';
import { Observable, of } from 'rxjs'
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(userDto: UserDto) {
     return this.http.post('https://localhost:7060/User/create', userDto).subscribe();
  }

  getUserByEmail(email: string) : Observable<any> {
    return this.http.get('https://localhost:7060/User/getUserByEmail?email='+email);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get('https://localhost:7060/User/getUserById?id='+userId);
  }

  getUserNameById(userId: number): Observable<string> {
    return this.getUserById(userId).pipe(
      map((res: any) => {
        return res.name || 'unknown user';
      }),
      catchError((err) => {
        console.error(err);
        return of('unknown user');
      })
    );
  }
}

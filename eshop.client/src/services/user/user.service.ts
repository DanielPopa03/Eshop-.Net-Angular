import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../../models/DTO/user-dto/user-dto';
import { Observable } from 'rxjs'

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
}

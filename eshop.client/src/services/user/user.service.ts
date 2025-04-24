import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../../models/DTO/user-dto/user-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createUser(userDto: UserDto) {
     return this.http.post('https://localhost:7060/User/create', userDto).subscribe();
  }
}

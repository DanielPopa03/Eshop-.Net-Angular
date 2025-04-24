import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserService } from '../../services/user/user.service';
import { LoginDto } from '../../models/DTO/login-dto/login-dto';
import { UserDto } from '../../models/DTO/user-dto/user-dto';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  isSignUp: boolean = false;

  email: string = '';
  password: string = '';

  signUpEmail: string = '';
  lastName: string = '';
  firstName: string = '';
  phoneNumber: string = '';
  passwordSignIn: string = '';

  constructor(private authService: AuthService, private userService: UserService) {}

  onLoginSubmit(): void {
    this.authService.login(new LoginDto(this.email, this.password))
  }

  onSignUpSubmit(): void {
    let userDto = new UserDto({
      email: this.signUpEmail,
      lastName: this.lastName,
      firstName: this.firstName,
      phoneNumber: this.phoneNumber,
      password: this.passwordSignIn, 
    });
    this.userService.createUser(userDto);
    this.isSignUp = false;
  }

  toggleForm(): void {
    this.isSignUp = !this.isSignUp;
  }
}



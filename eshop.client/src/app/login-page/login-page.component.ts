import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth.service';
import { UserService } from '../../services/user/user.service';
import { LoginDto } from '../../models/DTO/login-dto/login-dto';
import { UserDto } from '../../models/DTO/user-dto/user-dto';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private authService: AuthService,
    private userService: UserService, private router: Router,
    private snackBar: MatSnackBar) { }

  isLoading = false;

  onLoginSubmit(): void {
    this.isLoading = true;
    this.authService.login(new LoginDto(this.email, this.password)).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        const msg = err?.error?.message || 'Invalid credentials.';
        this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['bg-red-600', 'text-white'] });
      }
    });
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



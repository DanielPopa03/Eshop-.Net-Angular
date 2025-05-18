import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService) { }

  sendResetRequest() {
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.authService.requestPasswordReset(this.email).subscribe({
      next: res => {
        this.successMessage = 'Check your inbox for the reset link.';
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err?.error || 'Failed to send reset link.';
        this.isLoading = false;
      }
    });

  }
}

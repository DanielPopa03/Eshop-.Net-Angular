import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth-service/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open("Passwords do not match", 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: () => {
        this.snackBar.open('Password reset successful.', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Invalid or expired token.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

}

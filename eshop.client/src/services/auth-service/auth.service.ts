import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { UserInfo } from '../../models/DTO/user-info/user-info';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../../models/DTO/login-dto/login-dto';

const JWT_COOKIE_NAME = "Auth_Tok_Eshop";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<UserInfo | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  user$ = this.userSubject.asObservable();

  constructor(private cookieService: CookieService, private http: HttpClient) {}

  // Called from APP_INITIALIZER
  init(): Promise<void> {
    return new Promise(resolve => {
      this.loadAuthState();
      resolve();
    });
  }

  private loadAuthState(): void {
    const token = this.getToken();
    if (!token) return this.clearState();

    try {
      const rawPayload: any = jwtDecode(token);
      console.log(rawPayload)
      const decoded = UserInfo.fromJwtPayload(rawPayload);
      console.log(decoded.role)
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp > now) {
        this.userSubject.next(decoded);
        this.isLoggedInSubject.next(true);
      } else {
        this.clearState();
      }
    } catch {
      this.clearState();
    }
  }


  login(dto: LoginDto): Observable<any> {
    return this.http.post<any>('https://localhost:7060/login', dto).pipe(
      tap(response => {
        const token = response.token;
        if (token) {
          this.setToken(token);
          this.loadAuthState();
        }
      })
    );
  }


  logout(): void {
    this.clearToken();
    this.clearState();
  }

  requestPasswordReset(email: string): Observable<string> {
    return this.http.post('https://localhost:7060/request-password-reset', JSON.stringify(email), {
          headers: { 'Content-Type': 'application/json' },
          responseType: 'text'
      });

  }

  resetPassword(token: string, newPassword: string): Observable<string> {
    return this.http.post('https://localhost:7060/reset-password', {
      token,
      newPassword
    }, { responseType: 'text' });
  }

  roleOfUser(): string {
    const user = this.userSubject.getValue();
    if (user) {
      return user.role;
    }
    return '';
  }

  idOfUser(): number {
    const user = this.userSubject.getValue();
    if (user) {
      return user.id;
    }
    return -1;
  }

  private setToken(token: string, days: number = 1): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    this.cookieService.set(JWT_COOKIE_NAME, token, expires, '/');
  }

  public getToken(): string | null {
    return this.cookieService.get(JWT_COOKIE_NAME) || null;
  }

  private clearToken(): void {
    this.cookieService.delete(JWT_COOKIE_NAME, '/');
  }

  private clearState(): void {
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
  }
}

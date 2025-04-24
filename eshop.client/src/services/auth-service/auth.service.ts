import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  public isLoggedInSubject = new BehaviorSubject<boolean>(false);
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
      const decoded = UserInfo.fromJwtPayload(rawPayload);
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


  login(dto: LoginDto): void {
    this.http.post<any>('https://localhost:7060/login', dto).subscribe(
      (response) => {
        const token = response.token;
        if (token) {
          this.setToken(token);
          this.loadAuthState(); 
        }
      },
      (error) => {
        console.error('Login failed', error);
      }
    );
  }

  logout(): void {
    this.clearToken();
    this.clearState();
  }

  private setToken(token: string, days: number = 1): void {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);
    this.cookieService.set(JWT_COOKIE_NAME, token, expires, '/');
  }

  private getToken(): string | null {
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

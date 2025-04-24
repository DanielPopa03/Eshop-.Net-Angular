import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { AuthService } from '../services/auth-service/auth.service';
import { CookieService } from 'ngx-cookie-service';

export function initializeAuth(authService: AuthService) {
  return () => authService.init();
}

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'product', component: ProductPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
})
export class AppRoutingModule { }

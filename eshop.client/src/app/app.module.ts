import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AdminComponent } from './admin/admin.component';
import { ForgotPasswordComponent } from './login-page/forgot-password/forgot-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ResetPasswordComponent } from './login-page/reset-password/reset-password.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    ProductPageComponent,
    NavBarComponent,
    AdminComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutes } from './pages.routing';

import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../app.module';
import { LaddaModule } from 'angular2-ladda';
import { FooterModule } from '../shared/footer/footer.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    ReactiveFormsModule,
    FooterModule,
    LaddaModule.forRoot({
      style: "contract",
      spinnerSize: 35,
      spinnerColor: "grey",
      spinnerLines: 12
  }),
    MaterialModule
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
  ],
})

export class PagesModule {}

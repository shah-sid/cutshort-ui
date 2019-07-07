import { Routes } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

export const PagesRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        component: LoginComponent
      },
      {
        path: "forgot_pass",
        component: ForgotPasswordComponent
      }
    ]
  }
];

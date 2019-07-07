import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthGuard } from "./services/auth-guard.service";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { Routes } from "@angular/router";

export const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full"
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "profile",
        loadChildren: "./modules/profile/profile.module#ProfileModule",
        canActivate: [AuthGuard]
	  },
	  {
		path: "custom-dashboards",
		loadChildren:
		  "./modules/custom-dashboards/custom-dashboards.module#CustomDashboardsModule",
		canActivate: [AuthGuard]
	  },
	
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        loadChildren: "./pages/pages.module#PagesModule"
      }
    ]
  },
  {
    path: "**",
    redirectTo: "login"
  }
];

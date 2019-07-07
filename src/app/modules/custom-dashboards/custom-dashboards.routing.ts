import { Routes } from "@angular/router";
import { CustomDashboardsComponent } from "./custom-dashboards.component";
import { ViewCustomDashboardComponent } from "./view-custom-dashboard/view-custom-dashboard.component";
import { AddWidgetComponent } from './add-widget/add-widget.component';
import { ViewCustomDashboardGuard } from "app/services/view-custom-dashboard-guard.service";

export const CustomDashboardsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: CustomDashboardsComponent,
        canActivate: []
      }
    ]
  },
  {
    path: "add",
    children: [
      {
        path: "",
        component: AddWidgetComponent,
        canActivate: []
      }
    ]
  },
  {
    path: "view",
    children: [
      {
        path: "",
        component: ViewCustomDashboardComponent,
        canActivate: [ViewCustomDashboardGuard]
      }
    ]
  },
  {
    path: "config",
    children: [
      {
        path: "columnchart-config",
        loadChildren: "../dashboard-widgets-config/column-chart-config/column-chart-config.module#ColumnChartConfigModule",
      },
      ]
  }
];

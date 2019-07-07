import { Routes } from "@angular/router";
import { ColumnChartConfigComponent } from "./column-chart-config.component";

export const ColumnChartConfigRoutes: Routes = [
    {
      path: '',
      children: [{
        path: '',
        component: ColumnChartConfigComponent,
        canActivate: []
    }]
}];

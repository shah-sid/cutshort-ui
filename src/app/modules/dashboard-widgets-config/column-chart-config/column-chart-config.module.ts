import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ColumnChartConfigComponent } from './column-chart-config.component';
import { ColumnChartConfigRoutes } from './column-chart-config.routing';
import { MaterialModule } from 'app/app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardWidgetsModule } from 'app/modules/dashboard-widgets/dashboard-widgets.module';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ColumnChartConfigRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardWidgetsModule,
    ColorPickerModule
  ],
  declarations: [ColumnChartConfigComponent]
})
export class ColumnChartConfigModule { }

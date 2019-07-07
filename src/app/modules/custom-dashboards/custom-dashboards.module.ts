import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomDashboardsComponent } from './custom-dashboards.component';
import { CustomDashboardsRoutes } from './custom-dashboards.routing';
import { MaterialModule } from 'app/app.module';
import { MomentModule } from 'ngx-moment';
import { GeneralModule } from 'app/general/general.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewCustomDashboardComponent } from './view-custom-dashboard/view-custom-dashboard.component';
import { DashboardWidgetsModule } from '../dashboard-widgets/dashboard-widgets.module';
import { AddWidgetComponent } from './add-widget/add-widget.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ManageCustomDashboardDialogComponent } from 'app/general/dialogs/manage-custom-dashboard-dialog/manage-custom-dashboard-dialog.component';

@NgModule({
	entryComponents:[ManageCustomDashboardDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(CustomDashboardsRoutes),
    MaterialModule,
    MomentModule,
    GeneralModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardWidgetsModule,
    DragDropModule
  ],
  declarations: [CustomDashboardsComponent, ViewCustomDashboardComponent, AddWidgetComponent]
})
export class CustomDashboardsModule { }

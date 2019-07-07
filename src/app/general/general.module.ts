import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { ActionConfirmComponent } from "./dialogs/action-confirm/action-confirm.component";
import { ConnectionIndicatorComponent } from "./widgets/connection-indicator/connection-indicator.component";
import { EditImageDialogComponent } from "./dialogs/edit-image-dialog/edit-image-dialog.component";
import { FileHelpersModule } from "ngx-file-helpers";
import { HighchartsChartComponent } from "./highcharts/highcharts-chart/highcharts-chart.component";
import { ImageCropperModule } from "ngx-image-cropper";
import { MaterialModule } from "../app.module";
import { MomentModule } from "ngx-moment";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SearchComponent } from "./search/search.component";
import { UserDetailsComponent } from "./details/user-details/user-details.component";
import { DateTimeRangePickerComponent } from "./date-time-range-picker/date-time-range-picker.component";
import { WidgetOptionsMenuComponent } from "./dialogs/widget-options-menu/widget-options-menu.component";
import { CustomDashboardsListComponent } from "./lists/custom-dashboards-list/custom-dashboards-list.component";
import { ReportPlaceholderComponent } from "./placeholders/report-placeholder/report-placeholder.component";
import { WidgetCatalogFilterPipe } from "./pipes/widget-catalog-filter.pipe";
import { WidgetsCatalogComponent } from "./lists/widgets-catalog/widgets-catalog.component";
import { ManageCustomDashboardDialogComponent } from "./dialogs/manage-custom-dashboard-dialog/manage-custom-dashboard-dialog.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ImageCropperModule,
    FileHelpersModule,
    MomentModule,
    MaterialModule
  ],
  declarations: [
    SearchComponent,
    HighchartsChartComponent,
    UserDetailsComponent,
    ConnectionIndicatorComponent,
    ActionConfirmComponent,
    EditImageDialogComponent,
	DateTimeRangePickerComponent,
	WidgetOptionsMenuComponent,
	CustomDashboardsListComponent,
	ReportPlaceholderComponent,
	WidgetCatalogFilterPipe,
	WidgetsCatalogComponent,
	ManageCustomDashboardDialogComponent
  ],
  exports: [
    SearchComponent,
    HighchartsChartComponent,
    UserDetailsComponent,
    ConnectionIndicatorComponent,
    ActionConfirmComponent,
    EditImageDialogComponent,
	DateTimeRangePickerComponent,
	WidgetOptionsMenuComponent,
	CustomDashboardsListComponent,
	ReportPlaceholderComponent,
	WidgetCatalogFilterPipe,
	WidgetsCatalogComponent,
	ManageCustomDashboardDialogComponent
  ],
  entryComponents: [
    ActionConfirmComponent,
    EditImageDialogComponent
  ]
})
export class GeneralModule {}

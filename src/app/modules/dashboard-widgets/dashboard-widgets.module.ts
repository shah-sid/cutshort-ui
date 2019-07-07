import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MomentModule } from "ngx-moment";
import { GeneralModule } from "app/general/general.module";
import { MaterialModule } from "../../app.module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DragAndDropModule } from 'angular-draggable-droppable';
import { ColumnChartComponent } from './column-chart/column-chart.component';

@NgModule({
  imports: [
    CommonModule,
    MomentModule,
    GeneralModule,
    MaterialModule,
    DragDropModule,
    DragAndDropModule
  ],
  declarations: [
    ColumnChartComponent,
  ],
  entryComponents: [
    ColumnChartComponent,
  ],
  exports: [
    ColumnChartComponent,
  ]
})
export class DashboardWidgetsModule {}

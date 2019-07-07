import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ComponentFactoryResolver,
  ViewContainerRef
} from "@angular/core";
import { WidgetConfig } from "../../../models/widget-config";
import { WidgetItem } from "./widget-item";
import { Router, ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Subscription, EMPTY } from "rxjs";
import { switchMap } from "rxjs/operators";
import { WidgetsService } from "../../../services/widgets.service";
import * as _ from "lodash";
import { ColumnChartComponent } from "app/modules/dashboard-widgets/column-chart/column-chart.component";
import { ToastService } from "app/services/toast.service";
import { ActionConfirmComponent } from "app/general/dialogs/action-confirm/action-confirm.component";

@Component({
  selector: "view-custom-dashboard",
  templateUrl: "./view-custom-dashboard.component.html",
  styleUrls: ["./view-custom-dashboard.component.scss"]
})
export class ViewCustomDashboardComponent implements OnInit, OnDestroy {
  widgets: any[];
  viewContainerRefList = [];
  widgetActionSubscriptions = [];
  dialogRef;
  initSubscription: Subscription;
  showWidgetsLoader = true;
  dashboardId: string;
  editLayoutState = false;
  editLayoutSubscription: Subscription;

  @ViewChild("widgetHost", { read: ViewContainerRef }) widgetHost: any;

  constructor(
    private widgetsService: WidgetsService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initSubscription = this.route.queryParams
      .pipe(
        switchMap(params => {
          this.dashboardId = params.id;
          return this.widgetsService.getWidgetsByDashboard(this.dashboardId);
        })
      )
      .subscribe(
        (widgets: any[]) => {
          console.log("Widgets Found: ", widgets);
          this.formatWidgetDataToInject(widgets);
          this.showWidgetsLoader = false;
          setTimeout(() => {
            this.loadComponent();
            console.log("widget host", this.widgetHost);
          }, 500);
        },
        () => {
          this.widgets = [];
          this.showWidgetsLoader = false;
        }
      );

    this.editLayoutSubscription = this.widgetsService.editLayout$.subscribe(
      (state: boolean) => {
        console.log("Edit layout state", state);
        this.editLayoutState = state;

        if (this.editLayoutState == false) {
          this.saveDashboardLayout();
        }
      }
    );
  }

  ngOnDestroy() {
    this.viewContainerRefList.forEach(ref => (ref ? ref.clear() : ""));
    this.widgetActionSubscriptions.forEach(
      subscription => subscription.unsubscribe
    );

    if (this.editLayoutSubscription) {
      this.editLayoutSubscription.unsubscribe();
    }
  }

  loadComponent() {
    this.widgets.forEach(widget => {
      const widgetItem = widget;

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
        widgetItem.component
      );

      const viewContainerRef = this.widgetHost.viewContainerRef;

      const componentRef = this.widgetHost.createComponent(componentFactory);
      (<WidgetConfig>componentRef.instance).config = widgetItem.config;
      (<WidgetConfig>componentRef.instance).widgetId = widgetItem._id;
      (<WidgetConfig>componentRef.instance).dashboardId =
        widgetItem.dashboardId;

      if ((<WidgetConfig>componentRef.instance).manageConfig) {
        this.widgetActionSubscriptions.push(
          (<WidgetConfig>componentRef.instance).manageConfig.subscribe(data => {
            console.log("Event caught in view custom dash - config", data);
            this.viewWidgetConfig(data);
          })
        );
      }

      if ((<WidgetConfig>componentRef.instance).deleteWidget) {
        this.widgetActionSubscriptions.push(
          (<WidgetConfig>componentRef.instance).deleteWidget.subscribe(data => {
            console.log("Event caught in view custom dash - delete", data);
            this.deleteWidget(data);
          })
        );
      }

      this.viewContainerRefList.push(viewContainerRef);
    });
  }

  viewWidgetConfig(widgetData: any) {
    console.log("widget data in view config", widgetData);
    this.router.navigate(
      [
        `/custom-dashboards/config/${widgetData.widgetType.toLowerCase()}-config`
      ],
      {
        queryParams: {
          action: "edit",
          d: widgetData.dashboardId,
          w: widgetData.widgetConfigId
        }
      }
    );
  }

  deleteWidget(widgetData: any) {
    console.log("Deleting widget", widgetData);
    this.dialogRef = this.dialog.open(ActionConfirmComponent, {
      width: "400px",
      closeOnNavigation: true,
      data: {
        title: "Delete Widget",
        messageLine1: "Confirm Delete Widget ?",
        messageLine2: "This cannot be undone."
      }
    });

    this.dialogRef
      .afterClosed()
      .pipe(
        switchMap((res: boolean) => {
          if (res) {
            return this.widgetsService.removeWidgetFromDashboard(
              widgetData.widgetConfigId
            );
          }
          return EMPTY;
        })
      )
      .subscribe((res: boolean) => {
        console.log("Delete res", widgetData, res);
        if (res) {
          const widgetIndexToRemove = _.findIndex(this.widgets, {
            _id: widgetData.widgetConfigId
          });
          this.widgetHost.remove(widgetIndexToRemove);
          _.remove(this.widgets, { _id: widgetData.widgetConfigId });
        }
      });
  }

  addWidget($event) {
    $event.stopPropagation();
    this.router.navigate(["/custom-dashboards/add"], {
      queryParams: {
        d: this.dashboardId
      }
    });
  }

  formatWidgetDataToInject(widgets: any[]) {
    this.widgets = [];
    widgets.forEach((widget: any) => {
      switch (widget.type) {
        case "columnChart":
          this.widgets.push(
            new WidgetItem(
              widget._id,
              ColumnChartComponent,
              widget.config,
              widget.dashboard
            )
          );
          break;
      }
    });
  }

  toggleEditLayout() {
    this.widgetsService.toggleEditLayout();
  }

  isMobileDisplay() {
    return window.screen.width <= 576;
  }

  saveDashboardLayout() {
    if (this.widgets && this.widgets.length > 0) {
      const widgetPositions = this.widgets.map((widget: any) => ({
        id: widget._id,
        position: widget.config.position
      }));
      const positionInfo = {
        _id: this.dashboardId,
        widgets: widgetPositions
      };

      this.widgetsService.updateWidgetPositions(positionInfo).subscribe();
    }
  }
}

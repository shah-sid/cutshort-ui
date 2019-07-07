import { Component, OnInit } from "@angular/core";
import { CustomDashboard } from "../../models/custom-dashboard";
import { map, switchMap } from "rxjs/operators";
import { Observable, EMPTY } from "rxjs";
import { CustomDashboardsService } from "app/services/custom-dashboards.service";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { ActionConfirmComponent } from "app/general/dialogs/action-confirm/action-confirm.component";
// tslint:disable-next-line:max-line-length
import { ManageCustomDashboardDialogComponent } from '../../general/dialogs/manage-custom-dashboard-dialog/manage-custom-dashboard-dialog.component';
import * as _ from "lodash";

@Component({
  selector: "custom-dashboards",
  templateUrl: "./custom-dashboards.component.html",
  styleUrls: ["./custom-dashboards.component.scss"]
})
export class CustomDashboardsComponent implements OnInit {
  customDashboards$: Observable<CustomDashboard[]>;
  dialogRef;

  constructor(
    private customDashboardsService: CustomDashboardsService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.customDashboardsService.getCustomDashboards(true).subscribe();
    this.customDashboards$ = this.customDashboardsService.customDashboards$.pipe(
      map(customDashboards => {
        return customDashboards
          ? _.sortBy(customDashboards, "name")
          : customDashboards;
      })
    );
  }

  showManageCustomDashboard(customDashboard, action: String) {
    this.dialogRef = this.dialog.open(ManageCustomDashboardDialogComponent, {
      width: "500px",
      closeOnNavigation: true,
      data: {
        action: action,
        customDashboard: customDashboard
      }
    });

    this.dialogRef
      .afterClosed()
      .pipe(
        switchMap(
          (customDashboardData: any) => {
            if (customDashboardData) {
              console.log("CustomDashboard to add", customDashboardData);
              if (action  == 'add') {
                return this.customDashboardsService.addCustomDashboard(customDashboardData.customDashboard);
              } else {
                return this.customDashboardsService.updateCustomDashboard(customDashboardData.customDashboard);
              }
            }
            return EMPTY;
          }
        )
      )
      .subscribe((res: boolean) => {
        if (!res) {
          this.showManageCustomDashboard(customDashboard, action);
        }
      });
  }

  deleteCustomDashboard(eventArgs) {
    console.log("Deleting customDashboard", eventArgs);
    this.dialogRef = this.dialog.open(ActionConfirmComponent, {
      width: "400px",
      closeOnNavigation: true,
      data: {
        title: "Delete Custom Dashboard",
        messageLine1: "Confirm Delete Custom Dashboard ?",
        messageLine2: "This cannot be undone."
      }
    });
    this.dialogRef
      .afterClosed()
      .pipe(
        switchMap(action => {
          if (action == true) {
            return this.customDashboardsService.deleteCustomDashboard(
              eventArgs.customDashboardID
            );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  showConfig(eventArgs) {
    console.log("showing config for", eventArgs);
    this.showManageCustomDashboard(eventArgs.customDashboard, 'edit');
  }

  addDashboard($event) {
    $event.stopPropagation();
    this.showManageCustomDashboard({}, 'add');
  }

  viewCustomDashboard(eventArgs) {
    console.log("Viewing CustomDashboard", eventArgs);
    this.router.navigate(
      ["/custom-dashboards/view"],
      { queryParams: { id: eventArgs.customDashboard._id } }
    );
  }
}

import { Component, OnInit } from "@angular/core";
import { WidgetsService } from "../../../services/widgets.service";
import { Widget } from "app/models/widget";
import { Observable, Subscription } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import * as _ from "lodash";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastService } from "../../../services/toast.service";
import { MatDialog } from "@angular/material/dialog";
// import { NotificationDialogComponent } from "app/general/dialogs/notification-dialog/notification-dialog.component";

@Component({
  selector: "add-widget",
  templateUrl: "./add-widget.component.html",
  styleUrls: ["./add-widget.component.scss"]
})
export class AddWidgetComponent implements OnInit {
  widgets$: Observable<Widget[]>;
  searchTerms: string[] = [];
  multipleSearchTerms = true;
  dashboardId: string;
  initSubscription: Subscription;
  dialogRef;

  constructor(
    private widgetsService: WidgetsService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initSubscription = this.route.queryParams.subscribe((params: any) => {
      this.dashboardId = params.d;
    });

    this.widgetsService.getWidgets(true).subscribe();
    this.widgets$ = this.widgetsService.widgets$.pipe(
      map((widgets: Widget[]) => {
        if (widgets && widgets.length > 0) {
          return _.sortBy(widgets, (widget: Widget) =>
            widget.title.toLowerCase()
          );
        }
        return widgets;
      })
    );
  }

  searchTextChanged(eventArgs) {
    this.searchTerms = eventArgs.searchTerms;
    console.log("Search for", this.searchTerms);
  }

  addSelectedWidget(eventArgs: any) {
    console.log("Selected widget", eventArgs);
    if (eventArgs.widget.type == "lineGrouped" || eventArgs.widget.type == "lastDpTwoDemo" || eventArgs.widget.type == "Temperature") {
    //   this.dialogRef = this.dialog.open(NotificationDialogComponent, {
    //     width: "600px",
    //     closeOnNavigation: true,
    //     data: {
    //       title: "Widget Coming Soon!",
    //       icon: '../../../../../assets/img/essentials/warning.svg',
    //       messageLine1: "We're working really hard to bring tons of new useful widgets.",
    //       messageLine2: "Make sure you watch this space :)",
    //       doneText: 'Dismiss'
    //     }
    //   });
      return;
    }

    this.router.navigate(
      [
        `/custom-dashboards/config/${eventArgs.widget.type.toLowerCase()}-config`
      ],
      {
        queryParams: {
          action: "add",
          d: this.dashboardId
        }
      }
    );
  }
}

import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CustomDashboard } from 'app/models/custom-dashboard';
import * as _ from 'lodash';

@Component({
  selector: 'custom-dashboards-list',
  templateUrl: './custom-dashboards-list.component.html',
  styleUrls: ['./custom-dashboards-list.component.scss']
})
export class CustomDashboardsListComponent implements OnInit, OnChanges {
  @Input("custom-dashboards-list") customDashboards: CustomDashboard[];
  @Input("card-title") title: string;
  @Input("card-icon") icon: string;

  @Output("onCustomDashboardConfig") configureCustomDashboard = new EventEmitter();
  @Output("onCustomDashboardDelete") deleteCustomDashboard = new EventEmitter();
  @Output("onCustomDashboardView") viewCustomDashboard = new EventEmitter();

  showCustomDashboardsLoader = true;
  customDashboardHover: CustomDashboard;
  groupedCustomDashboards: { type?: string; customDashboards?: CustomDashboard[] }[] = [];

  constructor() { }

  ngOnInit() {  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("CustomDashboard Changes", changes.customDashboards.currentValue);
    if (changes.customDashboards && changes.customDashboards.currentValue != null) {
      this.groupedCustomDashboards = [];
      changes.customDashboards.currentValue.forEach((customDashboard: CustomDashboard) => {
        const customDashboardGroup = _.find(this.groupedCustomDashboards, { type: customDashboard.type.toLowerCase() });
        if (!customDashboardGroup) {
          this.groupedCustomDashboards.push({
            type: customDashboard.type.toLowerCase(),
            customDashboards: [customDashboard]
          });
        } else {
          customDashboardGroup.customDashboards.push(customDashboard);
        }
      });
      console.log("Grouped customDashboards", this.groupedCustomDashboards);
      this.showCustomDashboardsLoader = false;
    }
  }

  deleteCustomDashboardClicked($event, customDashboardID: string) {
    console.log("Delete customDashboard", customDashboardID);
    this.deleteCustomDashboard.emit({ customDashboardID: customDashboardID });
    $event.stopPropagation();
  }

  viewCustomDashboardClicked(customDashboard: CustomDashboard) {
    console.log("View CustomDashboard", customDashboard);
    this.viewCustomDashboard.emit({ customDashboard: customDashboard });
  }

  configureCustomDashboardClicked($event, customDashboard: CustomDashboard) {
    console.log("Configure CustomDashboard", customDashboard);
    this.configureCustomDashboard.emit({ customDashboard: customDashboard });
    $event.stopPropagation();
  }

  isMobileDisplay() {
    return window.screen.width <= 576;
  }
}

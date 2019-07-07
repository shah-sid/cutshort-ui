import { Injectable } from '@angular/core';
import { CustomDashboardsService } from './custom-dashboards.service';
import { RouterStateSnapshot, Router } from '@angular/router';
import { CustomDashboard } from '../models/custom-dashboard';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ViewCustomDashboardGuard {

  constructor(private customDashboardsSerivce: CustomDashboardsService, private router: Router) { }

  canActivate(route, state: RouterStateSnapshot) {
    console.log('Query params in ViewCustomDashboardGuard', route.queryParams);
    if (route.queryParams.id == undefined) {
      this.router.navigate(["/dashboards/custom-dashboards"]);
      return false;
    } else {
      return this.customDashboardsSerivce.getCustomDashboards(false).pipe(
        map((customDashBoards: CustomDashboard[]) => {
          if (_.find(customDashBoards, {_id: route.queryParams.id}) == undefined) {
            this.router.navigate(["/dashboards/custom-dashboards"]);
            return false;
          }
          return true;
        })
      );
    }
  }
}

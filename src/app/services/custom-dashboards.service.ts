import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { CustomDashboard } from "app/models/custom-dashboard";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ToastService } from "./toast.service";
import { tap, map, catchError } from "rxjs/operators";
import { AuthResp } from "app/models/auth-resp";
import * as _ from 'lodash';

@Injectable({
  providedIn: "root"
})
export class CustomDashboardsService {
  private subject = new BehaviorSubject(null);
  customDashboards$: Observable<CustomDashboard[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  getCustomDashboards(getAsObservable: boolean) {
    // this.subject.next(null);
    return this.http.get("/api/account/dashboard").pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          this.subject.next(res.data);
        } else {
          this.subject.next([]);
          this.toastService.showToast(res.errors[0], "danger");
        }
        return !getAsObservable ? res.data : res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("Get CustomDashboards Err", err.message);
        this.subject.next([]);
        return throwError(err.message);
      })
    );
  }

  addCustomDashboard(customDashboard: CustomDashboard) {
    return this.http.post("/api/account/dashboard", customDashboard).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          this.toastService.showToast("Dashboard added successfully!", "success");
          const customDashboards = this.subject.value;
          customDashboards.push(res.data);
          this.subject.next(customDashboards);
        } else {
          this.toastService.showToast(res.errors[0], "danger");
        }
        return res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("Add custom dashboard err", err.message);
        return throwError(false);
      })
    );
  }

  updateCustomDashboard(customDashboardData: CustomDashboard ) {
    const customDashboards = this.subject.value;
    const customDashboardToUpdate = _.find(customDashboards, { _id: customDashboardData._id });
    const indexToUpdate = _.findIndex(customDashboards, { _id: customDashboardData._id });
    customDashboards.splice(indexToUpdate, 1, customDashboardData);
    this.subject.next(customDashboards);

    return this.http.put("/api/account/dashboard/", customDashboardData).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          this.toastService.showToast("Dashboard updated successfully", "success");
        } else {
          this.toastService.showToast(res.errors[0], "danger");
          customDashboards.splice(indexToUpdate, 1, customDashboardToUpdate);
          this.subject.next(_.cloneDeep(customDashboards));
        }
        return res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("Delete customDashboard err", err.message);
        this.toastService.showToast(
          "Something went wrong. Try again!",
          "danger"
        );
        customDashboards.splice(indexToUpdate, 1, customDashboardToUpdate);
        this.subject.next(customDashboards);
        return throwError(false);
      })
    );
  }

  deleteCustomDashboard(_id: string) {
    const customDashboards = this.subject.value;
    const customDashboardToDelete = _.find(customDashboards, { _id: _id });
    const indexToDelete = _.findIndex(customDashboards, { _id: _id });
    customDashboards.splice(indexToDelete, 1);
    this.subject.next(customDashboards);

    return this.http.delete("/api/account/dashboard/" + _id).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          this.toastService.showToast("Custom dashboard deleted successfully", "success");
        } else {
          this.toastService.showToast(res.errors[0], "danger");
          customDashboards.splice(indexToDelete, 0, customDashboardToDelete);
          this.subject.next(_.cloneDeep(customDashboards));
        }
        return res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("Delete customDashboard err", err.message);
        this.toastService.showToast(
          "Something went wrong. Try again!",
          "danger"
        );
        customDashboards.splice(indexToDelete, 0, customDashboardToDelete);
        this.subject.next(customDashboards);
        return throwError(err.message);
      })
    );
  }
}

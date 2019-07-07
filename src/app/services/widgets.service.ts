import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { Widget } from 'app/models/widget';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastService } from './toast.service';
import { SecureStorageService } from './secure-storage.service';
import { map, tap, catchError } from 'rxjs/operators';
import { AuthResp } from 'app/models/auth-resp';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class WidgetsService {
  private subject = new BehaviorSubject(null);
  widgets$: Observable<Widget[]> = this.subject.asObservable();

  private editLayoutSubject = new BehaviorSubject(null);
  editLayout$: Observable<boolean> = this.editLayoutSubject.asObservable();

  constructor(private http: HttpClient, private toastService: ToastService, private secureStorageService: SecureStorageService) { }

  getWidgets(getAsObservable: boolean) {
    return this.http.get("/api/account/widgetType").pipe(
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
        console.log("Get Widgets Err", err.message);
        this.subject.next([]);
        return throwError(err.message);
      })
    );
  }

  addWidgetToDashboard(dashboardId: string, widgetType: string, widgetData: any) {
    return this.http.post("/api/account/widget", {type: widgetType, dashboard: dashboardId, config: widgetData}).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (!res.success) {
          this.toastService.showToast(res.errors[0], 'danger');
        }
        return res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("Get widgets err", err.message);
        return of(false);
      })
    )
  }

  getWidgetsByDashboard(dashboardId: string) {
    return this.http.get(`/api/account/widget/${dashboardId}`).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          return res.data;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return [];
        }
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("get widgets err", err.message);
        this.toastService.showToast("Something went wrong. Try again", 'danger');
        return of([]);
      })
    )
  }

  getWidgetConfig(widgetId: string) {
    return this.http.get(`/api/account/widget/config/${widgetId}`).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          return res.data;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return null;
        }
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("get widget config err", err.message);
        this.toastService.showToast("Something went wrong. Try again", 'danger');
        return of(null);
      })
    )
  }

  updateWidgetConfig(widgetId: string, widgetType: string, config: any) {
    return this.http.put("/api/account/widget", {_id: widgetId, type: widgetType, config: config}).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (!res.success) {
          this.toastService.showToast(res.errors[0], 'danger');
        }
        return res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("update widgets err", err.message);
        return of(false);
      })
    )
  }

  removeWidgetFromDashboard(widgetId: string) {
    return this.http.delete(`/api/account/widget/${widgetId}`).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          this.toastService.showToast('Widget removed succesfully', 'success');
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
        }
        return res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("delete widgets err", err.message);
        return of(false);
      })
    )
  }

  updateWidgetPositions(positionInfo: any) {
    return this.http.put('/api/account/dashboard/updatePosition', positionInfo).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          this.toastService.showToast('Dashboard layout updated successfully', 'success');
        } else {
          this.toastService.showToast(res.errors[0], 'danger')
        }
        return res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("update widget positions err", err.message);
        return of(false);
      })
    )
  }

  toggleEditLayout() {
    this.editLayoutSubject.next(!this.editLayoutSubject.value);
  }
}

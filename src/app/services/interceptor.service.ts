
import {map, catchError} from 'rxjs/operators';
import {throwError as observableThrowError,  Observable , BehaviorSubject, EMPTY} from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthResp } from '../models/auth-resp';
import { APP_SERVER_OPTIONS, REPORT_GEN_SERVER_OPTIONS, BOSCH_SERVER_OPTIONS } from '../config';
import { ToastService } from './toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService,
              private toastService: ToastService,
              private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('amazonaws.com') != -1 || req.url.indexOf('assets') != -1 || req.url.indexOf('jsonbase') != -1) {
      return next.handle(req).pipe(
      catchError((err: any) => {
        console.log("Profile pic err", err);
        return observableThrowError(err)
      }))
    }

    const HOST = req.url.indexOf('/account/report/generate') == -1 ? APP_SERVER_OPTIONS.host : (REPORT_GEN_SERVER_OPTIONS.host);

      const headersToSet = {
        'Authorization': `Bearer ${ this.auth.getAuthToken() }`,
      }
      req = req.clone({
        setHeaders: headersToSet,
        url: HOST + req.url
      });
      console.log("INTERCEPTOR URL", req.url);
      return next.handle(req)
        .pipe(
          catchError(err => {
            if (err instanceof HttpErrorResponse) {
              console.log("err", err);
              if (err.status == 0) {
                this.toastService.showToast('Could not reach Server. Try again!', 'danger');
              } else if (err.status === 401) {
                this.auth.logoutUI();
                return this.refreshAuthTokenAndRetry(req, next)
              }
            }
            return observableThrowError(err);
      }));
  }

  refreshAuthTokenAndRetry(req, next) {
    return this.auth.refreshAuthToken().pipe(
      map((res: AuthResp) => {
        if (res.success) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${ res.access_token }`
            }
          });
          return next.handle(req)
        } else {
          this.auth.logoutUI();
          return EMPTY;
        }
      }))
  }
}

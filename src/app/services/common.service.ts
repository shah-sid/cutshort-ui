
import {map, tap, catchError} from 'rxjs/operators';
import { AuthResp } from '../models/auth-resp';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import { BehaviorSubject ,  Observable, EMPTY } from 'rxjs';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import 'rxjs/add/observable/throw';

declare const Android: any;

@Injectable()
export class CommonService {
  private appUserAgentSubject = new BehaviorSubject(null);
  appUserAgent$: Observable<string> = this.appUserAgentSubject.asObservable();
  constructor(private http: HttpClient,
              private toastService: ToastService
  ) {
    console.log("Nav", window.navigator);
    this.getUserAgent();
  }

  getpingNetwork() {
    /*return this.http.get('https://www.google.com')
    tap(console.log),
    .map((response) => {
      console.log("response", response.responseCode);
      return response;
    })*/
//    const xhr = new XMLHttpRequest();
//     const filedata = '';
//     xhr.open("GET", 'https://pingme.iosense.io');
//     xhr.onload = function() {
//       console.log("ping response", xhr.status);
//     }
//     xhr.onloadend = function() {
//       console.log("ping response", xhr.status);
//     }
//     xhr.send();
//     return filedata;
  }

  validateUserCredentials(credentials) {
    return this.http.get('/api/validateUser/' + credentials.email + '/' + credentials.token).pipe(
      tap(console.log))
  }


  verifyUser(userDetails) {
    return this.http.post('/api/updateUser ', userDetails).pipe(
      tap(console.log))
  }

  verifyEmail(email, token) {
    return this.http.get('/api/tokenVerification/' + email + '/' + token).pipe(
      tap(console.log))
      // .map((res: AuthResp) => {
      //   return res.success;
      // }, err => {
      //   console.log('Verification Err', err);
      //   return false;
      // })
  }

  registerUser(userDetails) {
    return this.http.post('/api/signup', userDetails).pipe(
      tap(console.log))
  }

  getUserAgent() {
    if (window.navigator.userAgent) {
      this.appUserAgentSubject.next(window.navigator.userAgent);
    }
  }

  submitTicket(ticketDetails) {
    return this.http.put('/api/account/profile/raiseTicket', ticketDetails).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          this.toastService.showToast('Issue Registered Successfully. Our service executive will get in touch with you soon.', 'success');
          return true;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return false;
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.showToast('Something went wrong. Try Again!', 'danger');
        return Observable.throw(err.message);
      }))
  }

  requestOTP(recipientConfig) {
    return this.http.put('/api/account/devices/generateOTP', recipientConfig).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        return res.success;
      }, err => {
        console.log("OTP err", err);
        return false;
      }))
  }

  verifyOTP(otpConfig) {
    return this.http.put('/api/account/devices/verifyOTP', otpConfig).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          this.toastService.showToast('OTP verification Successful!', 'success');
          return res.device;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return null;
        }
      }, err => {
        console.log('Otp verify err', err);
        this.toastService.showToast('Something went wrong. Try Again!', 'danger');
        return null;
      }))
  }

  formatDeviceData(data): any {
    const formattedData = {};
    data.forEach(dataPt => {
      formattedData[dataPt.tag] = dataPt.value;
    });
    console.log('Formatted Data', formattedData);
    return formattedData;
  }

  checkAppVersion (ver) {
    return this.http.get('/api/version/' + ver).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success == true)  {
          return ver;
        } else {
          localStorage.setItem('appVer', JSON.stringify(res.data));
          location.reload();
          return "-1";
        }
      }))
  }

  getBLOBData(URL) {
    const xhr = new XMLHttpRequest();
    let filedata = '';

    xhr.open("GET", URL);
    xhr.onload = function() {
      filedata += this.response;
    }

    xhr.onloadend = function() {
      Android.getData(filedata);
      filedata += this.response;
    }
    xhr.send();
    return filedata;
  }

  getVTSDataCount() {
    return this.http.get('/api/account/getTotalUnits').pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success) {
          return res.data;
        } else {
          this.toastService.showToast(res.errors[0], 'danger')
          return null;
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.toastService.showToast('Something went wrong. Try again!', 'danger');
        return Observable.throw(err.message);
      }))
  }

  getGeoNames() {
    return this.http.get('/assets/data/geonames_ind.json').pipe(
                      tap(console.log),
                      map(geoNames => {
                        return geoNames
                      }));
  }
}

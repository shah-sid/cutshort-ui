
import { map, tap, catchError } from 'rxjs/operators';
import { AuthResp } from '../models/auth-resp';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, EMPTY, throwError } from 'rxjs';
import { Device } from '../models/device';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';
import * as _ from 'lodash';
import 'rxjs/add/observable/throw';

@Injectable({
  providedIn: "root"
})
export class DevicesService {
  private subject = new BehaviorSubject(null);
  devices$: Observable<Device[]> = this.subject.asObservable();
  private fenceSubject = new BehaviorSubject(null);
  fences$: Observable<any[]> = this.fenceSubject.asObservable();

  private networkStrengthSubject = new BehaviorSubject(null);
  networkStrengths$: Observable<any> = this.networkStrengthSubject.asObservable();

  deviceCount: number;
  constructor(private http: HttpClient,
              private auth: AuthService,
              private toastService: ToastService) { }

  checkDevice(device) {
    return this.http.post('/api/account/devices/checkDevice', device).pipe(
      tap(console.log))
  }

  getDevices() {
    // this.subject.next(null);
    return this.http.get('/api/account/devices').pipe(
      tap(console.log),
      tap(res => this.subject.next(res)))
  }
  addDevice(deviceToAdd) {
    return this.http.post('/api/account/devices', deviceToAdd).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          const devices = this.subject.value;
          devices.push(res.device)
          this.subject.next(_.cloneDeep(devices));
          this.toastService.showToast('Device Added Successfully!', 'success');
          return true;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return false;
        }
      }, err => {
          this.toastService.showToast('Something went wrong. Try Again!', 'danger');
          return false;
      }))
  }

  updateDeviceConfig(device) {
    return this.http.post('/api/account/devices/update', device).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          const devices = this.subject.value;
          let deviceToEdit = _.find(devices, {devID: device.devID })
          deviceToEdit = device;
          this.toastService.showToast('Device Updated Successfully!', 'success');
          this.subject.next(_.cloneDeep(devices));
          return true;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return false;
        }
      }, err => {
          this.toastService.showToast('Something went wrong. Try Again!', 'danger');
          return false;
      }))
  }

  deleteDevice(_id) {
    const devices = this.subject.value;
    const deviceIndex = _.findIndex(devices, function(device) { return device._id === _id })
    const deletedDevice = _.remove(devices, function(device) { return device._id === _id })
    console.log('Deleted Device', deletedDevice);

    this.subject.next(_.cloneDeep(devices));

    return this.http.delete('/api/account/devices/' + _id).pipe(
      tap(console.log),
      tap((res: AuthResp) => {
        if (res.success === true) {
          this.toastService.showToast('Device Deleted Successfully', 'success');
        } else {
          devices.splice(deviceIndex, 0, deletedDevice[0]);
          this.toastService.showToast(res.errors[0], 'danger');
          this.subject.next(_.cloneDeep(devices));
        }
      }, err => {
        this.toastService.showToast('Something went wrong. Try Again!', 'danger');
          devices.splice(deviceIndex, 0, deletedDevice[0]);
          this.subject.next(_.cloneDeep(devices));
      }))
  }

  getLastDP(devID, sensors) {
    return this.http.put('/api/account/deviceData/lastDP', { devID: devID, sensors: sensors }).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          return res.data;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return null;
        }
      }, err => {
        this.toastService.showToast('Something Went Wrong!', 'danger');
        return null;
      }))
  }

  getData(devID, sensor, sTime, eTime) {
    return this.http.get('/api/account/deviceData/getData/' + devID + '/' + sensor + '/' + sTime + '/' + eTime).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          return _.sortBy(res.data[0], function(dataPt) { return Date.parse(dataPt.time) });
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return null;
        }
      }))
  }

  getAllData(devID, sTime, eTime) {
    return this.http.get('/api/account/deviceData/getSnappedPoints/' + devID + '/' + sTime + '/' + eTime).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          return _.sortBy(res.data, function(dataPt) { return Date.parse(dataPt.time) });
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return null;
        }
      }))
  }

  getWaterLevelDelta(devID, sensor, eTime, duration) {
    return this.http.get('/api/account/getWaterLevelDelta/' + devID + '/' + sensor + '/' + eTime + '/' + duration).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          // return _.sortBy(res.data[0], function(dataPt) { return Date.parse(dataPt.time) });
          return res.data
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return null;
        }
      }))
  }

  getHourlyFlow(devID, sensor, eTime, duration) {
    return this.http.get('/api/account/getHourlyFlow/' + devID + '/' + sensor + '/' + eTime + '/' + duration).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          // return _.sortBy(res.data[0], function(dataPt) { return Date.parse(dataPt.time) });
          return res.data
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return null;
        }
      }))
  }

  getDeviceNetworks() {
    return this.http.get('/api/account/deviceData/lastDataPoints').pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          this.networkStrengthSubject.next(res.data);
          return true;
        } else {
          return false;
        }
      }, err => {
        return false;
      }))
  }

  toggleStar(devID, star) {
    const devices = this.subject.value;

    _.find(devices, {devID: devID}).star = star;
    this.subject.next(devices);

    return this.http.put('/api/account/devices/updateStar' + '/' + devID + '/' + star, {}).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          return true;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          _.find(devices, {devID: devID}).star = !star;
          this.subject.next(devices);
          return false;
        }
      }, err => {
          this.toastService.showToast('Something went wrong!', 'danger');
          _.find(devices, {devID: devID}).star = !star;
          this.subject.next(devices);
          return false;
      }))
  }

  setListView(view) {
    const user = this.auth.getUserData();
    user.userDetail.pageView.devices = view;
    localStorage.setItem('userData', JSON.stringify(user));

    return this.http.put('/api/account/profile/updatePageView', { entity: "devices", value: view }).pipe(
      tap(console.log))
  }

  toggleSort() {
    const user = this.auth.getUserData();
    user.userDetail.sortOrder.devices = user.userDetail.sortOrder.devices == 1 ? 0 : 1;
    localStorage.setItem('userData', JSON.stringify(user));
    this.subject.next(_.cloneDeep(this.subject.value));
  }

  // automation services

  toggleAutomationSensor(toggleData) {
    return this.http.put('/api/account/device/control', toggleData).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        return res.success;
      }, err => {
        console.log(err);
        return false;
      }))
  }

  updateAutomationState(toggleData) {
    return this.http.put('/api/account/schedule/saveState', toggleData).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        return res.success;
      }),
      catchError((err: HttpErrorResponse) => {
        console.log("Update State err", err.message);
        return throwError(err.message);
      }))
  }

  addFence(fenceObj) {
    return this.http.post('/api/account/device/geofence', fenceObj).pipe(
    tap(console.log),
    map((res: AuthResp) => {
      if (res.success === true) {
        this.toastService.showToast('Fence Added Successfully', 'success');
        return true;
      } else {
        this.toastService.showToast(res.errors[0], 'danger');
        return false;
      }
    }, err => {
        this.toastService.showToast('Something went wrong!', 'danger');
        return false;
    }))
  }

  getFences(devID) {
    return this.http.get('/api/account/device/geofence/' + devID).pipe(
    tap(console.log),
    map((res: AuthResp) => {
      if (res.success === true) {
        console.log('res', res.data);
        return res.data;
      } else {
        this.toastService.showToast(res.errors[0], 'danger');
        return false;
      }
    }, err => {
        this.toastService.showToast('Something went wrong!', 'danger');
        return false;
    }))
  }

  removeFence(fence) {
    return this.http.post('/api/account/device/geofence/remove', {
      devID: fence.devID,
      geofenceName: fence.name
    }).pipe(
    tap(console.log),
    map(res => {
      console.log('res', res);
      if (res.success === true) {
        this.toastService.showToast('Fence Removed successfully', 'success');
        return true;
      } else {
        this.toastService.showToast(res.errors[0], 'danger');
        return false;
      }
    }, err => {
        this.toastService.showToast('Something went wrong!', 'danger');
        return false;
    }))
  }
}

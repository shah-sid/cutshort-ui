
import {map, tap, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResp } from '../models/auth-resp';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';
import { Subject, EMPTY } from 'rxjs';
import {Md5} from 'ts-md5/dist/md5';

@Injectable()
export class ProfileService {
  profileUpdatedEvent = new Subject();

  constructor(private http: HttpClient,
              private auth: AuthService,
              private toastService: ToastService
  ) { }

  updateProfile(profileChanges) {
    return this.http.put('/api/account/profile/updateUserDetails', profileChanges).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success == true) {
          this.toastService.showToast('Profile Updated Successfully!', 'success');
          const userData = this.auth.getUserData();
          userData.userDetail.personalDetails.name.first = profileChanges.firstname;
          userData.userDetail.personalDetails.name.last = profileChanges.lastname;
          userData.userDetail.personalDetails.gender = profileChanges.gender;
          localStorage.setItem('userData', JSON.stringify(userData));
          this.profileUpdatedEvent.next(profileChanges);
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

  convertdataURIToBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
    return new Blob([new Uint8Array(array)], {
        type: 'image/jpeg'
    });
  }

  uploadProfilePicture(data) {
    const user = this.auth.getUserData();
    let filename = Md5.hashStr(user.email + user.organisation.orgID);
    filename += '.jpeg'
    return this.http.put('/api/account/profile/getUrl', {filename: filename}).pipe(
      tap(console.log),
      switchMap((res: AuthResp) => {
        if (res.success == true) {
          console.log("Signed Url", res);
          this.updateProfilePicURL(res.data.substring(0, res.data.indexOf('?'))).subscribe();
          return this.http.put(res.data, this.convertdataURIToBlob(data), {headers: {'Content-Type': 'image/jpeg'}}).pipe(
            tap(console.log))
        } else {
          return EMPTY;
        }
      }))
  }

  updateProfilePicURL(url) {
    url = "https://s3-ap-southeast-1.amazonaws.com/faclonpics/" + url.substring(url.indexOf("amazonaws.com/") + 14)
    return this.http.put("/api/account/profile/updateProfilePic", {url: url}).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success == true) {
          const user = this.auth.getUserData();
          user.userDetail.personalDetails.profilePicUrl = url;
          localStorage.setItem('userData', JSON.stringify(user));
          this.toastService.showToast('Profile Picture Updated Successfully', "success");
          setTimeout(() => {
            this.profileUpdatedEvent.next();
          }, 1000)
          return true;
        } else {
          this.toastService.showToast(res.errors[0], "danger");
          return false;
        }
      }, err => {
        console.log('Profile pic Err', err);
        this.toastService.showToast('Something went wrong. Try again', 'danger');
        return false;
      }))
  }

  sendPasswordResetLink(email) {
    return this.http.post('/api/login/forgot', {email: email}).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success == false) {
          this.toastService.showToast(res.errors[0], 'danger');
          return false;
        } else {
          return true;
        }
      }, err => {
        console.log("Forgot Pass err", err);
        this.toastService.showToast("Something went wrong. Try again.", "danger");
        return false;
      }))
  }

  setNewPassword(email, token, password, confirmPassword) {
    return this.http.put('/api/reset/' + email + '/' + token, {password: password, confirm: confirmPassword}).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success == true) {
          this.toastService.showToast('Password Reset Successfully', 'success');
          return true;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return false;
        }
      }, err => {
        console.log("Set new pass err", err);
        this.toastService.showToast('Something went wrong. Try again!', 'danger');
        return false;
      }))
  }

  changeAccountPassword(currentPassword, newPassword, confirmNewPassword) {
    const passwordData = {
      current: currentPassword,
      password: newPassword,
      password_verify: confirmNewPassword
    }
    return this.http.post("/api/account/profile/resetPassword", passwordData).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success == true) {
          this.toastService.showToast('Password Changed Successfully!', 'success');
          return true;
        } else {
          this.toastService.showToast(res.errors[0], 'danger');
          return false;
        }
      }, err => {
        console.log("Change password err", err);
        this.toastService.showToast('Something went wrong. Try again!', 'danger');
        return false;
      }))
  }
}

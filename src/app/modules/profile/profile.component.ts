import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserData } from '../../models/user-data';
import { ProfileService } from '../../services/profile.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidators } from '../../validators/password.validators';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserData;
  showChangePassword = false;
  showUserDetails = true;
  isChangePasswordLoading = false;
  genders = [{
    value: 'female',
    viewValue: 'Female'
  }, {
    value: 'male',
    viewValue: 'Male'
  }, {
    value: 'others',
    viewValue: 'Others'
  }]

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, PasswordValidators.requiredLength]),
    verifyNewPassword: new FormControl('', [Validators.required, PasswordValidators.requiredLength]),
  })
  constructor(private auth: AuthService,
              private profileService: ProfileService,
              private router: Router
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(userData => {
      this.user = userData;
    });
  }

  updateProfile() {

    const infoToUpdate = {
      firstname: this.user.userDetail.personalDetails.name.first,
      lastname: this.user.userDetail.personalDetails.name.last,
      gender: this.user.userDetail.personalDetails.gender
    }
    console.log('In update profile', infoToUpdate);

    this.profileService.updateProfile(infoToUpdate)
      .subscribe(res => {
        if (res === true) {
          this.router.navigate(['/overview']);
        }
      })
  }

  showPasswordInput() {
    this.showChangePassword = true;
    this.showUserDetails = false;
  }

  viewUserDetails() {
    this.showChangePassword = false;
    this.showUserDetails = true;
  }

  matchPasswords(newPassData) {
    if (newPassData.newPassword != '' &&
      newPassData.newPassword != undefined &&
      newPassData.verifyNewPassword != '' &&
      newPassData.verifyNewPassword != undefined) {
        this.changePasswordForm.clearValidators();
        if (newPassData.newPassword != newPassData.verifyNewPassword) {
          this.changePasswordForm.get('verifyNewPassword').setErrors({
            unmatched: true
          })
        }
      }
  }

  changeAccountPassword(newPassData) {
    this.isChangePasswordLoading = true;
    this.profileService.changeAccountPassword(newPassData.currentPassword,
                                              newPassData.newPassword,
                                              newPassData.verifyNewPassword
    )
    .subscribe(res => {
      this.isChangePasswordLoading = false;
      if (res == true) {
        this.viewUserDetails();
      }
    })
  }

}

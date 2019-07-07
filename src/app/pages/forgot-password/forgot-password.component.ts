import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { FormControl, Validators, NgForm, FormGroup } from '@angular/forms';
import { Observable ,  Subscription } from 'rxjs';
import { UserOrganisation } from '../../models/user-org';
import { ActivatedRoute, Router } from '@angular/router';
import { UserOrgService } from '../../services/user-org.service';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { PasswordValidators } from '../../validators/password.validators';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  private sidebarVisible: boolean;
  private nativeElement: Node;
  userOrg$: Observable<UserOrganisation>;
  showEmailInput = true;
  showResetResponse = false;
  showPasswordInput = false;
  isResetLoading = false;
  initSubscription: Subscription
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  params: any;

  resetPasswordForm = new FormGroup({
    email: new FormControl('', []),
    password: new FormControl('', [Validators.required, PasswordValidators.requiredLength]),
    verifypassword: new FormControl('', [Validators.required, PasswordValidators.requiredLength]),
  })

  constructor(private element: ElementRef,
              private route: ActivatedRoute,
              private router: Router,
              private userOrgService: UserOrgService,
              private profileService: ProfileService,
              public auth: AuthService) {
      this.nativeElement = element.nativeElement;
      this.sidebarVisible = false;
    }

  ngOnInit() {
    this.userOrg$ = this.userOrgService.organisation$;
    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');
    body.classList.add('off-canvas-sidebar');
    const card = document.getElementsByClassName('card')[0];
    this.initSubscription = this.route.queryParams.subscribe(params => {
      console.log("Params", params);
      if (params.email != undefined && params.token != undefined) {
        this.showPasswordInput = true;
        this.showEmailInput = false;
        this.showResetResponse = false;
        this.params = params;
        this.resetPasswordForm.get('email').disable();
        this.resetPasswordForm.get('email').patchValue(params.email);
      }
    })
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');
    body.classList.remove('off-canvas-sidebar');
    this.initSubscription.unsubscribe();
  }

  sendPasswordResetLink(email) {
    this.isResetLoading = true;
    this.profileService.sendPasswordResetLink(email)
      .subscribe(res => {
        this.isResetLoading = false;
        if (res) {
          this.showEmailInput = false;
          this.showResetResponse = true;
        }
      })
  }

  matchPasswords(newPassData) {
    if (newPassData.password != '' &&
      newPassData.password != undefined &&
      newPassData.verifypassword != '' &&
      newPassData.verifypassword != undefined) {
        this.resetPasswordForm.clearValidators();
        if (newPassData.password != newPassData.verifypassword) {
          this.resetPasswordForm.get('verifypassword').setErrors({
            unmatched: true
          })
        }
      }
  }

  setNewPassword(newPassData) {
    console.log("New Pass Data", newPassData);
    this.profileService.setNewPassword(this.params.email, this.params.token, newPassData.password, newPassData.verifypassword)
      .subscribe(res => {
        if (res == true) {
          this.router.navigate(["/login"]);
        }
      })
  }

}

import { ActivatedRoute, Router } from "@angular/router";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";

import { AuthService } from "../../services/auth.service";
import { Location } from "@angular/common";
import { NgForm } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { Observable, Subscription } from "rxjs";
import { UserOrgService } from "../../services/user-org.service";
import { UserOrganisation } from "../../models/user-org";

declare var $: any;

@Component({
  selector: "app-login-cmp",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  private sidebarVisible: boolean;
  private nativeElement: Node;
  isLoginLoading = false;
  userOrg$: Observable<UserOrganisation>;
  userAgent: any;
  showPassword = false;
  initSubscription: Subscription;
  orgHost = "";

  @ViewChild("f") loginForm: NgForm;

  constructor(
    private element: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private userOrgService: UserOrgService,
    private spinner: NgxSpinnerService,
    public auth: AuthService,
    private location: Location
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    const angularRoute = this.location.path();
    const url = window.location.href;
    const domainAndApp = url.replace(angularRoute, "");
    this.orgHost = domainAndApp.substring(domainAndApp.indexOf("://") + 3);
    console.log(
      "Location",
      domainAndApp.substring(domainAndApp.indexOf("://") + 3)
    );

    this.userOrg$ = this.userOrgService.organisation$;
    if (this.auth.isLoggedIn()) {
      this.spinner.show();
      this.router.navigate(["/custom-dashboards"]);
    } else {
      this.spinner.hide();
    }
    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");
    const card = document.getElementsByClassName("card")[0];
    setTimeout(() => {
      // after 1000 ms we add the class animated to the login/register card
      card.classList.remove("card-hidden");
    }, 350);

    setTimeout(() => {
      console.log("this.userAgent", this.userAgent);
      if (this.userAgent && this.userAgent.os == "mac") {
        this.loginForm.controls["username"].setValue("");
        this.loginForm.controls["password"].setValue("");
      }
    }, 1500);
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }

  parseUrl(url) {
    const returnUrl = {
      path: "",
      queryParams: {}
    };
    returnUrl.path = url.trim().split("?")[0];

    const params = url.trim().split("?")[1];
    if (params.indexOf("&") == -1) {
      returnUrl.queryParams[params.split("=")[0]] = params.split("=")[1];
      return returnUrl;
    } else {
      const multiParams = params.split("&");
      multiParams.forEach(param => {
        returnUrl.queryParams[param.split("=")[0]] = param.split("=")[1];
      });
      return returnUrl;
    }
  }

  signIn(credentials) {
    console.log("Login creds", credentials);
    this.isLoginLoading = true;
    this.auth.signIn(credentials).subscribe((res: boolean) => {
      this.isLoginLoading = false;
      if (res === true) {
        const returnUrl = this.route.snapshot.queryParamMap.get("returnUrl");
        if (!returnUrl || returnUrl.indexOf("?") == -1) {
          this.router.navigate(["/custom-dashboards"]);
        } else {
          const parsedUrl = this.parseUrl(returnUrl);
          this.router.navigate([parsedUrl.path], {
            queryParams: parsedUrl.queryParams
          });
        }
      }
    }, console.error);
  }
}

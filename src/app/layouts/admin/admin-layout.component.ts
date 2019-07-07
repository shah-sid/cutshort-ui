import { filter } from "rxjs/operators";

import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Location, PopStateEvent } from "@angular/common";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { CommonService } from "../../services/common.service";
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { NgxSpinnerService } from "ngx-spinner";
import { PubSubService } from "../../services/pub-sub.service";
import { Subscription } from "rxjs";
import { UserOrgService } from "../../services/user-org.service";
import { Md5 } from 'ts-md5/dist/md5';
import { IMqttMessage } from "ngx-mqtt";
import { ToastService } from "app/services/toast.service";
import PerfectScrollbar from "perfect-scrollbar";

declare const $: any;
const VAPID_PUBLIC =
  "BAfKPgCYWKDn8rwZHWhtY1J2FBIqeQ8vH-G330EAXZbGNrikOjxeeEzDgDthWkCxA7HSdTvCkPgo-yX8S7_ADiI";

@Component({
  selector: "app-layout",
  templateUrl: "./admin-layout.component.html"
})
export class AdminLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  userOrganisation$;
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  url: string;
  location: Location;
  showPageLoader = false;
  notifSubscription: Subscription;

  @ViewChild("sidebar") sidebar: any;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;
  constructor(
    private router: Router,
    private auth: AuthService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private toastService: ToastService,
    private userOrgService: UserOrgService,
    private pubsub: PubSubService,
    location: Location
  ) {
    this.location = location;
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.spinner.show();
      } else if (event instanceof NavigationEnd) {
        this.spinner.hide();
      }
    });

    //   if (this.swPush.isEnabled) {
    //     this.swPush
    //       .requestSubscription({
    //         serverPublicKey: VAPID_PUBLIC
    //       })
    //       .then(subscription => {
    //         console.log('Push Notif sub', subscription);
    //         this.notificationsService.savePushNotificationSubcriptions(subscription).subscribe();
    //       })
    //       .catch(console.error);
    //   }
  }
  ngOnInit() {
    const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
    const elemSidebar = <HTMLElement>(
      document.querySelector(".sidebar .sidebar-wrapper")
    );
    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else {
          window.scrollTo(0, 0);
        }
      }
    });
    this._router = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;
      });
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
    }
    this._router = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.navbar.sidebarClose();
      });
  }

  subscribeToNotifications() {
    const user = this.auth.getUserData();
   
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  ngOnDestroy() {
  }

  public isMap() {
    if (
      this.location.prepareExternalUrl(this.location.path()) ===
      "/maps/fullscreen"
    ) {
      return true;
    } else {
      return false;
    }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }
}

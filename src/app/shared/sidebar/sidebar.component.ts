import { Component, OnInit } from "@angular/core";
import PerfectScrollbar from "perfect-scrollbar";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { ProfileService } from "app/services/profile.service";

declare const $: any;

// Metadata
export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  ab: string;
  type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "/custom-dashboards",
    title: "Custom dashboard",
    type: "link",
    icontype: "person"
  }
];

@Component({
  selector: "app-sidebar-cmp",
  templateUrl: "sidebar.component.html"
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  orgLogo = "";
  appName = "";
  profilePicture = "";
  userData;

  constructor(public auth: AuthService, private router: Router, private profileService: ProfileService) {
    this.userData = this.auth.getUserData();
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  ngOnInit() {
	this.menuItems = ROUTES.filter(menuItem => menuItem);
	console.log(this.menuItems);
    this.getOrgNameAndLogo();
    setTimeout(() => {
      this.profilePicture = this.auth.getProfilePicture();
    }, 1000);

    this.profileService.profileUpdatedEvent.subscribe(() => {
      console.log("Reload image in sidebar");
      this.profilePicture = this.auth.getProfilePicture();
    });
  }

  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );
      const ps = new PerfectScrollbar(elemSidebar, {
        wheelSpeed: 2,
        suppressScrollX: true
      });
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

  signOut() {
    this.auth.logout().subscribe(success => {
      if (success) {
        this.router.navigate(["/login"]);
      }
    });
  }

  hideCollapse() {
    $("#collapseExample").collapse("hide");
  }

  getOrgNameAndLogo() {
    const userData = this.auth.getUserData();
    }

}

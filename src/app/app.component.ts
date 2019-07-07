import { Component, OnInit } from "@angular/core";
import { UserOrgService } from "./services/user-org.service";
import { ConnectionService } from "ng-connection-service";
import { Observable } from "rxjs";
import { UserOrganisation } from "./models/user-org";
import { AuthService } from "./services/auth.service";
import { environment } from "../environments/environment.prod";

const LOGS_WHITELIST = [
  "j4inam@gmail.com",
  "base@faclon.com",
  "inderbilkhu95@gmail.com",
  "harshit13mehta@gmail.com",
  "utkarsh@faclon.com"
];

@Component({
  selector: "app-my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  isConnected = true;
  isSuspended = false;
  organisation$: Observable<UserOrganisation>;
  constructor(
    private userOrgService: UserOrgService,
    private connection: ConnectionService,
    private auth: AuthService
  ) {
    this.connection.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
    });
  }

  ngOnInit() {
    const logFn = console.log;
    const user = this.auth.getUserData();
    if (
      user &&
      LOGS_WHITELIST.indexOf(user.email) == -1 &&
      environment.production
    ) {
      console.log = function() {};
    } else {
      console.log = logFn;
    }
    const self = this;
    this.userOrgService.organisation$.subscribe(org => {
      if (org) {
        console.log("User org", org);
        this.isSuspended = org.status.toLowerCase() == "suspended";
        if (this.isSuspended) {
          localStorage.clear();
        }
      }
    });
    setTimeout(function() {
      self.userOrgService.getOrgDetailsByHostname().subscribe();
    }, 1000);
  }

  isMobileDisplay() {
    return window.screen.width <= 576;
  }
}

import { map, tap, catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { UserData } from "../models/user-data";
import { BehaviorSubject, Observable, EMPTY } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastService } from "./toast.service";
import { AuthResp } from "../models/auth-resp";
import { PubSubService } from "./pub-sub.service";
import "rxjs/add/observable/throw";

export const GUEST: UserData = {
  id: null
};

@Injectable()
export class AuthService {
  private subject = new BehaviorSubject(GUEST);
  user$: Observable<UserData> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
    private pubsub: PubSubService
  ) {}

  signIn(credentials): Observable<any> {
    return this.http.post("/api/auth/login", credentials).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        if (res.success === true) {
          localStorage.setItem("authToken", res.access_token);
          localStorage.setItem("refreshToken", res.refresh_token);
          localStorage.setItem("userData", JSON.stringify(res.user));
          localStorage.setItem("appVer", JSON.stringify(res.version));
          console.log("App Version: ", res.version);
        //   this.pubsub.connectMQTT();
          this.toastService.showToast(
            "Welcome, " + res.user.firstName,
            "success"
          );
          this.subject.next(res.user);
          return true;
        } else {
          this.toastService.showToast(res.errors[0], "danger");
          return false;
        }
      })
    );
  }

  logout() {
    return this.http.post("/api/account/logout", null).pipe(
      map((response: AuthResp) => {
        this.pubsub.disconnectMQTT();
        localStorage.clear();
        console.log("Logout Resp", response);
        return response.success;
      }),
      catchError((err: HttpErrorResponse) => {
        this.pubsub.disconnectMQTT();
        localStorage.clear();
        console.log("Logout Resp", err);
        return Observable.throw(err.message);
      })
    );
  }

  logoutUI() {
    this.pubsub.disconnectMQTT();
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  isLoggedIn(): boolean {
    if (this.getAuthToken() != null && this.getAuthToken() != undefined) {
      this.subject.next(this.getUserData());
      return true;
    }
    localStorage.clear();
    return false;
  }

  getProfilePicture() {
    return "https://s3-ap-southeast-1.amazonaws.com/faclonpics/male.jpg";
  }

  updateFCMToken(token) {
    const tokenData = {
      userID: this.getUserData().id,
      clientId: this.getUserData().clientId,
      fcmToken: token
    };

    return this.http.put("/api/account/profile/updateToken", tokenData).pipe(
      tap(console.log),
      map((res: AuthResp) => {
        return res.success;
      })
    );
  }

  getAuthToken(): string {
    return localStorage.getItem("authToken");
  }

  getCurrentAppVersion(): string {
    return localStorage.getItem("appVer");
  }

  getRefreshToken(): string {
    return localStorage.getItem("refreshToken");
  }

  getUserData(): any {
    return JSON.parse(localStorage.getItem("userData"));
  }

  getUserEntities(): any {
    return this.getUserData().entitySet || [];
  }

  refreshAuthToken() {
    const token = {
      refresh_token: this.getRefreshToken()
    };
    console.log("refresh_token", token);
    return this.http.post("/api/auth", token);
  }

  hasPermission(entity, action) {
    return this.http
      .get("/api/admin/permissionCheck/" + entity + "/" + action)
      .pipe(tap(res => console.log("Permission for ", entity, action, res)));
  }

  getCredentials(): Observable<string> {
    return this.http.get("/api/account/profile/credentials").pipe(
      tap(console.log),
      map(
        (res: AuthResp) => {
          if (res.success == true) {
            return res.data;
          } else {
            return res.errors[0];
          }
        },
        err => {
          console.log(err);
          return "";
        }
      )
    );
  }
}

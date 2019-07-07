
import {map, tap} from 'rxjs/operators';
import { DOCUMENT, Meta, Title } from '@angular/platform-browser';
import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { UserOrganisation } from '../models/user-org';
import { HttpClient } from '@angular/common/http';
import { AuthResp } from '../models/auth-resp';

@Injectable()
export class UserOrgService {
  userOrg: UserOrganisation = {
    name: '',
    url: '',
    primaryColor: '#2f4050',
    poweredByText: '',
    iconUrl: '',
    status: 'active'
  }
  private orgSubject = new BehaviorSubject(this.userOrg); // Do Not remove while whitelabelling
  organisation$ = this.orgSubject.asObservable();

  constructor(private titleService: Title,
              private http: HttpClient,
              private metaService: Meta,
              @Inject(DOCUMENT) private _document: HTMLDocument
  ) { }

    getOrgDetailsByHostname () {
      return this.http.get('/api/details').pipe(
        tap(console.log),
        map((res: AuthResp) => {
            if (res.success == true) {
              this.userOrg = {
                name: res.data.orgName,
                url: 'http://' + res.data.url,
                primaryColor: '#2f4050',
                poweredByText: 'powered by ' + res.data.orgName,
                iconUrl: res.data.iconUrl,
                status: res.data.status || 'active'
            }

            if (res.data.favIconUrl && res.data.favIconUrl != "") {
              this._document.getElementById('appFavicon').setAttribute('href', res.data.favIconUrl);
              this._document.getElementById('appAppleIcon').setAttribute('href', res.data.favIconUrl);
              console.log('Favicon', this._document.getElementById('appFavicon'));
            }

            this.orgSubject.next(this.userOrg);
            this.metaService.updateTag({ content: this.userOrg.primaryColor }, "name='theme-color'");
            this.metaService.updateTag({ content: this.userOrg.primaryColor }, "name='msapplication-navbutton-color'");
            this.metaService.updateTag({ content: this.userOrg.iconUrl }, "name='og:image'");
            this.titleService.setTitle(this.userOrg.name.split(' ')[0] + ' IO Sense');
            return true;
          } else {
            console.log('Org Load err', res.errors[0]);
            return false
          }
        }, err => {
          console.log("Load org err", err);
          return false;
        }));
    }

}

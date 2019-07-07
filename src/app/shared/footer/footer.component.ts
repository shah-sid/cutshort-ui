import { Component, Input, OnInit } from '@angular/core';
import { UserOrganisation } from '../../models/user-org';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';

@Component({
    selector: 'app-footer-cmp',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.scss']
})

export class FooterComponent implements OnInit {
    @Input('user-org') organisation: UserOrganisation;
    @Input('showBadge') showBadge: boolean;
    test: Date = new Date();
    isDemoUser: boolean;
    orgHost = "";

    constructor(private auth: AuthService, private location: Location) {
        if (this.showBadge == true) {
            this.isDemoUser = this.auth.getUserData().isDemoUser
        }
    }

    ngOnInit() {
        const angularRoute = this.location.path();
        const url = window.location.href;
        const domainAndApp = url.replace(angularRoute, '');
        this.orgHost = domainAndApp.substring(domainAndApp.indexOf('://') + 3)
        console.log('Location', domainAndApp.substring(domainAndApp.indexOf('://') + 3));
    }
}

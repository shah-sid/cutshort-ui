import { Component, OnInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { UserOrgService } from '../../services/user-org.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  userOrganisation$;
  private toggleButton: any;
  private sidebarVisible: boolean;
  currentUrl = '/register';
  orgHost = "";

  constructor(private element: ElementRef,
              private userOrgService: UserOrgService,
              private router: Router,
              private location: Location) {
      this.sidebarVisible = false;
      router.events.subscribe(event => {
          if (event instanceof NavigationEnd) {
              this.currentUrl = event.url;
          }
    })
  }
  ngOnInit() {
    const self = this;
    const angularRoute = this.location.path();
    const url = window.location.href;
    const domainAndApp = url.replace(angularRoute, '');
    this.orgHost = domainAndApp.substring(domainAndApp.indexOf('://') + 3)
    console.log('Location', domainAndApp.substring(domainAndApp.indexOf('://') + 3));
    this.userOrgService.getOrgDetailsByHostname().subscribe();
    this.userOrganisation$ = this.userOrgService.organisation$;
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
  }
}


import { map, tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { PubSubService } from '../../services/pub-sub.service';
import { MqttConnectionState } from 'ngx-mqtt';
import { environment } from 'environments/environment';
import * as _ from 'lodash';

const misc: any = {
	navbar_menu_visible: 0,
	active_collapse: true,
	disabled_collapse_init: 0,
};

declare var $: any;
@Component({
	selector: 'app-navbar-cmp',
	templateUrl: 'navbar.component.html',
	styleUrls: ['navbar.component.scss']
})

export class NavbarComponent implements OnInit, OnDestroy {
	private listTitles: any[];
	location: Location;
	private nativeElement: Node;
	private toggleButton: any;
	private sidebarVisible: boolean;
	mqttConnectionStatus$: Observable<MqttConnectionState>
	notifications$: Observable<any[]>;
	env = environment;
	mqttReconnectCount = 0;
	unreadNotifCount = 0;
	mqttRefreshInterval;
	@ViewChild('app-navbar-cmp') button: any;

	constructor(location: Location,
		private element: ElementRef,
		private auth: AuthService,
		private router: Router,
		private pubsub: PubSubService,
	) {
		this.location = location;
		this.nativeElement = element.nativeElement;
		this.sidebarVisible = false;
	}
	minimizeSidebar() {
		const body = document.getElementsByTagName('body')[0];

		if (misc.sidebar_mini_active === true) {
			body.classList.remove('sidebar-mini');
			misc.sidebar_mini_active = false;

		} else {
			setTimeout(function () {
				body.classList.add('sidebar-mini');

				misc.sidebar_mini_active = true;
			}, 300);
		}
	}

	hideSidebar() {
		const body = document.getElementsByTagName('body')[0];
		const sidebar = document.getElementsByClassName('sidebar')[0];

		if (misc.hide_sidebar_active === true) {
			setTimeout(function () {
				body.classList.remove('hide-sidebar');
				misc.hide_sidebar_active = false;
			}, 300);
			setTimeout(function () {
				sidebar.classList.remove('animation');
			}, 600);
			sidebar.classList.add('animation');

		} else {
			setTimeout(function () {
				body.classList.add('hide-sidebar');
				// $('.sidebar').addClass('animation');
				misc.hide_sidebar_active = true;
			}, 300);
		}
	}
	ngOnInit() {
		this.listTitles = ROUTES.filter(listTitle => listTitle);
		const navbar: HTMLElement = this.element.nativeElement;
		const body = document.getElementsByTagName('body')[0];
		this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
		if (body.classList.contains('sidebar-mini')) {
			misc.sidebar_mini_active = true;
		}
		if (body.classList.contains('hide-sidebar')) {
			misc.hide_sidebar_active = true;
		}
		this.mqttConnectionStatus$ = this.pubsub.mqttConnectionState$
			.pipe(
				tap(state => {
					clearInterval(this.mqttRefreshInterval);
					this.mqttRefreshInterval = setInterval(() => {
						if (this.auth.isLoggedIn && state == MqttConnectionState.CLOSED) {
							this.pubsub.connectMQTT();
						}
					}, 5000);
				})
			)
	}

	ngOnDestroy() {
		clearInterval(this.mqttRefreshInterval);
	}

	onResize(event) {
		if ($(window).width() > 991) {
			return false;
		}
		return true;
	}
	sidebarOpen() {
		const toggleButton = this.toggleButton;
		const body = document.getElementsByTagName('body')[0];
		setTimeout(function () {
			toggleButton.classList.add('toggled');
		}, 500);
		body.classList.add('nav-open');

		this.sidebarVisible = true;
	};
	sidebarClose() {
		const body = document.getElementsByTagName('body')[0];
		this.toggleButton.classList.remove('toggled');
		this.sidebarVisible = false;
		body.classList.remove('nav-open');
	};
	sidebarToggle() {
		if (this.sidebarVisible === false) {
			this.sidebarOpen();
		} else {
			this.sidebarClose();
		}
	};

	getTitle() {
		let title: any = this.location.prepareExternalUrl(this.location.path());
		if (title.indexOf('?') != -1) {
			title = title.substring(0, title.indexOf('?'));
		}
		for (let i = 0; i < this.listTitles.length; i++) {
			if ((this.listTitles[i].type === "link" || this.listTitles[i].type === "child") && this.listTitles[i].path === title) {
				return this.listTitles[i].title;
			} else if (this.listTitles[i].type === "sub") {
				for (let j = 0; j < this.listTitles[i].children.length; j++) {
					const subtitle = this.listTitles[i].path + '/' + this.listTitles[i].children[j].path;
					if (subtitle === title) {
						return this.listTitles[i].children[j].title;
					}
				}
			}
		}
		return 'Home';
	}

	goBack() {
		if (this.getIcon() == 'keyboard_backspace') {
			window.history.back();
		}
	}
	getIcon() {
		let title: any = this.location.prepareExternalUrl(this.location.path());
		if (title.indexOf('?') != -1) {
			title = title.substring(0, title.indexOf('?'));
		}
		for (let i = 0; i < this.listTitles.length; i++) {
			if ((this.listTitles[i].type === "link" || this.listTitles[i].type === "child") && this.listTitles[i].path === title) {
				return this.listTitles[i].icontype;
			} else if (this.listTitles[i].type === "sub") {
				for (let j = 0; j < this.listTitles[i].children.length; j++) {
					const subtitle = this.listTitles[i].path + '/' + this.listTitles[i].children[j].path;
					if (subtitle === title) {
						return this.listTitles[i].children[j].icontype;
					}
				}
			}
		}
		return 'home';
	}

	signOut() {
		localStorage.clear();

		this.router.navigate(['/login']);
	}

	flattenNotifs(notifs) {
		console.log('Notifs to flatten in nav', notifs);
		const flattenedNotifs = [];
		this.unreadNotifCount = 0;
		notifs.forEach(notif => {
			notif.notifs.forEach(notification => {
				if (notification.isRead == "no") {
					this.unreadNotifCount++;
				}
				flattenedNotifs.push(notification);
			});
		});
		console.log("unread count", this.unreadNotifCount);
		return flattenedNotifs;
	}

	connectMQTT() {
		this.pubsub.connectMQTT();
	}

	isMobileDisplay() {
		return (window.screen.width <= 576)
	}
}

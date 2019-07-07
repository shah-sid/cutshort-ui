import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { AuthGuard } from './services/auth-guard.service';
import { AuthInterceptor } from './services/interceptor.service';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthService } from './services/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { CommonService } from './services/common.service';
import { FooterModule } from './shared/footer/footer.module';
import { FormsModule } from '@angular/forms';
import { MQTT_SERVICE_OPTIONS } from './config';
import { NavbarModule } from './shared/navbar/navbar.module';
import { NgModule } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OnlineStatusComponent } from './shared/online-status/online-status.component';
import { ProfileService } from './services/profile.service';
import { PubSubService } from './services/pub-sub.service';
import { RouterModule } from '@angular/router';
import { SidebarModule } from './shared/sidebar/sidebar.module';
import { ToastService } from './services/toast.service';
import { UserOrgService } from './services/user-org.service';
import { WindowRef } from './services/window-ref.service';
import { ConnectivityService } from './services/connectivity.service';
import { MqttModule } from 'ngx-mqtt';
import { OfflineComponent } from './offline/offline.component';
import { AccountSuspendedComponent } from './account-suspended/account-suspended.component';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ]
})
export class MaterialModule {}

@NgModule({
    imports:      [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        RouterModule.forRoot(AppRoutes),
        HttpClientModule,
        MaterialModule,
        MatNativeDateModule,
        SidebarModule,
        NavbarModule,
        FooterModule,
        NgxSpinnerModule,
        MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        AuthLayoutComponent,
        OnlineStatusComponent,
        OfflineComponent,
        AccountSuspendedComponent
    ],
    providers: [ToastService,
                AuthService,
                AuthGuard,
                CommonService,
                ProfileService,
                UserOrgService,
                PubSubService,
                WindowRef,
                ConnectivityService,
                SidebarModule,
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: AuthInterceptor,
                  multi: true
                }
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

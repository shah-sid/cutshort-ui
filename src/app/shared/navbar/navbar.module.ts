import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';
import { MatButtonModule, MatTooltipModule } from '@angular/material';
@NgModule({
    imports: [ RouterModule, CommonModule, MatButtonModule, MatTooltipModule ],
    declarations: [ NavbarComponent ],
    exports: [ NavbarComponent ]
})

export class NavbarModule {}

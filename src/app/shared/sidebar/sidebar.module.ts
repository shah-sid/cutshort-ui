import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { MatTooltipModule } from '@angular/material';
import { SummaryPipe } from '../../general/pipes/summary.pipe';

@NgModule({
    imports: [ RouterModule, CommonModule, MatTooltipModule ],
    declarations: [ SidebarComponent, SummaryPipe ],
    exports: [ SidebarComponent ]
})

export class SidebarModule {}

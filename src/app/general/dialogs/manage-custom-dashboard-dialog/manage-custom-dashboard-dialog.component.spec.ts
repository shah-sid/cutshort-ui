import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCustomDashboardDialogComponent } from './manage-custom-dashboard-dialog.component';

describe('ManageCustomDashboardDialogComponent', () => {
  let component: ManageCustomDashboardDialogComponent;
  let fixture: ComponentFixture<ManageCustomDashboardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageCustomDashboardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCustomDashboardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

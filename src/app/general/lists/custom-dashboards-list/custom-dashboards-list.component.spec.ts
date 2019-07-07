import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDashboardsListComponent } from './custom-dashboards-list.component';

describe('CustomDashboardsListComponent', () => {
  let component: CustomDashboardsListComponent;
  let fixture: ComponentFixture<CustomDashboardsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomDashboardsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDashboardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

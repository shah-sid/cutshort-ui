import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCustomDashboardComponent } from './view-custom-dashboard.component';

describe('ViewCustomDashboardComponent', () => {
  let component: ViewCustomDashboardComponent;
  let fixture: ComponentFixture<ViewCustomDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCustomDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCustomDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPlaceholderComponent } from './report-placeholder.component';

describe('ReportPlaceholderComponent', () => {
  let component: ReportPlaceholderComponent;
  let fixture: ComponentFixture<ReportPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

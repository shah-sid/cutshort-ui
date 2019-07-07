import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsCatalogComponent } from './widgets-catalog.component';

describe('WidgetsCatalogComponent', () => {
  let component: WidgetsCatalogComponent;
  let fixture: ComponentFixture<WidgetsCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WidgetsCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewdashboarddetailsComponent } from './viewdashboarddetails.component';

describe('ViewdashboarddetailsComponent', () => {
  let component: ViewdashboarddetailsComponent;
  let fixture: ComponentFixture<ViewdashboarddetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewdashboarddetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewdashboarddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

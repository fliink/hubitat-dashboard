import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermostatListItemComponent } from './thermostat-list-item.component';

describe('ThermostatListItemComponent', () => {
  let component: ThermostatListItemComponent;
  let fixture: ComponentFixture<ThermostatListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThermostatListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

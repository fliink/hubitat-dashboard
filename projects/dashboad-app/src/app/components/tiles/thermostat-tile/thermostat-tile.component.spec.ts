import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThermostatTileComponent } from './thermostat-tile.component';

describe('ThermostatTileComponent', () => {
  let component: ThermostatTileComponent;
  let fixture: ComponentFixture<ThermostatTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThermostatTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThermostatTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

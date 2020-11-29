import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorTileComponent } from './sensor-tile.component';

describe('SensorTileComponent', () => {
  let component: SensorTileComponent;
  let fixture: ComponentFixture<SensorTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

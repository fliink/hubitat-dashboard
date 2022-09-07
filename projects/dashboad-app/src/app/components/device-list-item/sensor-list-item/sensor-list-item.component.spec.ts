import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorListItemComponent } from './sensor-list-item.component';

describe('SensorListItemComponent', () => {
  let component: SensorListItemComponent;
  let fixture: ComponentFixture<SensorListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensorListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

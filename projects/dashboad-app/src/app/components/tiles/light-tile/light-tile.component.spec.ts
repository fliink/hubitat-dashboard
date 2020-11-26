import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightTileComponent } from './light-tile.component';

describe('LightTileComponent', () => {
  let component: LightTileComponent;
  let fixture: ComponentFixture<LightTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

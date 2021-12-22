import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HCanvasComponent } from './h-canvas.component';

describe('HCanvasComponent', () => {
  let component: HCanvasComponent;
  let fixture: ComponentFixture<HCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

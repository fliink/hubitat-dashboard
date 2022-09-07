import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightListItemComponent } from './light-list-item.component';

describe('LightListItemComponent', () => {
  let component: LightListItemComponent;
  let fixture: ComponentFixture<LightListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LightListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LightListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

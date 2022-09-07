import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchListItemComponent } from './switch-list-item.component';

describe('SwitchListItemComponent', () => {
  let component: SwitchListItemComponent;
  let fixture: ComponentFixture<SwitchListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchListItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

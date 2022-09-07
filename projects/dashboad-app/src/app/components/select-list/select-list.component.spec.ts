import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectListComponent } from './select-list.component';

describe('SelectListComponent', () => {
  let component: SelectListComponent<any>;
  let fixture: ComponentFixture<SelectListComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

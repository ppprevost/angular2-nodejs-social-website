import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidUrlComponent } from './valid-url.component';

describe('ValidUrlComponent', () => {
  let component: ValidUrlComponent;
  let fixture: ComponentFixture<ValidUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

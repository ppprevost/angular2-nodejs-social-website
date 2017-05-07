import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfFriendComponent } from './list-of-friend.component';

describe('ListOfFriendComponent', () => {
  let component: ListOfFriendComponent;
  let fixture: ComponentFixture<ListOfFriendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfFriendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import {Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {DataService} from '../../services/data.service';
import {User} from '../../interface/interface';

@Component({
  selector: 'app-list-of-friend',
  templateUrl: './list-of-friend.component.html',
  styleUrls: ['./list-of-friend.component.scss']
})
export class ListOfFriendComponent implements OnInit, OnDestroy, OnChanges {

  @Input() user: User;
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

  constructor(private data: DataService) {
  }

  ngOnInit() {
    console.log(this.user);
  }

  ngOnDestroy() {
    // this.followerSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user.currentValue) {
      this.getFollowerImage(this.user);
      // this.user = changes.user.currentValue;
    }
  }

  public getFollowerImage(user: User): void { // avatar from other friends
    if (user && user.following && user.following.length > 0) {
      this.data.listOfFriends(user.following).subscribe((elem) => {
        this.user.following = elem.json() || [];
        this.notify.emit(this.user.following.length);
      });
    }
  }
}

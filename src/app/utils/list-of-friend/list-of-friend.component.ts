import {Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-list-of-friend',
  templateUrl: './list-of-friend.component.html',
  styleUrls: ['./list-of-friend.component.scss']
})
export class ListOfFriendComponent implements OnInit, OnDestroy, OnChanges {

  @Input() user;
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();
  images: [Object];
  followerSub

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.getFollowerImage(this.user);
  }

  ngOnDestroy() {
    this.followerSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user.previousValue) {
      this.user = changes.user.currentValue;
      this.getFollowerImage(this.user);
    }
  }

  getFollowerImage(user) { // avatar from other friends
    if (user && user.following && user.following.length > 0) {
      return this.followerSub = this.data.ListOfFriends(user).subscribe((elem) => {
        this.images = elem.json();
        this.notify.emit(this.images.length);
      })
    }
  }

}

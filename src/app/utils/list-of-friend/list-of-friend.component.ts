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

  }

  ngOnDestroy() {
    //this.followerSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user.currentValue) {
      this.user = changes.user.currentValue;
    }
  }

  getFollowerImage(user): void { // avatar from other friends
    // if (user && user.following && user.following.length > 0 ) {
    //   // this.images = user.following;
    //   // this.notify.emit(this.images.length)
    //     this.data.ListOfFriends(user).subscribe((elem) => {
    //     this.images = elem.json() || [];
    //     this.notify.emit(this.images.length);
    //   });
    // }
  }

}

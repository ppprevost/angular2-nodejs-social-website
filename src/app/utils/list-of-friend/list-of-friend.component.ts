import {Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';
import {User} from '../../interface/interface';

@Component({
  selector: 'app-list-of-friend',
  templateUrl: './list-of-friend.component.html',
  styleUrls: ['./list-of-friend.component.scss']
})
export class ListOfFriendComponent implements OnInit, OnDestroy, OnChanges {

  @Input() user: User;
  @Output() notify: EventEmitter<number> = new EventEmitter<number>();

  constructor(private data: DataService, private auth: AuthService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // this.followerSub.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('change list of friend component', changes)
    if (changes.user.currentValue) {
      //Oly call for the user authentified, for the others getusers call listOf Friends directlyh
      if (changes.user.currentValue._id === this.auth.user._id) {
        this.getFollowerImage(this.user); // limit xhr call
      }
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

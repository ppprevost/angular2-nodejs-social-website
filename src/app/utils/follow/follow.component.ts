import {Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges, OnDestroy} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {SocketService} from '../../services/socket.service';
import {AuthHttp} from 'angular2-jwt';

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss'],
})
export class FollowComponent implements OnInit, OnChanges, OnDestroy {
  isLoading = true;
  table = ['friendRequest', 'removeFriend', 'friendRequestAccepted'];
  @Input() waste;
  @Input() user;

  @Output() follower: EventEmitter<any> = new EventEmitter<any>();
  @Output() notify: EventEmitter<any> = new EventEmitter<any>();
  private obj = (wasterValue, typeFollowing?) => {
    const obj: any = {
      userId: this.user._id,
      wasterId: wasterValue
    };
    if (typeFollowing) {
      obj.typeFollowing = typeFollowing;
    }
    return obj;
  }

  constructor(private socket: SocketService, private auth: AuthService, private http: AuthHttp) {
  }

  ngOnInit() {
    this.getThisUser();
    this.socketMethodUse(this.table);

  }

  followUserOk(wasterId) {
    this.http.post('/api/users/followOk', JSON.stringify(this.obj(wasterId))).toPromise().then(data => {
      this.auth.countFriendRequest--;
      this.getThisUser(data.json());
    });
  }

  ngOnDestroy() {
    for (var i = 0; i < this.table.length; i++) {
      this['connection' + i].unsubscribe();
    }
  }

  follow(wasterId) {
    this.http.post('/api/users/follow', JSON.stringify(this.obj(wasterId))).toPromise().then(data => {
      this.getThisUser(data.json());

    });
  }

  socketMethodUse(table) {
    table.forEach((elem, i) => {
      this['connection' + i] = this.socket.socketFunction(elem)
        .subscribe(waste => {
          this.auth.callRefreshUserData(waste);
          this.getThisUser(waste);
        });
    });
  }

  unfollow(wasterId) {
    this.http.post('/api/users/unfollow', JSON.stringify(this.obj(wasterId))).toPromise().then(data => {
      this.getThisUser(data.json());
    }, err => console.log(err));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user.previousValue) {
    }
  }


  getThisUser(user?) { // pour rafraichir la liste des différents followers
    const waster = user ? user : this.auth.user;
    let ok = false;
    if (waster.following.length) {
      waster.following.map((elem) => {
        if (elem.userId === this.waste._id) {
          this.waste.statut = elem.statut;
          ok = true;
        }
        return elem;
      });
      if (!ok) {
        this.waste.statut = '';
      }
    } else {
      this.waste.statut = '';
    }
    this.follower.emit(this.waste.following.length);
    this.notify.emit(this.waste.statut);
    this.isLoading = false;
  }

  typeFollowing(typeFollowing, wasterId) {
    return this.http.post
    (`/api/users/followingFunction`, JSON.stringify(this.obj(wasterId, typeFollowing)))
      .toPromise()
      .then(data => {
        this.getThisUser(data.json());
      }).catch(err => console.log(err));
  }


}

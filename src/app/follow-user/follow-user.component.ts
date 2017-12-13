import {Component, OnInit, ViewChild, AfterViewChecked, OnDestroy, HostListener, OnChanges} from '@angular/core';
import {DataService} from '../services/data.service';
import {InfiniteScrollService} from '../services/infinite-scroll.service';
import {AuthService} from '../services/auth.service';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/concatMap';
import {ListOfFriendComponent} from '../utils/list-of-friend/list-of-friend.component';
import {ActivatedRoute} from '@angular/router';
import {Waste} from '../interface/interface';
import {
  ActivatedRouteSnapshot
} from '@angular/router';

@Component({
  selector: 'app-follow-user',
  templateUrl: './follow-user.component.html',
  styleUrls: ['./follow-user.component.css'],
  providers: [InfiniteScrollService]
})

export class FollowUserComponent implements OnInit, AfterViewChecked, OnDestroy, OnChanges {
  wasters: Waste[];
  unsub;
  @ViewChild(ListOfFriendComponent) listOfFriendComponent: ListOfFriendComponent;
  @ViewChild('wasteMasonry') wasteCompo;

  constructor(private infinite: InfiniteScrollService, private route: ActivatedRoute,
              private auth: AuthService, private data: DataService) {
  }

  ngOnInit() {
    this.unsub = this.route.snapshot.data['follow'].json();
    this.wasters = this.unsub
      .filter(elem => {
        return elem._id !== this.auth.user._id;
      })
      .map(follower => {
        follower.following.filter(contact => contact.statut === 'accepted');
        return follower;
      });
  }

  /**
   * Inifinite scroll module
   */
  onScrollDown() { //  wait for refreshing correctly the users
    console.log('scrolled down!!');
    this.data.getUsers({
      'request': 'all',
      'limitData': 10,
      'skipLimit': this.wasters.length
    })
      .then(donc => {
        this.wasters = this.wasters.concat(donc.json().filter(elem => {
          return elem._id !== this.auth.user._id;
        })
          .map(follower => {
            follower.following.filter(contact => contact.statut === 'accepted');
            return follower;
          }));
      });
  }

  ngAfterViewChecked() {

  }

  ngOnChanges(changes) {
    console.log('changes from parent data', changes);
  }

  ngOnDestroy() {

  }
}

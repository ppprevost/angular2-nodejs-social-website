import {Component, OnInit, ViewChild, AfterViewChecked, OnDestroy, HostListener, OnChanges} from '@angular/core';
import {DataService} from '../services/data.service';
import {InfiniteScrollService} from '../services/infinite-scroll.service';
import {AuthService} from '../services/auth.service';
import 'rxjs/add/operator/toPromise';
import {ListOfFriendComponent} from '../utils/list-of-friend/list-of-friend.component';
import {ActivatedRoute} from '@angular/router';
import * as Masonry from 'masonry-layout';
import {Waste} from '../interface/interface';

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
    this.unsub = this.route.snapshot.data['follow'].subscribe(data => {
      this.wasters = data.json()
        .filter(elem => {
          return elem._id !== this.auth.user._id;
        })
        .map(follower => {
          follower.following.filter(contact => contact.statut === 'accepted');
          return follower;
        });
      //    console.log(this.wasters);
    });
  }

  @HostListener('window:scroll', ['$event']) onScroll($event) {
    this.infinite.getInfiniteScroll(() => {
      this.data.getUsers()
        .then(elem => elem
          .subscribe(response => this.wasters = this.wasters.concat(response.json())
            .filter(doc => {
              return doc._id !== this.auth.user._id;
            }), err => console.log(err)
          ));
    });
  }

  ngAfterViewChecked() {
    if (this.wasteCompo) {
      const item = this.wasteCompo.nativeElement;
      return new Masonry(item, {
        itemSelector: '.item'
      });
    }
  }

  ngOnChanges(changes) {
    console.log('changes from parent data', changes);
  }

  ngOnDestroy() {
    this.unsub.unsubscribe();
  }

  onNotify(message: string) {
    console.log('response from parentData', message === 'accepted');
    if (this.listOfFriendComponent && message === 'accepted') {
      this.listOfFriendComponent.getFollowerImage(this.auth.user);
    }
  }
}

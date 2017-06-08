import {Component, OnInit, ViewChild, AfterViewChecked, OnDestroy} from '@angular/core';
import {DataService} from '../services/data.service';
import {AuthService} from '../services/auth.service';
import 'rxjs/add/operator/toPromise';
import {ListOfFriendComponent} from '../utils/list-of-friend/list-of-friend.component';
import {ActivatedRoute, Router} from '@angular/router';
import * as Masonry from 'masonry-layout';

@Component({
  selector: 'app-follow-user',
  templateUrl: './follow-user.component.html',
  styleUrls: ['./follow-user.component.css']
})

export class FollowUserComponent implements OnInit, AfterViewChecked, OnDestroy {
  wasters;
  unsub;
  @ViewChild(ListOfFriendComponent) listOfFriendComponent: ListOfFriendComponent;
  @ViewChild('wasteMasonry') wasteCompo;

  constructor(private route: ActivatedRoute,
              private router: Router, private auth: AuthService, private data: DataService) {
  }

  ngOnInit() {
    this.unsub = this.route.snapshot.data['follow'].subscribe(data => {
      this.wasters = data.json().filter(elem => {
        return elem._id !== this.auth.user._id;
      });
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

  ngOnDestroy() {
    this.unsub.unsubscribe()
  }

  onNotify(message: string, waster) {
    console.log("response from parentData", message == "accepted");
    if (this.listOfFriendComponent && message == "accepted") {
      this.listOfFriendComponent.getFollowerImage(this.auth.user)
    }
  }
}

import {Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DataService} from '../services/data.service'
import {AuthService} from '../services/auth.service'
import 'rxjs/add/operator/toPromise';
import {ListOfFriendComponent} from '../utils/list-of-friend/list-of-friend.component';

@Component({
  selector: 'app-follow-user',
  templateUrl: './follow-user.component.html',
  styleUrls: ['./follow-user.component.css']
})

export class FollowUserComponent implements OnInit, AfterViewInit {
  wasters;
  @ViewChild(ListOfFriendComponent) listOfFriendComponent: ListOfFriendComponent;

  constructor(private auth: AuthService, private data: DataService) {
  }

  ngOnInit() {
    this.data.getUsers().subscribe(data => {
      this.wasters =data.json().filter(elem=>{
        return elem._id != this.auth.user._id
      });
    });
  }

  ngAfterViewInit() {

  }

  onNotify(message: string, waster) {
    console.log("response from parentData", message == "accepted");
    if (this.listOfFriendComponent && message=="accepted") {
      this.listOfFriendComponent.getFollowerImage(this.auth.user)
    }
  }
}

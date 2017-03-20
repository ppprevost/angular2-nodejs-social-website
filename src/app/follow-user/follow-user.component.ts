import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service'


@Component({
  selector: 'app-follow-user',
  templateUrl: './follow-user.component.html',
  styleUrls: ['./follow-user.component.css']
})
export class FollowUserComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('profile'));
  waster;

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.data.getUsers().then(data => {
      console.log(data);
      this.waster = JSON.parse(data._body)
    })
  }
}

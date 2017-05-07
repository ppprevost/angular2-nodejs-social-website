import {Component, OnInit, Injectable} from '@angular/core';
import {DataService} from '../services/data.service'
import {AuthService} from '../services/auth.service'
import 'rxjs/add/operator/toPromise';


@Component({
  selector: 'app-follow-user',
  templateUrl: './follow-user.component.html',
  styleUrls: ['./follow-user.component.css']
})

export class FollowUserComponent implements OnInit {
  wasters;


  constructor(private auth:AuthService ,private data: DataService) {
  }

  ngOnInit() {
    this.data.getUsers().subscribe(data => {
      this.wasters = data.json();
    });
  }

  onNotify(message: string) {
    console.log("response from parentData", message);
    this.wasters.forEach((waster) => {
      waster.message = message
    })
  }


}

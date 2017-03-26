import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component'
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('profile'));
  images;

  constructor(private data: DataService, private login: AppComponent) {

  }

  ngOnInit() {
    this.getFollowerImage()
  }

  getFollowerImage() {
    if (this.user && this.user.following && this.user.following.length > 0) {
      var data = {
        userId: this.user._id,
        following: this.user.following
      };
      return this.data.ListOfFriends(this.user).subscribe((data) => {
        this.images = data.json();
      })
    }
  }

  loggedIn() {
    return this.login.loggedIn()
  }

}

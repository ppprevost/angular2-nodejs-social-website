import {Component, OnInit, NgZone} from '@angular/core';
import {DataService} from '../services/data.service'
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';

interface Obj {
  userId: string;
  wasterId: string;
}

@Component({
  selector: 'app-follow-user',
  templateUrl: './follow-user.component.html',
  styleUrls: ['./follow-user.component.css'],

})

export class FollowUserComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('profile'));
  private obj = (wasterValue) => {
    let obj: Obj = <any>{
      userId: this.user._id,
      wasterId: wasterValue
    };
    return obj;
  };
  wasters;
  private headers = new Headers({'Content-Type': 'application/json', 'charset': 'UTF-8'});
  private options = new RequestOptions({headers: this.headers});
  public followingTrue: string;

  constructor(private _ngZone: NgZone, private http: Http, private data: DataService) {

  }

  ngOnInit() {
    let self = this;
    this.getThisUser(() => {
      self.data.getUsers().then(data => {
        console.log(data);
        self.wasters = JSON.parse(data["_body"]);
        this.wasters.forEach((waster) => {
          this.checkIsFollowing(waster._id)
        })
      });
    });
  }

  getThisUser(callback) {
    this.data.getThisUser(this.user._id).subscribe(following => {
      localStorage.setItem('profile', following["_body"]);
      console.log("following", following);
      callback()
    })
  }

  checkIsFollowing(wasterId) {
    this.user.following.forEach((elem) => {
      if (elem.userId == wasterId) {
        console.log("statu", elem.statut);
        this.followingTrue = elem.statut
      } else {
        this.followingTrue = ''
      }
    });
    return this.followingTrue;
  }

  followUserOk(wasterId) {
    this.http.post('/api/users/followOk', JSON.stringify(this.obj(wasterId)), this.options).toPromise().then(data => {
      this.checkIsFollowing(wasterId)
    });
  }

  follow(wasterId) {
    this.http.post('/api/users/follow', JSON.stringify(this.obj(wasterId)), this.options).toPromise().then(data => {
      this.checkIsFollowing(wasterId)
    });
  }

  unfollow(wasterId) {
    this.http.post('/api/users/unfollow', JSON.stringify(this.obj(wasterId)), this.options).toPromise().then(data => {
      this.checkIsFollowing(wasterId)
    });
  }
}

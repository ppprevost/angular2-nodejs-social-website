import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';

interface Obj {
  userId: string;
  wasterId: string;
}

@Component({
  selector: 'app-follow',
  templateUrl: './follow.component.html',
  styleUrls: ['./follow.component.scss'],
})
export class FollowComponent implements OnInit {
  @Input() waste;
  @Input() user;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  private obj = (wasterValue) => {
    let obj: Obj = <any>{
      userId: this.user._id,
      wasterId: wasterValue
    };
    return obj;
  };
  private headers = new Headers({'Content-Type': 'application/json', 'charset': 'UTF-8'});
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http) {
  }

  ngOnInit() {
    this.getThisUser();
  }

  followUserOk(wasterId) {
    this.http.post('/api/users/followOk', JSON.stringify(this.obj(wasterId)), this.options).toPromise().then(data => {
      this.user = data.json();
      this.getThisUser();
    });
  }

  follow(wasterId) {
    this.notify.emit('Click from nested component');
    this.http.post('/api/users/follow', JSON.stringify(this.obj(wasterId)), this.options).toPromise().then(data => {
      this.user = data.json();
      this.getThisUser();
    });
  }

  unfollow(wasterId) {
    this.notify.emit('Click from nested component');
    this.http.post('/api/users/unfollow', JSON.stringify(this.obj(wasterId)), this.options).toPromise().then(data => {
      this.user = data.json();
      this.getThisUser();
    });
  }

  getThisUser() { // pour rafraichir la liste des différents followers
    if (this.user.following.length) {
      this.user.following.map((elem) => {
        if (elem.userId == this.waste._id) {
          this.waste.status = elem.statut;
          this.notify.emit(this.waste.status);
        }
      });
    } else {
      this.waste.status = ""
    }
  }
}

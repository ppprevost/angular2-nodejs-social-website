import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {NgZone} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class DataService {
  private headers = new Headers({'Content-Type': 'application/json', 'charset': 'UTF-8'});
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http, zone: NgZone) {

  }

  editCat(cat): Observable<any> {
    return this.http.put(`/cat/${cat._id}`, JSON.stringify(cat), this.options);
  }

  getUsers(): Promise<any> {
    return this.http.get('api/users/get').toPromise()
  }

  getThisUser(userid): Observable<any> {
    return this.http.post('/app/users/getThisUsers', JSON.stringify({userId: userid}), this.options)
  }

  createAccount(user): Observable<any> {
    return this.http.post('/api/user/signup', JSON.stringify(user), this.options)
  }

  updateChamp(champ): Observable<any> {
    return this.http.post('/api/profile/updateChamp', JSON.stringify(champ), this.options)
  }

  updatePassword(pass): Observable<any> {
    return this.http.post('/api/profile/updatePassword', JSON.stringify(pass), this.options)
  }

  loginAccount(user): Observable<any> {
    return this.http.post('/api/user/login', JSON.stringify(user), this.options)
  }

  logOut(userId): Observable<any> {
    return this.http.post('/api/user/logout', JSON.stringify(userId), this.options)
  }

  ListOfFriends(user): Observable<any> {
    return this.http.post('/app/waste/listOfFriend', JSON.stringify(user), this.options)

  };

}

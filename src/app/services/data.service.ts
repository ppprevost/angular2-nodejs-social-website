import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {

  private headers = new Headers({
    'Content-Type': 'application/json',
    'charset': 'UTF-8',
    'x-access-token': localStorage.getItem('token')
  });
  private options = new RequestOptions({headers: this.headers});
  user;

  constructor(private http: Http) {
    this.user = {}
  }

  getUsers(): Observable<any> {
    return this.http.get('api/users/get');
  }

  getThisUser(userid): Observable<any> {
    return this.http.post('/api/users/getThisUsers', JSON.stringify({userId: userid}), this.options);
  }

  refreshUserData(token): Observable<any> {
    return this.http.post('/api/user/refreshUserData', JSON.stringify(token), this.options);
  }


  updateChamp(champ): Observable<any> {
    return this.http.post('/api/profile/updateChamp', JSON.stringify(champ), this.options)
  }

  updatePassword(pass): Observable<any> {
    return this.http.post('/api/profile/updatePassword', JSON.stringify(pass), this.options)
  }


  logOut(userId, token): Observable<any> {
    return this.http.post(`/api/user/logout/`, JSON.stringify({userId, token}), this.options)
  }

  deleteAccount(userId: string): Observable<any> {
    return this.http.delete(`api/profile/deleteAccount/${userId}`, this.options)
  }

  ListOfFriends(user): Observable<any> {
    return this.http.post('/api/waste/listOfFriend', JSON.stringify(user), this.options)
  };

  getYourOwnPicture(userId: Object): Observable<any> {
    return this.http.get(`api/users/uploadPicture/${userId}`, this.options)
  }

  deleteAllPicture(userId: string): Observable<any> {
    return this.http.delete(`/api/users/deleteAllPicture/${userId}`, this.options);
  }

  refreshSocketIdOfConnectedUsers(userId: string, socketId: string, token: string): Observable<any> {
    return this.http.post('/api/user/refreshSocketId', JSON.stringify({
      userId,
      socketId,
      token
    }), this.options)
  }

  sendWaste(request: Object) {
    return this.http.post('api/waste/sendPost', JSON.stringify(request), this.options)
  }

  getPost(userId: string, numberOfWaste: number, typePost: string, onlyOwnPost: boolean) {
    return this.http.post('/api/waste/getPost', JSON.stringify({
      following: userId,
      numberOfWaste: numberOfWaste,
      typePost: typePost,
      onlyOwnPost: onlyOwnPost
    }), this.options)
  }


}

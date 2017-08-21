import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Commentary, Waste, Friends} from '../interface/interface';
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
    this.user = {};
  }

  /**
   * Get all Users
   * @param {Object} args -key limitData and searchData and precise value
   */
  getUsers(...args): Promise<any> {
    let str = '';
    args
      .filter(elem => elem)
      .forEach(doc => str += `${doc.key}=${doc.value}`);
    return Promise.resolve(this.http.get('api/users/get' + (str ? '?' + str : '')));
  }

  /**
   * Get data from a specific user and load data from the backend
   * @param {String} userid
   * @path {Post}
   * @returns {Observable<Response>}
   */
  getThisUser(userid): Observable<any> {
    return this.http.post('/api/users/getThisUsers', JSON.stringify({userId: userid}), this.options);
  }

  /**
   * Refresh data rom a user
   * @param token {String} Json web token
   * @returns {Observable<Response>}
   */
  refreshUserData(token): Observable<any> {
    return this.http.post('/api/user/refreshUserData', JSON.stringify(token), this.options);
  }

  /**
   * Update perso data
   * @param {Object} champ -userId and the value to change
   * @returns {Observable<Response>}
   */
  updateChamp(champ): Observable<any> {
    return this.http.post('/api/profile/updateChamp', JSON.stringify(champ), this.options);
  }

  updatePassword(pass): Observable<any> {
    return this.http.post('/api/profile/updatePassword', JSON.stringify(pass), this.options);
  }


  logOut(userId, token): Observable<any> {
    return this.http.post(`/api/user/logout/`, JSON.stringify({userId, token}), this.options);
  }

  /**
   * Delete my account
   * @param {String} userId -mongooose UserId
   * @returns {Observable<Response>}
   */
  deleteAccount(userId: string): Observable<any> {
    return this.http.delete(`api/profile/deleteAccount/${userId}`, this.options);
  }

  getYourOwnPicture(userId: Object): Observable<any> {
    return this.http.get(`api/users/uploadPicture/${userId}`, this.options);
  }

  /**
   * Delete all your own Picture
   * @param userId
   * @returns {Observable<Response>}
   */
  deleteAllPicture(userId: string): Observable<any> {
    return this.http.delete(`/api/users/deleteAllPicture/${userId}`, this.options);
  }

  /**
   * get the new socket id of the connected user
   * @param userId
   * @param socketId
   * @param token
   * @returns {Observable<Response>}
   */
  refreshSocketIdOfConnectedUsers(userId: string, socketId: string, token: string): Observable<any> {
    return this.http.post('/api/user/refreshSocketId', JSON.stringify({
      userId,
      socketId,
      token
    }), this.options);
  }

  /**
   * Send a new post
   * @param request
   * @returns {Observable<Response>}
   */
  sendWaste(request: Object) {
    return this.http.post('api/waste/sendPost', JSON.stringify(request), this.options);
  }

  dataCommentary(waste: Waste, userId: string) {
    return this.http.post('api/waste/getCommentary', JSON.stringify(waste), this.options);
  }

  /**
   * Get post from a user and all this different friends
   * @param userId {String}
   * @param numberOfWaste {Number}
   * @param typePost {String} means private or public
   * @param onlyOwnPost {Boolean} means that i only want my own post
   * @param skipLimit for infinite scrollig
   * @returns {Observable<Response>}
   */
  getPost(userId: string, numberOfWaste: number, typePost: string, onlyOwnPost: boolean, skipLimit) {
    return this.http.post('/api/waste/getPost', JSON.stringify({
      following: userId,
      numberOfWaste,
      typePost,
      onlyOwnPost,
      skipLimit
    }), this.options);
  }

  sendWasteComments(comments) {
    return this.http.post('/api/waste/sendComments', JSON.stringify({comments}), this.options);
  }

  /**
   *
   * @param wasteId {String} post id
   * @param commentId {String}
   * @returns {Observable<Response>}
   */
  deletePost(wasteId, commentId?): Observable<any> {
    return this.http.delete('/api/waste/deletePost/' + wasteId + (commentId ? '/' + commentId : ''), this.options);
  }

  likeThisPostOrComment(wasteId, commentId?): Observable<any> {
    return this.http.get('api/waste/likeThisPostOrComment/' + wasteId + (commentId ? '/' + commentId : ''), this.options);
  }

  listOfFriends(followingTable: Friends[]) {
    return this.http.post('/api/users/getListOfFriends', JSON.stringify(followingTable), this.options);
  }
}

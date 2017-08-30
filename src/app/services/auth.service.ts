import {DataService} from './data.service';
import {PublicService} from './public.service';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from '@angular/core';
import {User} from '../interface/interface';

@Injectable()
export class AuthService {
  user: User;
  jwtHelper: JwtHelper = new JwtHelper();
  token;
  countFriendRequest = 0;

  constructor(private publicService: PublicService, private data: DataService) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      // TODO seek a connection between having the auth service
       this.callRefreshUserData();
      // this.user = this.decodeUserFromToken(this.token);
    }
  }

  /**
   * Check if you're not connected
   * @returns {boolean}
   */
  loggedIn() {
    return tokenNotExpired();
  }

  /**
   * To Connect to the social website
   * @param emailAndPassword
   * @returns {Observable<R>}
   */
  loginAccount(emailAndPassword) {
    return this.publicService.loginAccount(emailAndPassword)
      .map(res => res.json())
      .map(data => {
        this.token = data.token;
        localStorage.setItem('token', this.token);
        return this.user = this.decodeUserFromToken(data.token);
      });
  }

  decodeUserFromToken(token) {
    return this.jwtHelper.decodeToken(token).user;
  }

  /**
   * See data.redreshUserData
   * @param userData
   * @param callback
   * @returns {any}
   */
  callRefreshUserData(userData?: User, callback?: (User)=>any) {
    if (userData) {
      return this.user = userData;
    } else {
      return this.data.refreshUserData({userId: this.decodeUserFromToken(this.token)._id}).subscribe(user => {
        this.user = user.json();
        if (callback) {
          callback(this.user);
        }
      });
    }
  }
}

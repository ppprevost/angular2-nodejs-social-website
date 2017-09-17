import {DataService} from './data.service';
import {PublicService} from './public.service';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from '@angular/core';
import {User} from '../interface/interface';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

@Injectable()
export class AuthService {
  user: User;
  jwtHelper: JwtHelper = new JwtHelper();
  token;
  countFriendRequest = 0;

  constructor(private publicService: PublicService, private data: DataService) {
    this.token = localStorage.getItem('token');
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
   * Refresh the user. If callback async function and call the server to refresH. to log in, we only decode the token. and if we have the data we could refresh the user with that.
   * @param userData
   * @param callback
   * @returns {any}
   */
  callRefreshUserData(userData?: User, callback?: (User) => any) {
    if (userData) {
      return this.user = userData;
    } else {
      if (callback) {
        this.data
          .refreshUserData({userId: this.decodeUserFromToken(this.token)._id})
          .subscribe(user => {
            this.user = user.json();
            if (callback) {
              callback(this.user);
            }
          });
      } else {
        this.user = this.decodeUserFromToken(this.token);
      }
    }
  }

  resolve(route: ActivatedRouteSnapshot): Promise<User[]> {
    return this.data.refreshUserData({userId: this.decodeUserFromToken(this.token)._id}).toPromise();

  }
}

import{DataService} from './data.service';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {
  user;
  jwtHelper: JwtHelper = new JwtHelper();
  token;

  constructor(private data: DataService) {
    this.token = localStorage.getItem('token')
    if (this.token) {
      this.user = this.decodeUserFromToken(this.token)
    }
  }


  loggedIn() {
    return tokenNotExpired()
  }

  loginAccount(emailAndPassword) {
    return this.data.loginAccount(emailAndPassword)
      .map(res => res.json())
      .map(data => {
        console.log(data);
        localStorage.setItem('token', data.token);
        return this.user = this.decodeUserFromToken(data.token);
      });
  }

  decodeUserFromToken(token) {
    return this.jwtHelper.decodeToken(token).user;
  }

  callRefreshUserData(userData?) {
    if (userData) {
      return this.user = userData
    } else {
      return this.data.refreshUserData({token: this.token}).subscribe(user => {
        console.log('setITem');
        this.user = user.json();
      })
    }
  }
}

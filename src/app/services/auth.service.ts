import {DataService} from './data.service';
import {PublicService} from './public.service';
import {JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from '@angular/core';
import {User} from '../interface/interface'

@Injectable()
export class AuthService {
  user: User;
  jwtHelper: JwtHelper = new JwtHelper();
  token;

  constructor(private publicService: PublicService, private data: DataService) {
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.user = this.decodeUserFromToken(this.token);
    }
  }

  loggedIn() {
    return tokenNotExpired()
  }

  loginAccount(emailAndPassword) {
    return this.publicService.loginAccount(emailAndPassword)
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

  callRefreshUserData(userData?: User, callback?: Function) {
    if (userData) {
      return this.user = userData
    } else {
      return this.data.refreshUserData({token: this.token}).subscribe(user => {
        this.user = user.json();
      if(callback)  callback(this.user);
      });
    }
  }
}

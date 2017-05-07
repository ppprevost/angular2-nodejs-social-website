import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import{DataService} from './data.service';
import{AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router, private data: DataService) {
  }

  canActivate() {
    // If user is not logged in we'll send them to the homepage
    if (!this.auth.loggedIn()) {
      this.router.navigate(['']);
      return false;
    }
    if (this.router.navigated) {
      this.auth.callRefreshUserData()
    }
    return true;
  }

}

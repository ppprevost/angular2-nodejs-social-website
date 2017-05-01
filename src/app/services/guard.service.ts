import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import{DataService} from './data.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private data: DataService) {
  }

  canActivate() {
    // If user is not logged in we'll send them to the homepage
    if (!localStorage["profile"]) {
      this.router.navigate(['']);
      return false;
    }
    if(this.router.navigated){
      this.data.getThisUser(this.data.user._id).subscribe(following => {
        console.log('setITem');
        localStorage.setItem('profile', following["_body"]);
      })
    }
    return true;
  }

}

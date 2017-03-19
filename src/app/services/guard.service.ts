import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private router: Router) {}

  canActivate() {
    // If user is not logged in we'll send them to the homepage
    if (!localStorage["profile"]) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }

}

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {DataService} from '../services/data.service';


@Injectable()
export class FollowUserResolverService implements Resolve<any> {
  constructor(private data: DataService, private router: Router) {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this.data.getUsers()
    //   .then(users => {
    //   if (users) {
    //     return users;
    //   }
    // });
  }
}

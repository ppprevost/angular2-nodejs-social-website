import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {User} from '../interface/interface';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {DataService} from '../services/data.service';


@Injectable()
export class FollowUserResolverService implements Resolve<User[]> {
  constructor(private data: DataService, private router: Router) {

  }

  resolve(route: ActivatedRouteSnapshot): Promise<User[]> {
    return this.data.getUsers();

  }
}

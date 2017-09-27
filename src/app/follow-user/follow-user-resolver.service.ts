import {Injectable} from '@angular/core';
import {User} from '../interface/interface';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {DataService} from '../services/data.service';
import {AuthService} from '../services/auth.service';

@Injectable()
export class FollowUserResolverService implements Resolve<User[]> {
  params;

  constructor(private auth: AuthService, private data: DataService) {

  }

  /**
   *
   * @param route
   * @returns {any}
   */
  resolve(route: ActivatedRouteSnapshot | any): Promise<User[]> {
    if (route.params.userId && (route.params.request === 'requested' || route.params.request === 'accepted')) {
      return this.data.getThisUser(route.params.userId, route.params.request, true);
    } else {
      return this.data.getUsers({
        'searchData': route.params.request
      });
    }

  }
}

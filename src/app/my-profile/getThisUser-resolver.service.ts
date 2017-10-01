/**
 * Created by Prevost on 01/10/2017.
 */
import {Injectable} from '@angular/core';
import {User} from '../interface/interface';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {DataService} from '../services/data.service';
import {AuthService} from '../services/auth.service';

@Injectable()
export class GetThisUserResolverService implements Resolve<User[]> {
  params;

  constructor(private auth: AuthService, private data: DataService) {

  }

  /**
   *
   * @param route
   * @returns {any}
   */
  resolve(route: ActivatedRouteSnapshot | any): Promise<User[]> {

    return this.data.getThisUser(route.params.userId);
  }
}

import {Injectable} from '@angular/core';
import {User} from '../../interface/interface';
import {
  Router, Resolve, RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import {DataService} from '../../services/data.service';
import {AuthService} from '../../services/auth.service';

@Injectable()
export class WasteResolverService implements Resolve<User[]> {


  constructor(private auth: AuthService, private data: DataService) {

  }

  /**
   *
   * @param route
   * @returns {any}
   */
  resolve(route: ActivatedRouteSnapshot | any): Promise<User[]> {
   // TODO add waste resolver

  }
}

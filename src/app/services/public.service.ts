import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PublicService {
  private headers = new Headers({
    'Content-Type': 'application/json',
    'charset': 'UTF-8'
  });
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http) {

  }

  createAccount(user): Observable<any> {
    return this.http.post('/api/user/signup', JSON.stringify(user), this.options);
  }

  loginAccount(user): Observable<any> {
    return this.http.post('/api/user/login', JSON.stringify(user), this.options);
  }

  getCaptcha(catchaToken: string) {
    return this.http.get('/api/user/validCaptcha/' + catchaToken, this.options);
  }

  resendVerifMail(email) {
    return this.http.get(`/api/user/resendVerifEmail/${email}`);
  }
}

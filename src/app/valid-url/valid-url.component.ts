import {Component, OnInit} from '@angular/core';
import {Http, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Injectable} from '@angular/core';

@Component({
  selector: 'app-valid-url',
  templateUrl: './valid-url.component.html',
  styleUrls: ['./valid-url.component.css']
})

@Injectable()
export class ValidUrlComponent implements OnInit {
  private welcome:string;
  private headers = new Headers({'Content-Type': 'application/json', 'charset': 'UTF-8'});
  private options = new RequestOptions({headers: this.headers});
  private url: string;
  constructor(private http: Http, private activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.url = params['URL'];
    });
    this.http.post('/verif', JSON.stringify({url: this.url}), this.options).subscribe((res) => {

this.welcome = "bravo, vous pouvez maintenant vous connecter !! ";
      console.log(res)
    });
  }
}

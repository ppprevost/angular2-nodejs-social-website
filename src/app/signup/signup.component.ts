import {Component, OnInit} from '@angular/core';
import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {DataService} from '../services/data.service'
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {ToastComponent} from '../shared/toast/toast.component';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  private addUser: FormGroup;
  private email = new FormControl('', Validators.required);
  private res;
  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  constructor(private http: Http, private dataService: DataService, private addUserForm: FormBuilder, public toast: ToastComponent, private router: Router) {
  }

  ngOnInit() {
    console.log('Vous etes connecte sur la pgae de profil');
    this.addUser = this.addUserForm.group({
      email: this.email,
      username: this.username,
      pass: this.password

    })
  }

  addAccount() {
    this.dataService.createAccount(this.addUser.value).subscribe((res) => {
        this.res = res;
        console.log("response Angular2", res);
        this.toast.setMessage('item added successfully.', 'success');
        this.router.navigate(['./']);
      }
    )
  }
}

import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import {DataService} from '../services/data.service'
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  addUser: FormGroup;
  private email = new FormControl('', Validators.required);
  private res;
  username = new FormControl('', Validators.required);
  password = new FormControl('', Validators.required);

  constructor(private toastyService: ToastyService, private dataService: DataService, private addUserForm: FormBuilder, private router: Router) {
  }

  ngOnInit() {

    this.addUser = this.addUserForm.group({
      email: this.email,
      username: this.username,
      pass: this.password

    })
  }

  handleCorrectCaptcha(event) {
    console.log(event);
  }

  addAccount() {
    let toastOptions = (response, title) => {
      return {
        title: title,
        msg: response,
        showClose: true,
        timeout: 8000,
        theme: 'material',
      };
    };
    this.dataService.createAccount(this.addUser.value)
      .map(res => res.json().msg)
      .subscribe((res) => {
          this.res = res;

          this.toastyService.success(toastOptions(res, "Congratulations !"));
          this.router.navigate(['./']);
        }, (err) => {
          this.toastyService.error(toastOptions(err, "An error occured"))
        }
      )
  }
}

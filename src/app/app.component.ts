import {Component, OnInit, Injectable, OnDestroy, ViewContainerRef} from '@angular/core';

import {DataService} from './services/data.service';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import{Router} from '@angular/router';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
@Injectable()
export class AppComponent implements OnInit,OnDestroy {

  private loginUser: FormGroup;
  private email = new FormControl('', Validators.required);
  private password = new FormControl('', Validators.required);
  user;

  constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig, private data: DataService, private addUserForm: FormBuilder, private router: Router, vcr: ViewContainerRef) {
    this.toastyConfig.theme = 'material';
  }

  ngOnInit() {
    this.loginUser = this.addUserForm.group({
      email: this.email,
      password: this.password
    });
    if (this.loggedIn()) {
      console.log("on rafraichit le user")
      this.data.getThisUser(this.data.user._id).subscribe(following => {
        console.log('setITem');
        localStorage.setItem('profile', following["_body"]);
      })
    }
  }

  ngOnDestroy() {

  }

  loginAccount() {
    this.data.loginAccount(this.loginUser.value).subscribe(data => {
      console.log(data);
      localStorage.setItem("profile", data["_body"]);
      this.user = JSON.parse(localStorage["profile"])._id;
      this.router.navigate(['./']);
    }, err => {
      if (typeof err.json() == 'string') {
        this.toastyService.error(err.json())
      } else {
        if (Array.isArray(err.json())) {
          this.toastyService.error(err.json()[0].msg)
        } else {
          this.toastyService.error(err.json().msg)
        }
      }
    });
  }

  logOut() {
    console.log("click sur logout avec socket");
    this.data.logOut({userId: this.user._id}).subscribe(res => {
      console.log(res);
      localStorage.clear();
      this.router.navigate(['./']);
      var toastOptions: ToastOptions = {
        title: "Deconnection",
        msg: "See you soon !",
        showClose: true,
        timeout: 5000,
        theme: 'material',
        onAdd: (toast: ToastData) => {
          console.log('Toast ' + toast.id + ' has been added!');
        },
        onRemove: function (toast: ToastData) {
          console.log('Toast ' + toast.id + ' has been removed!');
        }
      };
      this.toastyService.info(toastOptions);
    })
  }

  loggedIn() {
    return this.user = this.data.loggedIn()
  }
}

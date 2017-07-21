import {Component, OnInit, ElementRef, AfterViewInit} from '@angular/core';
import {PublicService} from '../services/public.service';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastyService} from 'ng2-toasty';
import swal from 'sweetalert2';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  addUser: FormGroup;
  private email = new FormControl('', Validators.required);
  private res;
  activatedModule = environment.recaptcha;
  verifToggle = false;
  private eventCaptcha = false;
  username = new FormControl('', [Validators.required, Validators.maxLength(20)]);
  password = new FormControl('', Validators.required);

  constructor(private toastyService: ToastyService,
              private publicService: PublicService,
              private addUserForm: FormBuilder,
              private router: Router) {
  }

  ngOnInit() {
    this.addUser = this.addUserForm.group({
      email: this.email,
      username: this.username,
      pass: this.password

    });
  }

  handleCorrectCaptcha(event) {
    this.publicService.getCaptcha(event)
      .map(res => res.json())
      .subscribe((res) => {
        if (res.responseCode === 0) {
          this.eventCaptcha = true;
        }
      }, err => console.log(err));
    console.log(event);
  }

  addAccount() {
    if (!this.verifToggle) {
      const toastOptions = (response, title) => {
        return {
          title: title,
          msg: response,
          showClose: true,
          timeout: 8000,
          theme: 'material',
        };
      };
      this.publicService.createAccount(this.addUser.value)
        .map(res => res.json().msg)
        .subscribe((res) => {
          this.res = res;
          swal({
            title: 'Congratulations!',
            text: res,
            type: 'success',
            confirmButtonText: 'Ok'
          });
          this.toastyService.success(toastOptions(res, 'Congratulations !'));
          this.router.navigate(['./']);
        }, (err) => {
          this.toastyService.error(toastOptions(err, 'An error occured'));
        });
    } else {
      this.publicService.resendVerifMail(this.addUser.value.email)
        .map(res => res.json())
        .subscribe(data => {
          swal({
            title: 'warning!',
            text: data.msg,
            type: 'warning',
            confirmButtonText: 'Ok'
          });

        });
    }


  }
}

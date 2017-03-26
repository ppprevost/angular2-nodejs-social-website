import {Component, OnInit} from '@angular/core';
import {Injectable} from '@angular/core';
import {DataService} from './services/data.service';
import {ToastComponent} from './shared/toast/toast.component';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import{Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent implements OnInit {
  private userId: "string";
  private loginUser: FormGroup;
  private email = new FormControl('', Validators.required);
  private password = new FormControl('', Validators.required);

  constructor(private data: DataService, private toast: ToastComponent, private addUserForm: FormBuilder, private router: Router) {

  }

  ngOnInit() {
    this.loginUser = this.addUserForm.group({
      email: this.email,
      password: this.password
    })
  }

  public loginAccount() {
    console.log(this.loginUser);
    this.data.loginAccount(this.loginUser.value).subscribe(data => {
      console.log(data);
      localStorage.setItem("profile", data["_body"])
    });
    this.toast.setMessage('item added successfully.', 'success');
  }

  logOut() {
    console.log("click sur logout avec socket");
    try {
      this.userId = JSON.parse(localStorage["profile"])._id;
      this.data.logOut({userId: this.userId}).subscribe(res => {
        console.log(res);
        localStorage.clear();
        this.router.navigate(['./']);
      })
    } catch (err) {

    }
  }

  loggedIn() {
    return localStorage["profile"]
  }

}

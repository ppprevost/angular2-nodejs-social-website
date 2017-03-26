import {Component, OnInit} from '@angular/core';
import {DataService} from '../services/data.service'
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: Object;
  private profile;
  private updatePass: FormGroup;
  private password = new FormControl('', Validators.required);
  private confirm = new FormControl('', Validators.required);
  public uploader: FileUploader = new FileUploader({
    url: 'http://localhost:3000/upload'//,
    // itemAlias: "blablabla",
    // disableMultipart: true
  });

  constructor(private data: DataService, private passwordForm: FormBuilder) {

  }

  ngOnInit() {
    this.profile = localStorage["profile"];
    if (this.profile) {
      this.user = JSON.parse(this.profile)
    }
    this.uploader.onBuildItemForm = (item, form) => {
      form.append("userId", this.user["_id"]);
    };
    this.updatePass = this.passwordForm.group({
      password: this.password,
      confirm: this.confirm
    })
  }

  updateChamp(event) {
    console.log(event.target.value);
    interface Obj {
      userId: string;
    }
    let obj: Obj = <any>{};
    obj["userId"] = this.user["_id"];
    obj[event.target.name] = event.target.value;

    this.data.updateChamp(obj).subscribe(res => {
      console.log(res);
      localStorage.setItem("profile", res._body)
    })
  }

  updatePassword() {
    if (this.updatePass.value.confirm == this.updatePass.value.password) {
      this.updatePass.value["userId"] = this.user["_id"];
      this.data.updatePassword(this.updatePass.value).subscribe(res => console.log(res))
    } else {
      console.log("ceci ne correspond pas !!")
    }//
  }
}

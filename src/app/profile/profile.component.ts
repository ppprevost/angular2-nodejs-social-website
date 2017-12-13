import {Component, NgZone, OnInit} from '@angular/core';
import {DataService} from '../services/data.service';
import {AuthService} from '../services/auth.service';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {FileUploader} from 'ng2-file-upload';
import {environment} from '../../environments/environment';
import {FileSelectDirective, FileDropDirective} from 'ng2-file-upload';
import {User} from '../interface/interface';
import swal from 'sweetalert2';
import {FileLikeObject} from "ng2-file-upload/file-upload/file-like-object.class";
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [FileSelectDirective, FileDropDirective]
})
export class ProfileComponent implements OnInit {
  public user: User;
  private profile;
  public typeUpload: string;
  updatePass: FormGroup;
  private password = new FormControl('', Validators.required);
  private confirm = new FormControl('', Validators.required);
  private lastPassword = new FormControl('', Validators.required);

  public uploader: FileUploader = new FileUploader({
    url: `${environment.url}/api/profile/updatePhoto`,
    maxFileSize: 1 * 1024 * 1024,
    allowedMimeType: ['image/png', 'image/jpg', 'image/gif', 'image/jpeg']
  });

  constructor(private toastyService: ToastyService, private auth: AuthService, private data: DataService, private passwordForm: FormBuilder, private zone: NgZone) {
    this.user = this.auth.user;
  }

  ngOnInit() {
    this.uploader.authToken = 'Bearer ' + localStorage.token;
    this.fileUploader();
    this.updatePass = this.passwordForm.group({
      lastPassword: this.lastPassword,
      password: this.password,
      confirm: this.confirm
    });
  }

  private fileUploader() {
    this.uploader.onWhenAddingFileFailed = (item: FileLikeObject, filter: any, options: any) => {
      console.log(item, filter, options)
      if (item.size > options.maxFileSize) {
        this.toastyService.info({
          title: 'Too BiG ! ',
          msg: 'This File is too BIG, please upload a file that do not exceed 1 mb'
        })
      }
    };
    this.uploader.onBuildItemForm = (item: any, form) => {
      form.append('userId', this.auth.user['_id']);
      form.append('uploadType', this.typeUpload);

    };
    this.uploader.onAfterAddingFile = (file: any) => {
      file.withCredentials = false;
      file.typeUpload = this.typeUpload;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this.auth.callRefreshUserData(JSON.parse(response));
    };
  }

  updateChamp(event) {
    console.log(event.target.value);

    interface Obj {
      userId: string;
    }

    const obj: Obj = <any>{};
    obj['userId'] = this.auth.user['_id'];
    obj[event.target.name] = event.target.value;

    this.data.updateChamp(obj).subscribe(res => {
      console.log(res);
      this.auth.callRefreshUserData(res.json());
    });
  }

  getTypeUpload(event) {
    return this.typeUpload = event.target.id;
  }

  updatePassword() {
    try {
      Object.keys(this.updatePass.value).forEach(elem => {
        if (this.updatePass.value[elem] === '') {
          throw new Error('Fields are required');
        }
      });
      if (this.updatePass.value.confirm === this.updatePass.value.password) {
        this.updatePass.value['userId'] = this.auth.user['_id'];
        this.data.updatePassword(this.updatePass.value)
          .map(res => res.json())
          .subscribe(res => {
              swal({
                title: 'Success!',
                text: res.msg,
                type: 'success',
                confirmButtonText: 'Ok'
              });
            },
            err => this.errMethod(err));
      } else {
        if (this.updatePass.value.password === this.updatePass.value.lastPassword) {
          throw new Error('Password and newPassword are the same');
        } else {
          throw new Error('Password are not Matching');
        }
      }//
    } catch (err) {
      swal({
        title: 'Error!',
        text: err.message,
        type: 'error',
        confirmButtonText: 'Ok'
      });
    }
  }

  errMethod(err) {
    let x: string;
    if (typeof err === 'string') {
      x = err;
    }
    if (typeof err.text() === 'string') {
      x = err.text();
    } else {
      err.json().forEach((elem, i) => {
        const param = elem.msg.replace('Password', elem.param);
        if (i === 0) {
          x = param;
        } else {
          x += '\n' + param;
        }
      });
    }
    swal({
      title: 'Error!',
      text: x,
      type: 'error',
      confirmButtonText: 'Ok'
    });
  }

  deleteAccount() {
    this.zone.runOutsideAngular(() => {
      const self = this;
      swal({ // TODO wrapper swal
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: false
      }).then(function () {
        self.data.deleteAccount(self.user._id)
          .map(res => res.json())
          .subscribe((data) => {
              swal('Deleted!', data, 'success');
              localStorage.clear();
            },
            err => {
              swal('Problem with your destruction!', err, 'error');
            });

      }, function (dismiss) {
        // dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
        if (dismiss === 'cancel') {
          swal(
            'Cancelled',
            'Your account is safe :)',
            'error'
          );
        }
      });
    });
  }
}

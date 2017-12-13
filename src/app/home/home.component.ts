import {Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {DataService} from '../services/data.service';
import {WasteComponent} from '../utils/waste/waste.component';
import {User} from '../interface/interface';
import {AuthService} from '../services/auth.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  user: User;
  typeWaste: string;
  newWaste: string;
  @ViewChild(WasteComponent) wasteComponent: WasteComponent;

  constructor(private _sanitizer: DomSanitizer, private auth: AuthService, private data: DataService) {
    console.log(this);
  }

  loggedIn() {
    if (this.auth.loggedIn()) {
      return this.user = this.auth.user;
    }
  }

  sendWaste() {
    const request = {
      user: this.auth.user.username,
      userId: this.auth.user._id,
      userType: this.typeWaste || 'public',
      content: this.newWaste
    };
    if (this.newWaste && this.newWaste !== '') {
      return this.data.sendWaste({request: request}).map(res => res.json())
        .subscribe(data => {
            this.newWaste = '';
          if (data && data.content && data.content.source === 'YouTube') {
            data.content._url = this._sanitizer.bypassSecurityTrustResourceUrl(data.content._url);
          }
            this.wasteComponent.wastes.unshift(data)
          },
          (err => console.log(err)));
    }
  }

}

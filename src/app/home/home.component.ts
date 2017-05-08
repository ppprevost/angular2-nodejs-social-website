import {Component, OnInit, ViewChild, SimpleChanges, OnChanges} from '@angular/core';
import {DataService} from '../services/data.service';
import {WasteComponent} from '../utils/waste/waste.component';
import {MdRadioModule} from '@angular/material';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  user;
  images: Object[] = [];
  typeWaste: string;
  newWaste: string;
  @ViewChild(WasteComponent) wasteComponent: WasteComponent;

  constructor(private auth: AuthService, private data: DataService) {
    console.log(this)
  }

  ngOnInit() {

  }


  loggedIn() {
    if (this.auth.loggedIn()) {

      return this.user = this.auth.user
    }
  }

  sendWaste() {
    let request = {
      user: this.auth.user.username,
      userId: this.auth.user._id,
      userType: this.typeWaste || 'public',
      content: this.newWaste
    };
    if(this.newWaste !=""){
      return this.data.sendWaste({request: request}).map(res => res.json())
        .subscribe(data => {
            this.newWaste = '';
          },
          (err => console.log(err)),
          () => this.wasteComponent.getPosts()); // une fois// qu'on a bien enregfistré on rappelle la méthode getost du component child
    }

  }

}

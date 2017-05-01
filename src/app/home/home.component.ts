import {Component, OnInit, ViewChild, SimpleChanges, OnChanges} from '@angular/core';
import {DataService} from '../services/data.service';
import {WasteComponent} from '../utils/waste/waste.component';
import {MdRadioModule} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit, OnChanges {
  user;
  images: Object[] = [];
  typeWaste: string;
  newWaste: string;
  @ViewChild(WasteComponent) wasteComponent: WasteComponent;

  constructor(private data: DataService) {
    console.log(this)
  }

  ngOnInit() {
    if (this.user)
      this.getFollowerImage();

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)

  }

  getFollowerImage() {
    return this.data.ListOfFriends(this.data.user).subscribe((data) => {
        this.images = data.json();
      },
      err => console.log(err))
  }

  loggedIn() {
    return this.user = this.data.loggedIn()
  }

  sendWaste() {
    let request = {
      user: this.data.user.username,
      userId: this.data.user._id,
      userType: this.typeWaste || 'public',
      content: this.newWaste
    };
    return this.data.sendWaste({request: request}).map(res => res.json())
      .subscribe(data => {
          this.newWaste = '';
        },
        (err => console.log(err)),
        () => this.wasteComponent.getPosts()); // une fois// qu'on a bien enregfistré on rappelle la méthode getost du component child
  }

}

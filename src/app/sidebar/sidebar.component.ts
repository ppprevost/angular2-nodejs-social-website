import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private appComponent:AppComponent) { }

  ngOnInit() {
  }
logOut(){
    return this.appComponent.logOut()
}

}

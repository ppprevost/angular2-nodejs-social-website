import {Component, OnInit, Input, OnDestroy, Injectable} from '@angular/core';
import {DataService} from '../../services/data.service';
import {SocketService} from "../../services/socket.service";


@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss']
})
@Injectable()
export class WasteComponent implements OnInit, OnDestroy {

  @Input() numberOfWaste;
  @Input() typePost;
  @Input() onlyOwnPost;
  @Input() userId;
  wastes;
  connection;

  constructor(private socket: SocketService, private data: DataService) { // en le mettant dans le constructeur toutes les methodes sont  disponibles
  }

  ngOnInit() {
    this.getPosts();
    this.connection = this.socket.socketFunction("getNewPost")
      .subscribe(message => {
        this.wastes.unshift(message);
      });
  }

  ngOnDestroy() {

  }

  getPosts() {
    this.data.getPost(this.userId, this.numberOfWaste, this.typePost, this.onlyOwnPost)
      .map(res => res.json())
      .subscribe(
        data => {
          this.wastes = data
        },
        err => console.log(err))
  }

}

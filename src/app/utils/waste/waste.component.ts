import {Component, OnInit, Input, OnDestroy, Injectable, OnChanges} from '@angular/core';
import {DataService} from '../../services/data.service';
import {SocketService} from "../../services/socket.service";
import {Waste} from "../../interface/interface";

@Component({
  selector: 'app-waste',
  templateUrl: './waste.component.html',
  styleUrls: ['./waste.component.scss']
})
@Injectable()
export class WasteComponent implements OnInit, OnDestroy, OnChanges {

  @Input() numberOfWaste: number;
  @Input() typePost;
  @Input() onlyOwnPost;
  @Input() userId: string;
  wastes: [Waste];
  newComment: string;
  connection;

  constructor(private socket: SocketService, private data: DataService) { // en le mettant dans le constructeur toutes les methodes sont  disponibles
  }

  ngOnInit() {
    this.getPosts();
    this.connection = this.socket.socketFunction("getNewPost")
      .subscribe(message => {
        message.user = message.username;
        this.wastes.unshift(message);
      });
  }

  ngOnDestroy() {

  }

  ngOnChanges(changes) {
    console.log(changes);
    if (changes.userId.currentValue && changes.userId.currentValue != changes.userId.previousValue) {
      this.getPosts();
    }
  }

  getPosts() {
    this.data.getPost(this.userId, this.numberOfWaste, this.typePost, this.onlyOwnPost)
      .map(res => res.json())
      .subscribe(
        data => {
          this.wastes = data;
        },
        err => console.log(err))
  }

  sendWasteComments(wasteId: string, value) {
    let comments = {
      userId: this.userId,
      content: {
        type: "text",
        data: value.value,
      },
    };

    return this.data.sendWasteComments(wasteId, comments)
      .map(res => res.json())
      .subscribe(res => {

      })
  }
}

import { Component, OnInit } from '@angular/core';
import { IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,IonFooter,IonInput],
  providers:[ModalController],

})
export class CommentsComponent  implements OnInit {
dismiss: any;

  constructor() { }

  ngOnInit() {
    return
  }

}

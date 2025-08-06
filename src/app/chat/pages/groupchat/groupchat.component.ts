import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonLabel, IonTextarea, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-groupchat',
  templateUrl: './groupchat.component.html',
  styleUrls: ['./groupchat.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonImg,IonContent,NgFor,IonLabel,IonFooter,IonTextarea,NgIf],
  providers:[ModalController],
})
export class GroupchatComponent  implements OnInit {

  constructor(private modalController: ModalController,) { }

  ngOnInit(): void {
    return
   }

  close() {
    this.modalController.dismiss();
  }
}

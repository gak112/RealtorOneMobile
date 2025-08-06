import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonContent, IonFooter, IonHeader, IonIcon, IonImg, IonInput, IonLabel, IonTextarea, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, arrowRedoCircle, camera, chevronBackOutline } from 'ionicons/icons'
@Component({
  selector: 'app-chatfullview',
  templateUrl: './chatfullview.component.html',
  styleUrls: ['./chatfullview.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonIcon,IonImg,IonContent,IonLabel,IonFooter,IonTextarea,NgIf,IonInput,],
  providers:[ModalController],
})
export class ChatfullviewComponent implements OnInit {

  constructor(private modalController: ModalController,) {
    addIcons({ add, arrowRedoCircle, camera, chevronBackOutline })
  }

  ngOnInit(): void {
  return
   }

  close() {
    this.modalController.dismiss();
  }

}

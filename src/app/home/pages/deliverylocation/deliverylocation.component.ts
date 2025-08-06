import { Component, OnInit } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonSearchbar, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { AddaddressComponent } from '../addaddress/addaddress.component';
import {  NgIf } from '@angular/common';
import { LivelocationComponent } from '../../components/livelocation/livelocation.component';

@Component({
  selector: 'app-deliverylocation',
  templateUrl: './deliverylocation.component.html',
  styleUrls: ['./deliverylocation.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,LivelocationComponent,IonSearchbar,IonImg,IonLabel,IonButton,NgIf,],
  providers:[ModalController],
})
export class DeliverylocationComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    return
   }

  dismiss() {
    this.modalController.dismiss();
  }

  async addAddress() {

    const modal = await this.modalController.create({
      component: AddaddressComponent,
      breakpoints: [0, 0, 1],
      initialBreakpoint: 0.85,
    });
    return await modal.present();
  }

}

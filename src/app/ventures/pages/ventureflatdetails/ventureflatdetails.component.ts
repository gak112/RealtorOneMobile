import {  NgIf } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { register } from 'swiper/element';
register();

@Component({
  selector: 'app-ventureflatdetails',
  templateUrl: './ventureflatdetails.component.html',
  styleUrls: ['./ventureflatdetails.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,IonImg,NgIf,IonLabel],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[ModalController],
})
export class VentureflatdetailsComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {return;}

  dismiss() {
    this.modalController.dismiss();
  }

}

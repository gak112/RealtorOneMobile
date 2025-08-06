import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-couponapplied',
  templateUrl: './couponapplied.component.html',
  styleUrls: ['./couponapplied.component.scss'],
  standalone:true,
  imports:[IonContent,IonImg,IonIcon,IonLabel,],
  providers:[ModalController],
})
export class CouponappliedComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

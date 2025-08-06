import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonImg, IonLabel, IonSkeletonText, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-alerts-box',
  templateUrl: './alerts-box.component.html',
  styleUrls: ['./alerts-box.component.scss'],
  standalone:true,
  imports:[IonSkeletonText,IonImg,IonLabel,],
  providers:[ModalController]
})
export class AlertsBoxComponent  implements OnInit {

  constructor() { }

  ngOnInit() : void {
    return;
  }

}

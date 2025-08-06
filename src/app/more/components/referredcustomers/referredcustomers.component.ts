import { Component, OnInit } from '@angular/core';
import { IonIcon, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-referredcustomers',
  templateUrl: './referredcustomers.component.html',
  styleUrls: ['./referredcustomers.component.scss'],
  standalone:true,
  imports:[IonImg,IonLabel,IonIcon],
  providers:[ModalController],
})
export class ReferredcustomersComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    return
  }

}

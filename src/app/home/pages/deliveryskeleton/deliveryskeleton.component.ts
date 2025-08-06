import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonSearchbar, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  selector: 'app-deliveryskeleton',
  templateUrl: './deliveryskeleton.component.html',
  styleUrls: ['./deliveryskeleton.component.scss'],
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,IonSearchbar,IonImg,IonLabel, ],
  providers:[ModalController],
})
export class DeliveryskeletonComponent  implements OnInit {
dismiss: any;

  constructor() { }

  ngOnInit() {
    return
  }

}

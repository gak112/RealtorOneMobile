import { Component, OnInit, inject } from '@angular/core';
import { ModalController ,IonHeader ,IonImg, IonToolbar, IonIcon, IonTitle, IonContent, IonLabel, IonRange } from '@ionic/angular/standalone';

@Component({
  selector: 'app-addons',
  templateUrl: './addons.component.html',
  styleUrls: ['./addons.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,IonImg,IonLabel,IonRange,],
  providers:[ModalController],
})
export class AddonsComponent  implements OnInit {
  private modalController = inject(ModalController);


  ngOnInit() {
    return
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

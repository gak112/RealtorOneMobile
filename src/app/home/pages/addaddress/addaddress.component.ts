import { Component, OnInit, inject } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonRadio, IonRadioGroup, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.component.html',
  styleUrls: ['./addaddress.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonTitle,IonIcon,IonContent,IonLabel,IonRadioGroup,IonRadio,IonImg,IonButton],
  providers:[ModalController],
})
export class AddaddressComponent  implements OnInit {
  private modalController = inject(ModalController);


  action = 'tab-1';

  ngOnInit() {
    return
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

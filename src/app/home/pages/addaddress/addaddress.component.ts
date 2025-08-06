import { Component, OnInit } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonLabel, IonRadio, IonRadioGroup, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-addaddress',
  templateUrl: './addaddress.component.html',
  styleUrls: ['./addaddress.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonTitle,IonIcon,IonContent,IonLabel,IonRadioGroup,IonRadio,IonImg,IonInput,IonButton],
  providers:[ModalController],
})
export class AddaddressComponent  implements OnInit {

  action = 'tab-1';

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    return
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

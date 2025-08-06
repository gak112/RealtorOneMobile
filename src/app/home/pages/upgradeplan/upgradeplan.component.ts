import { Component, OnInit } from '@angular/core';
import { ModalController ,IonContent, IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle, IonLabel, IonFooter, IonInput, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-upgradeplan',
  templateUrl: './upgradeplan.component.html',
  styleUrls: ['./upgradeplan.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,IonLabel,IonFooter,IonInput,IonButton],
  providers:[ModalController],
})
export class UpgradeplanComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    return
  }

  dismiss() {
    this.modalController.dismiss();
   }

}

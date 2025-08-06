import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {chevronBackOutline} from 'ionicons/icons';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,IonLabel,],
  providers:[ModalController],
})

export class PrivacypolicyComponent  implements OnInit {

  constructor(private modalController: ModalController) {
    addIcons({chevronBackOutline})
   }

    ngOnInit(): void {
      return;
     }


    dismiss() {
        this.modalController.dismiss();
      }

}

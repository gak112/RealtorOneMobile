import { Component, OnInit } from '@angular/core';
import {  IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { AlertsBoxComponent } from '../../components/alerts-box/alerts-box.component';
import { addIcons } from 'ionicons';
import {chevronBackOutline} from 'ionicons/icons';

@Component({
  selector: 'app-alerttab',
  templateUrl: './alerttab.component.html',
  styleUrls: ['./alerttab.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonTitle,IonContent,AlertsBoxComponent,IonIcon],
  providers:[ModalController]
})
export class AlerttabComponent  implements OnInit {

  action = 'alerts';

    constructor(private modalController: ModalController) {
      addIcons({chevronBackOutline})
     }

    ngOnInit(): void {
      return
     }

    segmentChanged(val: { detail: { value: string; }; }): void {
        this.action = val.detail.value;
    }

    dismiss() {
        this.modalController.dismiss();
    }

}

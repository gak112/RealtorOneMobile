import { Component, OnInit, inject } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonSearchbar, IonTitle, IonToolbar, ModalController} from '@ionic/angular/standalone';
import { DeliverylocationComponent } from '../deliverylocation/deliverylocation.component';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronForwardOutline, addOutline, homeOutline, ellipsisHorizontal, arrowRedoOutline, } from 'ionicons/icons';

@Component({
  selector: 'app-locationnew',
  templateUrl: './locationnew.component.html',
  styleUrls: ['./locationnew.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonSearchbar,IonContent,IonImg,IonLabel,],
  providers:[ModalController],
})
export class LocationnewComponent  implements OnInit {
  private modalController = inject(ModalController);


  constructor() {
    addIcons({chevronDownOutline,chevronForwardOutline,addOutline,homeOutline,ellipsisHorizontal,arrowRedoOutline,})
   }

  ngOnInit() {
    return
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openDeliveryLocation() {

    const modal = await this.modalController.create({
        component: DeliverylocationComponent,
    });
    return await modal.present();
  }

}

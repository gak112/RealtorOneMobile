import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { VentureflatdetailsComponent } from '../ventureflatdetails/ventureflatdetails.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-venturefloordetails',
  templateUrl: './venturefloordetails.component.html',
  styleUrls: ['./venturefloordetails.component.scss'],
  imports:[IonHeader,IonToolbar,IonTitle,IonContent,IonImg,IonLabel,IonIcon],
  standalone:true,
  providers:[ModalController],
})
export class VenturefloordetailsComponent  implements OnInit {

  constructor(private modalController: ModalController,) { }

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }
  
  async openVentureFlatDetails() {
    const modal = await this.modalController.create({
        component: VentureflatdetailsComponent,
    });
    return await modal.present();
  }
}

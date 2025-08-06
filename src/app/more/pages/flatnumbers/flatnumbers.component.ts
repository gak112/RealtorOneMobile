import { Component, OnInit } from '@angular/core';
import { ModalController ,IonContent, IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle, IonLabel } from '@ionic/angular/standalone';
import { FlatviewersComponent } from '../flatviewers/flatviewers.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-flatnumbers',
  templateUrl: './flatnumbers.component.html',
  styleUrls: ['./flatnumbers.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,IonLabel,],
  providers:[ModalController],
})
export class FlatnumbersComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openFlatViewers() {
    const modal = await this.modalController.create({
        component: FlatviewersComponent,
    });
    return await modal.present();
  }
}

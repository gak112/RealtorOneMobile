import { Component, OnInit, inject } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MyrequestsComponent } from '../../pages/myrequests/myrequests.component';
import { IonImg, IonLabel,  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  standalone:true,
  imports:[IonImg,IonLabel,],
  providers:[ModalController],
})
export class TransactionsComponent  implements OnInit {
  private modalController = inject(ModalController);


  ngOnInit() {
    return
  }

  async openRequests() {
    const modal = await this.modalController.create({
      component: MyrequestsComponent,
    });
    return await modal.present();
  }
}

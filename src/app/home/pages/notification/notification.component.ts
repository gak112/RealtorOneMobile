import { Component, OnInit } from '@angular/core';
import { IonContent, IonIcon, IonLabel, ModalController } from '@ionic/angular/standalone';
import { SubscriptionsComponent } from 'src/app/more/pages/subscriptions/subscriptions.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone:true,
  imports:[IonContent,IonIcon,IonLabel],
  providers:[ModalController],
})
export class NotificationComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    return
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openSubscribe() {
    const modal = await this.modalController.create({
      component: SubscriptionsComponent
    });
    return await modal.present();
  }

}

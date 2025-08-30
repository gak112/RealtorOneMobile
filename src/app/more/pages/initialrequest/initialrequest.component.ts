import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonButton, IonContent, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { PostentryComponent } from 'src/app/home/pages/postentry/postentry.component';

@Component({
  selector: 'app-initialrequest',
  templateUrl: './initialrequest.component.html',
  styleUrls: ['./initialrequest.component.scss'],
  standalone:true,
  imports:[IonContent,IonLabel,IonImg,IonButton,],
  providers:[ModalController],
})
export class InitialrequestComponent  implements OnInit {
  private modalController = inject(ModalController);


  ngOnInit(): void {
    return;
   }

  async openAdd() {
      const modal = await this.modalController.create({
          component: PostentryComponent
      });
      return await modal.present();
  }

  dismiss() {
      this.modalController.dismiss();
  }

}

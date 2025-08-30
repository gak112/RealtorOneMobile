import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { ProfileComponent } from 'src/app/more/pages/profile/profile.component';

@Component({
  selector: 'app-view-persons',
  templateUrl: './view-persons.component.html',
  styleUrls: ['./view-persons.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,],
  providers:[ModalController],
})
export class ViewPersonsComponent  implements OnInit {
  private modalController = inject(ModalController);


    ngOnInit(): void { 
      return;
    }

    dismiss() {
       this.modalController.dismiss();
    }

    async  goToProfile() {
        const modal = await this.modalController.create({
          component: ProfileComponent,

        });
        return await modal.present();
    }

}

import { Component, OnInit, inject } from '@angular/core';
import { IonAccordion, IonAccordionGroup, IonIcon, IonImg, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';
import { MyrequestsComponent } from '../../pages/myrequests/myrequests.component';

@Component({
  selector: 'app-renewalproperties',
  templateUrl: './renewalproperties.component.html',
  styleUrls: ['./renewalproperties.component.scss'],
  standalone:true,
  imports:[IonAccordionGroup,IonAccordion,IonItem,IonImg,IonLabel,IonIcon,],
  providers:[ModalController],
})
export class RenewalpropertiesComponent  implements OnInit {
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

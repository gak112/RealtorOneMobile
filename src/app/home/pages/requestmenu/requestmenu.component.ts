import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { RequestsubmenuComponent } from '../requestsubmenu/requestsubmenu.component';

@Component({
  selector: 'app-requestmenu',
  templateUrl: './requestmenu.component.html',
  styleUrls: ['./requestmenu.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonIcon],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RequestmenuComponent implements OnInit {
  private modalController = inject(ModalController);

  action = 'sale';
  propertyComponent = RequestsubmenuComponent;

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openRequestSubMenu(type: string) {
    const modal = await this.modalController.create({
      component: RequestsubmenuComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        action: type,
      },
    });
    await modal.present();
  }
}

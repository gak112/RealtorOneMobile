import { Component, inject, input } from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonImg,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-imgfullview',
  templateUrl: './imgfullview.component.html',
  styleUrls: ['./imgfullview.component.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonImg],
})
export class ImgfullviewComponent {
  readonly img = input<any>(undefined);
  modalController = inject(ModalController);
  dismiss() {
    this.modalController.dismiss();
  }

  constructor() {
    addIcons({ chevronBackOutline });
  }
}

import { DatePipe } from '@angular/common';
import { Component, inject, input, viewChild } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  IonIcon,
  IonImg,
  IonItem,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  camera,
  checkmarkDoneOutline,
  closeCircle,
  warningOutline,
} from 'ionicons/icons';
import { ImgfullviewComponent } from 'src/app/more/pages/imgfullview/imgfullview.component';

@Component({
  selector: 'app-left-message',
  templateUrl: './left-message.component.html',
  styleUrls: ['./left-message.component.scss'],
  standalone: true,
  imports: [
    IonItemOptions,
    IonItemSliding,
    IonIcon,
    IonImg,
    IonLabel,
    IonItem,
    DatePipe,
  ],
})
export class LeftMessageComponent {
  private modalController = inject(ModalController);

  canSelectMessages = input(false);

  slider = viewChild<IonItemSliding>('slider');
  slider$ = toObservable(this.slider);

  constructor() {
    addIcons({ camera, checkmarkDoneOutline, closeCircle, warningOutline });
  }

  selectMessage() {
    // this.selectedMessage.set(this.message());
  }

  async openImage(image: string) {
    const modal = await this.modalController.create({
      component: ImgfullviewComponent,
      componentProps: { img: image },
    });
    return await modal.present();
  }
}

import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonImg,
  IonContent,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { ImgfullviewComponent } from 'src/app/more/pages/imgfullview/imgfullview.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-home-all-photos',
  templateUrl: './home-all-photos.component.html',
  styleUrls: ['./home-all-photos.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonIcon, IonImg, IonContent],
})
export class HomeAllPhotosComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ arrowBackOutline });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openImageFullView() {
    const modal = await this.modalController.create({
      component: ImgfullviewComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  ngOnInit() {}
}

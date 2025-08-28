import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonIcon,
  IonTitle,
  ModalController,
  IonImg,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { CreateVentureTypeFormComponent } from '../create-venture-type-form/create-venture-type-form.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-venture-type-form',
  templateUrl: './venture-type-form.component.html',
  styleUrls: ['./venture-type-form.component.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonImg,
    IonHeader,
    IonContent,
    IonToolbar,
    IonIcon,
    IonTitle,
  ],
})
export class VentureTypeFormComponent implements OnInit {
  private modalController = inject(ModalController);

  ventureTypeForm = signal<'openPlot' | 'farmLands'>('openPlot');

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openCreateVentureTypeForm(type: string) {
    const modal = await this.modalController.create({
      component: CreateVentureTypeFormComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        ventureTypeForm: this.ventureTypeForm,
      },
    });
    await modal.present();
  }

  ngOnInit() {}
}

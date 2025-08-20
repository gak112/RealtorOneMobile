import { Component, OnInit, inject, signal } from '@angular/core';
import {
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
  IonFooter,
  ModalController,
  IonButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-productfilter',
  templateUrl: './productfilter.component.html',
  styleUrls: ['./productfilter.component.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonButton,
    IonFooter,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
})
export class ProductfilterComponent implements OnInit {
  private modalController = inject(ModalController);
  dismiss() {
    this.modalController.dismiss();
  }

  constructor() {
    addIcons({
      closeOutline,
      arrowBackOutline,
    });
  }

  ngOnInit() {}

  activeTab = signal('saleType');
}

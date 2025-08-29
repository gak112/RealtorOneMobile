import { Component, inject, OnInit, signal } from '@angular/core';
import {
  IonSpinner,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonImg,
  IonLabel,
  ModalController,
  IonFooter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, square, squareOutline } from 'ionicons/icons';

@Component({
  selector: 'app-total-plots-list',
  templateUrl: './total-plots-list.component.html',
  styleUrls: ['./total-plots-list.component.scss'],
  standalone: true,
  imports: [
    IonFooter,
    IonToolbar,
    IonHeader,
    IonContent,
    IonTitle,
    IonIcon,
    IonLabel,
  ],
})
export class TotalPlotsListComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ chevronBackOutline, squareOutline, square });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  status = signal<'available' | 'booked' | 'sold' | 'mortgage'>('available');

  ngOnInit() {}
}

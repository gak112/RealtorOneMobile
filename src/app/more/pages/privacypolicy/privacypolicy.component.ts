import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-privacypolicy',
  templateUrl: './privacypolicy.component.html',
  styleUrls: ['./privacypolicy.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonIcon, IonTitle, IonContent, IonLabel],
})
export class PrivacypolicyComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

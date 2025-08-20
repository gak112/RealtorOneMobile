import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, informationCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-upgradeplan',
  templateUrl: './upgradeplan.component.html',
  styleUrls: ['./upgradeplan.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,

    IonIcon,
    IonTitle,
    IonContent,
    IonLabel,
    IonFooter,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
  ],
  providers: [ModalController],
})
export class UpgradeplanComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ chevronBackOutline, informationCircleOutline });
  }

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

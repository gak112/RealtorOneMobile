import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonFooter,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-agent-basic-details',
  templateUrl: './agent-basic-details.component.html',
  styleUrls: ['./agent-basic-details.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonTextarea,
    IonFooter,
    IonIcon,
  ],
})
export class AgentBasicDetailsComponent implements OnInit {
  private modalController = inject(ModalController);
  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {}
}

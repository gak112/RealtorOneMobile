import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { VentureStep1Component } from '../../components/venture-step1/venture-step1.component';

@Component({
  selector: 'app-venturecreation',
  templateUrl: './venturecreation.component.html',
  styleUrls: ['./venturecreation.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    VentureStep1Component,
    IonFooter,
    NgIf,
    IonButton,
    IonSpinner,
  ],
})
export class VenturecreationComponent implements OnInit {
  private modalController = inject(ModalController);
  dismiss() {
    this.modalController.dismiss();
  }
  getVentures($event: Event) {
    throw new Error('Method not implemented.');
  }
  copiedTowerData($event: Event) {
    throw new Error('Method not implemented.');
  }
  next() {
    throw new Error('Method not implemented.');
  }
  saveVenture() {
    throw new Error('Method not implemented.');
  }
  loading: boolean = false;
  user: any;
  ventures: any;
  ventID: any;
  ventureID: any;
  copiedData: any;
  pasteAllData: any;
  action: any;

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    return;
  }
}

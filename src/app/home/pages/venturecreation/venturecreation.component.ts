import { Component, OnInit } from '@angular/core';
import { VentureStep1Component } from '../../components/venture-step1/venture-step1.component';
import { VentureStep2Component } from '../../components/venture-step2/venture-step2.component';
import {  NgIf } from '@angular/common';
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonSpinner, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-venturecreation',
  templateUrl: './venturecreation.component.html',
  styleUrls: ['./venturecreation.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonButtons,IonBackButton,IonTitle,IonContent,VentureStep1Component,VentureStep2Component,IonFooter,NgIf,IonButton,IonSpinner,],
  providers:[ModalController],
})
export class VenturecreationComponent implements OnInit {
  dismiss() {
    throw new Error('Method not implemented.');
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

  constructor() { }

  ngOnInit() {
    return
   }

}

import { Component, inject, input, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  ModalController,
  IonContent,
  IonLabel,
  IonInput,
  IonTextarea,
  IonImg, IonFooter, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-create-venture-type-form',
  templateUrl: './create-venture-type-form.component.html',
  styleUrls: ['./create-venture-type-form.component.scss'],
  standalone: true,
  imports: [IonButton, IonFooter, 
    IonImg,
    IonTextarea,
    IonInput,
    IonLabel,
    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
  ],
})
export class CreateVentureTypeFormComponent implements OnInit {
  private modalController = inject(ModalController);

  ventureTypeForm = signal<string>('');

  activeFilter = signal<'basicDetails' | 'plotsDetails' | 'uploadAttachments'>('basicDetails');
  stepCount = signal(0);

  constructor() {
    addIcons({ chevronBackOutline });
  }
  dismiss() {
    this.modalController.dismiss();
  }

  openDetectLocation() {}

  ngOnInit() {}


  // next() {
  //   switch (this.activeFilter()) {
  //     case 'basicDetails':
  //       this.activeFilter.set('propertyDetails');
  //       break;
  //     case 'propertyDetails':
  //       this.activeFilter.set('uploadAttachments');
  //       break;
     
  //   }
  // }

  // back() {
  //   switch (this.activeFilter()) {
  //     case 'basicDetails':
  //       break;
  //     case 'propertyDetails':
  //       this.activeFilter.set('basicDetails');
  //       break;
  //     case 'locationInfo':
  //       this.activeFilter.set('propertyDetails');
  //       break;
  //     case 'pricingInfo':
  //       this.activeFilter.set('propertyDetails');
  //       break;
  //     case 'locationInfo':
  //       this.activeFilter.set('pricingInfo');
  //       break;
  //     case 'attachments':
  //       this.activeFilter.set('locationInfo');
  //       break;
  //   }
  // }
}

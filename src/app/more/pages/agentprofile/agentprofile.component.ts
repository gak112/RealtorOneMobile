import { Component, inject, OnInit } from '@angular/core';

import {
  ModalController,
  IonContent,
  IonLabel,
  IonIcon,
  IonImg,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { TransactionsComponent } from '../../components/transactions/transactions.component';
import { RenewalpropertiesComponent } from '../../components/renewalproperties/renewalproperties.component';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronBackOutline,
  locationOutline,
  mailOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-agentprofile',
  templateUrl: './agentprofile.component.html',
  styleUrls: ['./agentprofile.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonLabel,
    IonIcon,
    IonImg,
    IonSegment,
    IonSegmentButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    TransactionsComponent,
    RenewalpropertiesComponent,
  ],
  providers: [ModalController],
})
export class AgentprofileComponent implements OnInit {
  private modalController = inject(ModalController);

  showFilter;

  // config = {
  //     indexName: 'spareParts',
  //     searchClient,
  // };

  segmentAction = 'ReferredCustomers';

  constructor() {
    addIcons({
      chevronBackOutline,
      locationOutline,
      mailOutline,
      callOutline,
    });
  }

  ngOnInit(): void {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  segmentChanged(val): void {
    this.segmentAction = val.detail.value;
  }
}

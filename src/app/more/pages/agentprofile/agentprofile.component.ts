import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalController ,IonContent, IonLabel, IonIcon, IonImg, IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import { TransactionsComponent } from '../../components/transactions/transactions.component';
import { CommonModule, NgIf } from '@angular/common';
import { RenewalpropertiesComponent } from '../../components/renewalproperties/renewalproperties.component';

@Component({
  selector: 'app-agentprofile',
  templateUrl: './agentprofile.component.html',
  styleUrls: ['./agentprofile.component.scss'],
  standalone:true,
  imports:[IonContent,IonLabel,IonIcon,IonImg,IonSegment,IonSegmentButton,NgIf,TransactionsComponent,RenewalpropertiesComponent],
  providers:[ModalController],
})
export class AgentprofileComponent  implements OnInit {

  showFilter;

  // config = {
  //     indexName: 'spareParts',
  //     searchClient,
  // };

  segmentAction = 'ReferredCustomers';

  constructor(private modalController: ModalController) { }

  ngOnInit(): void { 
    return
  }

  dismiss() {
    this.modalController.dismiss();
  }

  segmentChanged(val): void {
    this.segmentAction = val.detail.value;
  }

}

import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonAccordion, IonAccordionGroup, IonBadge, IonButton, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonRange, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-productfilter',
  templateUrl: './productfilter.component.html',
  styleUrls: ['./productfilter.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonIcon,IonTitle,IonButton,IonContent,IonAccordionGroup,IonAccordion,IonItem,IonLabel,NgIf,IonRange,NgFor,IonCheckbox,IonBadge],
  providers:[ModalController],
})
export class ProductfilterComponent implements OnInit {

  @Input() facetObject: any;
fObject: any;

  constructor(private modalController: ModalController) {
    addIcons({ chevronBackOutline })
  }

  ngOnInit(): void {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

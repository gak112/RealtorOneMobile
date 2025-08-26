import { Component, inject, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, eye } from 'ionicons/icons';
import { PropertyviewerslistComponent } from '../propertyviewerslist/propertyviewerslist.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { PropertyViewCardComponent } from "../../components/property-view-card/property-view-card.component";

@Component({
  selector: 'app-propertyviews',
  templateUrl: './propertyviews.component.html',
  styleUrls: ['./propertyviews.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    PropertyViewCardComponent
],
})
export class PropertyviewsComponent implements OnInit {
  private modalController = inject(ModalController);

  async showViewersList() {
    const modal = await this.modalController.create({
      component: PropertyviewerslistComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });

    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  constructor() {
    addIcons({ chevronBackOutline, eye });
  }

  ngOnInit() {
    return;
  }
}

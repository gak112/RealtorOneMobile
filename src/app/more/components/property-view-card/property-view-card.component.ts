import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
} from '@angular/core';
import {
  IonCard,
  IonImg,
  ModalController
} from '@ionic/angular/standalone';
import { PropertyviewerslistComponent } from '../../pages/propertyviewerslist/propertyviewerslist.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-property-view-card',
  templateUrl: './property-view-card.component.html',
  styleUrls: ['./property-view-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyViewCardComponent implements OnInit {
  private modalController = inject(ModalController);

  async openViewersList() {
    const modal = await this.modalController.create({
      component: PropertyviewerslistComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });

    await modal.present();
  }
  constructor() {}

  ngOnInit() {}
}

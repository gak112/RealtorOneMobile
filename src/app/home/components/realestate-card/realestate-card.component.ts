import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  IonIcon,
  IonImg,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowRedoOutline, heartOutline } from 'ionicons/icons';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { PropertyFullViewComponent } from '../../pages/property-full-view/property-full-view.component';

@Component({
  selector: 'app-realestate-card',
  templateUrl: './realestate-card.component.html',
  styleUrls: ['./realestate-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RealestateCardComponent implements OnInit {
  private modalController = inject(ModalController);

  async openPropertyDetails() {
    const modal = await this.modalController.create({
      component: PropertyFullViewComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });

    await modal.present();
  }
  property = input.required<IProperty>();
  constructor() {
    addIcons({
      heartOutline,
      arrowRedoOutline,
    });
  }

  ngOnInit() {}
}

export interface IProperty {
  id: string;
  propertyTitle: string;
  salePrice: number;
  location: string;
  houseType: string;
  bhkType: string;
  propertySize: string;
  propertyImages: IPropertyImage[];
  agentName: string;
  propertyId: string;
  saleType: string;
  propertyStatus: string;
  category: string;
  rentPrice: number;
}

export interface IPropertyImage {
  id: string;
  image: string;
}

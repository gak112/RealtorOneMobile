import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { IonIcon, IonLabel, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  create,
  ellipsisVertical,
  heartOutline,
  trash,
} from 'ionicons/icons';

@Component({
  selector: 'app-my-property-card',
  templateUrl: './my-property-card.component.html',
  styleUrls: ['./my-property-card.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyPropertyCardComponent implements OnInit {
  property = input.required<IPropertyDetails>();
  constructor() {
    addIcons({
      heartOutline,
      ellipsisVertical,
      create,
      trash,
    });
  }

  ngOnInit() {}

  isMenuOpen = signal(false);

  openMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }
}

export interface IPropertyDetails {
  id: string;
  price: number;
  locationCode: string;
  location: string;
  propertyType: string;
  propertySize: string;
  propertySqft: string;
  propertyImages: IPropertyImage[];
  type: string;
  agentName: string;
  propertyId: string;
  listingType: string;
  propertyStatus: string;
}

export interface IPropertyImage {
  id: string;
  image: string;
}

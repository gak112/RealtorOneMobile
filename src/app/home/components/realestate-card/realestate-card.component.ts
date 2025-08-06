import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  OnInit,
} from '@angular/core';
import { addIcons } from 'ionicons';
import { heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-realestate-card',
  templateUrl: './realestate-card.component.html',
  styleUrls: ['./realestate-card.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RealestateCardComponent implements OnInit {
  property = input.required<IProperty>();
  constructor() {
    addIcons({
      heartOutline,
    });
  }

  ngOnInit() {}
}

export interface IProperty {
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

import { StringTokenKind } from '@angular/compiler';
import { Component, input, OnInit } from '@angular/core';
import { IonIcon, IonImg, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-amenities-card',
  templateUrl: './amenities-card.component.html',
  styleUrls: ['./amenities-card.component.scss'],
  standalone: true,
  imports: [IonLabel, IonImg, IonIcon],
})
export class AmenitiesCardComponent implements OnInit {

amenity = input.required<IAmenitiesList>();


  constructor() {
    addIcons({
      create,
      trashOutline,
    });
  }

  ngOnInit() {}
}

export interface IAmenitiesList {
  id: number;
  amenityName: string;
  image: string;
  createdAt: number;
}
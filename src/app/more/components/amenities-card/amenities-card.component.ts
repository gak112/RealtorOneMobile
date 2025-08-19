import { Component, inject, input, OnInit } from '@angular/core';
import { IonIcon, IonLabel, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trashOutline } from 'ionicons/icons';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { AddAmenitiesComponent } from '../../pages/add-amenities/add-amenities.component';

@Component({
  selector: 'app-amenities-card',
  templateUrl: './amenities-card.component.html',
  styleUrls: ['./amenities-card.component.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon],
})
export class AmenitiesCardComponent implements OnInit {
  private modalController = inject(ModalController);

  amenity = input.required<IAmenitiesList>();

  constructor() {
    addIcons({
      create,
      trashOutline,
    });
  }

  async editAmenity() {
    console.log(this.amenity());

    const modal = await this.modalController.create({
      component: AddAmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        docId: this.amenity().id,
        initial: {
          amenityName: this.amenity().amenityName,
        },
      },
    });

    await modal.present();
  }

  ngOnInit() {}
}

export interface IAmenitiesList {
  id: number;
  amenityName: string;
  createdAt: number;
}

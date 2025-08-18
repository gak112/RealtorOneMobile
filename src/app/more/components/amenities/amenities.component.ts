import { Component, inject, Input, OnInit } from '@angular/core';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonImg,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
  IonIcon,
  IonFab,
  IonFabButton,
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';
import { AddAmenitiesComponent } from '../../pages/add-amenities/add-amenities.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { addIcons } from 'ionicons';
import { add, chevronBackOutline } from 'ionicons/icons';
import { AmenitiesCardComponent } from "../amenities-card/amenities-card.component";

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonImg,
    IonLabel,
    IonCheckbox,
    IonIcon,
    IonFab,
    IonFabButton,
    AmenitiesCardComponent
],
  providers: [ModalController],
})
export class AmenitiesComponent implements OnInit {
  private modalController = inject(ModalController);

  dismiss() {
    this.modalController.dismiss();
  }

  @Input() selectedAmenities: string[] = [];
  amenities;
  subscription: Subscription;

  constructor() {
    addIcons({
      chevronBackOutline,
      add,
    });
  }

  ngOnInit() {}

  selectedChange(event, index) {
    if (event.detail.checked) {
      this.amenities[index].selected = true;
    } else {
      this.amenities[index].selected = false;
    }
  }

  addItems() {
    const amenities = this.amenities.filter((amenity) => amenity.selected);
    this.modalController.dismiss(amenities);
  }

  async addAmenities() {
    const modal = await this.modalController.create({
      component: AddAmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

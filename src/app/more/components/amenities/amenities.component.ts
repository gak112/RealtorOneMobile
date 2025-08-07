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
} from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

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

  constructor(/*private afs: AngularFirestore,*/) {}

  ngOnInit() {
    if (this.selectedAmenities === undefined) {
      this.selectedAmenities = [];
    }
    // this.subscription = this.afs.collection('amenities').valueChanges({ idField: 'id' }).subscribe((amenities) => {

    //   this.amenities = amenities;

    //   this.amenities.forEach((amenity, i) => {

    //     this.selectedAmenities.forEach((selectedAmenity) => {

    //       if (amenity.amenity === selectedAmenity) {
    //         this.amenities[i].selected = true;
    //       }

    //     });

    //   });

    // });
  }

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

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

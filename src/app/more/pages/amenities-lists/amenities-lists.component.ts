import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonToolbar,
  IonTitle,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, chevronBackOutline } from 'ionicons/icons';
import { AddAmenitiesComponent } from '../add-amenities/add-amenities.component';
import {
  forwardEnterAnimation,
  backwardEnterAnimation,
} from 'src/app/services/animation';
import {
  AmenitiesCardComponent,
  IAmenitiesList,
} from '../../components/amenities-card/amenities-card.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  collection,
  collectionData,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-amenities-lists',
  templateUrl: './amenities-lists.component.html',
  styleUrls: ['./amenities-lists.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonToolbar,
    IonTitle,
    AmenitiesCardComponent,
  ],
})
export class AmenitiesListsComponent implements OnInit {
  private modalController = inject(ModalController);
  private afs = inject(AngularFirestore);


  // Live collection stream -> signal
  private col = collection(this.afs.firestore as any, 'amenities');
  private q = query(this.col, orderBy('createdAt'));
  private amenities$ = collectionData(this.q, {
    idField: 'id',
  }) as unknown as import('rxjs').Observable<IAmenitiesList[]>;
  amenities = toSignal(this.amenities$, { initialValue: [] });

  count = computed(() => this.amenities().length);


  constructor() {
    addIcons({ chevronBackOutline, add });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async addAmenities() {
    const modal = await this.modalController.create({
      component: AddAmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  ngOnInit() {}

  amenitiesList: IAmenitiesList[] = [
    {
      id: 1,
      amenityName: 'Swimming Pool',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 2,
      amenityName: 'Gym',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },
    {
      id: 3,
      amenityName: 'Parking',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },

    {
      id: 4,
      amenityName: 'Parking',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },

    {
      id: 5,
      amenityName: 'Parking',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },

    {
      id: 6,
      amenityName: 'Parking',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },

    {
      id: 7,
      amenityName: 'Parking',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },

    {
      id: 8,
      amenityName: 'Parking',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },

    {
      id: 9,
      amenityName: 'Parking',
      image: 'assets/img/onlylogo.png',
      createdAt: new Date().getTime(),
    },
  ];
}

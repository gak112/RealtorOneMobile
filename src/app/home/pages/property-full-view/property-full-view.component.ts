import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonImg,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronBackOutline,
  imagesOutline,
  locationOutline,
} from 'ionicons/icons';
import {
  AmentitycardComponent,
  IAmentity,
} from '../../components/amentitycard/amentitycard.component';
import { HomeAllPhotosComponent } from '../home-all-photos/home-all-photos.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-property-full-view',
  templateUrl: './property-full-view.component.html',
  styleUrls: ['./property-full-view.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonContent,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonImg,
    AmentitycardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PropertyFullViewComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({
      chevronBackOutline,
      locationOutline,
      callOutline,
      imagesOutline,
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {}

  async openAllPhotos() {
    const modal = await this.modalController.create({
      component: HomeAllPhotosComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  amentities = signal<IAmentity[]>([
    {
      id: '1',
      name: 'Swimming Pool',
      image:
        'https://img.staticmb.com/mbcontent/images/crop/uploads/2024/8/Swimming-Pool-Designs_0_1200.jpg.webp',
    },
    {
      id: '2',
      name: 'Gym',
      image: 'https://thumbs.dreamstime.com/b/gym-24699087.jpg',
    },
    {
      id: '3',
      name: 'Parking',
      image:
        'https://thumbs.dreamstime.com/b/underground-parking-cars-white-colors-30872672.jpg',
    },
  ]);
}

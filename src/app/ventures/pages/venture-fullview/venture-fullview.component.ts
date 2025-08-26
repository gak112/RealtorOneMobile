import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonLabel,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowRedoOutline,
  chevronBackOutline,
  globe,
  heartOutline,
  home,
  locationOutline,
  logoFacebook,
  logoInstagram,
  logoTwitter,
} from 'ionicons/icons';
import {
  AmentitycardComponent,
  IAmentity,
} from 'src/app/home/components/amentitycard/amentitycard.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { register } from 'swiper/element';
import { HouseFactsFeaturesComponent } from '../../components/house-facts-features/house-facts-features.component';
import { VenturefloordetailsComponent } from '../venturefloordetails/venturefloordetails.component';
import { HomeAllPhotosComponent } from 'src/app/home/pages/home-all-photos/home-all-photos.component';
register();

@Component({
  selector: 'app-venture-fullview',
  templateUrl: './venture-fullview.component.html',
  styleUrls: ['./venture-fullview.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    IonImg,
    IonLabel,
    AmentitycardComponent,
    IonButton,
    HouseFactsFeaturesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ModalController],
})
export class VentureFullviewComponent implements OnInit {
  private modalController = inject(ModalController);
  @Input() venture: any;
  safeURL: any;

  constructor(private sanitizer: DomSanitizer) {
    addIcons({
      chevronBackOutline,
      locationOutline,
      logoFacebook,
      logoTwitter,
      logoInstagram,
      globe,
      home,
      heartOutline,
      arrowRedoOutline,
    });
  }

  ngOnInit() {
    this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.venture?.brochure
    );
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openVentureFloorDetails() {
    const modal = await this.modalController.create({
      component: VenturefloordetailsComponent,
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

  async openAllPhotos() {
    const modal = await this.modalController.create({
      component: HomeAllPhotosComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
}

import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  IonCard,
  IonIcon,
  IonLabel,
  ModalController,
  IonImg,
} from '@ionic/angular/standalone';
import { VentureFullviewComponent } from '../../pages/venture-fullview/venture-fullview.component';
import { addIcons } from 'ionicons';
import { heartOutline, homeOutline, locationOutline } from 'ionicons/icons';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-venture-card',
  templateUrl: './venture-card.component.html',
  styleUrls: ['./venture-card.component.scss'],
  standalone: true,
  imports: [IonCard, IonIcon, IonLabel, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VentureCardComponent implements OnInit {
  private modalController = inject(ModalController);

  venture = input<IVentureDetails>();

  constructor() {
    addIcons({ locationOutline, heartOutline, homeOutline });
  }

  ngOnInit() {}

  async openVentureFullview() {
    const modal = await this.modalController.create({
      component: VentureFullviewComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }
}

export interface IVentureDetails {
  id: number;
  ventureName: string;
  ventureImage: IVentureImages[];
  ventureLocation: string;
  towerName: string | null;
  totalTowers: number | null;
  landSize: number;
  pricePerSqft: number;
  ventureStatus: string;
  postedDate: string;
}

export interface IVentureImages {
  id: number;
  image: string;
}

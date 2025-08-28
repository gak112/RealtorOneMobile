import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from '@ionic/angular/standalone';
import { ProductfilterComponent } from 'src/app/search/pages/productfilter/productfilter.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import {
  IVentureDetails,
  VentureCardComponent,
} from '../../components/venture-card/venture-card.component';
import { addIcons } from 'ionicons';
import { business } from 'ionicons/icons';
import { VentureTypeFormComponent } from '../venture-type-form/venture-type-form.component';
import { CreateVentureTypeFormComponent } from '../create-venture-type-form/create-venture-type-form.component';

@Component({
  selector: 'app-venturemain',
  templateUrl: './venturemain.component.html',
  styleUrls: ['./venturemain.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonFabList,
    IonFabButton,
    IonFab,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonSearchbar,
    IonContent,
    VentureCardComponent,
  ],
  providers: [ModalController],
})
export class VenturemainComponent implements OnInit {
  private modalController = inject(ModalController);
  constructor() {
    addIcons({
      business,
    });
  }

  ngOnInit() {
    return;
  }

  async openVentureTypeForm() {
    const modal = await this.modalController.create({
      component: CreateVentureTypeFormComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  async showFilters() {
    const modal = await this.modalController.create({
      component: ProductfilterComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });

    await modal.present();
  }

  ventures = signal<IVentureDetails[]>([
    {
      id: 1,
      ventureName: 'My Home Apartment',
      ventureImage: [
        {
          id: 1,
          image:
            'https://ucarecdn.com/a64fce22-5799-45c3-b980-3d653ca8a4e6~3//nth/0/',
        },
        {
          id: 2,
          image:
            'https://ucarecdn.com/a64fce22-5799-45c3-b980-3d653ca8a4e6~3//nth/0/',
        },
        {
          id: 3,
          image:
            'https://ucarecdn.com/a64fce22-5799-45c3-b980-3d653ca8a4e6~3//nth/0/',
        },
      ],
      ventureLocation: 'Hyderabad , Jubilee Hills',
      towerName: 'Sai Enclave',
      totalTowers: null,
      landSize: 100,
      pricePerSqft: 25000,
      ventureStatus: 'Active',
      postedDate: '5 days ago',
    },
    {
      id: 1,
      ventureName: 'My Home Apartment',
      ventureImage: [
        {
          id: 1,
          image:
            'https://ucarecdn.com/a64fce22-5799-45c3-b980-3d653ca8a4e6~3//nth/0/',
        },
      ],
      ventureLocation: 'Hyderabad , Jubilee Hills',
      towerName: null,
      totalTowers: 10,
      landSize: 100,
      pricePerSqft: 25000,
      ventureStatus: 'Active',
      postedDate: '5 days ago',
    },
  ]);
}

// src/app/home/components/my-property-card/my-property-card.component.ts
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonImg,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  create,
  ellipsisVertical,
  trash,
} from 'ionicons/icons';

import { PostentryComponent } from 'src/app/home/pages/postentry/postentry.component';
import {
  forwardEnterAnimation,
  backwardEnterAnimation,
} from 'src/app/services/animation';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-my-property-card',
  standalone: true,
  templateUrl: './my-property-card.component.html',
  styleUrls: ['./my-property-card.component.scss'],
  imports: [IonIcon, IonLabel, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyPropertyCardComponent implements OnInit {
  private modalController = inject(ModalController);
  private posts = inject(PostsService);
  private toastCtrl = inject(ToastController);

  property = input.required<IProperty>();
  isMenuOpen = signal(false);
  busy = signal(false);

  constructor() {
    addIcons({ ellipsisVertical, create, trash });
  }

  ngOnInit() {}

  openMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  async editProperty() {
    const p = this.property();
    const modal = await this.modalController.create({
      component: PostentryComponent,
      componentProps: {
        editId: p.id,             // hand your existing editor the id
        actionType: p.saleType,   // if your editor expects
        action: p.category,       // if your editor expects
      },
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
    this.isMenuOpen.set(false);
  }

  async deleteProperty() {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await this.posts.deleteSoft(this.property().id);
      const t = await this.toastCtrl.create({
        message: 'Property deleted',
        duration: 1500,
        color: 'success',
        position: 'top',
      });
      await t.present();
    } catch (e) {
      const t = await this.toastCtrl.create({
        message: 'Delete failed',
        duration: 1800,
        color: 'danger',
        position: 'top',
      });
      await t.present();
    } finally {
      this.busy.set(false);
      this.isMenuOpen.set(false);
    }
  }
}

export interface IProperty {
  id: string;
  propertyTitle: string;
  salePrice: number;
  rentPrice: number;
  location: string;
  houseType: string;
  bhkType: string;
  propertySize: string;
  propertyImages: IPropertyImage[];
  agentName: string;
  propertyId: string;
  saleType: string;     // 'sale' | 'rent'
  propertyStatus: string;
  category: string;     // residential / commercial / plots / lands
}

export interface IPropertyImage {
  id: string;
  image: string;
}

import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
  inject,
  input,
} from '@angular/core';
import {
  IonImg,
  IonLabel,
  IonSkeletonText,
  ModalController,
} from '@ionic/angular/standalone';
import { EditpropertyComponent } from '../../pages/editproperty/editproperty.component';
import { PostfullviewComponent } from 'src/app/home/pages/postfullview/postfullview.component';
import { PostUserHeaderComponent } from 'src/app/search/components/post-user-header/post-user-header.component';
import { register } from 'swiper/element';
import { NgIf } from '@angular/common';
import { PostLikesComponent } from 'src/app/search/components/post-likes/post-likes.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
register();

@Component({
  selector: 'app-savedpropertycard',
  templateUrl: './savedpropertycard.component.html',
  styleUrls: ['./savedpropertycard.component.scss'],
  standalone: true,
  imports: [
    PostUserHeaderComponent,
    NgIf,
    IonSkeletonText,
    IonLabel,
    PostLikesComponent,
    IonImg,
  ],
  providers: [ModalController],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SavedpropertycardComponent implements OnInit {
  property = input.required<ISavedPropertyDetails>();

  private modalController = inject(ModalController);
  constructor() {}

  onSwiper(swiper: any) {}
  onSlideChange() {}

  ngOnInit(): void {
    return;
  }

  async openFullview() {
    const modal = await this.modalController.create({
      component: PostfullviewComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }
  async editProperty(hit: any) {
    const modal = await this.modalController.create({
      component: EditpropertyComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }
}

export interface ISavedPropertyDetails {
  id: string;
  price: number;
  locationCode: string;
  location: string;
  propertyType: string;
  propertySize: string;
  propertySqft: string;
  propertyImages: IPropertyImage[];
  type: string;
  agentName: string;
  propertyId: string;
  listingType: string;
  propertyStatus: string;
}

export interface IPropertyImage {
  id: string;
  image: string;
}

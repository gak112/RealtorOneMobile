import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { IonImg, IonLabel, IonSkeletonText, ModalController } from '@ionic/angular/standalone';
import { EditpropertyComponent } from '../../pages/editproperty/editproperty.component';
import { PostfullviewComponent } from 'src/app/home/pages/postfullview/postfullview.component';
import { PostUserHeaderComponent } from 'src/app/search/components/post-user-header/post-user-header.component';
import { register } from 'swiper/element';
import {  NgIf } from '@angular/common';
import { PostLikesComponent } from 'src/app/search/components/post-likes/post-likes.component';
register();

@Component({
  selector: 'app-savedpropertycard',
  templateUrl: './savedpropertycard.component.html',
  styleUrls: ['./savedpropertycard.component.scss'],
  standalone: true,
  imports:[PostUserHeaderComponent,NgIf,IonSkeletonText,IonLabel,PostLikesComponent,IonImg],
  providers:[ModalController],

  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SavedpropertycardComponent implements OnInit {

  @Input() property: any;
  @Input() user: any;
  constructor(private modalController: ModalController) { }

  onSwiper(swiper: any) {
  }
  onSlideChange() {
  }

  ngOnInit(): void {
    return
  }

  async openFullview() {
    const modal = await this.modalController.create(
      {
        component: PostfullviewComponent,
        componentProps: { property: this.property, user: this.user }
      }
    );
    return await modal.present();
  }
  async editProperty(hit: any) {
    const modal = await this.modalController.create(
      {
        component: EditpropertyComponent,
        componentProps: { hit }
      }
    );
    return await modal.present();
  }
}

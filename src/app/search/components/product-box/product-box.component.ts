import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonIcon, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { PostfullviewComponent } from 'src/app/home/pages/postfullview/postfullview.component';
import { PostUserHeaderComponent } from '../post-user-header/post-user-header.component';
import { register } from 'swiper/element';
import { CommonModule, CurrencyPipe, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { PostLikesComponent } from '../post-likes/post-likes.component';
import { addIcons } from 'ionicons';
import { documentText, ellipsisVerticalOutline, trash } from 'ionicons/icons';
register();
@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss'],
  standalone: true,
  imports: [IonIcon,PostUserHeaderComponent,IonImg,IonLabel,NgFor,UpperCasePipe,CurrencyPipe,PostLikesComponent,NgIf,NgFor,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[ModalController],
})
export class ProductBoxComponent implements OnInit {

  @Input() hit: any;
  @Input() user: any;
  constructor(private modalController: ModalController) {
    addIcons({ documentText,trash,ellipsisVerticalOutline });
  }

  onSwiper(swiper: any) {
  }
  onSlideChange() {
  }

  ngOnInit(): void {
    return;
  }

  dummydetails: any = {
    resources: [
      { resourceUrl: "https://ucarecdn.com/882d06f0-0cb7-44b0-a4e7-eafb7d811699/" },
      { resourceUrl: "https://ucarecdn.com/c8577194-63e6-433e-8190-63977c6ef4a3/" },
      { resourceUrl: "https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/" }
    ],
    action: "sale",
    costOfProperty: 20202020,
    actionType: "Commercial",
    bhkType: "-2bhk",
    addressOfProperty: {
      address: "8R44+8FR, Kamapalli, Brahmapur, Odisha 760004, India - 760004"
    }
  }

  async openFullview() {
    const modal = await this.modalController.create(
        {
            component: PostfullviewComponent,
            //componentProps:{property: this.hit, user: this.user}
        }
    );
    return await modal.present();
  }

}

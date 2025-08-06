import { CommonModule, NgIf, NgFor } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { register } from 'swiper/element';
import { PostfullviewComponent } from '../../pages/postfullview/postfullview.component';
import { PostUserHeaderComponent } from 'src/app/search/components/post-user-header/post-user-header.component';
import { PostLikesComponent } from 'src/app/search/components/post-likes/post-likes.component';
import { IonImg, IonLabel, IonSkeletonText } from "@ionic/angular/standalone";

register();
@Component({
  selector: 'app-banner-product',
  templateUrl: './banner-product.component.html',
  styleUrls: ['./banner-product.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonSkeletonText,IonImg,IonLabel,NgIf,PostLikesComponent,NgFor,PostUserHeaderComponent,],
  providers:[ModalController],
})
export class BannerProductComponent implements OnInit {

  @Input() hit: any;
  @Input() user: any;
  property: any;

  dummyProperty = {
    resources: [{
      resourceUrl: "https://ucarecdn.com/c8577194-63e6-433e-8190-63977c6ef4a3/"
    }, {
      resourceUrl: "https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/"
    }],
    action: "Sale",
    costOfProperty: "202202020",
    actionType: "Commercial",
    bhkType: "3bhk",
    addressOfProperty: {
      address: "8R44+8FR, Kamapalli, Brahmapur, Odisha 760004, India - 760004"
    }
  }

  constructor(private modalController: ModalController, /*private afs: AngularFirestore*/) { }

  onSwiper(swiper: any) {
  }
  onSlideChange() {
  }

  ngOnInit(): void {
    return
    // this.afs.doc(`requests/${this.hit}`).valueChanges().subscribe((data: any) => {
    //   this.property = data;
    // });
  }

  async openFullview() {
    const modal = await this.modalController.create(
      {
        component: PostfullviewComponent,
        componentProps: { property: this.hit, user: this.user }
      }
    );
    return await modal.present();
  }

}

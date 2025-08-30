import { Component, OnInit, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { CouponBoxComponent } from '../../components/coupon-box/coupon-box.component';


@Component({
  selector: 'app-coupondetails',
  templateUrl: './coupondetails.component.html',
  styleUrls: ['./coupondetails.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,CouponBoxComponent],
providers:[ModalController],
})
export class CoupondetailsComponent  implements OnInit {
  private modalController = inject(ModalController);


  config;

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

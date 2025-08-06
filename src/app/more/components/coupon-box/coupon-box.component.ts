import { Component, OnInit } from '@angular/core';
import { ModalController, IonLabel, IonImg } from '@ionic/angular/standalone';
import { CouponappliedComponent } from '../../pages/couponapplied/couponapplied.component';

@Component({
  selector: 'app-coupon-box',
  templateUrl: './coupon-box.component.html',
  styleUrls: ['./coupon-box.component.scss'],
  standalone:true,
  imports:[IonLabel,IonImg,],
  providers:[ModalController],
})
export class CouponBoxComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    return
  }

  async openCouponApplied() {
    const modal = await this.modalController.create({
      component: CouponappliedComponent,
      cssClass: 'modal-settings'
    });
    await modal.present();
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import {
  ModalController,
  IonContent,
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonImg,
  IonCard
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { CoupondetailsComponent } from '../coupondetails/coupondetails.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { PaymentsAddressListComponent } from '../payments-address-list/payments-address-list.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    IonImg,
    IonCard
  ],
  providers: [ModalController],
})
export class SubscriptionsComponent implements OnInit {
  private auth = inject(AuthService);
  private afs = inject(AngularFirestore);

  private modalController = inject(ModalController);

  language;
  user;
  finalPaymentProcessing = false;

  sProperties = [10, 30, 100, 200, 500, 1000, '1000+'];
  months = [3, 6, 12];

  basicAmount = 499;
  vAmount = 0;

  vProperties;
  vMonths;
  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return;
    // this.auth.user$.subscribe(user => {
    //     this.user = user;
    //   });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async couponDetails() {
    const modal = await this.modalController.create({
      component: CoupondetailsComponent,
    });
    await modal.present();
  }

  async successPage() {
    // const modal = await this.modalController.create({
    //   component: SuccessPageComponent
    // });
    // await modal.present();
  }

  async paymentsAddressPage() {
    const modal = await this.modalController.create({
      component: PaymentsAddressListComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  changeProperties(event) {
    this.vProperties = event.detail.value;

    this.calculateAmounts();
  }

  changePropertiesM(event: any) {
    this.vMonths = event.detail.value;

    this.calculateAmounts();
  }

  calculateAmounts() {
    let amount = 0;
    let percentage = 0;
    let monthsCount = 1;

    switch (this.vProperties) {
      case '10':
        switch (this.vMonths) {
          case 'monthly':
            percentage = 0;
            monthsCount = 1;
            amount = 399;
            break;
          case 'half':
            percentage = 10;
            monthsCount = 6;
            amount = 399;
            break;
          case 'yearly':
            percentage = 20;
            monthsCount = 12;
            amount = 399;
            break;
        }

        break;
      case '50':
        switch (this.vMonths) {
          case 'monthly':
            percentage = 0;
            monthsCount = 1;
            amount = 299;
            break;
          case 'half':
            percentage = 10;
            monthsCount = 6;
            amount = 299;
            break;
          case 'yearly':
            percentage = 20;
            monthsCount = 12;
            amount = 299;
            break;
        }
        break;
      case '100':
        switch (this.vMonths) {
          case 'monthly':
            percentage = 0;
            monthsCount = 1;
            amount = 199;
            break;
          case 'half':
            percentage = 10;
            monthsCount = 6;
            amount = 199;
            break;
          case 'yearly':
            percentage = 20;
            monthsCount = 12;
            amount = 199;
            break;
        }
        break;

      case '500':
        switch (this.vMonths) {
          case 'monthly':
            percentage = 0;
            monthsCount = 1;
            amount = 99;
            break;
          case 'half':
            percentage = 10;
            monthsCount = 6;
            amount = 99;
            break;
          case 'yearly':
            percentage = 20;
            monthsCount = 12;
            amount = 99;
            break;
        }
        break;
    }

    this.vAmount = Math.floor(
      this.vProperties * (monthsCount * (amount - (amount * percentage) / 100))
    );
  }

  changeBasicMonths(event: any) {
    const months = event.detail.value;

    let percentage = 0;
    let monthsCount = 1;

    switch (months) {
      case 'monthly':
        percentage = 0;
        monthsCount = 1;

        break;
      case 'half':
        percentage = 10;
        monthsCount = 6;
        break;
      case 'yearly':
        percentage = 20;
        monthsCount = 12;
        break;
    }

    this.basicAmount = Math.floor(
      monthsCount * (499 - (499 * percentage) / 100)
    );
  }
}

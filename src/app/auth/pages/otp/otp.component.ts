import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../../models/user.model';
import { ToastService } from 'src/app/services/toast.service';
// import { SMSService } from 'src/app/services/sms.service';
// import { EncrDecrService } from 'src/app/services/EncrDecr.service';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  ModalController,
  NavController,
} from '@ionic/angular/standalone';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AuthService } from 'src/app/services/auth.service';
import { interval, map, takeWhile } from 'rxjs';
// import firebase from 'firebase/compat/app';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgIf } from '@angular/common';
import * as randomize from 'randomatic';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonImg,
    IonLabel,
    IonInput,
    FormsModule,
    IonIcon,
    IonButton,
    NgIf,
  ],
  providers: [ModalController],
})
export class OtpComponent implements OnInit {
  @Input() user!: IUser;
  otp!: string;
  gotOTP!: number;
  time = 60;
  count = 0;
  loading = false;
  subscription: any;
  resendButton = false;

  coordinates: any;
  markerPositions: any;

  address: any;

  constructor(
    private toast: ToastService,
    /*private sms: SMSService,
    private ende: EncrDecrService,*/
    private modalController: ModalController,
    private nav: NavController
  ) /*private auth: AuthService, private afs: AngularFirestore*/ {}
  ngOnInit(): void {
    this.start();
  }

  start() {
    this.sendOTP();
    this.startInterval();
  }

  sendOTP(): void {
    if (this.count >= 3) {
      this.toast.showError('3 Attempts Completed');
      return;
    }

    this.count += 1;
    this.otp = randomize('0', 4);
    console.log(this.otp);
  }

  startInterval(): void {
    this.subscription = interval(1000)
      .pipe(takeWhile((value) => value <= 60))
      .subscribe((val) => {
        if (val >= 60) {
          this.resendButton = true;
        }
        this.time = 60 - val;
      });
  }

  setOTP(): void {
    if (this.otp.length === 4) {
      console.log(this.otp);
      if (this.otp.toString() === this.gotOTP.toString()) {
        this.register();
      } else {
        this.toast.showMessage('Please Enter Valid OTP');
      }
    } else {
      this.toast.showMessage('Please Enter Valid OTP');
    }
  }

  async register(): Promise<void> {
    if (this.loading === true) {
      return;
    }

    this.loading = true;
    const user: IUser = this.user;
    //     user.email = user.email.toLowerCase();

    user.loginEmail = user.phone + `@phone.com`;
    //  user.loginEmail = user.phone;

    // const userExist = await this.checkUserExist(user);

    // if (!userExist) {
    await this.addUser(user);
    this.toast.showMessage('Successfully Registered..');
    this.loading = false;
    this.modalController.dismiss({ success: 'success' });
    this.nav.navigateRoot('/tabs/home');
    // } else {
    //   this.toast.showError(
    //     `User with Phone ${user.email} already exists`);
    //   this.loading = false;
    //   this.modalController.dismiss();
    // }
  }

  async addUser(user: any): Promise<any> {
    // user.secureData = await this.ende.set('112411919112', user.secureData);
    // return this.auth
    //   .register(user.loginEmail, user.secureData)
    //   .then(async (success) => {
    //     user.uid = success.user.uid;
    //    // user.address = this.address;
    //     // user.geoPoints = {lat: this.coordinates.coords.latitude, lng: this.coordinates.coords.longitude};
    //     const batch = this.afs.firestore.batch();
    //     const userRef = this.afs.firestore.collection('users').doc(user.uid);
    //     const dashboardRef = this.afs.firestore.collection('dashboard').doc('1');
    //     batch.set(userRef, Object.assign(user));
    //     batch.set(dashboardRef, { users: firebase.firestore.FieldValue.increment(1),
    //       inactiveUsers: firebase.firestore.FieldValue.increment(1)});
    //     return await batch.commit();
    //   });
  }

  async checkUserExist(user: IUser) /*: Promise<boolean>*/ {
    // const users = await this.afs
    //   .collection(`users`, (ref) =>
    //     ref.where('loginEmail', '==', user.loginEmail)
    //   )
    //   .get()
    //   .pipe(map((data) => data.docs))
    //   .toPromise();
    // return Promise.resolve(users!.length > 0 ? true : false);
  }

  resend() {
    this.start();
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

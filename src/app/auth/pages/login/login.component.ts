import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule, NavController } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonSpinner,
  ModalController,
} from '@ionic/angular/standalone';
import { Subscription, interval, takeWhile } from 'rxjs';
// import { AuthService } from 'src/app/services/auth.service';
// import { SMSService } from 'src/app/services/sms.service';
import { ToastService } from 'src/app/services/toast.service';
import { RegisterComponent } from '../register/register.component';
import { CommonModule, NgIf } from '@angular/common';
import * as randomize from 'randomatic';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { chevronBackOutline, reloadOutline } from 'ionicons/icons';
import { register } from 'swiper/element';
import { OtpComponent } from '../otp/otp.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    IonIcon,
    IonImg,
    IonLabel,
    IonInput,
    FormsModule,
    NgIf,
    IonSpinner,
    RegisterComponent,
  ],
  providers: [ModalController],
})
export class LoginComponent implements OnInit {
  phone: string = '';
  loading = false;
  showPassword = false;

  user: any;
  validPhone = false;
  action = 'login';
  resendButton = false;
  subscription: Subscription | undefined;
  disablePhone = false;
  loginOTP!: number;
  time = 60;
  count = 0;
  otp!: string;
  gotOTP!: number;
  selectedCountry: any;
  currentUser: any;

  constructor(
    // private afs: AngularFirestore,
    // private auth: AuthService,
    private nav: NavController,
    private toast: ToastService,
    // private sms: SMSService,
    private modalController: ModalController
  ) {
    addIcons({ chevronBackOutline, reloadOutline });
  }

  ngOnInit(): void {
    return;
  }

  setLogin(event: any) {
    if (event) {
      this.action = 'login';
    }
  }

  dismiss() {
    this.nav.navigateRoot('/tabs/home');
  }

  register() {
    this.action = 'register';
  }

  submit() {
    this.loading = true;
    const email = `${this.phone}@phone.com`;
    const password: string = this.currentUser.secureData;

    // this.auth.login(email, password).then(async (sucess: any) => {

    //   const user: any = await firstValueFrom(this.afs.doc(`users/${sucess.user.uid}`).valueChanges());
    //   const isActive = (user.data() as any).active;

    //   if (!isActive) {
    //     this.toast.showMessage('your account has been disabled, Please Contact QuickStore');
    //     this.loading = false;
    //     this.auth.logout();
    //   } else {

    //     this.toast.showMessage('You have successfully logged in');
    //     this.loading = false;
    //   }

    //   this.afs.doc(`users/${sucess.user.uid}`).valueChanges().subscribe((data: any) => {

    //   });
    //   this.nav.navigateRoot('/tabs/home');
    // }).catch(err => {
    //   this.toast.showError(err.message);
    //   this.loading = false;
    // });
  }

  setOTP(): void {
    const otp = parseInt(this.otp);

    this.gotOTP = this.loginOTP;
    console.log(this.gotOTP, this.loginOTP);

    if (this.otp.length === 4) {
      if (this.otp.toString() == this.gotOTP.toString()) {
        // this.register();

        // login logic

        const secureData = this.currentUser.secureData;
        const phone = this.phone + '@phone.com';

        // this.auth.login(phone, secureData).then(async (sucess: any) => {
        //   this.nav.navigateRoot('/tabs/home');
        // });
      } else {
        this.toast.showMessage('Please Enter Valid OTP');
      }
    } else {
      this.toast.showMessage('Please Enter Valid OTP');
    }
  }

  verify() {
    if (this.loading) {
      return;
    }

    this.loading = true;

    if (this.phone === null) {
      this.toast.showError('Enter valid Phone Number');
      return;
    }

    // this.auth.verifyPhone(this.phone + '@phone.com').then(async (data: any) => {

    //   // const user: any = await firstValueFrom((this.afs.doc(`users/${data.user.uid}`).valueChanges()));

    //   // const isActive = user.active;

    //   // if(!isActive) {
    //   //   this.toast.showMessage('your account has been disabled, Please Contact RealtorOne');
    //   //   this.loading = false;
    //   //   this.auth.logout();
    //   // } else {

    //   // this.toast.showMessage('You have successfully logged in');
    //   // this.loading = false;
    //   // }

    //   if (data === false) {

    //     this.toast.showError('Phone Number Not Registered, Please Register');

    //     this.action = 'register';
    //     this.validPhone = false;

    //     this.loading = false;
    //   } else {

    //     this.validPhone = true;
    //     this.disablePhone = true;
    //     this.currentUser = data;
    //     this.start(data);
    //   }

    //   //   this.otp = data.otp;
    //   this.loading = false;
    // }).catch(err => {
    //   this.toast.showError(err.message);
    //   this.loading = false;
    // })
  }

  start(data: any) {
    this.sendOTP(data);
    this.startInterval();
  }

  sendOTP(data: { phone: string }): void {
    if (this.count >= 3) {
      this.toast.showError('3 Attempts Completed');
      return;
    }

    this.count += 1;
    this.otp = randomize('0', 4);
    // this.otp = '0123';
    console.log(this.otp);
    //this.sms.processOTPSMS(this.otp, data.phone);
  }

  startInterval(): void {
    this.subscription = interval(1000)
      .pipe(takeWhile((value: any) => value <= 60))
      .subscribe((val: number) => {
        if (val >= 60) {
          this.resendButton = true;
        }
        this.time = 60 - val;
      });
  }

  resend() {
    this.resendButton = false;
    this.start(this.currentUser);
  }

  async opensetOTP() {
    const modal = await this.modalController.create({
      component: OtpComponent,
    });

    await modal.present();
  }

  // number to word
}

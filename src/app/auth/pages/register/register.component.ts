import { Component, OnInit, inject, input, output } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  IonButton,
  IonImg,
  IonInput,
  IonLabel,
  ModalController,
  NavController, IonContent } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { IUser } from '../../models/user.model';
// import firebase from 'firebase/compat/app';
import { serverTimestamp } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OtpComponent } from '../otp/otp.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [IonContent, IonImg, IonLabel, ReactiveFormsModule, IonInput, IonButton],
  providers: [ModalController],
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalController = inject(ModalController);
  private toast = inject(ToastService);
  private nav = inject(NavController);

  readonly setLogin = output();
  registerForm: FormGroup;
  showPassword = false;
  loading = false;
  readonly phone = input<any>(undefined);

  phoneValid: any;
  initialCountry = { initialCountry: 'in' };
  country: any;
  selectedCountry: any;
  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(4)]],
      email: [''],
      phone: ['', [Validators.required, Validators.minLength(6)]],
      secureData: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    const phone = this.phone();
    if (phone) {
      this.registerForm.controls['phone'].setValue(phone);
    }
  }
  get f(): any {
    return this.registerForm.controls;
  }

  async register() {
    if (this.loading) {
      return;
    }

    const user: IUser = {
      uid: '',
      fullName: '',
      phone: '',
      loginEmail: '',
      email: '',
      photoURL: '',
      secureData: '',
      city: '',
      district: '',
      address: '',
      state: '',
      lCountry: '',
      pincode: '',
      active: true,
      // reporter: false,
      createdAt: null,
    };

    user.fullName = this.registerForm.controls['fullName'].value;
    user.phone = this.registerForm.controls['phone'].value;
    user.email = this.registerForm.controls['email'].value;
    user.loginEmail = user.phone + '@phone.com';
    user.secureData = this.registerForm.controls['secureData'].value;
    user.createdAt = serverTimestamp();

    const userExist = await this.checkUserExist(user);

    // if(userExist) {
    //   this.toast.showError(
    //     `User already exists`);
    //     return;
    // }

    this.loading = true;
    const modal = await this.modalController.create({
      component: OtpComponent,
      componentProps: { user },
    });

    await modal.present();

    const data: any = await modal.onDidDismiss();

    if (data) {
      if (data.data) {
        if (data.data.success === 'success') {
          // this.modalController.dismiss( {registered: 'registered'});
          this.nav.navigateRoot('/auth');
        }
      } else {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  setShowPassword(val: boolean) {
    this.showPassword = val;
  }

  async checkUserExist(user: IUser) /*: Promise<boolean>*/ {
    // const users = await this.afs
    //   .collection(`users`, (ref) =>
    //     ref.where('loginEmail', '==', user.loginEmail)
    //   )
    //   .get()
    //   .pipe(map((data: { docs: any; }) => data.docs))
    //   .toPromise();
    // return Promise.resolve(users.length > 0 ? true : false);
  }

  dismiss() {
    //  this.modalController.dismiss();
    this.nav.navigateRoot('/auth');
  }

  async goToLogin() {
    this.nav.navigateRoot('/auth');
  }
}

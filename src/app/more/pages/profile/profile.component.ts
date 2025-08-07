import { Component, inject, OnInit } from '@angular/core';
import { ProfileeditComponent } from '../profileedit/profileedit.component';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ActionSheetController,
  NavController,
} from '@ionic/angular';
import { Observable } from 'rxjs';
import { IProfile } from 'src/app/languages/interface/profile/profile.interface';
// import { AuthService } from 'src/app/services/auth.service';
// import { ProfileService } from 'src/app/services/profile.service';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonSkeletonText,
  IonToolbar,
  IonTitle,
  ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  call,
  cameraOutline,
  chevronBackOutline,
  location,
  mail,
  text,
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonContent,
    IonSkeletonText,
    IonImg,
    IonLabel,
    IonTitle,
  ],
})
export class ProfileComponent implements OnInit {
  private modalController = inject(ModalController);
  profiles$: any;
  address$: any;
  user: any;
  profileData!: IProfile;

  task: any;
  percentage$!: Observable<any>;
  snapshot!: Observable<any>;
  downloadURL: any;

  photo: any;
  baseimage: any;

  isUploadProcessRunning = false;
  constructor(
    /*private profileService: ProfileService,*/ private nav: NavController,

    // private auth: AuthService,
    // private afstorage: AngularFireStorage, private afs: AngularFirestore,
    private actionSheetController: ActionSheetController,
    private sanitizer: DomSanitizer
  ) {
    addIcons({ chevronBackOutline, cameraOutline, mail, call, location, text });
  }

  ngOnInit(): void {
    return;

    // this.auth.user$.subscribe(user => {
    //     this.user = user;
    //     this.profileData = new profileData().getData(user?.language || 'english');
    //   });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async goToAuth() {
    this.nav.navigateRoot('/auth');
    await this.modalController.dismiss();
  }

  async openProfileEdit() {
    const modal = await this.modalController.create({
      component: ProfileeditComponent,
      componentProps: { user: this.user },
    });
    return await modal.present();
  }

  async selectMedia() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [
        {
          text: 'Load From library',
          handler: () => {
            // this.takePhoto(CameraSource.Photos);
          },
        },
        {
          text: 'Use Camera',
          handler: () => {
            // this.takePhoto(CameraSource.Camera);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }
}

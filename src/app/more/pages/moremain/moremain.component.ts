import { Component, inject, OnInit } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import { ILeftMenu } from 'src/app/languages/interface/menuitem/leftmenu.interface';
import Swal from 'sweetalert2';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { Camera } from '@capacitor/camera';
import { ImagemodalComponent } from 'src/app/more/pages/imagemodal/imagemodal.component';
import { SavedpropertiesComponent } from '../savedproperties/savedproperties.component';
import { PrivacypolicyComponent } from '../privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from '../termsandconditions/termsandconditions.component';
import { AddonsComponent } from '../addons/addons.component';
import { AgentprofileComponent } from '../agentprofile/agentprofile.component';
import { LanguageComponent } from '../language/language.component';
import { PaymentsComponent } from '../payments/payments.component';
import { ContactusComponent } from '../contactus/contactus.component';
import { FaqsComponent } from '../faqs/faqs.component';
import { MyrequestsComponent } from '../myrequests/myrequests.component';
import { SubscriptionsComponent } from '../subscriptions/subscriptions.component';
import { InitialrequestComponent } from '../initialrequest/initialrequest.component';
import { LeftMenuData } from 'src/app/languages/data/menuitem/leftmenu.data';
import { environment } from 'src/environments/environment';
import {
  ActionSheetController,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonProgressBar,
  IonTitle,
  IonToggle,
  IonToolbar,
  ModalController,
  NavController,
  IonSkeletonText,
  IonButton
} from '@ionic/angular/standalone';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe, CommonModule, DecimalPipe } from '@angular/common';
import { addIcons } from 'ionicons';
import {
  cameraOutline,
  moonOutline,
  personOutline,
  chevronForwardOutline,
  gitCompareOutline,
  businessOutline,
  bookmarkOutline,
  helpOutline,
  mailOutline,
  clipboardOutline,
  documentOutline,
  lockClosedOutline,
  logOutOutline,
} from 'ionicons/icons';
import { PropertyviewsComponent } from '../propertyviews/propertyviews.component';
import { DeleteaccountComponent } from '../deleteaccount/deleteaccount.component';
import { ThemeService } from 'src/app/services/theme.service';
import { AmenitiesComponent } from '../../components/amenities/amenities.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { AmenitiesListsComponent } from '../amenities-lists/amenities-lists.component';
import { BillingComponent } from 'src/app/home/pages/billing/billing.component';
import { VillaconfigureComponent } from '../villaconfigure/villaconfigure.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-moremain',
  templateUrl: './moremain.component.html',
  styleUrls: ['./moremain.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonImg,
    IonIcon,
    IonLabel,
    IonItem,
    IonToggle,
    IonListHeader
    ],
  providers: [ModalController],
})
export class MoremainComponent implements OnInit {
  private themeService = inject(ThemeService);

  userLogos: any;
  leftMenuData: ILeftMenu;
  user: any = {
    photo:
      'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a6c08249-45b1-4852-ac3c-f5e49a7f6d25/d6v0umi-48db83ce-8367-4e06-b71c-103b296794c5.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2E2YzA4MjQ5LTQ1YjEtNDg1Mi1hYzNjLWY1ZTQ5YTdmNmQyNVwvZDZ2MHVtaS00OGRiODNjZS04MzY3LTRlMDYtYjcxYy0xMDNiMjk2Nzk0YzUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.HhR535GRJ9MzqUS54LJ2XWtf-Y2v-aOuN4GTD6MC0q4',
  };
  photo: any;
  baseimage!: string;
  isUploadProcessRunning = false;
  task: any;
  percentage$!: Observable<any>;
  snapshot!: Observable<any>;
  downloadURL: any;

  constructor(
    private modalController: ModalController,
    private changePasswordModalController: ModalController,
    /*private afs: AngularFirestore,*/
    private nav: NavController,
    private sanitizer: DomSanitizer /* private afstorage: AngularFireStorage,*/,
    private actionSheetController: ActionSheetController,
    private auth: AuthService
  ) {
    addIcons({
      cameraOutline,
      moonOutline,
      personOutline,
      chevronForwardOutline,
      gitCompareOutline,
      businessOutline,
      bookmarkOutline,
      helpOutline,
      mailOutline,
      clipboardOutline,
      documentOutline,
      lockClosedOutline,
      logOutOutline,
    });
    this.leftMenuData = new LeftMenuData().getData(environment.language);
  }

  ngOnInit(): void {
    return;
    // this.auth.user$.subscribe((user: { language: any; }) => {
    //   this.user = user;

    //   this.leftMenuData = new LeftMenuData().getData(user?.language || 'english');

    // });
  }

  async setTheme() {
    this.themeService.setTheme();
  }

  theme = this.themeService.theme;

  async deleteAccount() {
    const modal = await this.modalController.create({
      component: DeleteaccountComponent,
      componentProps: { user: this.user },
      breakpoints: [0, 0, 1],
      initialBreakpoint: 0.65,
    });
    return await modal.present();
  }

  async openInitialRequest() {
    const modal = await this.modalController.create({
      component: InitialrequestComponent,
    });
    return await modal.present();
  }

  async goToSubcriptions() {
    const modal = await this.changePasswordModalController.create({
      component: SubscriptionsComponent,
    });
    return await modal.present();
  }

  async goToMyRequests() {
    const modal = await this.changePasswordModalController.create({
      component: MyrequestsComponent,
      componentProps: { user: this.user },
    });
    return await modal.present();
  }

  async faqs() {
    const modal = await this.changePasswordModalController.create({
      component: FaqsComponent,
    });
    return await modal.present();
  }
  async helpus() {
    const modal = await this.changePasswordModalController.create({
      component: ContactusComponent,
    });
    return await modal.present();
  }

  async goToMyPayments() {
    const modal = await this.changePasswordModalController.create({
      component: PaymentsComponent,
    });
    return await modal.present();
  }

  async openLanguage() {
    const modal = await this.modalController.create({
      component: LanguageComponent,
    });
    return await modal.present();
  }

  async goToProfile() {
    const modal = await this.modalController.create({
      component: ProfileComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async goToAgentProfile() {
    const modal = await this.modalController.create({
      component: AgentprofileComponent,
    });
    return await modal.present();
  }

  async goToBilling() {
    const modal = await this.modalController.create({
      component: BillingComponent,
    });
    return await modal.present();
  }

  async goToSubscription() {
    const modal = await this.modalController.create({
      component: SubscriptionsComponent,
    });
    return await modal.present();
  }

  async openAmenities() {
    const modal = await this.modalController.create({
      component: AmenitiesListsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    return await modal.present();
  }

  async openAddons() {
    const modal = await this.modalController.create({
      component: AddonsComponent,
    });
    return await modal.present();
  }

  async termsConditions() {
    const modal = await this.modalController.create({
      component: TermsandconditionsComponent,
    });
    return await modal.present();
  }
  async privacyPolicy() {
    const modal = await this.modalController.create({
      component: PrivacypolicyComponent,
    });
    return await modal.present();
  }

  async goToSavedProperties() {
    const modal = await this.modalController.create({
      component: SavedpropertiesComponent,
      componentProps: { user: this.user },
    });
    return await modal.present();
  }

  async openAuth() {
    this.nav.navigateRoot('/auth');
  }

  async openFullImage(images: any) {
    const modal = await this.modalController.create({
      component: ImagemodalComponent,
      componentProps: { media: images },
    });
    return await modal.present();
  }

  async goToPropertyViews() {
    const modal = await this.modalController.create({
      component: PropertyviewsComponent,
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
            this.takePhoto(CameraSource.Photos);
          },
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePhoto(CameraSource.Camera);
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

  async takePhoto(sourceType: CameraSource) {
    // sourceType: CameraSource

    const options = {
      quality: 100,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: sourceType,
    };

    const image = await Camera.getPhoto(options);

    this.photo = this.sanitizer.bypassSecurityTrustResourceUrl(
      image && image.dataUrl
    );

    this.isUploadProcessRunning = true;

    this.baseimage = image.dataUrl;
    //  this.baseimage = this.photo;

    // Node Functions
    const randomName = Math.floor(Math.random() * 899999 + 100000);

    const fileName = `${new Date().getTime()}_${randomName}`;

    let imgIndex;
    try {
      imgIndex = 0;
    } catch (ex) {
      alert('Image Index Error ' + ex);
    }

    const path = `request/${fileName}.jpeg`;

    try {
      // this.task = this.afstorage.ref(path).putString(this.baseimage, 'data_url');
    } catch (ex) {
      alert('task assign error ' + ex);
    }

    try {
      this.percentage$ = this.task.percentageChanges();
    } catch (ex) {
      alert(
        'Server Percentage Observable Push Error' +
          ' Img Index ' +
          imgIndex +
          ' Error ' +
          ex
      );
    }

    try {
      this.snapshot = this.task.snapshotChanges().pipe(
        tap((snap: any) => {
          if (snap.bytesTransferred === snap.totalBytes) {
            // Update firestore on completion
            // this.afs.collection('photos').add({ path, size: snap.totalBytes });
          }
        }),
        finalize(() => {
          // const downloadURL = this.afstorage.ref(path).getDownloadURL();
          // downloadURL.subscribe((val: any) => {
          //   this.downloadURL = val;
          //   this.isUploadProcessRunning = false;
          //   this.task = null;
          //   this.snapshot = null;
          //   this.percentage$ = null;
          //   // this.afs.doc(`users/${this.user.uid.trim()}`).update({ photo: val }).then(() => {
          //   //   this.user.photoURL = val;
          //   // });
          //   // this.userForm.controls['photo'].setValue(val);
          // });
        })
      );
    } catch (ex) {
      alert('Task then Error ' + ex);
      this.isUploadProcessRunning = false;
    }
  }

  alertLogout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to Logout?',
      //  type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.logout();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your Event is safe :)', 'error');
      }
    });
  }

  logout() {
    // this.auth.logout();
    this.nav.navigateRoot('/login');
  }
}

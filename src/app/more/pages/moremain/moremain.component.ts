import { Component, inject, OnInit, computed } from '@angular/core';
import { Observable, finalize, tap } from 'rxjs';
import Swal from 'sweetalert2';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import {
  ActionSheetController,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonToggle,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular/standalone';


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
  logOutOutline,
  chevronBackOutline,
} from 'ionicons/icons';

import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';

// Standalone pages/components (opened via ModalController)
import { ImagemodalComponent } from 'src/app/more/pages/imagemodal/imagemodal.component';
import { SavedpropertiesComponent } from '../savedproperties/savedproperties.component';
import { PrivacypolicyComponent } from '../privacypolicy/privacypolicy.component';
import { TermsandconditionsComponent } from '../termsandconditions/termsandconditions.component';
import { AgentprofileComponent } from '../agentprofile/agentprofile.component';
import { LanguageComponent } from '../language/language.component';
import { PaymentsComponent } from '../payments/payments.component';
import { FaqsComponent } from '../faqs/faqs.component';
import { MyrequestsComponent } from '../myrequests/myrequests.component';
import { SubscriptionsComponent } from '../subscriptions/subscriptions.component';
import { InitialrequestComponent } from '../initialrequest/initialrequest.component';
import { PropertyviewsComponent } from '../propertyviews/propertyviews.component';
import { AmenitiesListsComponent } from '../amenities-lists/amenities-lists.component';
import { BillingComponent } from 'src/app/home/pages/billing/billing.component';
import { ProfileComponent } from '../profile/profile.component';
import { ContactusComponent } from '../contactus/contactus.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

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
  // DI
  private themeService = inject(ThemeService);
  private modalController = inject(ModalController);
  private actionSheetController = inject(ActionSheetController);
  private nav = inject(NavController);
  private sanitizer = inject(DomSanitizer);
  private auth = inject(AuthService);
  private toast = inject(ToastController);

  // Live user from AuthService
  user = toSignal(this.auth.user$, { initialValue: null });

  // Theme signal from service
  theme = this.themeService.theme;

  // Derived UI fields
  displayName = computed(() => {
    const u: any = this.user();
    return (u?.fullName || u?.displayName || u?.name || '').trim();
  });

  userPhoto = computed(() => {
    const u: any = this.user();
    return u?.photo || u?.photoURL || '';
  });

  initials = computed(() => {
    const name = this.displayName();
    if (!name) return 'U';
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    return (first + second).toUpperCase() || 'U';
  });

  userAgent = computed(() => {
    const u: any = this.user();
    return !!u?.agent;
  });

  isDark = computed(() => this.theme() === 'dark');

  constructor() {
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
      logOutOutline,
      chevronBackOutline,
    });
  }

  ngOnInit(): void {
    // If you need to react to login success (first non-null user), do it here.
    // Example:
    // effect(() => {
    //   if (this.user()) { this.presentToast('Welcome back!', 'success'); }
    // });
  }

  // ---------- Theme ----------
  onThemeToggle(ev: CustomEvent) {
    try {
      const checked = !!(ev as any)?.detail?.checked;
      this.themeService.setTheme(checked ? 'dark' : 'light');
    } catch (e) {
      this.presentToast('Failed to apply theme.', 'danger');
    }
  }

  // ---------- Navigation helpers (robust) ----------
  private async openModal(component: any, props?: Record<string, any>) {
    try {
      const modal = await this.modalController.create({
        component,
        componentProps: props || {},
      });
      await modal.present();
    } catch (e) {
      console.error('[More] openModal error:', e);
      this.presentToast('Unable to open page. Please try again.', 'danger');
    }
  }

  openAbout() {
    // Replace with a real About component if you have one
    this.presentToast('About page coming soon.', 'medium');
  }

  async goToProfile() {
    const modal = await this.modalController.create({
      component: ProfileComponent,
      componentProps: { user: this.user() },
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async goToAgentProfile() {
    const modal = await this.modalController.create({
      component: AgentprofileComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async goToBilling() {
    const modal = await this.modalController.create({
      component: BillingComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async goToSubscription() {
    const modal = await this.modalController.create({
      component: SubscriptionsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async goToMyRequests() {
    const modal = await this.modalController.create({
      component: MyrequestsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async goToSavedProperties() {
    const modal = await this.modalController.create({
      component: SavedpropertiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async goToPropertyViews() {
    const modal = await this.modalController.create({
      component: PropertyviewsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async openAmenities() {
    const modal = await this.modalController.create({
      component: AmenitiesListsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async openInitialRequest() {
    const modal = await this.modalController.create({
      component: InitialrequestComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async faqs() {
    const modal = await this.modalController.create({
      component: FaqsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async helpus() {
    const modal = await this.modalController.create({
      component: ContactusComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async termsConditions() {
    const modal = await this.modalController.create({
      component: TermsandconditionsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async privacyPolicy() {
    const modal = await this.modalController.create({
      component: PrivacypolicyComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }
  async openLanguage() {
    const modal = await this.modalController.create({
      component: LanguageComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  // ---------- Full-image viewer ----------
  async openFullImage(images: string[]) {
    if (!images?.length) return;
    await this.openModal(ImagemodalComponent, { media: images });
  }

  // ---------- Camera / Image selection ----------
  async selectMedia() {
    try {
      const actionSheet = await this.actionSheetController.create({
        header: 'Select Image source',
        buttons: [
          {
            text: 'Load From Library',
            handler: () => this.takePhoto(CameraSource.Photos),
          },
          {
            text: 'Use Camera',
            handler: () => this.takePhoto(CameraSource.Camera),
          },
          { text: 'Cancel', role: 'cancel' },
        ],
      });
      await actionSheet.present();
    } catch (e) {
      console.error('[More] ActionSheet error:', e);
      this.presentToast('Unable to open image options.', 'danger');
    }
  }

  async takePhoto(sourceType: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: sourceType,
      });

      const dataUrl = image?.dataUrl;
      if (!dataUrl) throw new Error('No image data');

      // TODO: Upload to storage here, then update user profile photo.
      // await this.storageSvc.uploadUserPhoto(this.userId, dataUrl)
      // const url = await ...
      // await this.userSvc.update({ photo: url });

      await this.presentToast('Photo selected (upload stub).', 'success');
    } catch (e: any) {
      const msg =
        e?.message?.includes('No camera') || e?.message?.includes('denied')
          ? 'Camera not available or permission denied.'
          : 'Failed to capture image.';
      console.error('[More] takePhoto error:', e);
      this.presentToast(msg, 'danger');
    }
  }

  // ---------- Auth ----------
  async openAuth() {
    try {
      this.nav.navigateRoot('/auth');
    } catch {
      this.presentToast('Navigation failed.', 'danger');
    }
  }

  alertLogout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        this.logout();
      }
    });
  }

  logout() {
    try {
      // await this.auth.logout(); // uncomment when implemented
      this.nav.navigateRoot('/login');
    } catch (e) {
      this.presentToast('Logout failed.', 'danger');
    }
  }

  // ---------- Toast helper ----------
  private async presentToast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
  ) {
    const t = await this.toast.create({
      message,
      duration: 1500,
      position: 'top',
      color,
    });
    await t.present();
  }
}

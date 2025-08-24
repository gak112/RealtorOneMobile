import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  inject,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import {
  IonImg,
  IonLabel,
  IonSkeletonText,
  IonIcon,
  ToastController,
  ModalController,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import { SavedDocPayload, SavedService } from '../../services/saved.service';
import { IProperty } from 'src/app/models/property.model';
import { PropertyFullViewComponent } from 'src/app/home/pages/property-full-view/property-full-view.component';
import {
  forwardEnterAnimation,
  backwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-savedpropertycard',
  standalone: true,
  templateUrl: './savedpropertycard.component.html',
  styleUrls: ['./savedpropertycard.component.scss'],
  imports: [IonSkeletonText, IonLabel, IonImg, IonIcon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SavedpropertycardComponent {
  /** Full property object (mapped from posts) */
  property = input.required<IProperty>();

  /** Admin identity (string uid or { uid }) */
  admin = input<string | { uid: string }>('admin');

  /** Optional: navigate to saved list after saving */
  redirectOnSave = input<boolean>(true);

  /** Let parent know what happened */
  saved = output<string>(); // emits propertyId on save
  unsaved = output<string>(); // emits propertyId on unsave
  removed = output<string>(); // for saved-list pages to prune locally

  private toastCtrl = inject(ToastController);
  private router = inject(Router);
  private savedSvc = inject(SavedService);
  private modalController = inject(ModalController);

  /** Prevent rapid double-taps */
  busy = signal(false);
  /** Error banner (non-blocking) */
  errorMsg = signal<string | null>(null);

  /** Template lookup; initialized in ngOnInit once inputs exist */
  private _isSavedLookup: () => boolean = () => false;

  constructor() {
    addIcons({ heart, heartOutline });
  }

  ngOnInit() {
    const p = this.property();
    const uid = this.uid();
    if (p?.id) {
      // reactive lookup used by template
      this._isSavedLookup = this.savedSvc.isSavedSignal(uid, p.id);
      // pre-load state (ignore failures)
      this.savedSvc.ensureLoaded(uid, p.id).catch(() => {});
    }
  }

  /** Used by template: returns current saved state */
  isSaved() {
    return this._isSavedLookup();
  }

  /** Formatted price line (₹ + grouping; rent shows period) */
  readonly priceLine = computed(() => {
    const p = this.property();
    const inr = (n: number | null | undefined) =>
      `₹${Number(n ?? 0).toLocaleString('en-IN')}`;
    if (p.saleType === 'sale') return inr(p.priceOfSale);
    const period = (p.priceOfRentType || '').trim() || 'Monthly';
    return `${inr(p.priceOfRent)} / ${period}`;
  });

  /** Toggle save/unsave */
  async onToggleFavorite(ev: Event) {
    ev.stopPropagation();
    if (this.busy()) return;
    this.busy.set(true);
    this.errorMsg.set(null);

    try {
      const p = this.property();
      if (!p?.id) throw new Error('Property not ready.');

      const action = await this.savedSvc.toggle(this.uid(), toSavedPayload(p));

      if (action === 'saved') {
        this.saved.emit(p.id);
        await this.presentToast('Saved to list', 'success');

        if (this.redirectOnSave()) {
          await this.router.navigateByUrl('/saved-properties', {
            replaceUrl: false,
          });
        }
      } else {
        this.unsaved.emit(p.id);
        this.removed.emit(p.id);
        await this.presentToast('Removed from saved', 'medium');
      }
    } catch (e: any) {
      const msg = e?.message || 'Action failed. Please try again.';
      this.errorMsg.set(msg);
      await this.presentToast(msg, 'danger');
    } finally {
      this.busy.set(false);
    }
  }

  async openPropertyDetails() {
    try {
      const modal = await this.modalController.create({
        component: PropertyFullViewComponent,
        componentProps: { propertyIn: this.property() },
        enterAnimation: forwardEnterAnimation,
        leaveAnimation: backwardEnterAnimation,
      });
      await modal.present();
    } catch (e: any) {
      const msg = e?.message || 'Unable to open property details.';
      this.errorMsg.set(msg);
      await this.presentToast(msg, 'danger');
    }
  }

  /** Helper: parse admin uid input */
  private uid(): string {
    const a = this.admin();
    return typeof a === 'string' ? a || 'admin' : a?.uid || 'admin';
  }

  private async presentToast(
    message: string,
    color: 'success' | 'medium' | 'danger' = 'medium'
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration: 1600,
      position: 'top',
      color,
    });
    await t.present();
  }
}

/** Build the Firestore payload from your domain model */
function toSavedPayload(p: IProperty): SavedDocPayload {
  return {
    id: p.id,
    propertyTitle: p.propertyTitle ?? '',
    addressOfProperty: p.addressOfProperty ?? '',
    saleType: p.saleType ?? 'sale', // 'sale' | 'rent'
    category: p.category ?? 'residential', // 'residential' | 'commercial' | 'plots' | 'lands'
    priceOfSale : Number(p.priceOfSale ?? 0),
    priceOfRent: Number(p.priceOfRent ?? 0),
    houseType: p.houseType ?? '',
    bhkType: p.bhkType ?? '',
    propertySize: p.propertySize ?? 0,
    propertyStatus: p.propertyStatus ?? '',
    agentName: p.agentName ?? '',
    propertyId: p.propertyId ?? '',
    propertyImages: Array.isArray(p.propertyImages) ? p.propertyImages : [],
    floor: p.floor ?? '',
    commercialType: p.commercialType ?? '',
  };
}

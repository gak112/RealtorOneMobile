import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  IonIcon,
  IonImg,
  IonLabel,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowRedoOutline, heart, heartOutline } from 'ionicons/icons';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { PropertyFullViewComponent } from '../../pages/property-full-view/property-full-view.component';

import { register } from 'swiper/element';
register();

import {
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IProperty, IPropertyImage } from 'src/app/models/property.model';
import {
  SavedDocPayload,
  SavedService,
} from 'src/app/more/services/saved.service';

@Component({
  selector: 'app-realestate-card',
  standalone: true,
  templateUrl: './realestate-card.component.html',
  styleUrls: ['./realestate-card.component.scss'],
  imports: [IonIcon, IonLabel, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RealestateCardComponent implements OnInit, OnDestroy {
  private modalController = inject(ModalController);
  private afs = inject(Firestore);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);
  private savedSvc = inject(SavedService);

  /** Card input — parent MUST pass this */
  property = input<IProperty>();

  /** Admin identity (optional). If omitted, 'admin' is used. */
  admin = input<string | { uid: string }>();

  /** Optional behavior flags */
  redirectOnSave = input<boolean>(false);
  removeFromFeedOnSave = input<boolean>(false);

  /** Outputs so parent can update lists in-place */
  saved = output<string>();
  unsaved = output<string>();

  /** UI state */
  busy = signal(false);
  private _isSaved = signal(false);

  /** Derived/normalized fields (lazy-safe to call) */
  readonly saleTypeKey = computed<'sale' | 'rent'>(() => {
    const t = (this.property().saleType || '').toString().trim().toLowerCase();
    return t === 'rent' ? 'rent' : 'sale';
  });

  readonly images = computed<IPropertyImage[]>(() => {
    const list = Array.isArray(this.property().propertyImages)
      ? this.property().propertyImages.filter(Boolean)
      : [];
    return list.length
      ? list
      : [{ id: 'noimg', image: 'assets/img/no-image.png' }];
  });

  readonly priceText = computed(() => {
    const p = this.property();
    const key = this.saleTypeKey();
    const sale = Number(p.priceOfSale ?? 0);
    const rent = Number(p.priceOfRent ?? 0);
    if (key === 'sale') return sale > 0 ? `₹${formatIN(sale)}` : '₹—';
    return rent > 0 ? `₹${formatIN(rent)}` : '₹—';
  });

  private unsubscribeSaved?: () => void;

  constructor() {
    addIcons({ heartOutline, heart, arrowRedoOutline });
  }

  private _isSavedLookup: () => boolean = () => false;

  ngOnInit() {
    // Now it's safe to read inputs
    const p = this.property();
    const uid = this.uid();

    if (p?.id) {
      // Prepare a reactive lookup for the template
      this._isSavedLookup = this.savedSvc.isSavedSignal(uid, p.id);
      // Optionally pre-load state from Firestore (safe to ignore failures)
      this.savedSvc.ensureLoaded(uid, p.id).catch(() => {});
    }
  }

  /** used by template */
  isSaved() {
    return this._isSavedLookup();
  }
  private uid(): string {
    const a = this.admin();
    return typeof a === 'string' ? a || 'admin' : a?.uid || 'admin';
  }

  ngOnDestroy() {
    this.unsubscribeSaved?.();
  }

  private adminUid(): string {
    const a = this.admin();
    if (typeof a === 'string' && a) return a;
    if (a && typeof a === 'object' && a.uid) return a.uid;
    return 'admin';
  }

  async openPropertyDetails() {
    const modal = await this.modalController.create({
      component: PropertyFullViewComponent,
      componentProps: { propertyIn: this.property() },
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  /** Save/Unsave favorite + notify parent + optional redirect */
  async onToggleFavorite(ev: Event) {
    ev.stopPropagation();
    if (this.busy()) return;
    this.busy.set(true);

    try {
      const p = this.property();
      if (!p?.id) throw new Error('Property not ready');
      const action = await this.savedSvc.toggle(this.uid(), toSavedPayload(p));

      if (action === 'saved') {
        await this.presentToast('Saved to list', 'success');
        if (this.redirectOnSave()) {
          await this.router.navigateByUrl('/saved-properties', {
            replaceUrl: false,
          });
        }
      } else {
        await this.presentToast('Removed from saved', 'medium');
      }
    } catch (e: any) {
      await this.presentToast(
        e?.message || 'Action failed. Please try again.',
        'danger'
      );
    } finally {
      this.busy.set(false);
    }
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

  private async toast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
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

/** Helpers */
function formatIN(n: number) {
  return Number(n).toLocaleString('en-IN');
}

function toSavedPayload(p: IProperty): SavedDocPayload {
  return {
    ...p,
    propertyImages: p.propertyImages.map((image) => ({
      id: image.id,
      image: image.image,
    })),
  };
}

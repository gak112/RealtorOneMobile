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

  /** Card input — parent MUST pass this */
  property = input.required<IProperty>();

  /** Admin identity (optional). If omitted, 'admin' is used. */
  admin = input<string | { uid: string }>();

  /** Optional behavior flags */
  redirectOnSave = input<boolean>(false);
  removeFromFeedOnSave = input<boolean>(false);

  /** Outputs so parent can update lists in-place */
  saved = output<string>();
  unsaved = output<string>();

  /** UI state */
  private busy = signal(false);
  private _isSaved = signal(false);
  readonly isSaved = computed(() => this._isSaved());

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

  ngOnInit() {
    // Inputs are bound now — safe to reference property()
    const ref = this.savedRef();
    this.unsubscribeSaved = onSnapshot(ref, (snap) => {
      this._isSaved.set(snap.exists());
    });
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

  private savedRef(): DocumentReference<DocumentData> {
    const uid = this.adminUid();
    return doc(
      this.afs,
      `admins/${uid}/saved_properties/${this.property().id}`
    );
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
  async toggleFavorite(ev: Event) {
    ev.stopPropagation();
    if (this.busy()) return;
    this.busy.set(true);

    try {
      const ref = this.savedRef();
      const p = this.property();

      if (this.isSaved()) {
        await deleteDoc(ref);
        this.unsaved.emit(p.id);
        await this.toast('Removed from saved', 'medium');
      } else {
        await setDoc(ref, {
          id: p.id,
          propertyTitle: p.propertyTitle ?? '',
          addressOfProperty: p.addressOfProperty ?? '',
          saleType: this.saleTypeKey(),
          category: p.category ?? '',
          priceOfSale: Number(p.priceOfSale ?? 0),
          priceOfRent: Number(p.priceOfRent ?? 0),
          priceOfRentType: p.priceOfRentType ?? '',
          houseType: p.houseType ?? '',
          bhkType: p.bhkType ?? '',
          commercialType: p.commercialType ?? '',
          floor: p.floor ?? '',
          propertySize: p.propertySize ?? '',
          propertyStatus: p.propertyStatus ?? '',
          agentName: p.agentName ?? '',
          propertyId: p.propertyId ?? '',
          propertyImages: p.propertyImages ?? [],
          createdAt: serverTimestamp(),
        });
        this.saved.emit(p.id);

        if (this.redirectOnSave()) {
          await this.router.navigate(['/saved-properties']);
        } else {
          await this.toast('Saved to favorites', 'success');
        }
      }
    } catch {
      await this.toast('Action failed. Please try again.', 'danger');
    } finally {
      this.busy.set(false);
    }
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

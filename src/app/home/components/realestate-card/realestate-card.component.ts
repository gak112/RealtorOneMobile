import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  output,
  OnInit,
  signal,
  computed,
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
  Firestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-realestate-card',
  standalone: true,
  templateUrl: './realestate-card.component.html',
  styleUrls: ['./realestate-card.component.scss'],
  imports: [IonIcon, IonLabel, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RealestateCardComponent implements OnInit {
  private modalController = inject(ModalController);
  private afs = inject(Firestore);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);

  /** Card input */
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
  isSaved = computed(() => this._isSaved());

  /** Derived/normalized fields (always safe to render) */
  // Normalize saleType → 'sale' | 'rent'
  readonly saleTypeKey = computed<'sale' | 'rent'>(() => {
    const t = (this.property().saleType || '').toString().trim().toLowerCase();
    return t === 'rent' ? 'rent' : 'sale';
  });

  // Guard images (always return at least one)
  readonly images = computed<IPropertyImage[]>(() => {
    const list = Array.isArray(this.property().propertyImages)
      ? this.property().propertyImages.filter(Boolean)
      : [];
    if (list.length > 0) return list;
    // fallback
    return [{ id: 'noimg', image: 'assets/img/no-image.png' }];
  });

  // Human readable price text
  readonly priceText = computed(() => {
    const p = this.property();
    const key = this.saleTypeKey();

    // coerce to number safely
    const sale = Number(p.priceOfSale ?? 0);
    const rent = Number(p.priceOfRent ?? 0);

    if (key === 'sale') {
      return sale > 0 ? `₹${formatIN(sale)}` : '₹—';
    } else {
      return rent > 0 ? `₹${formatIN(rent)} / Monthly` : '₹— / Monthly';
    }
  });

  constructor() {
    addIcons({ heartOutline, heart, arrowRedoOutline });
  }

  ngOnInit() {
    this.refreshSavedState();
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
      componentProps: { id: this.property().id },
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
      const uid = this.adminUid();
      const id = this.property().id;

      if (this._isSaved()) {
        await this.unsave(uid, id);
        this._isSaved.set(false);
        this.unsaved.emit(id);
        await this.toast('Removed from saved', 'medium');
      } else {
        await this.save(uid, this.property());
        this._isSaved.set(true);
        this.saved.emit(id);

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

  private async refreshSavedState() {
    const uid = this.adminUid();
    const ref = doc(this.afs, `admins/${uid}/saved_properties/${this.property().id}`);
    const snap = await getDoc(ref);
    this._isSaved.set(snap.exists());
  }

  private async save(uid: string, p: IProperty) {
    const ref = doc(this.afs, `admins/${uid}/saved_properties/${p.id}`);
    await setDoc(ref, {
      id: p.id,
      propertyTitle: p.propertyTitle ?? '',
      location: p.location ?? '',
      saleType: this.saleTypeKey(), // normalized
      category: p.category ?? '',
      priceOfSale: Number(p.priceOfSale ?? 0),
      priceOfRent: Number(p.priceOfRent ?? 0),
      priceOfRentType: p.priceOfRentType ?? '',
      houseType: p.houseType ?? '',
      bhkType: p.bhkType ?? '',
      propertySize: p.propertySize ?? '',
      propertyStatus: p.propertyStatus ?? '',
      agentName: p.agentName ?? '',
      propertyId: p.propertyId ?? '',
      propertyImages: p.propertyImages ?? [],
      createdAt: serverTimestamp(),
    });
  }

  private async unsave(uid: string, propertyId: string) {
    const ref = doc(this.afs, `admins/${uid}/saved_properties/${propertyId}`);
    await deleteDoc(ref);
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

export interface IProperty {
  id: string;
  propertyTitle: string;
  priceOfSale: number | null | undefined;
  location: string;
  houseType: string;
  bhkType: string;
  propertySize: string | number;
  propertyImages: IPropertyImage[];
  agentName: string;
  propertyId: string;
  saleType: string; // 'sale' | 'rent' | 'Sale' | 'Rent' (we normalize)
  propertyStatus: string;
  category: string;
  priceOfRent: number | null | undefined;
  priceOfRentType: string;
}

export interface IPropertyImage {
  id: string;
  image: string;
}

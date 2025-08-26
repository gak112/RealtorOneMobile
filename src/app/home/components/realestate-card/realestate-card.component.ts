import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  inject,
  input,
  OnInit,
  OnDestroy,
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

import { Router } from '@angular/router';
import { IProperty, IPropertyImage } from 'src/app/models/property.model';

// ⬇️ Use your flat-collection SavedService
import {
  SavedService,
  SavedDocPayload,
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
  /** REQUIRED: the property to render */
  property = input.required<IProperty>();

  /** Optional: admin identity; used as the `uid` for saves */
  admin = input<string | { uid: string }>('admin');

  /** Optional: navigate to saved list after saving (default false) */
  redirectOnSave = input<boolean>(false);

  /** Outputs (optional for parent feeds) */
  saved = output<string>(); // emits propertyId on save
  unsaved = output<string>(); // emits propertyId on unsave

  // DI
  private modalController = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);
  private savedSvc = inject(SavedService);

  // UI state
  busy = signal(false);

  // Saved-state lookup (provided by SavedService)
  private isSavedLookup: () => boolean = () => false;

  // Derived view bits
  readonly saleTypeKey = computed<'sale' | 'rent'>(() => {
    const t = (this.property().saleType ?? '').toString().trim().toLowerCase();
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

  constructor() {
    addIcons({ heartOutline, heart, arrowRedoOutline });
  }

  ngOnInit() {
    // Connect the heart state to the flat collection via the service
    const p = this.property();
    const uid = this.uid();
    if (p?.id) {
      this.isSavedLookup = this.savedSvc.isSavedSignal(uid, p.id); // reactive getter
      // Keep local flag in sync with DB (safe to ignore errors)
      this.savedSvc.ensureLoaded(uid, p.id).catch(() => {});
    }
  }

  ngOnDestroy() {
    // If you added per-card stop in the service, call it here:
    // this.savedSvc.stop(this.uid(), this.property().id);
  }

  // Expose to template
  isSaved() {
    return this.isSavedLookup();
  }

  private uid(): string {
    const a = this.admin();
    return typeof a === 'string' ? a || 'admin' : a?.uid || 'admin';
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

  /** Click handler for the heart (save/unsave) */
  async onToggleFavorite(ev: Event) {
    ev.stopPropagation();
    if (this.busy()) return;
    this.busy.set(true);

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
}

/** ----- Helpers ----- */

function formatIN(n: number) {
  return Number(n).toLocaleString('en-IN');
}

/** Build the flat-collection payload the service expects */
function toSavedPayload(p: IProperty): SavedDocPayload {
  return {
    id: p.id,
    propertyTitle: p.propertyTitle ?? '',
    addressOfProperty: p.addressOfProperty ?? '',
    saleType: (p.saleType ?? 'sale') as 'sale' | 'rent',
    category: (p.category ?? 'residential') as
      | 'residential'
      | 'commercial'
      | 'plots'
      | 'agriculturalLands',
    priceOfSale: Number(p.priceOfSale ?? 0),
    priceOfRent: Number(p.priceOfRent ?? 0),
    priceOfRentType: p.priceOfRentType ?? undefined,
    houseType: p.houseType ?? '',
    bhkType: p.bhkType ?? '',
    PlotArea:
      (typeof p.PlotArea === 'number'
        ? p.PlotArea
        : Number(p.PlotArea)) || 0,
    availabilityStatus: p.availabilityStatus ?? '—',
    agentName: p.agentName ?? '',
    propertyId: p.propertyId ?? p.id,
    floor: p.floor ?? undefined,
    commercialType: p.commercialType ?? undefined,
    propertyImages: Array.isArray(p.propertyImages)
      ? p.propertyImages.map((img, i) => ({
          id: String(img.id ?? `${p.id}-${i}`),
          image: String(img.image ?? ''),
        }))
      : [],
  };
}

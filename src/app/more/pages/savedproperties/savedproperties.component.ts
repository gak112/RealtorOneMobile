import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  where,
} from '@angular/fire/firestore';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { SavedpropertycardComponent } from '../../components/savedpropertycard/savedpropertycard.component';
import { IProperty } from 'src/app/models/property.model';
import { SavedService, SavedDocPayload } from '../../services/saved.service';

/** Flat collection doc shape (what SavedService writes) */
type SavedDocStored = SavedDocPayload & {
  uid: string;
  key: string; // `${uid}__${id}`
  createdAt?: any;
  updatedAt?: any;
  images?: string[]; // (legacy/fallback)
};

@Component({
  selector: 'app-savedproperties',
  standalone: true,
  templateUrl: './savedproperties.component.html',
  styleUrls: ['./savedproperties.component.scss'],
  imports: [
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    SavedpropertycardComponent,
  ],
})
export class SavedpropertiesComponent {
  private modalController = inject(ModalController);
  private afs = inject(Firestore);
  private savedSvc = inject(SavedService);
  private toast = inject(ToastController);

  constructor() {
    addIcons({ chevronBackOutline });
  }

  /** Accept either `[user]` or `[currentUid]` */
  user = input<any | null>(null);
  currentUid = input<string | null>(null);

  /** Effective uid */
  readonly uid = computed<string>(() => {
    const explicit = this.currentUid();
    if (explicit) return explicit;
    const u = this.user();
    if (typeof u === 'string' && u) return u;
    if (u && typeof u === 'object' && 'uid' in u && u.uid) return String(u.uid);
    return 'admin';
  });

  /** UI state */
  readonly errorMsg = signal<string | null>(null);
  private prunedIds = signal<Set<string>>(new Set());
  private qText = signal<string>('');

  dismiss() {
    this.modalController.dismiss();
  }

  /** Stream saved list from flat collection `saved_properties` */
  private savedDocs$ = toObservable(this.uid).pipe(
    switchMap((uid) => {
      const col = collection(this.afs, 'saved_properties');
      // NOTE: where('uid','==',uid) + orderBy('createdAt') may need an index
      const qRef = query(
        col,
        where('uid', '==', uid),
        orderBy('createdAt', 'desc') as any
      );
      return collectionData(qRef, { idField: 'key' }) as any;
    }),
    catchError((err) => {
      console.error('[saved-properties] stream error', err);
      this.errorMsg.set(
        'Failed to load saved properties. Pull to refresh or try again.'
      );
      return of([] as SavedDocStored[]);
    })
  );

  /** Helpers */
  private toNumber(n: unknown, fallback = 0): number {
    const x = typeof n === 'string' ? Number(n) : (n as number);
    return Number.isFinite(x) ? x : fallback;
  }
  private normalizeSaleType(v?: string): IProperty['saleType'] {
    const s = (v ?? '').toLowerCase().trim();
    return (s === 'rent' ? 'rent' : 'sale') as IProperty['saleType'];
  }
  private normalizeCategory(v?: string): IProperty['category'] {
    const s = (v ?? '').toLowerCase().trim();
    if (s.startsWith('com')) return 'commercial';
    if (s.startsWith('plot')) return 'plots';
    if (s.startsWith('land')) return 'agriculturalLands';
    if (s.startsWith('res')) return 'residential';
    if (['residential', 'commercial', 'plots', 'agriculturalLands'].includes(s))
      return s as IProperty['category'];
    return 'residential';
  }
  private toPropertyImages(d: SavedDocStored): IProperty['propertyImages'] {
    // prefer normalized propertyImages from SavedService; fallback to legacy images[]
    if (Array.isArray(d.propertyImages) && d.propertyImages.length) {
      return d.propertyImages
        .filter((x) => x && typeof x.image === 'string' && x.image)
        .map((x, i) => ({
          id: String(x.id ?? `${d.id}-${i}`),
          image: String(x.image),
        }));
    }
    if (Array.isArray(d.images)) {
      return d.images
        .filter(Boolean)
        .map((url, i) => ({ id: `${d.id}-${i}`, image: String(url) }));
    }
    return [];
  }

  /** Map flat doc -> IProperty */
  private toProperty = (d: SavedDocStored): IProperty => {
    const prop: Partial<IProperty> = {
      id: d.id,
      propertyTitle: String(d.propertyTitle ?? '—'),
      priceOfSale: this.toNumber(d.priceOfSale),
      priceOfRent: this.toNumber(d.priceOfRent),
      priceOfRentType: (d.priceOfRentType ??
        '—') as IProperty['priceOfRentType'],
      addressOfProperty: String(d.addressOfProperty ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      PlotArea: this.toNumber(d.PlotArea),
      propertyImages: this.toPropertyImages(d),
      saleType: this.normalizeSaleType(d.saleType),
      category: this.normalizeCategory(d.category),
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? d.id),
      commercialType: String(d.commercialType ?? '—'),
      floor: String(d.floor ?? '—'),
      availabilityStatus: String(d.availabilityStatus ?? '—'),
      createdAt: d.createdAt ?? null,
      updatedAt: d.updatedAt ?? null,
      // optional extras your card may show:
      plotAreaUnits: undefined as any, // keep IProperty compatibility if needed
      furnishingType: String(d.furnishingType ?? '—'),
      houseFacingType: String(d.houseFacingType ?? '—'),
    };
    return prop as IProperty;
  };

  /** Items signal */
  private items = toSignal(
    this.savedDocs$.pipe(
      map((arr: SavedDocStored[]) => arr.map(this.toProperty))
    ),
    { initialValue: [] as IProperty[] }
  );

  /** Searchbar */
  onSearch(ev: Event) {
    const v = (ev as CustomEvent).detail?.value ?? '';
    this.qText.set(String(v).trim().toLowerCase());
  }

  /** Filtered + pruned list */
  readonly filtered = computed<IProperty[]>(() => {
    const list = this.items();
    const q = this.qText();
    const pruned = this.prunedIds();
    if (!q && pruned.size === 0) return list;

    return list
      .filter((p) => !pruned.has(p.id))
      .filter((p) => {
        if (!q) return true;
        const title = (p.propertyTitle ?? '').toLowerCase();
        const loc = (p.addressOfProperty ?? '').toLowerCase();
        const pid = (p.propertyId ?? '').toLowerCase();
        const priceBlob = `${p.priceOfSale ?? ''} ${
          p.priceOfRent ?? ''
        }`.toLowerCase();
        return (
          title.includes(q) ||
          loc.includes(q) ||
          pid.includes(q) ||
          priceBlob.includes(q)
        );
      });
  });

  trackById = (_: number, p: IProperty) => p.id;

  /** Child emits when unsaved; also remove from DB (flat collection) */
  async onRemoved(id: string) {
    const next = new Set(this.prunedIds());
    next.add(id);
    this.prunedIds.set(next);

    try {
      await this.savedSvc.remove(this.uid(), id);
      await this.presentToast('Removed from saved', 'medium');
      // stream will auto-update the list
    } catch (e) {
      console.error('[saved-properties] remove failed', e);
      await this.presentToast('Failed to remove. Please try again.', 'danger');
      // Optional rollback:
      // next.delete(id); this.prunedIds.set(next);
    }
  }

  /** Optional helper if you want to add to saved list from here */
  async addToSaved(p: IProperty) {
    try {
      const payload: SavedDocPayload = {
        id: p.id,
        propertyTitle: p.propertyTitle ?? '',
        addressOfProperty: p.addressOfProperty ?? '',
        saleType: (p.saleType ?? 'sale') as 'sale' | 'rent',
        category: (p.category ?? 'residential') as any,
        priceOfSale: Number(p.priceOfSale ?? 0),
        priceOfRent: Number(p.priceOfRent ?? 0),
        priceOfRentType: p.priceOfRentType ?? '',
        houseType: p.houseType ?? '',
        bhkType: p.bhkType ?? '',
        PlotArea:
          (typeof p.PlotArea === 'number' ? p.PlotArea : Number(p.PlotArea)) ||
          0,
        availabilityStatus: p.availabilityStatus ?? '',
        agentName: p.agentName ?? '',
        propertyId: p.propertyId ?? p.id,
        floor: p.floor ?? '',
        commercialType: p.commercialType ?? '',
        furnishingType: p.furnishingType ?? '',
        houseFacingType: p.houseFacingType ?? '',
        propertyImages: Array.isArray(p.propertyImages)
          ? p.propertyImages.map((img) => ({
              id: String(img.id ?? ''),
              image: String(img.image ?? ''),
            }))
          : [],
      };
      await this.savedSvc.save(this.uid(), payload);
      await this.presentToast('Saved to list', 'success');
    } catch (e) {
      console.error('[saved-properties] addToSaved failed', e);
      this.errorMsg.set('Failed to add to saved. Please try again.');
      await this.presentToast(
        'Failed to add to saved. Please try again.',
        'danger'
      );
    }
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'medium' = 'medium'
  ) {
    const t = await this.toast.create({
      message,
      duration: 1600,
      position: 'top',
      color,
    });
    await t.present();
  }
}

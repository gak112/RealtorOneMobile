import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
} from '@angular/fire/firestore';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { SavedpropertycardComponent } from '../../components/savedpropertycard/savedpropertycard.component';
import { IProperty } from 'src/app/models/property.model';

/** Saved docs stored under admins/{uid}/saved_properties */
type SavedDoc = {
  id: string;
  propertyTitle?: string;
  addressOfProperty?: string;
  saleType?: string; // 'sale' | 'rent' (normalize)
  category?: string; // 'residential' | 'commercial' | 'plots' | 'lands' (normalize)
  priceOfSale?: number | string;
  priceOfRent?: number | string;
  houseType?: string;
  bhkType?: string;
  propertySize?: number | string;
  propertyStatus?: string;
  agentName?: string;
  propertyId?: string;
  propertyImages?: Array<{ id?: string; image?: string } | string>;
  images?: string[]; // legacy fallback
  createdAt?: any;
  updatedAt?: any;
  floor?: string;
  commercialType?: string;
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

  constructor() {
    addIcons({ chevronBackOutline });
  }

  /** Back-compat: accept either `[user]` or `[currentUid]` */
  user = input<any | null>(null); // e.g., { uid: 'abc' }
  currentUid = input<string | null>(null); // e.g., 'abc'

  /** Effective uid used for the query */
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

  /** Firestore stream */
  private savedDocs$ = toObservable(this.uid).pipe(
    switchMap((uid) => {
      const col = collection(this.afs, `admins/${uid}/saved_properties`);
      const qRef = query(col, orderBy('createdAt', 'desc') as any);
      return collectionData(qRef, { idField: 'id' }) as any;
    }),
    catchError((err) => {
      console.error('[saved-properties] stream error', err);
      this.errorMsg.set(
        'Failed to load saved properties. Pull to refresh or try again.'
      );
      return of([] as SavedDoc[]);
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
    if (s.startsWith('land')) return 'lands';
    if (s.startsWith('res')) return 'residential';
    if (['residential', 'commercial', 'plots', 'lands'].includes(s))
      return s as IProperty['category'];
    return 'residential';
  }

  private toPropertyImages(d: SavedDoc): IProperty['propertyImages'] {
    const out: IProperty['propertyImages'] = [];
    if (Array.isArray(d.propertyImages)) {
      d.propertyImages.forEach((it, i) => {
        if (typeof it === 'string') {
          out.push({ id: `${d.id}-${i}`, image: it });
        } else if (it && typeof it === 'object') {
          const img = (it as any).image ?? '';
          if (img)
            out.push({
              id: (it as any).id ?? `${d.id}-${i}`,
              image: String(img),
            });
        }
      });
    } else if (Array.isArray(d.images)) {
      d.images
        .filter(Boolean)
        .forEach((url, i) =>
          out.push({ id: `${d.id}-${i}`, image: String(url) })
        );
    }
    return out;
  }

  /** SAFE mapper: SavedDoc -> IProperty (compile-safe) */
  private toProperty = (d: SavedDoc): IProperty => {
    const prop: Partial<IProperty> = {
      id: d.id,
      propertyTitle: String(d.propertyTitle ?? '—'),

      priceOfSale: this.toNumber(d.priceOfSale),
      priceOfRent: this.toNumber(d.priceOfRent),
      priceOfRentType: '—' as IProperty['priceOfRentType'],

      addressOfProperty: String(d.addressOfProperty ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      propertySize: this.toNumber(d.propertySize),

      propertyImages: this.toPropertyImages(d),

      saleType: this.normalizeSaleType(d.saleType),
      category: this.normalizeCategory(d.category),

      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? d.id),
      commercialType: String(d.commercialType ?? '—'),
      floor: String(d.floor ?? '—'),
      propertyStatus: String(d.propertyStatus ?? 'Available'),

      createdAt: d.createdAt ?? null,
      updatedAt: d.updatedAt ?? null,
    };

    return prop as IProperty; // <- ✅ Type matches IProperty exactly
  };

  /** Items signal */
  private items = toSignal(
    this.savedDocs$.pipe(map((arr: SavedDoc[]) => arr.map(this.toProperty))),
    { initialValue: [] as IProperty[] }
  );

  /** Searchbar handler */
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
        const priceBlob = `${p.priceOfSale ?? ''} ${p.priceOfRent ?? ''}`;
        return (
          title.includes(q) ||
          loc.includes(q) ||
          pid.includes(q) ||
          priceBlob.includes(q)
        );
      });
  });

  trackById = (_: number, p: IProperty) => p.id;

  /** Child emits when unsaved; prune immediately for snappy UX */
  onRemoved(id: string) {
    const next = new Set(this.prunedIds());
    next.add(id);
    this.prunedIds.set(next);
  }
}

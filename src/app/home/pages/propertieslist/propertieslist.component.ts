import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSearchbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import {
  Firestore,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
  where,
  Query as FsQuery,
} from '@angular/fire/firestore';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { RealestateCardComponent } from '../../components/realestate-card/realestate-card.component';
import { IProperty, IPropertyImage } from 'src/app/models/property.model';
import {
  ProductfilterComponent,
  Filters,
} from 'src/app/search/pages/productfilter/productfilter.component';

type CatKey = 'residential' | 'commercial' | 'plots' | 'lands';

@Component({
  selector: 'app-propertieslist',
  standalone: true,
  templateUrl: './propertieslist.component.html',
  styleUrls: ['./propertieslist.component.scss'],
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonSearchbar,
    IonButton,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    RealestateCardComponent,
  ],
})
export class PropertieslistComponent {
  // ✅ default so the component can construct before componentProps land
  actionType = input<string>('Residential');

  private modalController = inject(ModalController);
  private afs = inject(Firestore);

  constructor() {
    addIcons({ chevronBackOutline });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  readonly header = computed(() => this.actionType());

  /** Normalize to DB keys */
  private readonly category = computed<CatKey>(() => {
    const v = (this.actionType() ?? '').trim().toLowerCase();
    if (v.startsWith('res')) return 'residential';
    if (v.startsWith('com')) return 'commercial';
    if (v.startsWith('plot')) return 'plots';
    if (v.startsWith('land')) return 'lands';
    return (
      ['residential', 'commercial', 'plots', 'lands'].includes(v)
        ? v
        : 'residential'
    ) as CatKey;
  });

  /* ---------------- Filters & Search ---------------- */
  readonly filters = signal<Filters>({ category: this.category() });

  // ✅ pin filters.category whenever input changes (fixes “always residential”)
  private pinCategory = effect(() => {
    this.filters.update((f) => ({ ...f, category: this.category() }));
  });

  readonly filterCount = computed(() => {
    const f = this.filters();
    let n = 0;
    if (f.saleType) n++;
    if (f.priceMin != null) n++;
    if (f.priceMax != null) n++;
    if (f.houseType?.length) n++;
    if (f.bhkType?.length) n++;
    return n;
  });

  readonly search = signal<string>('');
  onSearch(ev: Event) {
    const val = (ev as CustomEvent).detail?.value ?? '';
    this.search.set(String(val).trim());
  }

  /* ---------------- Firestore (server-side category) ---------------- */
  private baseCol = collection(this.afs, 'posts');

  private serverRows$: Observable<PostDoc[]> = toObservable(this.filters).pipe(
    switchMap((f) => {
      const parts: any[] = [
        where('isDeleted', '==', false),
        where('category', '==', f.category ?? this.category()),
      ];
      if (f.saleType) parts.push(where('saleType', '==', f.saleType));
      if (f.saleType === 'sale') {
        if (f.priceMin != null)
          parts.push(where('priceOfSale', '>=', f.priceMin));
        if (f.priceMax != null)
          parts.push(where('priceOfSale', '<=', f.priceMax));
      } else if (f.saleType === 'rent') {
        if (f.priceMin != null)
          parts.push(where('priceOfRent', '>=', f.priceMin));
        if (f.priceMax != null)
          parts.push(where('priceOfRent', '<=', f.priceMax));
      }
      const qRef: FsQuery = query(
        this.baseCol,
        ...parts,
        orderBy('createdAt', 'desc'),
        limit(200)
      );
      return collectionData(qRef, { idField: 'id' }) as Observable<PostDoc[]>;
    }),
    catchError((err) => {
      console.error('[properties list] server query failed', err);
      return of([] as PostDoc[]);
    })
  );

  private toProperty = (d: PostDoc): IProperty => {
    const id = d.id;
    const imgs = Array.isArray(d.images) ? d.images.filter(Boolean) : [];
    const propertyImages: IPropertyImage[] = imgs.map((url, i) => ({
      id: `${id}-${i}`,
      image: url,
    }));
    return {
      id,
      propertyTitle: String(d.propertyTitle ?? '—'),
      priceOfSale: Number(d.priceOfSale ?? 0),
      priceOfRent: Number(d.priceOfRent ?? 0),
      priceOfRentType: String(d.priceOfRentType ?? '—'),
      addressOfProperty: String(d.addressOfProperty ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      propertySize: Number(d.propertySize ?? 0),
      propertyImages,
      saleType: String(d.saleType ?? 'sale') as 'sale' | 'rent',
      category: String(d.category ?? this.category()) as CatKey,
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? id),
      commercialType: String(d.commercialType ?? '—'),
      floor: String(d.floor ?? '—'),
      propertyStatus: String(d.propertyStatus ?? 'Available'),
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    } as unknown as IProperty;
  };

  readonly rows = toSignal(
    this.serverRows$.pipe(map((docs) => docs.map(this.toProperty))),
    { initialValue: [] }
  );

  /* ---------------- Client search ---------------- */
  readonly filtered = computed(() => {
    const list = this.rows();
    const f = this.filters();
    const termRaw = this.search().trim();
    const term = termRaw.toLowerCase();

    const numStr = termRaw.replace(/[^\d.]/g, '');
    const hasPriceTerm = /\d/.test(numStr);
    const priceQuery = hasPriceTerm ? Number(numStr) : NaN;

    return list.filter((p) => {
      if (term) {
        const blob = `${p.propertyTitle} ${p.addressOfProperty}`.toLowerCase();
        const textMatch = blob.includes(term);
        let priceMatch = true;
        if (hasPriceTerm && !isNaN(priceQuery)) {
          const saleStr = String(p.priceOfSale ?? '');
          const rentStr = String(p.priceOfRent ?? '');
          priceMatch =
            Number(p.priceOfSale) === priceQuery ||
            Number(p.priceOfRent) === priceQuery ||
            saleStr.includes(numStr) ||
            rentStr.includes(numStr);
        }
        if (!(textMatch || (hasPriceTerm && priceMatch))) return false;
      }

      if (!f.saleType && (f.priceMin != null || f.priceMax != null)) {
        const chosen =
          p.saleType === 'sale'
            ? Number(p.priceOfSale || 0)
            : Number(p.priceOfRent || 0);
        if (f.priceMin != null && chosen < f.priceMin) return false;
        if (f.priceMax != null && chosen > f.priceMax) return false;
      }
      if (f.houseType?.length && !f.houseType.includes(p.houseType))
        return false;
      if (f.bhkType?.length && !f.bhkType.includes(p.bhkType)) return false;
      return true;
    });
  });

  async openFilters() {
    const modal = await this.modalController.create({
      component: ProductfilterComponent,
      componentProps: { initial: this.filters() }, // includes current category
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<Filters>();
    if (role === 'apply' && data) {
      this.filters.set({ ...data, category: this.category() }); // keep category pinned
    } else if (role === 'clear') {
      this.clearFilters();
    }
  }

  clearFilters() {
    this.filters.set({ category: this.category() });
    this.search.set('');
  }

  onIonInfinite(ev: Event) {
    (ev as any).target?.complete();
  }

  trackById = (_: number, item: IProperty) => item.id;
}

/* ------------ Firestore doc shape ------------ */
type PostDoc = {
  id: string;
  images?: string[];
  propertyTitle?: string;
  saleType?: 'sale' | 'rent' | string;
  category?: string;
  addressOfProperty?: string;
  houseType?: string;
  bhkType?: string;
  propertySize?: number | string;
  agentName?: string;
  propertyId?: string;
  propertyStatus?: string;
  priceOfSale?: number;
  priceOfRent?: number;
  priceOfRentType?: string;
  commercialType?: string;
  floor?: string;
  isDeleted?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

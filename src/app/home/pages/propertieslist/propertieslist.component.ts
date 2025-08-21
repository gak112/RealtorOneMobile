import { NgIf } from '@angular/common';
import {
  Component, OnInit, Input, inject, signal, computed,
} from '@angular/core';
import {
  IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, IonSearchbar, ModalController, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

import {
  collection, collectionData, Firestore, limit, orderBy, query, where,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {
  IProperty, IPropertyImage, RealestateCardComponent,
} from '../../components/realestate-card/realestate-card.component';

type CatKey = 'residential' | 'commercial' | 'plots' | 'lands';

@Component({
  selector: 'app-propertieslist',
  standalone: true,
  templateUrl: './propertieslist.component.html',
  styleUrls: ['./propertieslist.component.scss'],
  imports: [IonButton, 
    IonHeader, IonToolbar, IonIcon, IonTitle, IonContent, IonSearchbar, NgIf,
    RealestateCardComponent,
  ],
  providers: [ModalController],
})
export class PropertieslistComponent implements OnInit {
  /** From opener: "Residential" | "Commercial" | "Plots" | "Lands" (or already lowercase keys) */
  @Input() actionType!: string;

  private modalController = inject(ModalController);
  private afs = inject(Firestore);

  constructor() { addIcons({ chevronBackOutline }); }

  /* ---------------- UI signals ---------------- */
  readonly headerTitle = signal<string>('Properties');
  readonly search = signal<string>('');
  readonly errorMsg = signal<string>('');

  onSearch(ev: CustomEvent) {
    const target = ev.target as HTMLIonSearchbarElement;
    this.search.set((target?.value ?? '').toString().trim().toLowerCase());
  }
  dismiss() { this.modalController.dismiss(); }

  /* ---------------- Category ---------------- */
  private get category(): CatKey {
    return toCategoryKey(this.actionType);
  }

  /* ---------------- Firestore stream ---------------- */
  /**
   * Requires a Firestore composite index:
   * collection: posts, fields: category ASC, createdAt DESC
   * (Firestore will show a console link once; create it once and you're done.)
   */
  private readonly rows$: Observable<PostDoc[]> = (() => {
    const postsCol = collection(this.afs, 'posts');
    const qRef = query(
      postsCol,
      where('category', '==', this.category),     // equality filter
      orderBy('createdAt', 'desc'),               // sort newest first
      limit(500)
    );
    return collectionData(qRef, { idField: 'id' }) as Observable<PostDoc[]>;
  })();

  // live → signal; drop docs with isDeleted === true
  readonly properties = toSignal<IProperty[]>(
    this.rows$.pipe(
      map(docs =>
        docs
          .filter(d => !(d as any).isDeleted)
          .map(this.toProperty)
      ),
      catchError(err => {
        console.error('[properties list] query error:', err);
        // Most common cause: missing composite index for (category, createdAt)
        this.errorMsg.set(
          'Unable to load properties. Please ensure a Firestore index exists for (category, createdAt desc).'
        );
        return of([] as IProperty[]);
      })
    ),
   
  );

  // client-side search
  readonly propertiesFiltered = computed(() => {
    const q = this.search();
    if (!q) return this.properties();
    return this.properties().filter(p =>
      (p.propertyTitle + ' ' + p.location).toLowerCase().includes(q)
    );
  });

  // first-load indicator
  readonly loading = computed(() => this.properties().length === 0 && !this.errorMsg());

  ngOnInit(): void {
    this.headerTitle.set(capFirst(this.category));
  }

  /* ---------------- Mapping to card ---------------- */
  private toProperty = (d: PostDoc): IProperty => {
    const id = d.id;

    const imgs: string[] = Array.isArray(d.images) ? d.images.filter(Boolean) : [];
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
      location: String(d.addressOfProperty ?? d.location ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      propertySize: String(d.propertySize ?? '—'),
      propertyImages,
      category: (String(d.category ?? '-') as string).toLowerCase(),
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? id),
      saleType: (String(d.saleType ?? '-') as string).toLowerCase(), // 'sale' | 'rent'
      propertyStatus: String(d.propertyStatus ?? 'Available'),
    };
  };
}

/* ---------------- Firestore doc shape ---------------- */
type PostDoc = {
  id: string;
  createdAt?: any;              // Firestore Timestamp (set on create)
  isDeleted?: boolean;

  images?: string[];
  propertyTitle?: string;
  saleType?: 'sale' | 'rent';
  category?: 'residential' | 'commercial' | 'plots' | 'lands';
  addressOfProperty?: string;
  location?: string;
  houseType?: string;
  bhkType?: string;
  propertySize?: number | string;
  agentName?: string;
  propertyId?: string;
  propertyStatus?: string;
  priceOfSale?: number;
  priceOfRent?: number;
  priceOfRentType?: string;
};

/* ---------------- helpers ---------------- */
function capFirst(s: string) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function toCategoryKey(v?: string | null): CatKey {
  const s = (v ?? '').trim().toLowerCase();
  if (s.startsWith('res')) return 'residential';
  if (s.startsWith('com')) return 'commercial';
  if (s.startsWith('plot')) return 'plots';
  if (s.startsWith('land')) return 'lands';
  // already lowercase key?
  if (['residential','commercial','plots','lands'].includes(s)) return s as CatKey;
  return 'residential';
}

import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  computed,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  ModalController,
  IonSpinner,
  IonSearchbar,
} from '@ionic/angular/standalone';
import {
  Firestore,
  collection,
  collectionData,
  limit,
  orderBy,
  query,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PostsService } from 'src/app/more/services/posts.service';
import {
  MyPropertyCardComponent,
  IProperty,
  IPropertyImage,
} from '../../components/my-property-card/my-property-card.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

type PostPayload = any; // your PostRequest-like shape

@Component({
  selector: 'app-myrequests',
  templateUrl: './myrequests.component.html',
  styleUrls: ['./myrequests.component.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    MyPropertyCardComponent,
  ],
})
export class MyrequestsComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return;
    // this.afs.collection(`requests`,
    // ref => ref.where('uid', '==', this.user.uid)).valueChanges({idField: 'id'}).subscribe((data: any) => {
    //   this.properties = data;
    // });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  readonly searchQuery = signal('');

  onSearch(ev: CustomEvent) {
    const val = ((ev.detail as any)?.value ?? '').toString();
    this.searchQuery.set(val);
  }

  clearSearch() {
    this.searchQuery.set('');
  }

  private afs = inject(Firestore);

  // Query: order by createdAt desc. Ensure you set createdAt = serverTimestamp() on create.
  private postsCol = collection(this.afs, 'posts');
  private q = query(this.postsCol, orderBy('createdAt', 'desc'), limit(200));

  private rows$: Observable<PostDoc[]> = collectionData(this.q, {
    idField: 'id',
  }) as Observable<PostDoc[]>;

  // Stream → signal; map docs to the IProperty shape your card expects
  readonly properties = toSignal<IProperty[]>(
    this.rows$.pipe(map((docs) => docs.map(this.toProperty)))
  );

  // basic loading signal (first render until we get anything)
  readonly loading = computed(() => this.properties().length === 0);

  private toProperty = (d: PostDoc): IProperty => {
    const id = d.id;

    // Build images array for the card
    const imgs: string[] = Array.isArray(d.images)
      ? d.images.filter(Boolean)
      : [];
    const propertyImages: IPropertyImage[] = imgs.map((url, i) => ({
      id: `${id}-${i}`,
      image: url,
    }));

    // Price preference: price → costOfProperty → rent
    const rawPrice = d.salePrice ?? d.costOfProperty ?? d.rent ?? 0;
    const price = Number(rawPrice) || 0;

    // Sizes formatted as strings
    const size = d.propertySize ?? '—';
    const sizeStr = String(size);

    return {
      id,
      propertyTitle: String(d.propertyTitle ?? '—'),
      salePrice: price,
      rentPrice: price,
      location: String(d.addressOfProperty ?? d.location ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      propertySize: sizeStr,
      propertyImages,
      category: String(d.category ?? '-'),
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? id),
      saleType: String(d.saleType ?? '-'),
      propertyStatus: String(d.propertyStatus ?? 'Available'),
    };
  };
}

type PostDoc = {
  id: string;
  images?: string[];
  propertyTitle?: string;
  saleType?: string;
  category?: string;
  addressOfProperty?: string;
  location?: string;
  houseType?: string;
  bhkType?: string;
  propertySize?: number | string;
  agentName?: string;
  propertyId?: string;
  propertyStatus?: string;
  costOfProperty?: number | string;
  rent?: number | string;
  salePrice?: number | string;
  rentPrice?: number | string;

  createdAt?: any;
  // …any other fields you store
};

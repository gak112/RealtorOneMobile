import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  Input,
} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import {
  Firestore,
  collection,
  collectionData,
  query,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import {
  IPropertyCard,
  SavedpropertycardComponent,
} from '../../components/savedpropertycard/savedpropertycard.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-savedproperties',
  templateUrl: './savedproperties.component.html',
  styleUrls: ['./savedproperties.component.scss'],
  standalone: true,
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
export class SavedpropertiesComponent implements OnInit {
  private modalController = inject(ModalController);
  @Input() user: any;

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    return;
    // this.afs.collection(`savedPropertiesList`,
    //   ref => ref.where('uid', '==', this.user.uid)).valueChanges().subscribe((data: any) => {

    //       this.savedProperties = data;
    // });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  private afs = inject(Firestore);

  /** Firestore: posts ordered by createdAt desc */
  private postsCol = collection(this.afs, 'posts');
  private q = query(this.postsCol, orderBy('createdAt', 'desc'), limit(200));

  private rows = toSignal(collectionData(this.q, { idField: 'id' }), {
    initialValue: [] as any[],
  });

  /** Map posts → card model */
  readonly items = computed<IPropertyCard[]>(() =>
    this.rows().map((d: any) => this.toCard(d))
  );

  /** Search */
  private qText = signal('');
  onSearch(ev: CustomEvent) {
    const v = ((ev.detail as any)?.value ?? '').toString().trim();
    this.qText.set(v.toLowerCase());
  }

  /** Client-side filter for simplicity */
  readonly filtered = computed(() => {
    const q = this.qText();
    if (!q) return this.items();
    return this.items().filter(
      (p) =>
        (p.propertyTitle ?? '').toLowerCase().includes(q) ||
        (p.location ?? '').toLowerCase().includes(q)
    );
  });

  /** Optional: remove from feed once saved (if you keep redirectOff) */
  removeFromFeed(id: string) {
    const cur = this.items();
    const idx = cur.findIndex((x) => x.id === id);
    if (idx >= 0) {
      // Quick local remove (purely UI); Firestore stream will resync anyway
      const copy = cur.slice();
      copy.splice(idx, 1);
      // Can't set computed directly; for a real remove rely on redirect or keep as-is.
      // If you want local mutable list, keep a signal for the visible list.
    }
  }

  private toCard(d: any): IPropertyCard {
    const id = d.id;
    const imgs: string[] = Array.isArray(d.images)
      ? d.images.filter(Boolean)
      : [];
    const propertyImages = imgs.map((url: string, i: number) => ({
      id: `${id}-${i}`,
      image: url,
    }));

    return {
      id,
      propertyTitle: String(d.propertyTitle ?? '—'),
      salePrice: Number(d.costOfProperty ?? d.salePrice ?? 0) || 0,
      rentPrice: Number(d.rentPrice ?? d.rent ?? 0) || 0,
      location: String(d.addressOfProperty ?? d.location ?? '—'),
      houseType: String(d.houseType ?? '—'),
      bhkType: String(d.bhkType ?? '—'),
      propertySize: String(d.propertySize ?? '—'),
      propertyImages,
      agentName: String(d.agentName ?? '—'),
      propertyId: String(d.propertyId ?? id),
      saleType: String(d.saleType ?? 'sale') as 'sale' | 'rent',
      propertyStatus: String(d.propertyStatus ?? d.status ?? 'Available'),
      category: String(d.category ?? 'residential'),
    };
  }
}

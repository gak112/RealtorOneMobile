import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  IonIcon,
  IonFooter,
  IonButton,
  IonLabel,
  IonInput,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

export type Filters = {
  category?: 'residential' | 'commercial' | 'plots' | 'lands';
  saleType?: 'sale' | 'rent';
  priceMin?: number | null;
  priceMax?: number | null;
  houseType?: string[];
  bhkType?: string[];
};

@Component({
  selector: 'app-productfilter',
  standalone: true,
  templateUrl: './productfilter.component.html',
  styleUrls: ['./productfilter.component.scss'],
  imports: [
    IonLabel,
    IonButton,
    IonFooter,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
  ],
})
export class ProductfilterComponent implements OnInit {
  private modalController = inject(ModalController);

  @Input() initial?: Filters;

  activeTab = signal<'saleType' | 'price' | 'houseType' | 'bhkType'>(
    'saleType'
  );

  saleType = signal<Filters['saleType']>(undefined);
  category = signal<Filters['category']>(undefined); // read-only (from parent)
  priceMin = signal<number | null | undefined>(undefined);
  priceMax = signal<number | null | undefined>(undefined);
  houseType = signal<string[]>([]);
  bhkType = signal<string[]>([]);

  houseTypeOptions = [
    'Apartment',
    'Individual House/Villa',
    'Gated Community Villa',
  ];
  bhkOptions = ['1BHK', '2BHK', '3BHK', '4BHK', '5BHK', '+5BHK'];

  constructor() {
    addIcons({ arrowBackOutline });
  }

  ngOnInit(): void {
    // Seed from list page (includes category)
    if (this.initial) {
      this.saleType.set(this.initial.saleType);
      this.category.set(this.initial.category);
      this.priceMin.set(this.initial.priceMin);
      this.priceMax.set(this.initial.priceMax);
      this.houseType.set([...(this.initial.houseType ?? [])]);
      this.bhkType.set([...(this.initial.bhkType ?? [])]);
    }
  }

  categoryLabel = computed(() => {
    const c = this.category() ?? 'residential';
    return c === 'commercial'
      ? 'Commercial'
      : c === 'plots'
      ? 'Plots'
      : c === 'lands'
      ? 'Lands'
      : 'Residential';
  });

  categoryColor(): 'danger' | 'tertiary' | 'warning' | 'primary' {
    const c = this.category() ?? 'residential';
    if (c === 'commercial') return 'tertiary';
    if (c === 'plots') return 'warning';
    if (c === 'lands') return 'danger';
    return 'primary';
  }

  toggleFrom(listSig: typeof this.houseType, value: string) {
    const next = new Set(listSig());
    next.has(value) ? next.delete(value) : next.add(value);
    listSig.set(Array.from(next));
  }

  toggleSale(kind: 'sale' | 'rent') {
    this.saleType.set(this.saleType() === kind ? undefined : kind);
  }

  onMinChange(ev: CustomEvent) {
    const raw = (ev.detail as any)?.value;
    const n = raw === '' || raw == null ? null : Number(raw);
    this.priceMin.set(Number.isFinite(n as number) ? (n as number) : null);
  }
  onMaxChange(ev: CustomEvent) {
    const raw = (ev.detail as any)?.value;
    const n = raw === '' || raw == null ? null : Number(raw);
    this.priceMax.set(Number.isFinite(n as number) ? (n as number) : null);
  }

  apply() {
    this.modalController.dismiss(
      {
        category: this.category(), // keep what was passed in
        saleType: this.saleType(),
        priceMin: this.priceMin() ?? null,
        priceMax: this.priceMax() ?? null,
        houseType: this.houseType(),
        bhkType: this.bhkType(),
      },
      'apply'
    );
  }

  clearAll() {
    this.saleType.set(undefined);
    this.priceMin.set(undefined);
    this.priceMax.set(undefined);
    this.houseType.set([]);
    this.bhkType.set([]);
    this.modalController.dismiss(null, 'clear');
  }

  dismiss(role: 'cancel' | 'apply' | 'clear' = 'cancel') {
    if (role === 'apply') return this.apply();
    if (role === 'clear') return this.clearAll();
    this.modalController.dismiss(null, role);
  }
}

// src/app/components/amenities/amenities.component.ts
import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
  IonSearchbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { toSignal } from '@angular/core/rxjs-interop';

import { AmenitiesService, AmenityDoc } from '../../services/amenities.service';

type AmenityVM = AmenityDoc & { selected: boolean };

@Component({
  selector: 'app-amenities',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss'],
  imports: [
    CommonModule,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonCheckbox,
    IonIcon,
    IonButton
  ],
  providers: [ModalController],
})
export class AmenitiesComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private amenitiesSvc = inject(AmenitiesService);

  /** Names or IDs to preselect */
  @Input() selectedAmenities: string[] = [];

  // UI
  loading = signal(true);
  pageError = signal<string | null>(null);

  // Writable list (source of truth for UI)
  private amenities = signal<AmenityVM[]>([]);

  // Search term
  private q = signal('');

  // Firestore → signal (read-only)
  private amenitiesDocs = toSignal(this.amenitiesSvc.streamAmenities(), {
    initialValue: [] as AmenityDoc[],
  });

  // Filtered view for template
  view = computed(() => {
    const term = this.q().toLowerCase();
    const list = this.amenities();
    return term ? list.filter(a => a.amenityName.toLowerCase().includes(term)) : list;
  });

  // Live selected count
  selectedCount = computed(() => this.amenities().filter(a => a.selected).length);

  constructor() {
    addIcons({ chevronBackOutline });

    // Merge Firestore docs with preselected values
    effect(
      () => {
        const docs = this.amenitiesDocs();
        const pre = new Set((this.selectedAmenities ?? []).map(s => s.trim().toLowerCase()));

        const next = docs.map(d => {
          const byName = pre.has(d.amenityName?.toLowerCase() ?? '');
          const byId = pre.has(d.id?.toLowerCase() ?? '');
          return { ...d, selected: byName || byId };
        });

        this.amenities.set(next);
        this.loading.set(false);
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  onSearch(ev: CustomEvent) {
    const val = ((ev.detail as any)?.value ?? '').toString().trim();
    this.q.set(val);
  }

  toggle(filteredIndex: number, checked: boolean) {
    const current = this.view();
    const target = current?.[filteredIndex];
    if (!target) return;

    const id = target.id;
    this.amenities.update(list =>
      list.map(a => (a.id === id ? { ...a, selected: checked } : a))
    );
  }

  addItems() {
    const result = this.amenities()
      .filter(a => a.selected)
      .map(a => a.amenityName); // swap to a.id if you prefer
    this.modalCtrl.dismiss(result);
  }
}

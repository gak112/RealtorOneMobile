import {
  Component,
  Input,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  collection,
  collectionData,
  orderBy,
  query,
} from '@angular/fire/firestore';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { IAmenitiesList } from '../amenities-card/amenities-card.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

type Amenity = {
  id: string;
  name: string;
  selected: boolean;
};

@Component({
  selector: 'app-amenities',
  standalone: true,
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss'],
  imports: [
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonLabel,
    IonCheckbox,
    IonIcon,
    IonButton,
  ],
  providers: [ModalController],
})
export class AmenitiesComponent implements OnInit {
  private modal = inject(ModalController);
  private afs = inject(AngularFirestore);

  @Input() selectedAmenities: string[] = [];

  // Local signal state
  amenities = signal<Amenity[]>([
    {
      id: 'pool',
      name: 'Swimming Pool',

      selected: false,
    },
    {
      id: 'gym',
      name: 'Gym',

      selected: false,
    },
    {
      id: 'parking',
      name: 'Parking',

      selected: false,
    },
    {
      id: 'garden',
      name: 'Garden',

      selected: false,
    },
    {
      id: 'clubhouse',
      name: 'Club House',

      selected: false,
    },
    {
      id: 'playarea',
      name: 'Kids Play Area',

      selected: false,
    },
    {
      id: 'security',
      name: '24/7 Security',

      selected: false,
    },
    {
      id: 'power',
      name: 'Power Backup',

      selected: false,
    },
    {
      id: 'lift',
      name: 'Lift',

      selected: false,
    },
    {
      id: 'wifi',
      name: 'Wi-Fi',

      selected: false,
    },
  ]);

  selectedCount = computed(
    () => this.amenities().filter((a) => a.selected).length
  );

  constructor() {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    if (this.selectedAmenities?.length) {
      const set = new Set(this.selectedAmenities.map((s) => s.toLowerCase()));
      this.amenities.update((list) =>
        list.map((a) => ({ ...a, selected: set.has(a.name.toLowerCase()) }))
      );
    }
  }

  dismiss() {
    this.modal.dismiss();
  }

  toggle(index: number, checked: boolean) {
    this.amenities.update((list) => {
      const copy = [...list];
      copy[index] = { ...copy[index], selected: checked };
      return copy;
    });
  }

  addItems() {
    const selectedNames = this.amenities()
      .filter((a) => a.selected)
      .map((a) => a.name);
    this.modal.dismiss(selectedNames);
  }
}

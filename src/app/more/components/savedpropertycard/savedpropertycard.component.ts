import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  inject,
  input,
  signal,
  computed,
  output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import {
  IonImg,
  IonLabel,
  IonSkeletonText,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline } from 'ionicons/icons';

import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-savedpropertycard',
  standalone: true,
  templateUrl: './savedpropertycard.component.html',
  styleUrls: ['./savedpropertycard.component.scss'],
  imports: [IonSkeletonText, IonLabel, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SavedpropertycardComponent {
  /** Post doc from `posts` collection (postentry data mapped) */
  property = input.required<IPropertyCard>();

  /** Admin identity (no auth): string uid or { uid } */
  admin = input<string | { uid: string }>('admin');

  /** Optional: navigate to saved list after save */
  redirectOnSave = input<boolean>(true);

  /** Outputs so parent feed can react (optional to use) */
  saved = output<string>(); // propertyId
  unsaved = output<string>(); // propertyId

  private afs = inject(Firestore);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);

  busy = signal(false);
  private _isSaved = signal(false);
  isSaved = computed(() => this._isSaved());

  constructor() {
    addIcons({ heart, heartOutline });
    // lazy check saved state (no need OnInit decorator)
    this.refreshSavedState();
  }

  private adminUid(): string {
    const a = this.admin();
    if (typeof a === 'string' && a) return a;
    if (a && typeof a === 'object' && a.uid) return a.uid;
    return 'admin';
  }

  private async refreshSavedState() {
    const uid = this.adminUid();
    const ref = doc(
      this.afs,
      `admins/${uid}/saved_properties/${this.property().id}`
    );
    const snap = await getDoc(ref);
    this._isSaved.set(snap.exists());
  }

  // savedpropertycard.component.ts (only the method is shown)
  async toggleFavorite(ev?: Event) {
    ev?.stopPropagation();
    if (this.busy()) return;
    this.busy.set(true);

    try {
      const uid = this.adminUid();
      const p = this.property();

      if (this._isSaved()) {
        await deleteDoc(
          doc(this.afs, `admins/${uid}/saved_properties/${p.id}`)
        );
        this._isSaved.set(false);
        await this.toast('Removed from saved', 'medium');
      } else {
        const ref = doc(this.afs, `admins/${uid}/saved_properties/${p.id}`);
        await setDoc(ref, {
          id: p.id,
          propertyTitle: p.propertyTitle ?? '',
          location: p.location ?? '',
          saleType: p.saleType ?? '',
          category: p.category ?? '',
          salePrice: p.saleType === 'sale' ? p.salePrice ?? 0 : 0,
          rentPrice: p.saleType === 'rent' ? p.rentPrice ?? 0 : 0,
          houseType: p.houseType ?? '',
          bhkType: p.bhkType ?? '',
          propertySize: p.propertySize ?? '',
          propertyStatus: p.propertyStatus ?? '',
          agentName: p.agentName ?? '',
          propertyId: p.propertyId ?? '',
          propertyImages: p.propertyImages ?? [],
          createdAt: serverTimestamp(),
        });

        this._isSaved.set(true);

        // ✅ Immediately go to saved list
        await this.router.navigateByUrl('/saved-properties', {
          replaceUrl: false,
        });
      }
    } catch {
      await this.toast('Action failed. Please try again.', 'danger');
    } finally {
      this.busy.set(false);
    }
  }

  private async toast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
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

/** Card model (mapped from posts/postentry) */
export interface IPropertyCard {
  id: string;
  propertyTitle: string;
  salePrice: number;
  rentPrice: number;
  location: string; // addressOfProperty or location
  houseType: string;
  bhkType: string;
  propertySize: string | number;
  propertyImages: { id: string; image: string }[];
  agentName: string;
  propertyId: string;
  saleType: 'sale' | 'rent';
  propertyStatus: string;
  category: string;
}

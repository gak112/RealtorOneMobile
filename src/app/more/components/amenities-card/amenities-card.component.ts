import {
  Component,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { IonIcon, IonLabel, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, trashOutline } from 'ionicons/icons';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { AddAmenitiesComponent } from '../../pages/add-amenities/add-amenities.component';

import { AlertController, ToastController } from '@ionic/angular';

// Firestore is optional – if you don't provide a custom delete handler,
// we'll attempt to delete from 'amenities/{id}'.
import { Firestore, doc, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-amenities-card',
  standalone: true,
  templateUrl: './amenities-card.component.html',
  styleUrls: ['./amenities-card.component.scss'],
  imports: [IonLabel, IonIcon],
})
export class AmenitiesCardComponent implements OnInit {
  /** The amenity item to render (required). */
  amenity = input.required<IAmenitiesList>();

  /**
   * Optional custom delete handler. If provided, the component will call this instead
   * of deleting from Firestore. Must return a Promise or void.
   *
   * Example usage in parent:
   * <app-amenities-card
   *   [amenity]="a"
   *   [deleteHandler]="deleteAmenityFromApi"
   *   (deleted)="onDeleted($event)">
   * </app-amenities-card>
   */
  deleteHandler = input<
    ((amenity: IAmenitiesList) => Promise<void> | void) | undefined
  >(undefined);

  /** Emits after a successful delete so parent can remove the item from its list. */
  deleted = output<IAmenitiesList>();

  private modalController = inject(ModalController);
  private alert = inject(AlertController);
  private toast = inject(ToastController);

  // Firestore is optional – inject softly to allow non-Firestore projects.
  private afs = inject(Firestore, { optional: true });

  // UI state (signals)
  isDeleting = signal(false);
  errorMsg = signal<string | null>(null);

  constructor() {
    addIcons({ create, trashOutline });
  }

  ngOnInit() {}

  /** Open edit modal */
  async editAmenity() {
    const item = this.amenity();
    const modal = await this.modalController.create({
      component: AddAmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        docId: item.id,
        initial: { amenityName: item.amenityName },
      },
    });
    await modal.present();
  }

  /** Ask user to confirm, then delete */
  async confirmDelete() {
    if (this.isDeleting()) return;

    const item = this.amenity();
    const alert = await this.alert.create({
      header: 'Delete amenity?',
      message: `This will permanently remove "<b>${item.amenityName}</b>".`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive' },
      ],
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role === 'destructive') {
      await this.deleteAmenity();
    }
  }

  /** Perform deletion (custom handler or Firestore fallback) */
  private async deleteAmenity() {
    if (this.isDeleting()) return;
    this.isDeleting.set(true);
    this.errorMsg.set(null);

    const item = this.amenity();

    try {
      // 1) Use custom handler if provided
      const custom = this.deleteHandler();
      if (typeof custom === 'function') {
        await custom(item);
      } else {
        // 2) Fallback to Firestore: amenities/{id}
        if (!this.afs)
          throw new Error('No delete handler and Firestore not available.');
        const id = String(item.id); // convert to string if your IDs are numbers
        await deleteDoc(doc(this.afs, 'amenities', id));
      }

      // Success UI + notify parent
      const t = await this.toast.create({
        message: 'Amenity deleted.',
        duration: 1600,
        color: 'success',
        position: 'top',
      });
      await t.present();

      this.deleted.emit(item);
    } catch (err: any) {
      console.error('[amenities-card] delete failed:', err);
      const msg = err?.message || 'Failed to delete amenity.';
      this.errorMsg.set(msg);

      const t = await this.toast.create({
        message: msg,
        duration: 2200,
        color: 'danger',
        position: 'top',
      });
      await t.present();
    } finally {
      this.isDeleting.set(false);
    }
  }
}

export interface IAmenitiesList {
  id: number | string; // allow string too, if Firestore doc IDs are strings
  amenityName: string;
  createdAt: number;
}

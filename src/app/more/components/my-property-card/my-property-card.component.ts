// src/app/home/components/my-property-card/my-property-card.component.ts
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  input,
  OnInit,
  signal,
  output,
} from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonImg,
  ModalController,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { create, ellipsisVertical, trash } from 'ionicons/icons';
import { PostentryComponent } from 'src/app/home/pages/postentry/postentry.component';
import {
  forwardEnterAnimation,
  backwardEnterAnimation,
} from 'src/app/services/animation';
import { PostsService } from '../../services/posts.service';
import { PropertyFullViewComponent } from 'src/app/home/pages/property-full-view/property-full-view.component';

@Component({
  selector: 'app-my-property-card',
  standalone: true,
  templateUrl: './my-property-card.component.html',
  styleUrls: ['./my-property-card.component.scss'],
  imports: [IonIcon, IonLabel, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MyPropertyCardComponent implements OnInit {
  // DI
  private modalController = inject(ModalController);
  private postsService = inject(PostsService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  // Inputs / Outputs
  property = input.required<any>();
  removed = output<string>(); // optional: parent can listen and filter immediately

  // Local UI state (signals)
  isMenuOpen = signal(false);
  busy = signal(false);

  constructor() {
    addIcons({ ellipsisVertical, create, trash });
  }

  async openPropertyDetails() {
    const modal = await this.modalController.create({
      component: PropertyFullViewComponent,
      componentProps: { propertyIn: this.property() },
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });

    await modal.present();
  }

  ngOnInit() {}

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  async editProperty() {
    const p = this.property();
    console.log(p);
    const modal = await this.modalController.create({
      component: PostentryComponent,
      componentProps: {
        editId: p.id, // your editor loads the doc by id and patches the form
      },
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
    this.isMenuOpen.set(false);
  }

  async deleteProperty() {
    if (this.busy()) return;

    const p = this.property();
    const alert = await this.alertCtrl.create({
      header: 'Delete post?',
      message:
        'This will permanently remove the post. This action cannot be undone.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => this.doDelete(p.id),
        },
      ],
    });
    await alert.present();
  }

  private async doDelete(id: string) {
    this.busy.set(true);
    try {
      // Hard delete — document is removed; all collectionData() streams update automatically
      await this.postsService.deleteHard(id);

      // Close menu and show toast
      this.isMenuOpen.set(false);
      await this.toast('Property deleted', 'success');

      // Optional: let parent remove the card immediately if it keeps a local array
      this.removed.emit(id);
    } catch (e) {
      await this.toast('Delete failed. Please try again.', 'danger');
    } finally {
      this.busy.set(false);
    }
  }

  private async toast(
    message: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'warning'
  ) {
    const t = await this.toastCtrl.create({
      message,
      duration: 1800,
      color,
      position: 'top',
    });
    (await this.toastCtrl.getTop())?.dismiss();
    await t.present();
  }
}

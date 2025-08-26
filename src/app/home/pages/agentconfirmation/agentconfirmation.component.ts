import {
  Component,
  Input,
  ChangeDetectionStrategy,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonContent,
  IonCheckbox,
  IonLabel,
  IonFooter,
  IonButton,
  ToastController,
  ModalController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

import { AgentBasicDetailsComponent } from '../agent-basic-details/agent-basic-details.component';
import {
  forwardEnterAnimation,
  backwardEnterAnimation,
} from 'src/app/services/animation';
import { AgentService } from 'src/app/more/services/agent.service';

@Component({
  selector: 'app-agentconfirmation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agentconfirmation.component.html',
  styleUrls: ['./agentconfirmation.component.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    IonCheckbox,
    IonLabel,
    IonFooter,
    IonButton,
  ],
})
export class AgentconfirmationComponent {
  @Input() uid: string | null = null;

  // Services
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private svc = inject(AgentService);

  // UI state (signals)
  accepted = signal(false);
  loading = signal(false);
  pageError = signal<string | null>(null);

  constructor() {
    addIcons({ chevronBackOutline });
  }

  // Utilities
  private async toast(
    msg: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
  ) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 2200,
      color,
      position: 'top',
    });
    await t.present();
  }

  async dismiss(role: 'cancel' | 'agent-created' | 'agent-left' = 'cancel') {
    try {
      const top = await this.modalCtrl.getTop();
      if (top) await top.dismiss(null, role);
    } catch {}
  }

  openPolicies() {
    // Replace with your real T&C page
    window.open('https://example.com/policies', '_blank');
  }

  /** Accept → record T&C + open Agent Basic Details modal */
  async agentConfirmation() {
    if (!this.accepted()) {
      await this.toast(
        'Please accept the Terms & Conditions to continue.',
        'warning'
      );
      return;
    }
    if (!this.uid) {
      this.pageError.set('Missing user id (uid).');
      await this.toast('Missing user id (uid).', 'danger');
      return;
    }

    this.loading.set(true);
    this.pageError.set(null);
    try {
      // Record acceptance (adjust version/tag as you wish)
      await this.svc.recordTerms(this.uid, 'v1');

      // Open the Agent Basic Details as a modal on top
      const details = await this.modalCtrl.create({
        component: AgentBasicDetailsComponent,
        componentProps: { uid: this.uid },
        enterAnimation: forwardEnterAnimation,
        leaveAnimation: backwardEnterAnimation,
        canDismiss: true,
      });

      await details.present();
      const { role } = await details.onWillDismiss();

      if (role === 'agent-created') {
        await this.toast('Agent created successfully.', 'success');
        await this.dismiss('agent-created'); // close this confirmation modal too
      }
    } catch (e: any) {
      this.pageError.set(e?.message || 'Failed to proceed.');
      await this.toast(this.pageError()!, 'danger');
    } finally {
      this.loading.set(false);
    }
  }
}

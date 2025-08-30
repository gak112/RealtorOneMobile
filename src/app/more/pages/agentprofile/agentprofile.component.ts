import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  input, // <— signals Input (not required)
} from '@angular/core';

import {
  IonButton,
  IonContent,
  IonLabel,
  IonIcon,
  IonImg,
  IonSegment,
  IonSegmentButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  ModalController,
  ToastController,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  callOutline,
  chevronBackOutline,
  locationOutline,
  mailOutline,
} from 'ionicons/icons';
import { AgentService } from 'src/app/more/services/agent.service';
import { AgentBasicDetailsComponent } from 'src/app/home/pages/agent-basic-details/agent-basic-details.component';
import {
  forwardEnterAnimation,
  backwardEnterAnimation,
} from 'src/app/services/animation';
import { TransactionsComponent } from '../../components/transactions/transactions.component';
import { RenewalpropertiesComponent } from '../../components/renewalproperties/renewalproperties.component';

type Agent = {
  id: string;
  agentCode?: string;
  agentFullName: string;
  email: string;
  phone: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: any;
  photoUrl?: string;
  referralsCount?: number;
  redeemableAmount?: number;
};

@Component({
  selector: 'app-agentprofile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agentprofile.component.html',
  styleUrls: ['./agentprofile.component.scss'],
  imports: [
    IonButton,
    IonContent,
    IonLabel,
    IonIcon,
    IonImg,
    IonSegment,
    IonSegmentButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    TransactionsComponent,
    RenewalpropertiesComponent
],
})
export class AgentprofileComponent {
  // Make uid optional initially; Ionic will set componentProps after construction
  uid = input<string | null>(null);

  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private svc = inject(AgentService);
  private alertCtrl = inject(AlertController);

  // UI state
  loading = signal(true);
  pageError = signal<string | null>(null);
  segmentAction = signal<'ReferredCustomers' | 'Properties'>(
    'ReferredCustomers'
  );

  // Data
  agent = signal<Agent | null>(null);

  constructor() {
    addIcons({ chevronBackOutline, locationOutline, mailOutline, callOutline });

    // React when uid arrives (or changes)
    effect((onCleanup) => {
      const id = this.uid();
      if (!id) {
        // Do not throw — just keep waiting for uid to arrive from componentProps
        return;
      }
      this.loading.set(true);
      this.pageError.set(null);

      const sub = this.svc.getAgentByUid$(id).subscribe({
        next: (doc) => {
          this.agent.set(doc || null);
          this.loading.set(false);
        },
        error: (err) => {
          this.pageError.set(err?.message || 'Failed to load agent profile.');
          this.loading.set(false);
        },
      });

      onCleanup(() => sub.unsubscribe());
    });
  }

  async dismiss() {
    const top = await this.modalCtrl.getTop();
    if (top) await top.dismiss(null, 'cancel');
  }

  segmentChanged(ev: CustomEvent) {
    this.segmentAction.set((ev.detail as any).value);
  }

  private async toast(
    msg: string,
    color: 'success' | 'warning' | 'danger' | 'medium' = 'medium'
  ) {
    const t = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
      position: 'top',
    });
    await t.present();
  }

  async editAgent() {
    const id = this.uid();
    if (!id) {
      await this.toast('No user id (uid).', 'warning');
      return;
    }
    const modal = await this.modalCtrl.create({
      component: AgentBasicDetailsComponent,
      componentProps: { uid: id },
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      canDismiss: true,
    });
    await modal.present();
    const { role } = await modal.onWillDismiss();
    if (role === 'agent-created' || role === 'agent-updated') {
      // re-fetch latest
      this.loading.set(true);
      try {
        const fresh = await this.svc.getAgentByUidOnce(id);
        this.agent.set(fresh || null);
        await this.toast('Agent updated.', 'success');
      } catch (e: any) {
        this.pageError.set(e?.message || 'Failed to refresh agent.');
      } finally {
        this.loading.set(false);
      }
    }
  }

  /** Leave Agent → revert user to normal */
  async leaveAgent() {
    if (!this.uid) {
      await this.toast('Missing user id (uid).', 'danger');
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Leave Agent?',
      message:
        'You will be reverted to a normal user. This action can be re-applied later by becoming an agent again.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Leave',
          role: 'confirm',
          handler: () => true,
        },
      ],
    });
    await alert.present();
    const r = await alert.onWillDismiss();
    if (r.role !== 'confirm') return;

    this.loading.set(true);
    this.pageError.set(null);
    try {
      await this.svc.leaveAgent(this.uid()); // <-- implement in AgentService
      await this.toast('You have left the Agent program.', 'success');
      await this.dismiss(); // close modal, parent can refresh UI
    } catch (e: any) {
      this.pageError.set(e?.message || 'Failed to leave agent.');
      await this.toast(this.pageError()!, 'danger');
    } finally {
      this.loading.set(false);
    }
  }
}

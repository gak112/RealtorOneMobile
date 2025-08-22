import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  input, // <— signals Input (not required)
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
    CommonModule,
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
    RenewalpropertiesComponent,
  ],
})
export class AgentprofileComponent {
  // Make uid optional initially; Ionic will set componentProps after construction
  uid = input<string | null>(null);

  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);
  private svc = inject(AgentService);

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
}

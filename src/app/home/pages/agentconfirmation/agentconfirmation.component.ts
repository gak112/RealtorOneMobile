import { Component, inject, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
// import { AuthService } from 'src/app/services/auth.service';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { chevronBackOutline } from 'ionicons/icons';
import { ToastService } from 'src/app/services/toast.service';
@Component({
  selector: 'app-agentconfirmation',
  templateUrl: './agentconfirmation.component.html',
  styleUrls: ['./agentconfirmation.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    IonCheckbox,
    FormsModule,
    IonLabel,
    IonFooter,
    IonButton,
  ],
  providers: [ModalController],
})
export class AgentconfirmationComponent implements OnInit {
  private modalController = inject(ModalController);

  user: any;
  agentVerified = false;
  conditionsVerified = false;
  agent = false;
  constructor(
    private toast: ToastService /*private auth: AuthService,
    private afs: AngularFirestore*/
  ) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return;
    // this.auth.user$.subscribe(user => this.user = user);
  }

  dismiss() {
    this.modalController.dismiss();
  }

  agentConfirmation() {
    if (this.agentVerified && this.conditionsVerified) {
      this.agent = true;
      // this.afs.doc(`users/${this.user.uid}`).update({
      //   agentVerified:this.agentVerified,
      //   conditionsVerified:this.conditionsVerified,
      //   agent: this.agent
      // }
      // ).then(
      //   () =>  {
      //     this.toast.showMessage('Status Updated');
      //     this.modalController.dismiss();
      //   }
      //   );
    } else {
      this.toast.showError('Select Both & Create as Agent');
      return;
    }
  }
}

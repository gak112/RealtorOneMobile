import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonSkeletonText,
  IonToolbar,
  IonSearchbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';

import {
  arrowRedoOutline,
  checkmarkCircle,
  notificationsOutline,
  ellipsisHorizontal,
  camera,
  addCircle,
} from 'ionicons/icons';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import {
  ChatData,
  IndividualBoxComponent,
} from '../../components/individual-box/individual-box.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-personalchat',
  templateUrl: './personalchat.component.html',
  styleUrls: ['./personalchat.component.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonSkeletonText,
    IonHeader,
    IonToolbar,
    IonContent,
    IndividualBoxComponent,
    IonLabel,
    IonIcon,
    IonSkeletonText,
    ReactiveFormsModule,
    IonTitle,
  ],
})
export class PersonalchatComponent {
  chatSegment = signal<'all' | 'unRead'>('all');

  async openRequestForm() {}

  constructor() {
    addIcons({
      checkmarkCircle,
      notificationsOutline,
      arrowRedoOutline,
      ellipsisHorizontal,
      camera,
      addCircle,
    });
  }

  async openNotifications() {}

  async openProfile() {}
}

import { NgIf, NgStyle } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import {
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonSkeletonText,
  ModalController,
} from '@ionic/angular/standalone';
import { IonImgCustomEvent } from '@ionic/core';
import { addIcons } from 'ionicons';
import { checkmark, checkmarkDone, image, videocam } from 'ionicons/icons';
import {
  combineLatest,
  firstValueFrom,
  map,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import ChatviewdetailsComponent from '../../pages/chatviewdetails/chatviewdetails.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-chat-timestamp',
  template: `<span [style.color]="isUnseen() ? '#1ea962' : 'var(--color-777)'"
    >12:00 PM</span
  >`,
  standalone: true,
  imports: [],
  styles: `
   span {
      margin-bottom: 5px;
      font-size: 12px;
      font-weight: 500;
      display: block;
      letter-spacing: 0.5px;
    }
  `,
})
export class ChatTimestampComponent {
  // private dateFormatService = inject(DateFormatService);
  timestamp = input.required<number>();
  isUnseen = input.required<boolean>();

  // formattedTimestamp = computed(() =>
  //   this.dateFormatService.formatTimestamp(this.timestamp())
  // );
}

@Component({
  selector: 'app-individual-box',
  templateUrl: './individual-box.component.html',
  styleUrls: ['./individual-box.component.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonItem,
    IonLabel,
    IonIcon,
    IonSkeletonText,
    NgStyle,
    ChatTimestampComponent,
  ],
  providers: [ModalController],
})
export class IndividualBoxComponent {
  private router = inject(Router);

  private modalController = inject(ModalController);

  constructor() {
    addIcons({ image, videocam, checkmark, checkmarkDone });
  }

  async openChatFullview() {
    const modal = await this.modalController.create({
      component: ChatviewdetailsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });

    await modal.present();
  }
}

export interface ChatData {
  chatId: string;
  userName?: string;
  userMobileNumber?: string;
  unSeenMessages?: number;
}

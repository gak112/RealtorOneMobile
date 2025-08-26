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
import { InvididualChat } from '../../../models/chat.model';
import { Message } from '../../../models/groups.model';
import { User } from '@angular/fire/auth';
import { IUser } from '../../../auth/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { DateFormatService } from '../../../services/date-format.service';

@Component({
  selector: 'app-chat-timestamp',
  template: `<span
    [style.color]="isUnseen() ? '#1ea962' : 'var(--color-777)'"
    >{{ formattedTimestamp() }}</span
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
  private dateFormatService = inject(DateFormatService);
  timestamp = input.required<number>();
  isUnseen = input.required<boolean>();

  formattedTimestamp = computed(() =>
    this.dateFormatService.formatTimestamp(this.timestamp())
  );
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
  private authService = inject(AuthService);
  user$ = this.authService.user$;
  user = toSignal(this.user$);

  chatData = output<ChatData>();

  constructor() {
    addIcons({ image, videocam, checkmark, checkmarkDone });
  }

  personalChat = input.required<InvididualChat>();

  personalChat$ = toObservable(this.personalChat);

  firestore = inject(AngularFirestore);

  otherUser$ = combineLatest([this.user$, this.personalChat$]).pipe(
    switchMap(([user, chat]) =>
      this.firestore
        .doc<IUser>(
          `users/${
            chat.recipientId === user?.uid ? chat.requesterId : chat.recipientId
          }`
        )
        .valueChanges({ idField: 'id' })
        .pipe(
          tap((u) => {
            this.chatData.emit({
              chatId: chat?.id ?? chat.objectID ?? '',
              userMobileNumber: u?.phone,
              userName: u?.fullName || 'Unknown User',
            });
          })
        )
    )
  );
  otherUser = toSignal(this.otherUser$);

  chatId = computed(() => {
    let userIds = [this.user()?.uid ?? '', this.otherUser()?.uid ?? ''].sort(
      (a, b) => a.localeCompare(b)
    );
    return userIds && userIds.join('_');
  });

  chatId$ = toObservable(this.chatId);

  lastMessage$ = this.chatId$.pipe(
    switchMap((chatId) =>
      this.firestore
        .doc(`chats/${chatId}`)
        .collection<Message>(`messages`, (ref) =>
          ref.orderBy('createdAt', 'desc').limit(1)
        )
        .valueChanges({ idField: 'id' })
    ),
    map((m) => m[0])
  );

  lastMessage = toSignal(this.lastMessage$);

  unSeenMessages$ = combineLatest([this.user$, this.chatId$]).pipe(
    switchMap(([user, chatId]) => {
      return this.firestore
        .doc<InvididualChat>(`chats/${chatId}`)
        .valueChanges({ idField: 'id' })
        .pipe(
          map((chat) => ({ chat, user })),
          shareReplay(1)
        );
    }),
    switchMap(({ user, chat }) => {
      return this.firestore
        .collection<Message>(`chats/${chat?.id}/messages`, (ref) => {
          let newRef = ref
            .where('senderId', '!=', user?.uid)
            .orderBy('createdBy', 'desc');
          const lastTimeStamp = user?.uid
            ? chat?.lastMessageIds?.[user?.uid]
            : null;
          if (lastTimeStamp) {
            newRef = newRef.endAt(lastTimeStamp);
          }
          return newRef;
        })
        .valueChanges({ idField: 'id' })
        .pipe(
          map((messages) =>
            messages.filter((msg) =>
              user?.uid ? !msg.seenBy?.[user?.uid] : false
            )
          ),
          shareReplay(1),
          tap((msgs) => {
            this.chatData.emit({
              chatId: chat?.id ?? chat?.objectID ?? '',
              unSeenMessages: msgs.length ?? 0,
            });
          })
        );
    })
  );

  isLoaded = signal(false);
  onImageLoaded(_ev: IonImgCustomEvent<void>) {
    this.isLoaded.set(true);
  }

  unSeenMessages = toSignal(this.unSeenMessages$);

  async openChatFullview() {
    const chatId = await firstValueFrom(this.chatId$);
    this.router.navigate(['chat', chatId]);
  }
}

export interface ChatData {
  chatId: string;
  userName?: string;
  userMobileNumber?: string;
  unSeenMessages?: number;
}

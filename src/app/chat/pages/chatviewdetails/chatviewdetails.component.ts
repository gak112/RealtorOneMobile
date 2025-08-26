import { DatePipe, Location } from '@angular/common';
import {
  Component,
  computed,
  HostBinding,
  inject,
  Injectable,
  input,
  Pipe,
  PipeTransform,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { serverTimestamp } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonPopover,
  IonSkeletonText,
  IonTextarea,
  IonToolbar,
  ModalController,
  Platform,
  ToastController,
} from '@ionic/angular/standalone';
import firebase from 'firebase/compat/app';
import { addIcons } from 'ionicons';
import {
  add,
  addOutline,
  arrowRedoCircle,
  attachOutline,
  callOutline,
  camera,
  cameraOutline,
  chevronBackOutline,
  closeCircle,
  closeCircleSharp,
  createOutline,
  documentOutline,
  ellipsisVertical,
  happyOutline,
  imageOutline,
  micOutline,
  paperPlaneOutline,
  trashOutline,
  videocamOutline,
  warningOutline,
} from 'ionicons/icons';
import {
  combineLatest,
  filter,
  firstValueFrom,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { ChatViewData } from 'src/app/languages/data/chatview.data';
import { ChatStatus, InvididualChat } from 'src/app/models/chat.model';
import { Message } from 'src/app/models/groups.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { UploadService } from 'src/app/services/upload.service';
import { ChatenterboxComponent } from '../../components/chatenterbox/chatenterbox.component';
import { LeftMessageComponent } from '../../components/left-message/left-message.component';
import { RightMessageComponent } from '../../components/right-message/right-message.component';
import { Capacitor } from '@capacitor/core';
import { ImageaddingComponent } from '../imageadding/imageadding.component';
import { CameraSource } from '@capacitor/camera';

@Pipe({ name: 'isSameDay', standalone: true })
export class IsSameDayPipe implements PipeTransform {
  transform(message: Message, prevMessage?: Message) {
    if (!prevMessage) return false;
    const date = new Date(message?.sortDate);
    const prevDate = new Date(prevMessage?.sortDate);
    return (
      date.getFullYear() === prevDate.getFullYear() &&
      date.getMonth() === prevDate.getMonth() &&
      date.getDate() === prevDate.getDate()
    );
  }
}

@Pipe({ name: 'startOfDay', standalone: true })
export class StartOfDayPipe implements PipeTransform {
  transform(timestamp: number) {
    return getMessageDateLabel(timestamp);
  }
}

function getMessageDateLabel(timestamp: number) {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  if (
    messageDate.getFullYear() === today.getFullYear() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getDate() === today.getDate()
  ) {
    return 'Today';
  }

  if (
    messageDate.getFullYear() === yesterday.getFullYear() &&
    messageDate.getMonth() === yesterday.getMonth() &&
    messageDate.getDate() === yesterday.getDate()
  ) {
    return 'Yesterday';
  }

  return formatDate(messageDate);
}

@Component({
  selector: 'app-chatviewdetails',

  templateUrl: './chatviewdetails.component.html',
  styleUrls: ['./chatviewdetails.component.scss'],
  standalone: true,
  imports: [
    IonPopover,
    IonButton,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonImg,
    IonContent,
    IonInput,
    IonFooter,
    ChatenterboxComponent,
    IonSkeletonText,
    LeftMessageComponent,
    RightMessageComponent,
    ReactiveFormsModule,
    IonTextarea,
    IsSameDayPipe,
    StartOfDayPipe,
  ],
  providers: [ModalController],
})
export default class ChatviewdetailsComponent {
  private location = inject(Location);
  private firestore = inject(AngularFirestore);
  private chatService = inject(ChatService);
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastCtrl = inject(ToastController);
  private uploadService = inject(UploadService);
  private platform = inject(Platform);
  private modalController = inject(ModalController);
  private router: Router = inject(Router);

  @HostBinding('style.max-height') maxHeight: string = '100vh';

  async ionViewDidEnter() {
    try {
      const [unSeenMessages, chat, user] = await Promise.all([
        firstValueFrom(this.unSeenMessages$),
        firstValueFrom(this.chat$),
        firstValueFrom(this.user$),
      ]);
      if (!user || !chat || unSeenMessages.length < 1) return;
      const chatRef = this.firestore.firestore.doc(`chats/${chat.id}`);
      await this.firestore.firestore.runTransaction(async (transaction) => {
        const chatData = (
          await transaction.get(chatRef)
        ).data() as InvididualChat;
        const msgDatas = await Promise.all(
          unSeenMessages.map(async (msg) => {
            const msgRef = this.firestore.firestore.doc(
              `chats/${chat.id}/messages/${msg.id}`
            );
            const msgData = (await transaction.get(msgRef)).data() as Message;
            return [msgRef, msgData] as const;
          })
        );
        msgDatas.forEach(([msgRef, msgData]) => {
          transaction.update(msgRef, {
            seenBy: { ...msgData.seenBy, [user?.uid]: true },
          } satisfies Partial<Message>);
        });
        transaction.update(chatRef, {
          lastMessageIds: {
            ...chatData.lastMessageIds,
            [user?.uid]: unSeenMessages[0]?.createdAt,
          },
        } satisfies Partial<InvididualChat>);
      });
    } catch (error) {
      console.log(error, 'ionViewDidEnter');
    }
  }

  user$ = this.authService.user$;
  user = toSignal(this.user$);

  ids = input<string>();
  userIds = computed(() => this.ids()?.split('_'));
  otherUserId = computed(
    () => this.userIds()?.filter((id) => id !== this.user()?.uid)?.[0]
  );
  otherUserId$ = toObservable(this.otherUserId);
  otherUserData$ = this.otherUserId$.pipe(
    switchMap((uid) =>
      this.firestore.doc<User>(`users/${uid}`).valueChanges({ idField: 'id' })
    )
  );
  otherUserData = toSignal(this.otherUserData$);
  chatId = computed(() => {
    firebase.firestore.FieldValue.arrayUnion();
    let userIds = this.ids()
      ?.split('_')
      .sort((a, b) => a.localeCompare(b));
    return userIds && userIds.join('_');
  });
  chatId$ = toObservable(this.chatId);
  chatDoc$ = this.chatId$.pipe(
    filter((chatId) => !!chatId),
    map((chatId) => this.firestore.doc<InvididualChat>(`chats/${chatId}`))
  );

  chat$ = this.chatDoc$.pipe(switchMap((chatDoc) => chatDoc.valueChanges()));
  chat = toSignal(this.chat$);

  unSeenMessages$ = combineLatest([this.user$, this.chat$]).pipe(
    switchMap(([user, chat]) => {
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
          shareReplay(1)
        );
    })
  );

  unSeenMessages = toSignal(this.unSeenMessages$);

  isInvitationSent = computed(
    () =>
      this.chat()?.status === 'Requested' &&
      this.user()?.uid === this.chat()?.requesterId
  );

  shouldYouAccept = computed(
    () =>
      this.chat()?.status === 'Requested' &&
      this.user()?.uid === this.chat()?.recipientId
  );

  isNotStarted = computed(() => this.chat() === undefined);
  messages$ = this.chatDoc$.pipe(
    switchMap((chat) =>
      chat
        .collection<Message>('messages', (ref) =>
          ref.orderBy('createdAt', 'desc')
        )
        .valueChanges()
    )
  );
  messages = toSignal(this.messages$, { initialValue: [] });

  replyMessage = signal<{
    message: Message | null;
    sender: User | null;
  } | null>(null);

  messageCtrl = this.formBuilder.control<string | null>(null);
  photoCtrl = this.formBuilder.control<string | null>(null);

  async createInvididualChat(message: Message) {
    try {
      const [requesterId, recipientId, chatId] = await Promise.all([
        firstValueFrom(this.user$).then((user) => user?.uid),
        firstValueFrom(this.otherUserId$),
        firstValueFrom(this.chatId$),
      ]);

      if (
        requesterId === undefined ||
        recipientId === undefined ||
        chatId === undefined
      ) {
        throw new Error('Something went wrong');
      }
      await this.chatService.createInvididualChat(
        requesterId,
        recipientId,
        chatId,
        message
      );
    } catch (error) {}
  }

  messageLoading = signal(false);

  ChatViewData = new ChatViewData();

  chatViewData = toSignal(
    this.user$.pipe(
      map((user) => {
        const Language = user?.language || 'english';
        return this.ChatViewData.getData(Language);
      })
    )
  );

  async sendMessage(event: MouseEvent | null) {
    event?.stopPropagation();
    if (this.messageCtrl.value === null && this.photoCtrl.value === null)
      return;
    if (this.messageLoading()) return;

    try {
      this.messageLoading.set(true);
      const user = await firstValueFrom(this.user$);
      const chatId = await firstValueFrom(this.chatId$);
      if (chatId === undefined) {
        throw new Error('ChatId Not Found');
      }
      const messageData: Message = {
        message: this.messageCtrl.value ?? '',
        image: this.photoCtrl.value ?? '',
        type: this.replyMessage()?.message ? 'reply' : 'new',
        createdAt: serverTimestamp(),
        senderId: user?.uid ?? '',
        chatId: chatId,
        createdBy: user?.uid ?? '',
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid ?? '',
        sortDate: Date.now(),
        replyMessage: this.replyMessage()?.message ?? null,
        seenBy: {},
        deletedAt: null,
        deletedBy: null,
        isDeleted: false,
      };
      if (this.isNotStarted()) {
        await this.createInvididualChat(messageData);
      } else {
        const chatDoc = await firstValueFrom(this.chatDoc$);
        await chatDoc.collection('messages').add(messageData);
        chatDoc.update({
          updatedAt: serverTimestamp(),
          updatedBy: this.user()?.uid,
        });
      }
      this.replyMessage.set(null);
      this.messageCtrl.reset();
      this.photoCtrl.reset();
    } catch (error) {
      console.log(error);
      this.toastCtrl
        .create({
          message: 'Failed to send message',
          duration: 500,
          color: 'danger',
          position: 'top',
        })
        .then((toast) => toast.present());
    } finally {
      this.messageLoading.set(false);
    }
  }

  async uploadImages(source: 'library' | 'camera') {
    if (this.messageLoading()) return;
    try {
      this.messageLoading.set(true);
      const photoUrl = await this.uploadService.selectMedia(
        source === 'library'
          ? CameraSource.Photos
          : source === 'camera'
          ? CameraSource.Camera
          : undefined
      );
      this.addImages(photoUrl);
    } catch (error: any) {
      if (error.message === 'Cancelled') return;
      this.toastCtrl
        .create({
          message: 'Failed to send message',
          duration: 500,
          color: 'danger',
          position: 'top',
        })
        .then((toast) => toast.present());
    } finally {
      this.messageLoading.set(false);
    }
  }
  async openProfile() {
    this.router.navigateByUrl('/more/more-profile/' + this.otherUserData()?.id);
  }

  async processChatRequest(event: MouseEvent, status: ChatStatus) {
    event.stopPropagation();
    if (this.messageLoading()) return;
    try {
      this.messageLoading.set(true);
      const chatId = await firstValueFrom(this.chatId$);
      if (!chatId) {
        throw new Error('ChatID is not valid');
      }
      await this.chatService.processChatRequest(chatId, status);
    } catch (error) {
      console.log(error);
    } finally {
      this.messageLoading.set(false);
    }
  }

  close() {
    this.location.back();
  }

  iosBottomPadding = this.platform.is('ios') ? '30px' : '10px';

  async toReply(event: { message: Message; sender: User | 'me' } | null) {
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.replyMessage.set({
      message: event?.message ?? null,
      sender: (event?.sender === 'me' ? this.user() : event?.sender) ?? null,
    });
  }

  async addImages(image: string) {
    const modal = await this.modalController.create({
      component: ImageaddingComponent,
      componentProps: {
        image,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<{
      status: 'confirm' | 'cancel';
      message?: string;
      image?: string;
    }>();
    if (data) {
      if (data.status === 'confirm') {
        this.photoCtrl.setValue(data.image ?? null);
        this.messageCtrl.setValue(data.message ?? null);
        this.sendMessage(null);
        this.onBlur();
      }
    }
  }



  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = this.messageCtrl.value;
      value && this.sendMessage(null);
    }
  }

  content = viewChild(IonContent);

  keyboardHeight = 0;

  onFocus() {
    if (this.keyboardHeight === 0) {
      return;
    }
    this.maxHeight = `calc(100vh - ${this.keyboardHeight}px)`;
    this.iosBottomPadding = '10px';
  }

  onBlur() {
    this.maxHeight = `100vh`;
    this.iosBottomPadding = this.platform.is('ios') ? '30px' : '10px';
  }

  constructor() {
    addIcons({
      chevronBackOutline,
      videocamOutline,
      callOutline,
      ellipsisVertical,
      warningOutline,
      closeCircleSharp,
      camera,
      closeCircle,
      add,
      cameraOutline,
      paperPlaneOutline,
      micOutline,
      documentOutline,
      addOutline,
      arrowRedoCircle,
      happyOutline,
      attachOutline,
      imageOutline,
      createOutline,
      trashOutline,
    });

    if (Capacitor.getPlatform() !== 'web') {
      Keyboard.addListener('keyboardWillShow', (info) => {
        if (this.keyboardHeight !== 0) {
          return;
        }
        this.maxHeight = `calc(100vh - ${info.keyboardHeight}px)`;
        this.keyboardHeight = info.keyboardHeight;
        this.iosBottomPadding = '10px';
      });
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class IdsResolver implements Resolve<boolean> {
  private router = inject(Router);

  resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
    let ids = route.paramMap.get('ids');
    if (!ids) {
      this.router.navigate(['tabs', 'chat']);
      return of(false);
    }
    const isValid =
      ids.split('_').length === 2 &&
      ids.split('_').every((id) => id.trim() !== '');
    if (!isValid) {
      this.router.navigate(['tabs', 'chat']);
      return of(false);
    }
    return of(true);
  }
}

function isSameDay(timestamp: number, prevTimestamp: number) {
  const date = new Date(timestamp);
  const prevDate = new Date(prevTimestamp);
  return (
    date.getFullYear() === prevDate.getFullYear() &&
    date.getMonth() === prevDate.getMonth() &&
    date.getDate() === prevDate.getDate()
  );
}

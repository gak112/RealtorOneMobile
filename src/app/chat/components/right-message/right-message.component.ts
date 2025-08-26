import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  model,
  viewChild,
} from '@angular/core';
import {
  outputFromObservable,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  IonIcon,
  IonImg,
  IonItem,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  camera,
  checkmarkDoneSharp,
  checkmarkSharp,
  closeCircle,
  warningOutline,
} from 'ionicons/icons';
import {
  combineLatest,
  debounceTime,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Message } from 'src/app/models/groups.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ImgfullviewComponent } from 'src/app/shared/pages/imgfullview/imgfullview.component';
import { LongPressDirective } from 'src/app/utils/long-press.directive';
@Component({
  selector: 'app-right-message',
  templateUrl: './right-message.component.html',
  styleUrls: ['./right-message.component.scss'],
  standalone: true,
  imports: [
    IonItemOptions,
    IonItemSliding,
    IonIcon,
    IonImg,
    IonLabel,
    IonItem,
    DatePipe,
    LongPressDirective,
  ],
})
export class RightMessageComponent {
  private firestore = inject(AngularFirestore);
  private authService = inject(AuthService);
  private modalController = inject(ModalController);
  user$ = this.authService.user$;
  user = toSignal(this.user$);

  message = input.required<Message>();
  message$ = toObservable(this.message);

  userIds = input<string[]>();
  otherUserId = computed(
    () => this.userIds()?.filter((id) => id !== this.user()?.uid)?.[0]
  );

  canSelectMessages = input(false);
  selectedMessage = model<Message | null>(null);

  slider = viewChild<IonItemSliding>('slider');
  slider$ = toObservable(this.slider);
  onDrag$ = combineLatest([this.slider$, this.message$]).pipe(
    switchMap(([slider, message]) =>
      slider
        ? slider?.ionDrag.pipe(map(() => ({ message, sender: 'me' as const })))
        : of(null)
    ),
    debounceTime(500)
  );
  onDragOutput = outputFromObservable(this.onDrag$);

  replySender$ = this.message$.pipe(
    filter((message) => message.type === 'reply'),
    map((message) => message.replyMessage?.senderId),
    switchMap((senderId) =>
      this.firestore.doc<User>(`users/${senderId}`).valueChanges()
    )
  );
  replySender = toSignal(this.replySender$);

  constructor() {
    addIcons({
      camera,
      checkmarkDoneSharp,
      closeCircle,
      warningOutline,
      checkmarkSharp,
    });
  }

  selectMessage() {
    this.selectedMessage.set(this.message());
  }

  async openImage(image: string) {
    const modal = await this.modalController.create({
      component: ImgfullviewComponent,
      componentProps: { img: image },
    });
    return await modal.present();
  }
}

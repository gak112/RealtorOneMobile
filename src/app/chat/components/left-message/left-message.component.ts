import { DatePipe } from '@angular/common';
import { Component, inject, input, model, viewChild } from '@angular/core';
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
  checkmarkDoneOutline,
  closeCircle,
  warningOutline,
} from 'ionicons/icons';
import { combineLatest, debounceTime, filter, map, of, switchMap } from 'rxjs';
import { Message } from 'src/app/models/groups.model';
import { User } from 'src/app/models/user.model';
import { ImgfullviewComponent } from 'src/app/shared/pages/imgfullview/imgfullview.component';
import { LongPressDirective } from 'src/app/utils/long-press.directive';

@Component({
  selector: 'app-left-message',
  templateUrl: './left-message.component.html',
  styleUrls: ['./left-message.component.scss'],
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
export class LeftMessageComponent {
  private firestore = inject(AngularFirestore);
  private modalController = inject(ModalController);

  canSelectMessages = input(false);
  selectedMessage = model<Message | null>(null);

  message = input.required<Message>();
  message$ = toObservable(this.message);
  isGroupChat = input.required<boolean>();

  sender$ = this.message$.pipe(
    map((message) => message.senderId),
    switchMap((senderId) =>
      this.firestore.doc<User>(`users/${senderId}`).valueChanges()
    )
  );
  sender = toSignal(this.sender$);

  slider = viewChild<IonItemSliding>('slider');
  slider$ = toObservable(this.slider);
  onDrag$ = combineLatest([this.slider$, this.message$, this.sender$]).pipe(
    switchMap(([slider, message, sender]) =>
      slider && sender
        ? slider?.ionDrag.pipe(map(() => ({ message, sender })))
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
    addIcons({ camera, checkmarkDoneOutline, closeCircle, warningOutline });
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

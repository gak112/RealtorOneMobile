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
import { AuthService } from 'src/app/services/auth.service';
import { ChatenterboxComponent } from '../../components/chatenterbox/chatenterbox.component';
import { LeftMessageComponent } from '../../components/left-message/left-message.component';
import { RightMessageComponent } from '../../components/right-message/right-message.component';
import { Capacitor } from '@capacitor/core';
import { CameraSource } from '@capacitor/camera';

@Pipe({ name: 'isSameDay', standalone: true })
export class IsSameDayPipe implements PipeTransform {
  transform(message: any, prevMessage?: any) {
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
  private modalController = inject(ModalController);

  @HostBinding('style.max-height') maxHeight: string = '100vh';

  messageLoading = signal(false);

  async openProfile() {}

  close() {
    this.modalController.dismiss();
  }

  content = viewChild(IonContent);

  keyboardHeight = 0;

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
  }
}

// @Injectable({
//   providedIn: 'root',
// })
// export class IdsResolver implements Resolve<boolean> {
//   private router = inject(Router);

//   resolve(route: ActivatedRouteSnapshot): Observable<boolean> {
//     let ids = route.paramMap.get('ids');
//     if (!ids) {
//       this.router.navigate(['tabs', 'chat']);
//       return of(false);
//     }
//     const isValid =
//       ids.split('_').length === 2 &&
//       ids.split('_').every((id) => id.trim() !== '');
//     if (!isValid) {
//       this.router.navigate(['tabs', 'chat']);
//       return of(false);
//     }
//     return of(true);
//   }
// }

// function isSameDay(timestamp: number, prevTimestamp: number) {
//   const date = new Date(timestamp);
//   const prevDate = new Date(prevTimestamp);
//   return (
//     date.getFullYear() === prevDate.getFullYear() &&
//     date.getMonth() === prevDate.getMonth() &&
//     date.getDate() === prevDate.getDate()
//   );
// }

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
import { ImgfullviewComponent } from 'src/app/more/pages/imgfullview/imgfullview.component';
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
  ],
})
export class RightMessageComponent {
  private modalController = inject(ModalController);

  canSelectMessages = input(false);

  slider = viewChild<IonItemSliding>('slider');
  slider$ = toObservable(this.slider);

  constructor() {
    addIcons({
      camera,
      checkmarkDoneSharp,
      closeCircle,
      warningOutline,
      checkmarkSharp,
    });
  }

  selectMessage() {}

  async openImage(image: string) {
    const modal = await this.modalController.create({
      component: ImgfullviewComponent,
      componentProps: { img: image },
    });
    return await modal.present();
  }
}

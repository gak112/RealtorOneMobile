import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonImg,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { PostentryComponent } from '../postentry/postentry.component';

@Component({
  selector: 'app-requestsubmenu',
  templateUrl: './requestsubmenu.component.html',
  styleUrls: ['./requestsubmenu.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonImg, IonLabel],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RequestsubmenuComponent implements OnInit {
  private modalController = inject(ModalController);

  @Input() action: any;
  propertyComponent = PostentryComponent;

  constructor() {
    addIcons({
      chevronBackOutline,
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openPostEntry(type: string) {
    const modal = await this.modalController.create({
      component: PostentryComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
      componentProps: {
        action: type,
        actionType: this.action,
      },
    });
    await modal.present();
  }

  ngOnInit() {
    return;
  }

  // goForward(type: any) {
  //   this.nav.push(this.propertyComponent, { actionType: type, action: this.action });
  // }
}

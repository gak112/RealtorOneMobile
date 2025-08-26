import {
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
  IonFooter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { IProfile } from 'src/app/languages/interface/profile/profile.interface';
import { LanguageService } from 'src/app/services/language.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-payments-address-list',
  templateUrl: './payments-address-list.component.html',
  styleUrls: ['./payments-address-list.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    ReactiveFormsModule,
    IonButton,
    IonFooter
  ],
})
export class PaymentsAddressListComponent implements OnInit {
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ chevronBackOutline });
  }

  dismiss() {
    this.modalController.dismiss();
  }

  ngOnInit() {}
}

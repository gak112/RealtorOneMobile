import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonIcon,
  IonTitle,
  ModalController,
  IonContent,
  IonLabel,
  IonInput,
  IonTextarea,
  IonImg,
  IonFooter,
  IonButton,
  IonSelect,
  IonSelectOption, IonCheckbox } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  arrowForward,
  caretDownOutline,
  caretUpOutline,
  chevronBackOutline,
  cloudUploadOutline,
  trashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-create-venture-type-form',
  templateUrl: './create-venture-type-form.component.html',
  styleUrls: ['./create-venture-type-form.component.scss'],
  standalone: true,
  imports: [IonCheckbox, 
    IonButton,
    IonFooter,
    IonImg,
    IonTextarea,
    IonInput,
    IonLabel,
    IonContent,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonSelect,
    IonSelectOption,
  ],
})
export class CreateVentureTypeFormComponent implements OnInit {
  private modalController = inject(ModalController);

  ventureTypeForm = signal<string>('');

  typeOfPlot = signal<string>('');

  activeFilter = signal<
    'basicDetails' | 'propertyDetails' | 'uploadAttachments'
  >('basicDetails');

  constructor() {
    addIcons({
      chevronBackOutline,
      arrowForward,
      arrowBack,
      caretDownOutline,
      caretUpOutline,
      cloudUploadOutline,
      trashOutline,
    });
  }
  dismiss() {
    this.modalController.dismiss();
  }

  openDetectLocation() {}

  ngOnInit() {}

  next() {
    switch (this.activeFilter()) {
      case 'basicDetails':
        this.activeFilter.set('propertyDetails');
        break;
      case 'propertyDetails':
        this.activeFilter.set('uploadAttachments');
        break;
    }
  }

  back() {
    switch (this.activeFilter()) {
      case 'basicDetails':
        break;
      case 'propertyDetails':
        this.activeFilter.set('basicDetails');
        break;
      case 'uploadAttachments':
        this.activeFilter.set('propertyDetails');
        break;
    }
  }

  stepCount = computed(() => {
    return this.activeFilter() === 'basicDetails'
      ? 0
      : this.activeFilter() === 'propertyDetails'
      ? 1
      : 2;
  });

  submit() {}
}

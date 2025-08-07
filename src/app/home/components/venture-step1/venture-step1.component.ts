import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  add,
  caretDownOutline,
  caretUpOutline,
  cloudUploadOutline,
  informationCircle,
  trashOutline,
} from 'ionicons/icons';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { SpecificationsComponent } from 'src/app/more/components/specifications/specifications.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';
import { SpecviewComponent } from '../../../more/components/specview/specview.component';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import { VentureTowerComponent } from '../venture-tower/venture-tower.component';
import { VentureHousevillaComponent } from '../venture-housevilla/venture-housevilla.component';

@Component({
  selector: 'app-venture-step1',
  templateUrl: './venture-step1.component.html',
  styleUrls: ['./venture-step1.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonIcon,
    IonTextarea,
    IonBadge,
    FormsModule,
    UcWidgetModule,
    IonLabel,
    IonButton,
    IonSelectOption,
    SpecviewComponent,
    IonImg,
    IonSelect,
    VentureTowerComponent,
    VentureHousevillaComponent,
  ],
  providers: [ModalController],
})
export class VentureStep1Component implements OnInit {
  private modalController = inject(ModalController);

  // formBuilder = inject(NonNullableFormBuilder)
  // ventureForm = this.formBuilder.group({
  //   ventureName: ['', Validators.required],
  //   description: ['', Validators.required],
  //   ventureWebsite: ['', Validators.required],
  //   logo: ['', Validators.required],
  // })

  constructor() {
    addIcons({
      informationCircle,
      trashOutline,
      add,
      caretDownOutline,
      caretUpOutline,
      cloudUploadOutline
    });
  }

  actionTab = signal<string>('towerAPT');

  isTowerDataOpen = signal(false);

  openTower() {
    this.isTowerDataOpen.set(!this.isTowerDataOpen());
  }

  ngOnInit() {
    return;
  }

  ventures = {
    ventureName: '',
    description: '',
    ventureWebsite: '',
    logo: '',
    ventureImages: ['', '', ''],
    amenities: ['', '', ''],
    directors: '',
    companyName: '',
    companyWebsite: '',
    facebookLink: '',
    instagramLink: '',
    twitterLink: '',
    brochure: '',
    landArea: '',
    landAreaUnits: '',
    propertySizeBuildUp: '',
    openArea: '',
    towerAPT: '',
    houseVilla: '',
  };

  ventID: any;
  ventureNameValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  ventureNameError: any;
  ventureDescriptionValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  ventureDescriptionError: any;
  area: string = '';
  city: string = '';
  district: string = '';
  state: string = '';
  pincode: string = '';

  onLogoComplete($event: Event) {
    throw new Error('Method not implemented.');
  }

  uploadLogoValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  ventureImagesComplete($event: Event) {
    throw new Error('Method not implemented.');
  }

  deleteImage(_t55: any) {
    throw new Error('Method not implemented.');
  }

  async amenitiesList() {
    const modal = await this.modalController.create({
      component: AmenitiesComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  onBrochureComplete($event: Event) {
    throw new Error('Method not implemented.');
  }

  landAreaValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  landAreaUnitsValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  landAreaError: any;
  landAreaUnitsError: any;

  propertySizeBuildUpValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  propertySizeBuildUpError: any;
  propertyUnitsError: any;

  async openSpecifications() {
    const modal = await this.modalController.create({
      component: SpecificationsComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });
    await modal.present();
  }

  user: any;

  ventureData() {
    throw new Error('Method not implemented.');
  }

  ventureEdit: any;

  towerAPRValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  simplexValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  towerAPTError: any;
  houseVillaError: any;
}
function backwardLeaveAnimation(baseEl: any, opts?: any): Animation {
  throw new Error('Function not implemented.');
}

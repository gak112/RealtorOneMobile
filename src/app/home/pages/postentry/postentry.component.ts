import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import firebase from 'firebase/compat/app';
import { addIcons } from 'ionicons';
import {
  add,
  caretDownOutline,
  cloudUploadOutline,
  trashOutline,
  videocamOutline,
} from 'ionicons/icons';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { UcWidgetComponent, UcWidgetModule } from 'ngx-uploadcare-widget';
import { IRequest } from 'src/app/models/request.model';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import { ToastService } from 'src/app/services/toast.service';
import { BillingComponent } from '../billing/billing.component';
import { LocationComponent } from '../location/location.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-postentry',
  templateUrl: './postentry.component.html',
  styleUrls: ['./postentry.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    UcWidgetModule,
    IonImg,
    IonFooter,
    IonTextarea,
  ],
  providers: [ModalController],
})
export class PostentryComponent implements OnInit {
  private modalController = inject(ModalController);

  @Input() action: any;
  @Input() actionType!: string;
  @ViewChild('uc') ucare!: UcWidgetComponent;
  @ViewChild('places') places!: ElementRef<HTMLInputElement>;

  ageOfPropertyAction = 'underconstruction';
  paymentAction = 'singlePlan';
  pincode: string | any;
  selectedLocation: any;
  point: any = new firebase.firestore.GeoPoint(32.5522, 34.556656);
  locationSystemType: any;
  locationType: any;
  lat!: number; // =37.0902;
  lng!: number; //=95.7129  ;
  location: string | any;
  source: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0],
          },
        },
      ],
    },
  };
  user: any;
  plus_code: any;
  area: any;
  city: string | any;
  district: string | any;
  state: string | any;
  country: string | any;
  locations: ILocation[] = [];
  loading = false;

  paymentProcessing = false;
  request!: IRequest;
  price: any;

  constructor(
    private nav: NavController,
    private toast: ToastService /*private afs: AngularFirestore, 
        private auth: AuthService*/
  ) {
    addIcons({ add, videocamOutline, trashOutline, caretDownOutline, cloudUploadOutline });
  }

  ngOnInit(): void {
    //   this.auth.user$.subscribe(user => {
    //     this.user = user;

    // });

    this.intializeRequests();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  segmentChanged(val: { detail: { value: any } }): void {
    this.action = val.detail.value;
  }

  subSegmentChanged(val: { detail: { value: any } }): void {
    this.actionType = val.detail.value;
  }

  ageOfPropertyChanged(val: any): void {
    this.ageOfPropertyAction = val.detail.value;
  }

  async billing() {
    const modal = await this.modalController.create({
      component: BillingComponent,
      componentProps: { request: this.request, user: this.user },
    });
    return await modal.present();
  }

  async openNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      cssClass: 'modal-settings',
    });
    return await modal.present();
  }

  async openLocation() {
    const modal = await this.modalController.create({
      // component: LocationnewComponent,
      component: LocationComponent,
    });
    return await modal.present();
  }

  async amenitiesList() {
    const modal = await this.modalController.create({
      component: AmenitiesComponent,
      componentProps: { selectedAmenities: this.request.amenities },
      initialBreakpoint: 1,
      breakpoints: [1],
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      data.forEach((amenity: any) => {
        this.request.amenities.push(amenity.amenity);
      });
    }
  }

  paymentChanged(val: { detail: { value: string } }): void {
    this.paymentAction = val.detail.value;
  }

  public handleAddressChange(address: Address): void {
    // Do some stuff

    this.pincode = null;

    this.lat = address.geometry.location.lat();
    this.lng = address.geometry.location.lng();

    this.source.data.features[0].geometry.coordinates = [this.lng, this.lat];

    this.location = {
      locationName: address.address_components[0].short_name,
      address: address.formatted_address + ' - ' + this.pincode,
      lat: this.lat,
      lng: this.lng,
    };

    this.manageAddress(address);
  }

  clearLocation(): void {
    this.location = '';
    this.city = '';
    this.district = '';
    this.state = '';
    this.country = '';
    this.pincode = '';
  }

  setLocation() {
    this.locations.push({
      location: this.location,
      country: this.country,
      state: this.state,
      district: this.district,
      city: this.city,
      pincode: this.pincode,
      locationSystemType: this.locationSystemType,
      locationType: this.locationType,
      geoPoint: this.point,
    });

    this.location = null;
    this.country = null;
    this.state = null;
    this.district = null;
    this.city = null;
    this.pincode = null;
    this.locationSystemType = null;
    this.locationType = null;
    this.point = null;

    this.places.nativeElement.value = '';
    this.places.nativeElement.focus();
  }

  manageAddress(address: Address) {
    const addressComponents = address.address_components;

    addressComponents.forEach(
      (addressComponent: { types: any[]; long_name: any }) => {
        switch (addressComponent.types[0]) {
          case 'country':
            this.country = addressComponent.long_name;
            break;
          case 'administrative_area_level_1':
            this.state = addressComponent.long_name;
            break;
          case 'administrative_area_level_2':
            this.district = addressComponent.long_name;
            break;
          case 'locality':
            this.city = addressComponent.long_name;
            break;
          case 'route':
            this.area = addressComponent.long_name;
            break;
          case 'political':
            this.area = addressComponent.long_name;
            break;
          case 'plus_code':
            this.plus_code = addressComponent.long_name;
            break;
          case 'postal_code':
            this.pincode = addressComponent.long_name;
            break;
        }
      }
    );

    this.location = {
      locationName: address.address_components[0].short_name,
      address:
        address.formatted_address + (this.pincode ? ' - ' + this.pincode : ''),
      lat: this.lat,
      lng: this.lng,
    };

    // "plus_code"
    // "political"
    // "locality"
    // "administrative_area_level_2"
    // "administrative_area_level_1"
    // "country"
    // "postal_code"
  }

  onComplete(event: { count: number; cdnUrl: string }): void {
    this.ucare.reset();
    this.ucare.clearUploads();

    if (event.count) {
      for (let i = 0; i < event.count; i++) {
        this.request.resources.push({
          resourceName: '',
          resourceUrl: event.cdnUrl + '/nth/' + i + '/',
          resourceType: 'image',
        });
      }
    } else {
      this.request.resources.push({
        resourceName: '',
        resourceUrl: event.cdnUrl,
        resourceType: 'image',
      });
    }

    if (2 - this.request.resources.length === 1) {
      this.ucare.multiple = false;
    }
  }

  removeImage(index: number) {
    this.request.resources.splice(index, 1);
    if (this.request.resources.length === 0) {
      this.ucare.multiple = true;
    } else if (2 - this.request.resources.length === 1) {
      this.ucare.multiple = false;
    }
  }

  submit() {
    if (this.loading) {
      return;
    }
    this.loading = true;

    if (this.request.title) {
      if (this.request.title.trim() === '') {
        this.toast.showError('Please Enter Title');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Enter Title');
      this.loading = false;
      return;
    }

    if (this.actionType === 'Residential') {
      if (this.request.houseType) {
        if (this.request.houseType.trim() === '') {
          this.toast.showError('Please Enter House Type');
          this.loading = false;
          return;
        }
      } else {
        this.toast.showError('Please Enter House Type');
        this.loading = false;
        return;
      }

      if (this.request.bhkType) {
        if (this.request.bhkType.trim() === '') {
          this.toast.showError('Please Enter BHK Type');
          this.loading = false;
          return;
        }
      } else {
        this.toast.showError('Please Enter BHK Type');
        this.loading = false;
        return;
      }
    }

    if (this.request.propertySize) {
      if (this.request.propertySize === 0) {
        this.toast.showError('Please Enter Property Size');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Enter Property Size');
      this.loading = false;
      return;
    }

    if (this.request.totalPropertyUnits) {
      if (this.request.totalPropertyUnits.trim() === '') {
        this.toast.showError('Please Select Total Property Units');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Select Total Property Units');
      this.loading = false;
      return;
    }

    if (this.request.propertySizeBuildUp) {
      if (this.request.propertySizeBuildUp === 0) {
        this.toast.showError('Please Enter PropertySize BuildUp');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Enter PropertySize BuildUp');
      this.loading = false;
      return;
    }

    if (this.request.propertyUnits) {
      if (this.request.propertyUnits.trim() === '') {
        this.toast.showError('Please Select Property Units');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Select Property Units');
      this.loading = false;
      return;
    }

    if (this.request.toilets) {
      if (this.request.toilets === 0) {
        this.toast.showError('Please Enter Toilets');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Enter Toilets');
      this.loading = false;
      return;
    }

    if (this.request.poojaRoom) {
      if (this.request.poojaRoom === 0) {
        this.toast.showError('Please Enter Pooja Room');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Enter Pooja Room');
      this.loading = false;
      return;
    }

    if (this.request.livingDining) {
      if (this.request.livingDining === 0) {
        this.toast.showError('Please Enter Living Dining');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Enter Living Dining');
      this.loading = false;
      return;
    }

    if (this.request.kitchen) {
      if (this.request.kitchen === 0) {
        this.toast.showError('Please Enter Kitchen');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Enter Kitchen');
      this.loading = false;
      return;
    }

    if (this.request.floor) {
      if (this.request.floor.trim() === '') {
        this.toast.showError('Please Select Floor');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Select Floor');
      this.loading = false;
      return;
    }

    if (this.request.costOfProperty) {
      if (this.request.costOfProperty === 0) {
        this.toast.showError('Please Enter Cost Of Property');
        this.loading = false;
        return;
      }
    } else {
      this.toast.showError('Please Enter Cost Of Property');
      this.loading = false;
      return;
    }

    // if (this.paymentProcessing) {
    //   return;
    // }

    this.request = {
      title: this.request.title || '',
      houseType: this.request.houseType || '',
      bhkType: this.request.bhkType || '',
      toilets: this.request.toilets || 0,
      poojaRoom: this.request.poojaRoom || 0,
      livingDining: this.request.livingDining || 0,
      kitchen: this.request.kitchen || 0,
      propertySizeBuildUp: this.request.propertySizeBuildUp || 0,
      northFacing: this.request.northFacing || '',
      northSize: this.request.northSize || 0,
      units: this.request.units || '',
      propertyUnits: this.request.propertyUnits || '',
      totalPropertyUnits: this.request.totalPropertyUnits || '',
      southFacing: this.request.southFacing || '',
      southSize: this.request.southSize || 0,
      eastFacing: this.request.eastFacing || '',
      eastSize: this.request.eastSize || 0,
      westFacing: this.request.westFacing || '',
      westSize: this.request.westSize || 0,
      propertySize: this.request.propertySize,
      amenities: this.request.amenities || [],
      floor: this.request.floor || '',
      noOfYears: this.request.noOfYears || 0,
      // ownership: this.request.ownership|| '',
      rent: this.request.rent || 0,
      rentUnits: this.request.rentUnits || '',
      costOfProperty: this.request.costOfProperty || 0,
      addressOfProperty: this.location || '',
      description: this.request.description || '',
      resources: this.request.resources || [],
      videoResources: this.request.videoResources || [],
      action: this.action || '',
      actionType: this.actionType || '',
      ageOfPropertyAction: this.ageOfPropertyAction || '',
      paymentAction: this.paymentAction || '',
      uid: this.user.uid || '',
      planCost: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp() || '',
      createdBy: this.user.uid || '',
      status: 'pending',
      displayDate: new Date().toDateString(),
      sortTime: null,
      sortDate: +new Date(),
      sortDate2: new Date(),
    };

    // const batch = this.afs.firestore.batch();

    // const requestRef = this.afs.firestore.collection(`requests`).doc();
    // batch.set(requestRef, Object.assign(this.request));

    // const userDashboardRef = this.afs.firestore.collection(`dashboard`).doc('1');
    // batch.update(userDashboardRef, Object.assign({properties: firebase.firestore.FieldValue.increment(1)}));

    // batch.commit().then(() => {
    //   this.toast.showMessage('Saved Successfully', 1000);
    //   this.intializeRequests();
    //   this.goRoot();
    //   this.loading = false;
    //   this.modalController.dismiss();

    // }).catch(err => {
    //   this.loading = false;
    // });
  }

  intializeRequests() {
    this.request = {
      title: '',
      houseType: '',
      bhkType: '',
      toilets: null,
      poojaRoom: null,
      livingDining: null,
      kitchen: null,
      propertySizeBuildUp: null,
      northFacing: '',
      northSize: null,
      units: '',
      propertyUnits: '',
      amenities: [],
      totalPropertyUnits: '',
      southFacing: '',
      southSize: null,
      eastFacing: '',
      eastSize: null,
      westFacing: '',
      westSize: null,
      propertySize: null,
      floor: '',
      noOfYears: null,
      // ownership: '',
      rent: null,
      rentUnits: '',
      costOfProperty: null,
      addressOfProperty: '',
      description: '',
      resources: [],
      videoResources: [],
      action: '',
      actionType: '',
      ageOfPropertyAction: '',
      paymentAction: '',
      planCost: null,
      uid: '',
      createdAt: '',
      createdBy: '',
      sortDate: '',
      sortDate2: '',
      displayDate: '',
      sortTime: '',
      status: 'pending',
    };
  }

  // goRoot() {
  //   this.navM.popToRoot();
  // }
}

export interface ILocation {
  location: string;
  country: string;
  state: string;
  district: string;
  city: string;
  pincode: string;
  locationSystemType: string;
  locationType: string;
  geoPoint: any;
}

export interface IOrder {
  amount: number;
  currency: string;
  receipt: string;
  id: string;
}

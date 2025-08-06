import {  NgIf, NgFor } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import firebase from 'firebase/compat/app';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { UcWidgetComponent, UcWidgetModule } from 'ngx-uploadcare-widget';
import { IRequest } from 'src/app/models/request.model';
import { ToastService } from 'src/app/services/toast.service';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import { IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonLabel, IonSegment, IonSegmentButton, IonSelectOption, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-editproperty',
  templateUrl: './editproperty.component.html',
  styleUrls: ['./editproperty.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonSegment,IonSegmentButton,IonLabel,IonContent,IonInput,FormsModule,NgIf,IonSelectOption,IonButton,NgFor,IonBadge,UcWidgetModule,IonImg,],
  providers:[
    ModalController
  ],
})
export class EditpropertyComponent  implements OnInit {

  @Input() hit: any;
  @ViewChild('uc')
  ucare!: UcWidgetComponent;
  @ViewChild('places')
  places!: ElementRef<HTMLInputElement>;
  action = 'sale';
  actionType = 'Residential';
  ageOfPropertyAction = 'underconstruction';
  paymentAction = 'singlePlan';
  pincode!: string | any;
  selectedLocation: any;
  point: any = new firebase.firestore.GeoPoint(32.5522, 34.556656);
  locationSystemType: any;
  locationType: any;
  lat!: number;// =37.0902;
  lng!: number;//=95.7129  ;
  location: any ;
  source: any = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [0, 0]
          }
        }
      ]
    }
  };
  user: any;
  plus_code: any;
  area: any;
  city :string | any;
  district :string | any;
  state :string | any;
  country :string | any;
  locations: ILocation[] = [];
  loading = false;

  paymentProcessing = false;
  request!: IRequest;
  price: any;

  constructor(private modalController: ModalController,
      private toast: ToastService, /*private afs: AngularFirestore, private nav: NavController,
      private auth: AuthService*/
         ) { }

  ngOnInit(): void {
    // this.auth.user$.subscribe(user => {
    //   this.user = user;
    // });
    // this.intializeRequests();

    this.request = ({
      title: this.hit.title,
      houseType: this.hit.houseType,
      bhkType: this.hit.bhkType,
      toilets: this.request.toilets|| 0,
      poojaRoom: this.request.poojaRoom|| 0,
      livingDining: this.request.livingDining|| 0,
      kitchen: this.request.kitchen|| 0,
      propertySizeBuildUp: this.hit.propertySizeBuildUp,
      northFacing: this.hit.northFacing,
      northSize: this.hit.northSize,
      units: this.hit.units,
      propertyUnits: this.hit.propertyUnits,
      totalPropertyUnits: this.hit.totalPropertyUnits,
      southFacing: this.hit.southFacing,
      amenities: this.request.amenities || [],
      southSize: this.hit.southSize,
      eastFacing: this.hit.eastFacing,
      eastSize: this.hit.eastSize,
      westFacing: this.hit.westFacing,
      westSize: this.hit.westSize,
      propertySize: this.hit.propertySize,

      floor: this.hit.floor,
      noOfYears: this.hit.noOfYears,
      // ownership: this.hit.ownership,
      rent: this.hit.rent,
      rentUnits: this.hit.rentUnits,
      costOfProperty: this.hit.costOfProperty,
      addressOfProperty: this.location,
      description: this.hit.description,
      resources: this.hit.resources,
      videoResources: this.hit.videoResources,
      action: this.hit.action,
      actionType: this.hit.actionType,
      ageOfPropertyAction: this.hit.ageOfPropertyAction,
      paymentAction: this.hit.paymentAction,
      uid: this.hit.uid,
      planCost: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: this.hit.uid,
      status: this.hit.status,
      displayDate: this.hit.displayDate,
      sortTime: this.hit.sortTime,
      sortDate: this.hit.sortDate,
      sortDate2: this.hit.sortDate2,
  });
  }

  dismiss() {
      this.modalController.dismiss();
  }

  segmentChanged(val: any): void {
      this.action = val.detail.value;
  }

  subSegmentChanged(val:any): void {
      this.actionType = val.detail.value;
  }

  ageOfPropertyChanged(val: any): void {
      this.ageOfPropertyAction = val.detail.value;
  }


  async amenitiesList() {
    const modal = await this.modalController.create({
        component: AmenitiesComponent,
        initialBreakpoint: 0.85,
        breakpoints: [0.75]
    });
    return await modal.present();
  }


  paymentChanged(val: { detail: { value: string; }; }): void {
      this.paymentAction = val.detail.value;
  }

  public handleAddressChange(address: Address): void {
      // Do some stuff

      this.pincode = null;

     this.lat = address.geometry.location.lat();
     this.lng = address.geometry.location.lng();

     this.source.data.features[0].geometry.coordinates = [this.lng, this.lat];

          this.location = {locationName: address.address_components[0].short_name,
            address: address.formatted_address + ' - ' + this.pincode,
            lat: this.lat, lng: this.lng};


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
        country: this.country ,
        state: this.state ,
        district: this.district,
        city: this.city,
        pincode: this.pincode,
        locationSystemType: this.locationSystemType,
        locationType: this.locationType,
        geoPoint: this.point
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

          addressComponents.forEach((addressComponent: { types: any[]; long_name: any; }) => {


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

          });

          this.location = {locationName: address.address_components[0].short_name,
            address: address.formatted_address + (this.pincode ? (' - ' + this.pincode) : ''),
            lat: this.lat, lng: this.lng};

          // "plus_code"
          // "political"
          // "locality"
          // "administrative_area_level_2"
          // "administrative_area_level_1"
          // "country"
          // "postal_code"

    }


  onComplete(event: { count: number; cdnUrl: string; }): void {
      this.ucare.reset();
      this.ucare.clearUploads();

      if(event.count) {
        for(let i = 0; i < event.count; i++) {
            this.request.resources.push({
            resourceName: '',
            resourceUrl: event.cdnUrl + '/nth/' +i+ '/',
            resourceType: 'image'}
            );
          }
      } else {
        this.request.resources.push({
          resourceName: '',
          resourceUrl: event.cdnUrl,
          resourceType: 'image'}
          );
      }

          if(2 - this.request.resources.length === 1) {
            this.ucare.multiple = false;
          }
  }

  removeImage(index: number) {
      this.request.resources.splice(index, 1);
      if(this.request.resources.length === 0) {
        this.ucare.multiple = true;
      } else if(2 - this.request.resources.length === 1) {
        this.ucare.multiple = false;
      }
  }

  submit() {
    if (this.paymentProcessing) {
      return;
    }

    this.request = ({
      title: this.request.title,
      houseType: this.request.houseType,
      bhkType: this.request.bhkType,
      toilets: this.request.toilets|| 0,
      poojaRoom: this.request.poojaRoom|| 0,
      livingDining: this.request.livingDining|| 0,
      kitchen: this.request.kitchen|| 0,
      propertySizeBuildUp: this.request.propertySizeBuildUp,
      northFacing: this.request.northFacing,
      northSize: this.request.northSize,
      units: this.request.units,
      amenities: this.request.amenities || [],
      propertyUnits: this.request.propertyUnits,
      totalPropertyUnits: this.request.totalPropertyUnits,
      southFacing: this.request.southFacing,
      southSize: this.request.southSize,
      eastFacing: this.request.eastFacing,
      eastSize: this.request.eastSize,
      westFacing: this.request.westFacing,
      westSize: this.request.westSize,
      propertySize: this.request.propertySize,

      floor: this.request.floor,
      noOfYears: this.request.noOfYears,
      // ownership: this.request.ownership,
      rent: this.request.rent,
      rentUnits: this.request.rentUnits,
      costOfProperty: this.request.costOfProperty,
      addressOfProperty: this.location,
      description: this.request.description,
      resources: this.request.resources,
      videoResources: this.request.videoResources,
      action: this.action,
      actionType: this.actionType,
      ageOfPropertyAction: this.ageOfPropertyAction,
      paymentAction: this.paymentAction,
      uid: this.user.uid,
      planCost: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: this.user.uid,
      status: 'active',
      displayDate: new Date().toDateString(),
      sortTime: null,
      sortDate: +new Date(),
      sortDate2: new Date(),
  });

  }


  intializeRequests() {
      this.request = {
        title: '',
          houseType: '',
          bhkType: '',
          toilets: 0,
          poojaRoom: 0,
          livingDining: 0,
          kitchen: 0,
          propertySizeBuildUp: 0,
          northFacing: '',
          northSize: 0,
          units: '',
          propertyUnits: '',
          totalPropertyUnits: '',
          southFacing: '',
          southSize: 0,
          amenities: [],
          eastFacing: '',
          eastSize: 0,
          westFacing: '',
          westSize: 0,
          propertySize: 0,
          floor: '',
          noOfYears: 0,
          // ownership: '',
          rent: 0,
          rentUnits: '',
          costOfProperty: 0,
          addressOfProperty: '',
          description: '',
          resources:[],
          videoResources: [],
          action: '',
          actionType: '',
          ageOfPropertyAction: '',
          paymentAction: '',
          planCost:0,
          uid: '',
          createdAt: '',
          createdBy: '',
          sortDate: '',
          sortDate2 : '',
          displayDate: '',
          sortTime: '',
          status: 'active'
      };
  }

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
  
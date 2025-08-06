import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { SpecviewComponent } from "../../../more/components/specview/specview.component";
import { addIcons } from 'ionicons';
import { informationCircle, trashOutline, add, caretDownOutline, caretUpOutline } from 'ionicons/icons';
import { IonBadge, IonButton, IonIcon, IonImg, IonInput, IonLabel, IonSelectOption, IonTextarea, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-venture-step1',
  templateUrl: './venture-step1.component.html',
  styleUrls: ['./venture-step1.component.scss'],
  standalone: true,
  imports: [IonInput,IonIcon,IonTextarea,NgIf,IonBadge,FormsModule,UcWidgetModule,IonLabel,NgFor,IonButton,IonSelectOption,SpecviewComponent,IonImg,],
  providers:[ModalController],
})
export class VentureStep1Component implements OnInit {

  constructor() {
    addIcons({ informationCircle, trashOutline, add, caretDownOutline, caretUpOutline })
  }

  ngOnInit() {
    return
   }

  ventures: any = {
    ventureName: "",
    description: "",
    ventureWebsite: "",
    logo: "",
    ventureImages: [
      "", "", ""
    ],
    amenities: ["", "", ""],
    directors: "",
    companyName: "",
    companyWebsite: "",
    facebookLink: "",
    instagramLink: "",
    twitterLink: "",
    brochure: "",
    landArea: "",
    landAreaUnits: "",
    propertySizeBuildUp: "",
    openArea: "",
    towerAPT: "",
    houseVilla: "",
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
  area: string = "";
  city: string = "";
  district: string = "";
  state: string = "";
  pincode: string = "";

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

  amenitiesList() {
    throw new Error('Method not implemented.');
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

  openSpecifications() {
    throw new Error('Method not implemented.');
  }

  user: any;

  ventureData() {
    throw new Error('Method not implemented.');
  }

  towerAPT: any;

  towerAPTCheck() {
    throw new Error('Method not implemented.');
  }

  ventureEdit: any;

  towerAPRValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  houseVilla: any;

  houseVillaCheck() {
    throw new Error('Method not implemented.');
  }

  simplexValid($event: Event) {
    throw new Error('Method not implemented.');
  }

  towerAPTError: any;
  houseVillaError: any;


}

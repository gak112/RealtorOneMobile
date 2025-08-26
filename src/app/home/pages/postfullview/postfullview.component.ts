
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { callOutline, chevronBackOutline } from 'ionicons/icons';
import { Observable } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { register } from 'swiper/element';
import { IonContent, IonFooter, IonHeader, IonIcon, IonLabel, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

register();

@Component({
  selector: 'app-postfullview',
  templateUrl: './postfullview.component.html',
  styleUrls: ['./postfullview.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,IonLabel,IonFooter],
  providers:[ModalController],
 
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PostfullviewComponent implements OnInit {

  @Input() property: any;
  @Input() user: any;
  @Input() venture: any;

  dummyproperty: any = {
    actionType: "commercial",
    bhkType: "3bhk",
    resources: [{
      resourceUrl: "https://ucarecdn.com/c58b2143-187e-4d28-81a1-22371e91e075~1//nth/0/"
    }, {
      resourceUrl: "https://ucarecdn.com/10a5a223-f6a0-4499-91e9-aec139b5254d/"
    }, {
      resourceUrl: "https://ucarecdn.com/c58b2143-187e-4d28-81a1-22371e91e075~1//nth/0/"
    }],
    action: "sale",
    costOfProperty: 20202020,
    title: "Sai Envlave 2 bed room flat",
    houseType: "Apartment",
    toilets: "2",
    poojaRoom: "1",
    livingDining: "1",
    kitchen: "1",
    PlotArea: 1500,
    propertyUnits: "Sq Yard",
    northFacing: "500",
    northSize: "0",
    southFacing: "100",
    southSize: "10",
    units: "Yard",
    eastFacing: "100",
    eastSize: "0",
    westFacing: "100",
    westSize: "0",
    floor: "2nd Floor",
    ageOfPropertyAction: "noofyears",
    noOfYears: "5",
    amenities: {},
    ownership: "Bhavani Sankar",
    rent: "20000",
    rentUnits: "$",
    description: "lorem ipsum",
    addressOfProperty: {
      address: "8R44+8FR, Kamapalli, Brahmapur, Odisha 760004, India - 760004"
    }
  };
  dummyuser: any = {
    fullName: "Bhavani Sankar",
    phone: "9398068299"
  };


  safeURL!: SafeResourceUrl;
  action = 'rent';
  media = 'video';
  loading = false;
  users$!: Observable<any>;
  constructor(private modalController: ModalController, /*private afs: AngularFirestore,*/private toast: ToastService,
    private router: Router, private sanitizer: DomSanitizer,) {
    addIcons({ callOutline, chevronBackOutline })
  }

  ngOnInit(): void {
    // this.users$ = this.afs.doc(`users/${this.property.uid}`).valueChanges({idField: 'id'});
    this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl(this.venture?.brochure);
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

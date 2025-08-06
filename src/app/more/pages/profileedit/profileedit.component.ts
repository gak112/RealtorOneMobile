import { Component, ElementRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonSpinner, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { IProfile } from 'src/app/languages/interface/profile/profile.interface';
import { LanguageService } from 'src/app/services/language.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-profileedit',
  templateUrl: './profileedit.component.html',
  styleUrls: ['./profileedit.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,ReactiveFormsModule,IonBadge,IonButton,IonSpinner],
  providers:[ModalController],
})
export class ProfileeditComponent  implements OnInit {

  @ViewChild('places')
  places!: ElementRef<HTMLInputElement>;
  @Input() user!:any;
    loading = false;
    profileEditForm: FormGroup;

    profileData!: IProfile;
    language: any;

    validations = {

      fullName: [{ type: 'required', message: 'Full Name is required.' }],
      email: [{ type: 'required', message: 'Email is required.' }],
      phone: [
           { type: 'required', message: 'Number is required.' },
         ],
        //  address: [
        //   { type: 'required', message: 'Address is required.' },
        // ],
        location: [
          { type: 'required', message: 'Location is required.' },
        ],
        description: [
          { type: 'required', message: 'Location is required.' },
        ],

      };
    constructor(private fb: FormBuilder,
      public zone: NgZone, 
      // private afs: AngularFirestore,
      private toast: ToastService, private modalController: ModalController,
       private languageService: LanguageService,) {
        this.profileEditForm = this.fb.group ({
          fullName: ['', [Validators.required]],
          email: [''],
          // address: [''],
          location: [''],
          description: [''],
        });

     }

    ngOnInit(): void {
      // this.languageService.language.subscribe(language => {
      //   this.profileData = new ProfileData().getData(language);
      //   this.language = language;
      // });



     this.profileEditForm.controls['fullName'].setValue(this.user.fullName);
     this.profileEditForm.controls['email'].setValue(this.user.email || null);
     this.profileEditForm.controls['address'].setValue(this.user.address || null);
     this.profileEditForm.controls['location'].setValue(this.user.location || null);
     this.profileEditForm.controls['description'].setValue(this.user.description || null);

     }



    // get f(): any {
    //   return this.profileEditForm.controls;
    // }

    submit(event: any) {


      if(this.loading) {
        return;
      }

      this.loading = true;
      this.user.location = this.user.location +','+  this.user.city +','+
      this.user.district+','+   this.user.state+','+
      this.user.lCountry;

      this.user.fullName = this.profileEditForm.controls['fullName'].value ;
      this.user.email = this.profileEditForm.controls['email'].value || null;
      // this.user.location = this.profileEditForm.controls.location.value || null;
      this.user.description = this.profileEditForm.controls['description'].value || null;

    }

    dismiss() {
      this.modalController.dismiss();
     }







    handleAddressChange(address: any) {
   

      address.address_components.forEach((a: { types: any[]; long_name: any; }) => {

        switch(a.types[0]) {

          case 'sublocality_level_1':
             this.user.location = a.long_name;
             break;

          case 'locality':
            this.user.city = a.long_name;
            break;
          case 'administrative_area_level_2':
            this.user.district = a.long_name;
            break;
          case 'administrative_area_level_1':
            this.user.state = a.long_name;
            break;
          case 'country':
            this.user.lCountry = a.long_name;
            break;
          case 'postal_code':
            this.user.pincode =  a.long_name;
            break;
        }


      });

      // this.userAddress = address.formatted_address
      // this.userLatitude = address.geometry.location.lat()
      // this.userLongitude = address.geometry.location.lng()
    }

}

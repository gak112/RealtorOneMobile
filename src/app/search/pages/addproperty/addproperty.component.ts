import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule, ModalController } from '@ionic/angular';
import { IVentures } from 'src/app/models/ventures.modal';
import { FlatnumbersComponent } from 'src/app/more/pages/flatnumbers/flatnumbers.component';
import { ToastService } from 'src/app/services/toast.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonLabel, IonTitle, IonToolbar,  } from '@ionic/angular/standalone';
import { PropertyviewsComponent } from 'src/app/more/pages/propertyviews/propertyviews.component';

@Component({
  selector: 'app-addproperty',
  templateUrl: './addproperty.component.html',
  styleUrls: ['./addproperty.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonButton,IonContent,IonLabel,NgIf,NgFor,IonInput,],
  providers:[ModalController],
})
export class AddpropertyComponent implements OnInit {

  @Input() venture;
  ventures: IVentures;
  constructor(private modalController: ModalController,
    private afs: AngularFirestore, private toast: ToastService) { }

  ngOnInit() {
    this.intializeVentures();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openProperty() {
    const modal = await this.modalController.create({
      component: PropertyviewsComponent,
      componentProps: { venture: this.venture },
      initialBreakpoint: 0.5,
      breakpoints: [1]
    });
    return await modal.present();
  }

  async openFlatNumbers() {
    const modal = await this.modalController.create({
      component: FlatnumbersComponent,
    });
    return await modal.present();
  }


  deleteIt(property) {
    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'You will not be able to recover this!',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, delete it!',
    //   cancelButtonText: 'No, keep it',
    // }).then((result) => {
    //   if (result.value) {
    //     this.delete(property);
    //   } else if (result.dismiss === Swal.DismissReason.cancel) {
    //     Swal.fire('Cancelled', 'Your Event is safe :)', 'error');
    //   }
    // });
  }

  delete(i) {
    this.venture.propertyTypes = this.venture.propertyTypes.filter((v, ix) => ix !== i);

    this.ventures = ({
      ventureName: this.venture.ventureName,
      description: this.venture.description,
      location: this.venture.location,
      ventureWebsite: this.venture.ventureWebsite,
      logo: this.venture.logo,
      amenities: this.venture.amenities || [],
      ventureImages: this.venture.ventureImages || [],
      surveyNos: this.venture.surveyNos,
      directors: this.venture.directors,
      companyName: this.venture.companyName,
      companyWebsite: this.venture.companyWebsite,
      facebookLink: this.venture.facebookLink,
      instagramLink: this.venture.instagramLink,
      twitterLink: this.venture.twitterLink,
      brochure: this.venture.brochure,
      approvals: this.venture.approvals,
      // propertyTypes: this.venture.propertyTypes,
      specifications: this.venture.specifications || '',
      towerAPT: this.ventures.towerAPT,
      villaName: this.ventures.villaName,
      houseVilla: this.ventures.houseVilla,
      villaResources: this.ventures.villaResources || [],
      landArea: this.ventures.landArea,
      landAreaUnits: this.ventures.landAreaUnits,
      propertySizeBuildUp: this.ventures.propertySizeBuildUp,
      propertyUnits: this.ventures.propertyUnits,
      openArea: this.ventures.openArea,
      uid: this.venture.uid,
      createdAt: this.venture.createdAt,
      createdBy: this.venture.uid,
    });

    const batch = this.afs.firestore.batch();

    const venturesRef = this.afs.firestore.collection(`ventures`).doc(this.venture.id);
    batch.update(venturesRef, Object.assign(this.ventures));

    // const userDashboardRef = this.afs.firestore.collection(`dashboard`).doc('1');
    // batch.update(userDashboardRef, Object.assign({properties: firebase.firestore.FieldValue.increment(1)}));

    batch.commit().then(() => {
      this.toast.showMessage('Updated Successfully', 1000);
      this.intializeVentures();

      this.modalController.dismiss();

    }).catch(err => {
    });
  }
  intializeVentures() {
    this.ventures = {
      ventureName: '',
      description: '',
      location: '',
      ventureWebsite: '',
      logo: '',
      amenities: [],
      ventureImages: [],
      surveyNos: '',
      directors: '',
      companyName: '',
      companyWebsite: '',
      facebookLink: '',
      instagramLink: '',
      twitterLink: '',
      brochure: '',
      approvals: false,
      //propertyTypes:[],
      specifications: [],
      towerAPT: 0,
      villaName: '',
      houseVilla: 0,
      villaResources: [],
      landArea: '',
      landAreaUnits: '',
      propertySizeBuildUp: '',
      propertyUnits: '',
      openArea: 0,
      uid: '',
      createdAt: '',
      createdBy: '',
    };
  }
  async editProperty() {
    const modal = await this.modalController.create({
      component: PropertyviewsComponent,
      componentProps: { venture: this.venture }
    });
    return await modal.present();
  }

}

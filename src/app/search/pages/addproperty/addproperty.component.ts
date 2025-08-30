import { Component, OnInit, inject, input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { IVentures } from 'src/app/models/ventures.modal';
import { FlatnumbersComponent } from 'src/app/more/pages/flatnumbers/flatnumbers.component';
import { ToastService } from 'src/app/services/toast.service';

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { PropertyviewsComponent } from 'src/app/more/pages/propertyviews/propertyviews.component';

@Component({
  selector: 'app-addproperty',
  templateUrl: './addproperty.component.html',
  styleUrls: ['./addproperty.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonButton,
    IonContent,
    IonLabel,
    IonInput,
  ],
  providers: [ModalController],
})
export class AddpropertyComponent implements OnInit {
  private modalController = inject(ModalController);
  private afs = inject(AngularFirestore);
  private toast = inject(ToastService);

  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  readonly venture = input(undefined);
  ventures: IVentures;

  ngOnInit() {
    this.intializeVentures();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async openProperty() {
    const modal = await this.modalController.create({
      component: PropertyviewsComponent,
      componentProps: { venture: this.venture() },
      initialBreakpoint: 0.5,
      breakpoints: [1],
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
    venture.propertyTypes = venture.propertyTypes.filter(
      (v, ix) => ix !== i
    );

    this.ventures = {
      ventureName: venture.ventureName,
      description: venture.description,
      location: venture.location,
      ventureWebsite: venture.ventureWebsite,
      logo: venture.logo,
      amenities: venture.amenities || [],
      ventureImages: venture.ventureImages || [],
      surveyNos: venture.surveyNos,
      directors: venture.directors,
      companyName: venture.companyName,
      companyWebsite: venture.companyWebsite,
      facebookLink: venture.facebookLink,
      instagramLink: venture.instagramLink,
      twitterLink: venture.twitterLink,
      brochure: venture.brochure,
      approvals: venture.approvals,
      // propertyTypes: this.venture.propertyTypes,
      specifications: venture.specifications || '',
      towerAPT: this.ventures.towerAPT,
      villaName: this.ventures.villaName,
      houseVilla: this.ventures.houseVilla,
      villaResources: this.ventures.villaResources || [],
      landArea: this.ventures.landArea,
      landAreaUnits: this.ventures.landAreaUnits,
      propertySizeBuildUp: this.ventures.propertySizeBuildUp,
      propertyUnits: this.ventures.propertyUnits,
      openArea: this.ventures.openArea,
      uid: venture.uid,
      createdAt: venture.createdAt,
      createdBy: venture.uid,
    };

    const batch = this.afs.firestore.batch();

    const venturesRef = this.afs.firestore
      .collection(`ventures`)
      .doc(venture.id);
    batch.update(venturesRef, Object.assign(this.ventures));

    // const userDashboardRef = this.afs.firestore.collection(`dashboard`).doc('1');
    // batch.update(userDashboardRef, Object.assign({properties: firebase.firestore.FieldValue.increment(1)}));

    batch
      .commit()
      .then(() => {
        this.toast.showMessage('Updated Successfully', 1000);
        this.intializeVentures();

        this.modalController.dismiss();
      })
      .catch((err) => {});
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
      componentProps: { venture: this.venture() },
    });
    return await modal.present();
  }
}

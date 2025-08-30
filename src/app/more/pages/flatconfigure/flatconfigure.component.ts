import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
  input,
  output,
  viewChild
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { UcWidgetComponent, UcWidgetModule } from 'ngx-uploadcare-widget';
import {
  IVentureHouses,
  IVentureTowerFlats,
} from 'src/app/models/ventures.modal';
import { AmenitiesComponent } from 'src/app/more/components/amenities/amenities.component';
import { ToastService } from 'src/app/services/toast.service';
import { register } from 'swiper/element';
register();

@Component({
  selector: 'app-flatconfigure',
  templateUrl: './flatconfigure.component.html',
  styleUrls: ['./flatconfigure.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonButton,
    IonContent,
    IonSelect,
    FormsModule,
    IonSelectOption,
    IonLabel,
    UcWidgetModule,
    IonImg,
  ],
  providers: [ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FlatconfigureComponent implements OnInit {
  private modalController = inject(ModalController);
  private afs = inject(AngularFirestore);
  private toast = inject(ToastService);

  readonly ucare = viewChild.required<UcWidgetComponent>('uc');
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  readonly flat = input<any>(undefined);
  readonly user = input<any>(undefined);
  readonly type = input.required<string>();
  readonly copiedData = input<any>(undefined);
  readonly pasteAll = input<any>(undefined);
  action = 'display';
  loading = false;

  readonly copied = output();

  ngOnInit() {
    const flat = this.flat();
    console.log(flat.costOfProperty, flat.costOfProperty);
    if (!flat.configured) {
      this.action = 'dataEntry';
    } else {
      this.action = 'display';
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  submit() {
    if (this.loading === true) {
      return;
    }

    this.loading = true;

    let towerFlat: IVentureTowerFlats = {
      ventureId: this.flat().ventureId,
      towerId: this.flat().towerId,
      floorId: this.flat().floorId,
      flatName: this.flat().flatName,
      flatNumber: this.flat().flatNumber,
      bhkType: this.flat().bhkType,
      resources: this.flat().resources || [],
      layout: this.flat().layout || [],
      videos: [],
      toilets: this.flat().toilets,
      poojaRoom: this.flat().poojaRoom,
      livingDining: this.flat().livingDining,
      kitchen: this.flat().kitchen,
      northFacing: this.flat().northFacing,
      northSize: this.flat().northSize,
      units: this.flat().units,
      southFacing: this.flat().southFacing,
      southSize: this.flat().southSize,
      eastFacing: this.flat().eastFacing,
      eastSize: this.flat().eastSize,
      westFacing: this.flat().westFacing,
      westSize: this.flat().westSize,
      carpetArea: this.flat().carpetArea,
      balconyArea: this.flat().balconyArea,
      commonArea: this.flat().commonArea,
      saleableArea: this.flat().saleableArea,
      amenities: this.flat().amenities || [],
      costOfProperty: this.flat().costOfProperty,
      createdAt: this.flat().createdAt,
      createdBy: this.flat().createdBy,
      sortDate: this.flat().sortDate,
      sortDate2: this.flat().sortDate2,
      displayDate: this.flat().displayDate,
      sortTime: null,
      configured: true,
    };

    let towerVilla: IVentureHouses = {
      ventureId: this.flat().ventureId,
      houseName: this.flat().houseName,
      houseNumber: this.flat().houseNumber,
      bhkType: this.flat().bhkType,
      floors: this.flat().floors,
      lifts: this.flat().lifts,
      type: this.flat().type, // simplex, duplex, triplex or anything..
      resources: this.flat().resources || [],
      layout: this.flat().layout || [],
      videos: [],
      toilets: this.flat().toilets,
      poojaRoom: this.flat().poojaRoom,
      livingDining: this.flat().livingDining,
      kitchen: this.flat().kitchen,
      northFacing: this.flat().northFacing,
      northSize: this.flat().northSize,
      units: this.flat().units,
      southFacing: this.flat().southFacing,
      southSize: this.flat().southSize,
      eastFacing: this.flat().eastFacing,
      eastSize: this.flat().eastSize,
      westFacing: this.flat().westFacing,
      westSize: this.flat().westSize,
      carpetArea: this.flat().carpetArea,
      balconyArea: this.flat().balconyArea,
      commonArea: this.flat().commonArea,
      saleableArea: this.flat().saleableArea,
      amenities: this.flat().amenities || [],
      costOfProperty: this.flat().costOfProperty,
      createdAt: this.flat().createdAt,
      createdBy: this.flat().createdBy,
      sortDate: this.flat().sortDate,
      sortDate2: this.flat().sortDate2,
      displayDate: this.flat().displayDate,
      sortTime: null,
      configured: true,
    };
    const batch = this.afs.firestore.batch();
    const type = this.type();
    console.log(type);
    if (type === 'floor') {
      const ventureTowersRef = this.afs.firestore
        .collection(
          `ventureTowers/${this.flat().towerId}/floors/${this.flat().floorId}/flats`
        )
        .doc(this.flat().id);
      batch.update(ventureTowersRef, Object.assign(towerFlat));
    } else if (type === 'flat') {
      const ventureTowersRef = this.afs.firestore
        .collection(`ventureVillas`)
        .doc(this.flat().id);
      batch.update(ventureTowersRef, Object.assign(towerVilla));
    }

    batch
      .commit()
      .then(() => {
        // this.action = 2;
        this.action = 'display';
        this.toast.showMessage('Updated Successfully');
        this.loading = false;
        this.modalController.dismiss();
      })
      .catch((err: any) => {
        this.loading = false;
      });
  }

  async amenitiesList() {
    const modal = await this.modalController.create({
      component: AmenitiesComponent,
      componentProps: { selectedAmenities: this.flat().amenities },
      initialBreakpoint: 1,
      breakpoints: [1],
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      data.forEach((amenity: any) => {
        this.flat().amenities.push(amenity.amenity);
      });
    }
  }

  async copyConfiguration() {
    this.copied.emit(this.flat());
    console.log(this.copied);
  }

  onFlatLayoutComplete(event: { count: number; cdnUrl: string }) {
    if (event.count) {
      for (let i = 0; i < event.count; i++) {
        this.flat().layout.push(event.cdnUrl + '/nth/' + i + '/');
      }
    } else {
      this.flat().layout.push(event.cdnUrl);
    }

    const ucare = this.ucare();
    if (2 - this.flat().layout.length === 1) {
      ucare.multiple = false;
    }
    ucare.reset(true);
    ucare.clearUploads();
  }

  onFlatImagesComplete(event: { count: number; cdnUrl: string }) {
    if (event.count) {
      for (let i = 0; i < event.count; i++) {
        this.flat().resources.push(event.cdnUrl + '/nth/' + i + '/');
      }
    } else {
      this.flat().resources.push(event.cdnUrl);
    }

    const ucare = this.ucare();
    if (2 - this.flat().resources.length === 1) {
      ucare.multiple = false;
    }
    ucare.reset(true);
    ucare.clearUploads();
  }
}

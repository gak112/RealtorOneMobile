import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
  inject,
  input,
  viewChild
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { UcWidgetComponent, UcWidgetModule } from 'ngx-uploadcare-widget';
import { ToastService } from 'src/app/services/toast.service';
import { register } from 'swiper/element';
register();
@Component({
  selector: 'app-floorconfigure',
  templateUrl: './floorconfigure.component.html',
  styleUrls: ['./floorconfigure.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    IonInput,
    FormsModule,
    UcWidgetModule,
    IonLabel,
    IonImg,
    IonFooter,
    IonButton,
  ],
  providers: [ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FloorconfigureComponent implements OnInit {
  private modalController = inject(ModalController);
  private afs = inject(AngularFirestore);
  private toast = inject(ToastService);

  readonly ucare = viewChild.required<UcWidgetComponent>('uc');
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  readonly floor = input<any>(undefined);
  readonly user = input<any>(undefined);

  ventureTowerFloors: any;
  loading = false;

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }

  submit() {
    if (this.loading === true) {
      return;
    }

    this.loading = true;

    const towerObj = {
      ventureId: this.floor().ventureId,
      towerId: this.floor().towerId,
      floorName: this.floor().floorName,
      floorNumber: this.floor().floorNumber,
      flats: this.floor().flats,
      resources: this.floor().resources || [],
      layout: this.floor().layout || [],
      videos: [],
      carpetArea: this.floor().carpetArea,
      balconyArea: this.floor().balconyArea,
      commonArea: this.floor().commonArea,
      saleableArea: this.floor().saleableArea,
      createdAt: this.floor().createdAt,
      createdBy: this.floor().createdBy,
      sortDate: this.floor().sortDate,
      sortDate2: this.floor().sortDate2,
      displayDate: this.floor().displayDate,
      sortTime: null,
      configured: true,
    };
    const batch = this.afs.firestore.batch();

    const ventureTowersRef = this.afs.firestore
      .collection(`ventureTowers/${this.floor().towerId}/floors`)
      .doc(this.floor().id);
    batch.update(ventureTowersRef, Object.assign(towerObj));

    batch
      .commit()
      .then(() => {
        // this.action = 2;
        this.toast.showMessage('Updated Successfully');
        this.loading = false;
        this.modalController.dismiss();
      })
      .catch((err: any) => {
        this.loading = false;
      });
  }

  onFloorLayoutComplete(event: { count: number; cdnUrl: string }) {
    if (event.count) {
      for (let i = 0; i < event.count; i++) {
        this.floor().layout.push(event.cdnUrl + '/nth/' + i + '/');
      }
    } else {
      this.floor().layout.push(event.cdnUrl);
    }

    const ucare = this.ucare();
    if (2 - this.floor().layout.length === 1) {
      ucare.multiple = false;
    }
    ucare.reset(true);
    ucare.clearUploads();
  }

  onFloorImagesComplete(event: { count: number; cdnUrl: string }) {
    if (event.count) {
      for (let i = 0; i < event.count; i++) {
        this.floor().resources.push(event.cdnUrl + '/nth/' + i + '/');
      }
    } else {
      this.floor().resources.push(event.cdnUrl);
    }

    const ucare = this.ucare();
    if (2 - this.floor().resources.length === 1) {
      ucare.multiple = false;
    }
    ucare.reset(true);
    ucare.clearUploads();
  }
}

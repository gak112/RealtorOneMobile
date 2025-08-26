
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonImg, IonInput, IonLabel, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create, eye, copy, clipboard } from 'ionicons/icons';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { register } from 'swiper/element';
register();

@Component({
  selector: 'app-venture-housevilla',
  templateUrl: './venture-housevilla.component.html',
  styleUrls: ['./venture-housevilla.component.scss'],
  standalone: true,
  imports: [IonImg,IonButton,IonInput,FormsModule,IonLabel,IonIcon,UcWidgetModule],
  providers:[ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VentureHousevillaComponent implements OnInit {

  constructor() {
    addIcons({ trash, create, eye, copy, clipboard, })
  }

  ngOnInit() {
    return
   }

  img: any;

  deleteImg(_t19: number) {
    throw new Error('Method not implemented.');
  }
  ventures: any = {
    villaResources: [],
    villaName: "",
    houseVilla: "",
  };

  ucare: any;

  onUploadComplete($event: Event) {
    throw new Error('Method not implemented.');
  }

  towerEntry: any;

  submit() {
    throw new Error('Method not implemented.');
  }

  loading: any;

  openTowerConfigure() {
    throw new Error('Method not implemented.');
  }
}

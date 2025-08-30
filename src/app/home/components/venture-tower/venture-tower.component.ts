
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonImg, IonInput, IonLabel, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create, eye, copy, clipboardOutline } from 'ionicons/icons';
import { UcWidgetModule } from 'ngx-uploadcare-widget';
import { register } from 'swiper/element';
register();

@Component({
  selector: 'app-venture-tower',
  templateUrl: './venture-tower.component.html',
  styleUrls: ['./venture-tower.component.scss'],
  standalone: true,
  imports: [IonImg, IonIcon, IonButton, UcWidgetModule, IonInput, FormsModule, IonLabel],
  providers:[ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VentureTowerComponent implements OnInit {


  constructor() {
    addIcons({ trash, create, eye, copy, clipboardOutline })
  }

  ngOnInit() {
    return
   }

  towerGallery: any;

  deleteImg(_t19: number) {
    throw new Error('Method not implemented.');
  }

  ucare: any;

  onUploadComplete($event: any) {
    throw new Error('Method not implemented.');
  }

  towerEntry: any;
  tower: any = {
    towerName:"",
    floors:"",
    flats:"",
    
  };

  submit() {
    throw new Error('Method not implemented.');
  }

  loading: any;

  copyConfiguration() {
    throw new Error('Method not implemented.');
  }

  displayPaste: any;

  pasteConfiguration() {
    throw new Error('Method not implemented.');
  }

  openTowerConfigure() {
    throw new Error('Method not implemented.');
  }


}

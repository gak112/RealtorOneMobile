/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonButton, IonIcon, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { FlatconfigureComponent } from '../../pages/flatconfigure/flatconfigure.component';
// import firebase from 'firebase/compat/app';
import { firstValueFrom } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { register } from 'swiper/element';
import { NgIf, NgFor } from '@angular/common';
import { serverTimestamp } from '@angular/fire/firestore';
register();

@Component({
  selector: 'app-towerflat-box',
  templateUrl: './towerflat-box.component.html',
  styleUrls: ['./towerflat-box.component.scss'],
  standalone:true,
  imports:[IonLabel,IonIcon,IonButton,NgIf,NgFor,IonImg,],
  providers:[ModalController],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class TowerflatBoxComponent  implements OnInit {
  @Input() villa : any;
  @Input() user : any;
  @Input() displayPaste = false;
  @Input() copiedData : any;
  @Input() pasteAll : any;



  @Output() copied = new EventEmitter();
  houses : any;

  
  constructor(private modalController: ModalController, private afs: AngularFirestore, private toast: ToastService) { }

  ngOnInit() {
    return
    // this.loadVillas();

  }


  ngOnChanges(changes: SimpleChanges): void {



     if(changes['pasteAll'] && changes['pasteAll'].currentValue) {
        this.reloadVilla();
     }

      if(changes['copiedData'] && changes['copiedData'].currentValue) {
        this.copiedData = changes['copiedData'].currentValue;

        if(this.copiedData.id === this.villa.id) {
          this.displayPaste = false;

         } else {
          this.displayPaste = true;
         }

      } else {
        this.displayPaste = false;
        this.copiedData = null;
      }
  }

  

  async openFloorConfigure(flat: any) {
    const modal = await this.modalController.create(
      {
        component: FlatconfigureComponent,
        componentProps:{flat, user: this.user, type: 'flat'}
      }      
    );

    await modal.present();
  }


  pasteConfiguration() {


    const updatedVilla = {
      amenities: this.copiedData.amenities,
      balconyArea: this.copiedData.balconyArea,
      bhkType: this.copiedData.bhkType,
      carpetArea: this.copiedData.carpetArea,
      commonArea: this.copiedData.commonArea,
      costOfProperty: this.copiedData.costOfProperty,
      ventureId: this.copiedData.ventureId,
      floors:  this.copiedData.floors,
      lifts:  this.copiedData.lifts,
      type:   this.copiedData.type,
      resources:  this.copiedData.resources,
      layout:  this.copiedData.layout,
      videos:  this.copiedData.videos,
      toilets:  this.copiedData.toilets,
      poojaRoom:  this.copiedData.poojaRoom,
      livingDining:  this.copiedData.livingDining,
      kitchen:  this.copiedData.kitchen,
      northFacing:  this.copiedData.northFacing,
      northSize:  this.copiedData.northSize,
      units:  this.copiedData.units,
      southFacing:  this.copiedData.southFacing,
      southSize:  this.copiedData.southSize,
      eastFacing:  this.copiedData.eastFacing,
      eastSize:  this.copiedData.eastSize,
      westFacing:  this.copiedData.westFacing,
      westSize:  this.copiedData.westSize,
      saleableArea:  this.copiedData.saleableArea,
      sortDate:   +new Date(),
      sortDate2 : new Date(),
      sortTime:  this.copiedData.sortTime,
      configured: true,
      createdAt: serverTimestamp(),
      createdBy: this.user.uid,
      displayDate: new Date().toDateString(),
    }

    this.afs.doc(`ventureVillas/${this.villa.id}`).update(updatedVilla).then(async () => {


       this.reloadVilla(); 

      //  const id = this.villa.id;
      //  this.villa = await firstValueFrom(this.afs.doc(`ventureVillas/${this.villa.id}`).valueChanges());
      //  this.villa.id = id;

      this.displayPaste = false;
      this.copiedData = null;
       this.toast.showMessage('Configuration Pasted Successfully');
    }).catch((err) => {

      this.toast.showError(err.message);

    });


  }

  async copyConfiguration() {

    this.copied.emit(this.villa);

  }

  async reloadVilla() {
    const id = this.villa.id;
    this.villa = await firstValueFrom(this.afs.doc(`ventureVillas/${this.villa.id}`).valueChanges());
    this.villa.id = id;
  }

}

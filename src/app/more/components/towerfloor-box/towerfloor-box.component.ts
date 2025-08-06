/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { FlatconfigureComponent } from '../../pages/flatconfigure/flatconfigure.component';
import { FloorconfigureComponent } from '../../pages/floorconfigure/floorconfigure.component';

import { CommonModule, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { IonButton, IonIcon, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-towerfloor-box',
  templateUrl: './towerfloor-box.component.html',
  styleUrls: ['./towerfloor-box.component.scss'],
  standalone:true,
  imports:[IonLabel,UpperCasePipe,IonIcon,NgIf,IonButton,NgIf,IonImg,NgFor],
  providers:[ModalController],
})
export class TowerfloorBoxComponent  implements OnInit {

  @Input() floor: any;
  @Input() user: any;  
  @Input() displayPaste = false;
  @Input() copiedData: any;
  @Input() copiedFltsData: any;
  @Input() pasteAll: any;

  flats: any = [];

  clipboard = false;

  @Output() copied = new EventEmitter();
  @Output() copiedFlatData = new EventEmitter();

  copiedFlat: any;

  configured = false;
  pasteAllFlats = false;

  constructor(private modalController: ModalController, private afs: AngularFirestore,
    private toast: ToastService) { }

  ngOnInit() {
    this.loadFlats();
  }

  ngOnChanges(changes: SimpleChanges): void {


    if(changes['pasteAll'] && changes['pasteAll'].currentValue) {
       this.reloadVilla();
       this.loadFlats();
    }

     if(changes['copiedData'] && changes['copiedData'].currentValue) {
       this.copiedData = changes['copiedData'].currentValue;

       if(this.copiedData.id === this.floor.id) {
         this.displayPaste = false;

        } else {
         this.displayPaste = true;
        }

     } else {
       this.displayPaste = false;
       this.copiedData = null;
     }
 }


  async loadFlats() {

    this.flats = await firstValueFrom(this.afs.collection(`ventureTowers/${this.floor.towerId}/floors/${this.floor.id}/flats`, ref => ref.orderBy('flatNumber')).valueChanges({idField:'id'}));

    // flats.docs.forEach(flat => {
    //   this.flats.push(flat.data());
    // });

  

   // this.configured = true;


  }

  async openFloorConfigure(floor: any) {
    const modal = await this.modalController.create(
      {
        component: FloorconfigureComponent,
        componentProps:{floor, user: this.user}
      }      
    );

    await modal.present();
  }

  async openFlatConfigure(flat: any) {
    const modal = await this.modalController.create(
      {
        component: FlatconfigureComponent,
        componentProps:{flat, user: this.user, type: 'floor'}
      }      
    );

    await modal.present();
  }

  async copyConfiguration() {

    this.copied.emit(this.floor);
    this.pasteAllFlats = true;
  }

  pasteConfiguration() {

   

     const updatedVilla = {


      ventureId: this.copiedData.ventureId,
      towerId: this.copiedData.towerId,
      flats: this.copiedData.flats,
      resources: this.copiedData.resources,
      layout: this.copiedData.layout,
      videos: this.copiedData.videos,
      carpetArea: this.copiedData.carpetArea,
      balconyArea: this.copiedData.balconyArea,
      commonArea: this.copiedData.commonArea,
      saleableArea: this.copiedData.saleableArea,
      sortDate:   +new Date(),
      sortDate2 : new Date(),
      sortTime:  this.copiedData.sortTime,
      configured: true,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: this.user.uid,
      displayDate: new Date().toDateString(),

    
    }
    this.afs.doc(`ventureTowers/${this.copiedData.towerId}/floors/${this.floor.id}`).update(updatedVilla).then(async () => {


       this.reloadVilla(); 

      this.displayPaste = false;
      this.copiedData = null;
       this.toast.showMessage('Configuration Pasted Successfully');
    }).catch((err) => {
      this.toast.showError(err.message);

    });


  }

  async pasteFlatsConfiguration(floor: { id: any; }) {

  

    const batch = await this.afs.firestore.batch();

    if(this.copiedFlat === undefined) {
      const notConfiguredData = await firstValueFrom(this.afs.collection(`ventureTowers/${this.floor.towerId}/floors/${this.floor.id}/flats`, 
      ref => ref.where('floorId', '==', floor.id)
      .where('configured', '==', false))
      .valueChanges({idField: 'id'}));
      for await (let data of notConfiguredData) {

        const updatedVilla = await {
  
  
        ventureId: await this.copiedFltsData.ventureId,
        towerId: await this.floor.towerId,
        floorId: await floor.id,
        bhkType: await this.copiedFltsData.bhkType,
        resources: await this.copiedFltsData.resources,
        layout: await this.copiedFltsData.layout,
        videos: await this.copiedFltsData.videos,
        toilets: await this.copiedFltsData.toilets,
        poojaRoom: await this.copiedFltsData.poojaRoom,
        livingDining: await this.copiedFltsData.livingDining,
        kitchen: await this.copiedFltsData.kitchen,
        northFacing: await this.copiedFltsData.northFacing,
        northSize: await this.copiedFltsData.northSize,
        units: await this.copiedFltsData.units,
        southFacing: await this.copiedFltsData.southFacing,
        southSize: await this.copiedFltsData.southSize,
        eastFacing: await this.copiedFltsData.eastFacing,
        eastSize: await this.copiedFltsData.eastSize,
        westFacing: await this.copiedFltsData.westFacing,
        westSize:  await this.copiedFltsData.westSize,
        carpetArea:  await this.copiedFltsData.carpetArea,
        balconyArea:  await this.copiedFltsData.balconyArea,
        commonArea:  await this.copiedFltsData.commonArea,
        saleableArea:  await this.copiedFltsData.saleableArea,
        amenities:  await this.copiedFltsData.amenities,
        costOfProperty:  await this.copiedFltsData.costOfProperty,
        sortDate: await  +new Date(),
        sortDate2 : await new Date(),
        sortTime: await this.copiedFltsData.sortTime,
        configured: await true,
        createdAt:await firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: await this.user.uid,
        displayDate: await new Date().toDateString(),
  
      }
  
    
        const villaRef = await this.afs.firestore.doc(`ventureTowers/${this.floor.towerId}/floors/${floor.id}/flats/${data.id}`);
        await batch.update(villaRef, Object.assign(updatedVilla));

        
    
      }

    } else {
      const notConfiguredData = await firstValueFrom(this.afs.collection(`ventureTowers/${this.copiedFlat.towerId}/floors/${this.copiedFlat.floorId}/flats`, 
      ref => ref.where('floorId', '==', this.copiedFlat.floorId)
      .where('configured', '==', false))
      .valueChanges({idField: 'id'}));

      for await (let data of notConfiguredData) {

        const updatedVilla = await {
  
  
        ventureId: await this.copiedFlat.ventureId,
        towerId: await this.copiedFlat.towerId,
        floorId: await this.copiedFlat.floorId,
        bhkType: await this.copiedFlat.bhkType,
        resources: await this.copiedFlat.resources,
        layout: await this.copiedFlat.layout,
        videos: await this.copiedFlat.videos,
        toilets: await this.copiedFlat.toilets,
        poojaRoom: await this.copiedFlat.poojaRoom,
        livingDining: await this.copiedFlat.livingDining,
        kitchen: await this.copiedFlat.kitchen,
        northFacing: await this.copiedFlat.northFacing,
        northSize: await this.copiedFlat.northSize,
        units: await this.copiedFlat.units,
        southFacing: await this.copiedFlat.southFacing,
        southSize: await this.copiedFlat.southSize,
        eastFacing: await this.copiedFlat.eastFacing,
        eastSize: await this.copiedFlat.eastSize,
        westFacing: await this.copiedFlat.westFacing,
        westSize:  await this.copiedFlat.westSize,
        carpetArea:  await this.copiedFlat.carpetArea,
        balconyArea:  await this.copiedFlat.balconyArea,
        commonArea:  await this.copiedFlat.commonArea,
        saleableArea:  await this.copiedFlat.saleableArea,
        amenities:  await this.copiedFlat.amenities,
        costOfProperty:  await this.copiedFlat.costOfProperty,
        sortDate: await  +new Date(),
        sortDate2 : await new Date(),
        sortTime: await this.copiedFlat.sortTime,
        configured: await true,
        createdAt:await firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: await this.user.uid,
        displayDate: await new Date().toDateString(),
  
      }
  
    
        const villaRef = await this.afs.firestore.doc(`ventureTowers/${this.floor.towerId}/floors/${this.copiedFlat.floorId}/flats/${data.id}`);
        await batch.update(villaRef, Object.assign(updatedVilla));
    
      }
    }

   await batch.commit().then(async () => {
    this.loadFlats();
       this.copiedData = null;
       this.pasteAllFlats = false; 
       this.toast.showMessage('Configuration Pasted Successfully');
       
    }).catch((err) => {
      this.toast.showError(err.message);
  
    });
  
  
  
  }

  async copyFlatConfiguration(flat: any) {

    this.copiedFlatData.emit(flat);

    this.copiedFlat = flat;
    this.pasteAllFlats = true;
    // this.copied = flat;

  }

  async pasteFlatConfiguration(flat: { floorId: any; id: any; }) {
    let updatedFlat;

    const batch = await this.afs.firestore.batch();

    if(this.copiedFlat === undefined) {
      updatedFlat = await {
        ventureId: await this.copiedFltsData.ventureId,
        towerId: await this.copiedFltsData.towerId,
        floorId: await flat.floorId,
        bhkType: await this.copiedFltsData.bhkType,
        resources: await this.copiedFltsData.resources,
        layout: await this.copiedFltsData.layout,
        videos: await this.copiedFltsData.videos,
        toilets: await this.copiedFltsData.toilets,
        poojaRoom: await this.copiedFltsData.poojaRoom,
        livingDining: await this.copiedFltsData.livingDining,
        kitchen: await this.copiedFltsData.kitchen,
        northFacing: await this.copiedFltsData.northFacing,
        northSize: await this.copiedFltsData.northSize,
        units: await this.copiedFltsData.units,
        southFacing: await this.copiedFltsData.southFacing,
        southSize: await this.copiedFltsData.southSize,
        eastFacing: await this.copiedFltsData.eastFacing,
        eastSize: await this.copiedFltsData.eastSize,
        westFacing: await this.copiedFltsData.westFacing,
        westSize:  await this.copiedFltsData.westSize,
        carpetArea:  await this.copiedFltsData.carpetArea,
        balconyArea:  await this.copiedFltsData.balconyArea,
        commonArea:  await this.copiedFltsData.commonArea,
        saleableArea:  await this.copiedFltsData.saleableArea,
        amenities:  await this.copiedFltsData.amenities,
        costOfProperty:  await this.copiedFltsData.costOfProperty,
        sortDate: await  +new Date(),
        sortDate2 : await new Date(),
        sortTime: await this.copiedFltsData.sortTime,
        configured: await true,
        createdAt:await firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: await this.user.uid,
        displayDate: await new Date().toDateString(),
  
      }
    
      const villaRef = await this.afs.firestore.doc(`ventureTowers/${this.floor.towerId}/floors/${flat.floorId}/flats/${flat.id}`);
      await batch.update(villaRef, Object.assign(updatedFlat));
    } else {
      updatedFlat = await {
        ventureId: await this.copiedFlat.ventureId,
        towerId: await this.copiedFlat.towerId,
        floorId: await this.copiedFlat.floorId,
        bhkType: await this.copiedFlat.bhkType,
        resources: await this.copiedFlat.resources,
        layout: await this.copiedFlat.layout,
        videos: await this.copiedFlat.videos,
        toilets: await this.copiedFlat.toilets,
        poojaRoom: await this.copiedFlat.poojaRoom,
        livingDining: await this.copiedFlat.livingDining,
        kitchen: await this.copiedFlat.kitchen,
        northFacing: await this.copiedFlat.northFacing,
        northSize: await this.copiedFlat.northSize,
        units: await this.copiedFlat.units,
        southFacing: await this.copiedFlat.southFacing,
        southSize: await this.copiedFlat.southSize,
        eastFacing: await this.copiedFlat.eastFacing,
        eastSize: await this.copiedFlat.eastSize,
        westFacing: await this.copiedFlat.westFacing,
        westSize:  await this.copiedFlat.westSize,
        carpetArea:  await this.copiedFlat.carpetArea,
        balconyArea:  await this.copiedFlat.balconyArea,
        commonArea:  await this.copiedFlat.commonArea,
        saleableArea:  await this.copiedFlat.saleableArea,
        amenities:  await this.copiedFlat.amenities,
        costOfProperty:  await this.copiedFlat.costOfProperty,
        sortDate: await  +new Date(),
        sortDate2 : await new Date(),
        sortTime: await this.copiedFlat.sortTime,
        configured: await true,
        createdAt:await firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: await this.user.uid,
        displayDate: await new Date().toDateString(),
  
      }
      const villaRef = await this.afs.firestore.doc(`ventureTowers/${this.floor.towerId}/floors/${this.copiedFlat.floorId}/flats/${flat.id}`);
      await batch.update(villaRef, Object.assign(updatedFlat));
    } 
      await batch.commit().then(async () => {
  
        this.loadFlats();
        this.copiedData = null;
        this.copiedFltsData = null;
        this.pasteAllFlats = false; 
        this.toast.showMessage('Configuration Pasted Successfully');
        
     }).catch((err) => {
       this.toast.showError(err.message);
   
     });
   
  } 

  async reloadVilla() {
    const id = this.floor.id;
    this.floor = await firstValueFrom(this.afs.doc(`ventureTowers/${this.floor.towerId}/floors/${this.floor.id}`).valueChanges());
    this.floor.id = id;
  }


}

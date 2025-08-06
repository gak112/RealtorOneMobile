import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ModalController ,IonHeader, IonToolbar, IonIcon, IonTitle, IonButton, IonLabel, IonContent, IonImg } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { IVentureHouses } from 'src/app/models/ventures.modal';
import { ToastService } from 'src/app/services/toast.service';
import firebase from 'firebase/compat/app';
import { IonicModule } from '@ionic/angular';
import { TowerflatBoxComponent } from '../../components/towerflat-box/towerflat-box.component';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-villaconfigure',
  templateUrl: './villaconfigure.component.html',
  styleUrls: ['./villaconfigure.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonButton,IonLabel,IonContent,IonImg,NgIf,TowerflatBoxComponent,],
  providers:[ModalController],
})
export class VillaconfigureComponent  implements OnInit {

  @Input() venture:any ;
  @Input() user:any ;
  @Input() ventureID:any ;
   
  villas: any[] = [];
  eachRowFlats: any;
  
  flats = [];
  
  pasteAllData = false;
  
  
  configuring = false;
  
  
  villasData: any = [];
  
  copiedData : any
  
  constructor(private modalController: ModalController, private afs: AngularFirestore, private toast: ToastService) { }
  
  ngOnInit() {
  
   
    this.configuring = true;
  
  
    for( let i = 1; i <= this.venture.houseVilla; i++) {
      this.villas.push(i);
    }
  
    // this.eachRowFlats = this.venture.houseVilla / this.tower.floors;
  
    // for(let i=1; i <= this.eachRowFlats; i++) {
    //   this.flats.push(i);
    // }
  
    this.configureTower();
  
  }
  
  
  async configureTower() {
  
  
    const isHousesExisted = await firstValueFrom(this.afs.collection(`ventureVillas`,
    ref => ref.where('ventureId', '==', this.ventureID)).get());
    
    if(isHousesExisted.docs.length > 0) {
  
       this.loadVillas();
      
      this.configuring = false;
  
      return;
    }
  
    // create floors
  
    const batch = await this.afs.firestore.batch();
  
  
    for await (const floor of this.villas) {
      
      const id = await this.afs.createId();
  
      let floorRef = await this.afs.firestore.collection(`ventureVillas`).doc(id);
  
      let towerFloor: IVentureHouses = {
        ventureId: this.ventureID,
  
        houseName: this.venture.houseName || '',
        houseNumber: floor,
        bhkType: this.venture.bhkType || 0,
        floors: this.venture.floors || 0,
        lifts: this.venture.lifts || 0,
        type: this.venture.type || '', // simplex, duplex, triplex or anything..
        resources: this.venture.resources || [],
        layout: this.venture.layout || [],
        videos: this.venture.videos || [],
        toilets: this.venture.toilets || 0,
        poojaRoom: this.venture.poojaRoom || 0,
        livingDining: this.venture.livingDining || 0,
        kitchen: this.venture.kitchen  || 0,
        northFacing: this.venture.northFacing  || '',
        northSize: this.venture.northSize || 0,
        units: this.venture.units || '',
        southFacing: this.venture.southFacing || '',
        southSize: this.venture.southSize || 0,
        eastFacing: this.venture.eastFacing || '',
        eastSize: this.venture.eastSize || 0,
        westFacing: this.venture.westFacing || '',
        westSize: this.venture.westSize || 0,
        carpetArea: this.venture.carpetArea || '',
        balconyArea: this.venture.balconyArea || '',
        commonArea: this.venture.commonArea || '',
        saleableArea: this.venture.saleableArea || '',
        amenities: [],
        costOfProperty: this.venture.costOfProperty || 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: this.user.uid,
        sortDate: +new Date(),
        sortDate2: new Date(),
        displayDate: new Date().toDateString(),
        sortTime: null,
        configured: false
      }
      await batch.set(floorRef, Object.assign(towerFloor));
  
  
  
    
    }
  
  
  
    // floors create
  
    // create flats in each floor
  
    await batch.commit().then(async() => { 
  
     
  
     await this.loadVillas();
  this.toast.showMessage('Villas Configured Successfully');
  
    }).catch((err) => {
      
      this.toast.showMessage('Something went wrong, please try again later');
      this.configuring = false;
    });
  
  
  
  }
  
  
  
  special = ['zeroth','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
  deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];
  
  stringifyNumber(n: number) {
   if (n < 20) return this.special[n];
   if (n%10 === 0) return this.deca[Math.floor(n/10)-2] + 'ieth';
   return this.deca[Math.floor(n/10)-2] + 'y-' + this.special[n%10];
  }
  
  
  async loadVillas() {
  
   this.villasData =  await firstValueFrom(this.afs.collection(`ventureVillas`,
   ref => ref.where('ventureId', '==', this.ventureID).orderBy('houseNumber', 'asc')).valueChanges({idField: 'id'}));
  this.configuring = false;
  }
  
  copiedVilla(villa: any) {
  
    
  
    this.copiedData = villa
  
  }
  
  clearClipboard() {
    this.copiedData = null;
  }
  
  async pasteAll() {
    
    
  
    const notConfiguredData = await firstValueFrom(this.afs.collection(`ventureVillas`, 
    ref => ref.where('ventureId', '==', this.ventureID)
    .where('configured', '==', false))
    .valueChanges({idField: 'id'}));
  
  
    const updatedVilla = {
      amenities: await this.copiedData.amenities,
      balconyArea: await this.copiedData.balconyArea,
      bhkType: await this.copiedData.bhkType,
      carpetArea: await this.copiedData.carpetArea,
      commonArea: await this.copiedData.commonArea,
      costOfProperty: await this.copiedData.costOfProperty,
      ventureId: await this.copiedData.ventureId,
      floors: await this.copiedData.floors,
      lifts: await this.copiedData.lifts,
      type: await this.copiedData.type,
      resources: await this.copiedData.resources,
      layout: await this.copiedData.layout,
      videos: await this.copiedData.videos,
      toilets: await this.copiedData.toilets,
      poojaRoom: await this.copiedData.poojaRoom,
      livingDining: await this.copiedData.livingDining,
      kitchen: await this.copiedData.kitchen,
      northFacing: await this.copiedData.northFacing,
      northSize: await this.copiedData.northSize,
      units: await this.copiedData.units,
      southFacing: await this.copiedData.southFacing,
      southSize: await this.copiedData.southSize,
      eastFacing: await this.copiedData.eastFacing,
      eastSize: await this.copiedData.eastSize,
      westFacing: await this.copiedData.westFacing,
      westSize: await this.copiedData.westSize,
      saleableArea: await this.copiedData.saleableArea,
      sortDate: await +new Date(),
      sortDate2: await new Date(),
      sortTime: await this.copiedData.sortTime,
      configured: await true,
      createdAt: await firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: await this.user.uid,
      displayDate: await new Date().toDateString(),
    }
  
  
  
    const batch = await this.afs.firestore.batch();
  
    for await (let data of notConfiguredData) {
  
  
      const villaRef = await this.afs.firestore.doc(`ventureVillas/${data.id}`);
      await batch.update(villaRef, Object.assign(updatedVilla));
  
    }
  
  
   await batch.commit().then(async () => {
  
       this.pasteAllData = true;
       this.copiedData = null;
       this.toast.showMessage('Configuration Pasted Successfully');
       
    }).catch((err) => {
  
      this.toast.showError(err.message);
  
    });
  
  
  
  
  }
  
  dismiss() {
    this.modalController.dismiss();
  }

}

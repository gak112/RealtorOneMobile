import { Component, OnInit, inject, input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { firstValueFrom } from 'rxjs';
import { IVentureTowerFlats, IVentureTowerFloors } from 'src/app/models/ventures.modal';
import { ToastService } from 'src/app/services/toast.service';
import firebase from 'firebase/compat/app';
import { IonicModule } from '@ionic/angular';
import { TowerfloorBoxComponent } from '../towerfloor-box/towerfloor-box.component';



@Component({
  selector: 'app-towerconfigure',
  templateUrl: './towerconfigure.component.html',
  styleUrls: ['./towerconfigure.component.scss'],
  standalone:true,
  imports: [IonHeader, IonToolbar, IonIcon, IonTitle, IonButton, IonLabel, IonContent, IonImg, TowerfloorBoxComponent],
  providers:[ModalController],
})
export class TowerconfigureComponent  implements OnInit {
  private modalController = inject(ModalController);
  private afs = inject(AngularFirestore);
  private toast = inject(ToastService);


  readonly tower = input.required<{
    floors: number;
    flats: number;
    id: any;
    ventureId: any;
}>();
  readonly user = input.required<{
    uid: any;
}>();

  floors : any[] = [];
  eachRowFlats!: number;

  flats :any[]= [];

  copiedFlatData!: { towerId: any; floorId: any; };
  pasteAllData = false;
  configuring = false;


  copiedData : any= null;
  floorsData: any = [];

  ngOnInit() {


    this.configuring = true;


    for( let i = 1; i <= this.tower().floors; i++) {
      this.floors.push(i);
    }

    this.eachRowFlats = this.tower().flats / this.tower().floors;

    for(let i=1; i <= this.eachRowFlats; i++) {
      this.flats.push(i);
    }

    this.configureTower();

  }

  copiedVilla(villa: null) {

  
    this.copiedData = villa
  
  }

  copiedFData(villa: any) {
    this.copiedFlatData = villa;
  }

  
clearClipboard() {
  this.copiedData = null;
}

  async configureTower() {


    const isFloorsExisted = await firstValueFrom(this.afs.collection(`ventureTowers/${this.tower().id}/floors`).get());

    
    if(isFloorsExisted.docs.length > 0) {
       this.loadFloors();
      
      this.configuring = false;

      return;
    }

    // create floors

    const batch = await this.afs.firestore.batch();


    for await (const floor of this.floors) {

      const id = await this.afs.createId();

      let floorRef = await this.afs.firestore.collection(`ventureTowers/${this.tower().id}/floors`).doc(id);

      let towerFloor: IVentureTowerFloors = {
        ventureId: this.tower().ventureId,
        towerId: this.tower().id,
        floorName: this.stringifyNumber(floor) + ' Floor',
        floorNumber: floor,
        flats: this.eachRowFlats,
        resources: [],
        layout: [],
        videos: [],
        carpetArea: null,
        balconyArea: null,
        commonArea: null,
        saleableArea: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: this.user().uid,
        sortDate: +new Date(),
        sortDate2: new Date(),
        displayDate: new Date().toDateString(),
        sortTime: null,
        configured: false,
      }
      await batch.set(floorRef, Object.assign(towerFloor));

      for await (let flat of this.flats) { 
          
          const flatId = await this.afs.createId();
  
          let flatRef = await this.afs.firestore.collection(`ventureTowers/${this.tower().id}/floors/${id}/flats`).doc(flatId);
  
          let towerFlat: IVentureTowerFlats = {
            ventureId: this.tower().ventureId,
            towerId: this.tower().id,
            floorId: id,
            flatName: this.stringifyNumber(flat) + ' Flat',
            flatNumber: flat,
            bhkType: '',
            resources: [],
            layout: [],
            videos: [],
            toilets: null,
            poojaRoom: null,
            livingDining: null,
            kitchen: null,
            northFacing: null,
            northSize: null,
            units: null,
            southFacing: null,
            southSize: null,
            eastFacing: null,
            eastSize: null,
            westFacing: null,
            westSize: null,
            carpetArea: null,
            balconyArea: null,
            commonArea: null,
            saleableArea: null,
            amenities: [],
            costOfProperty: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: this.user().uid,
            sortDate: +new Date(),
            sortDate2: new Date(),
            displayDate: new Date().toDateString(),
            sortTime: null,
            configured: false,
          }
  
          await batch.set(flatRef, Object.assign(towerFlat));
  

      }


    
    }



    // floors create

    // create flats in each floor

    await batch.commit().then(async() => { 

     
  
     await this.loadFloors();
 this.toast.showMessage('Tower Configured Successfully');

    }).catch((err: any) => {
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


 async loadFloors() {
   this.floorsData =  await firstValueFrom(this.afs.collection(`ventureTowers/${this.tower().id}/floors`
   , ref => ref.orderBy('floorNumber', 'asc')).valueChanges({idField: 'id'}));

  this.configuring = false;
 }

 
async pasteAll() {
  
  

  const notConfiguredData = await firstValueFrom(this.afs.collection(`ventureTowers/${this.copiedData.towerId}/floors`, 
    ref => ref.where('towerId', '==', this.tower().id)
  .where('configured', '==', false))
  .valueChanges({idField: 'id'}));





  const updatedVilla = await {

    ventureId: await this.copiedData.ventureId,
    towerId: await this.copiedData.towerId,
    flats: await this.copiedData.flats,
    resources: await this.copiedData.resources,
    layout: await this.copiedData.layout,
    videos: await this.copiedData.videos,
    carpetArea: await this.copiedData.carpetArea,
    balconyArea: await this.copiedData.balconyArea,
    commonArea: await this.copiedData.commonArea,
    saleableArea: await this.copiedData.saleableArea,
    sortDate: await  +new Date(),
    sortDate2 : await new Date(),
    sortTime: await this.copiedData.sortTime,
    configured: await true,
    createdAt:await firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: await this.user().uid,
    displayDate: await new Date().toDateString(),
   
  }



  const batch = await this.afs.firestore.batch();

  for await (let data of notConfiguredData) {

    const villaRef = await this.afs.firestore.doc(`ventureTowers/${this.tower().id}/floors/${data.id}`);
    await batch.update(villaRef, Object.assign(updatedVilla));

  }


 await batch.commit().then(async () => {

     this.pasteAllData = true;
     this.copiedData = null;
     this.toast.showMessage('Configuration Pasted Successfully');
     
  }).catch((err: { message: any; }) => {
    this.toast.showError(err.message);

  });




}

async pasteAllFlats() {
  console.log(this.copiedFlatData);
  const notConfiguredData = await firstValueFrom(this.afs.collection(`ventureTowers/${this.copiedFlatData.towerId}/floors/${this.copiedFlatData.floorId}/flats`, 
    ref => ref.where('floorId', '==', this.copiedFlatData.floorId)
  .where('configured', '==', false))
  .valueChanges({idField: 'id'}));

  console.log(notConfiguredData);
}


  dismiss() {
    this.modalController.dismiss();
  }
}



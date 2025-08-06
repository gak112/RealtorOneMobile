import {  NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ProductBoxComponent } from 'src/app/search/components/product-box/product-box.component';

@Component({
  selector: 'app-propertieslist',
  templateUrl: './propertieslist.component.html',
  styleUrls: ['./propertieslist.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,NgIf,ProductBoxComponent,],
  providers:[ModalController],
})
export class PropertieslistComponent implements OnInit {

  @Input() actionType: any;
  properties: any;

  constructor(private modalController: ModalController, /*private afs: AngularFirestore*/) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return
    // this.afs.collection(`requests`,
    // ref => ref.where('actionType', '==', this.actionType)).valueChanges().subscribe((data: any) => {
    //   this.properties = data;
    // });
  }
  dismiss() {

    this.modalController.dismiss();
    
  }
}

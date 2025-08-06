import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { IonHeader, IonToolbar, ModalController, IonButtons, IonIcon, IonTitle, IonContent } from '@ionic/angular/standalone';
import { SavedpropertycardComponent } from '../../components/savedpropertycard/savedpropertycard.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-savedproperties',
  templateUrl: './savedproperties.component.html',
  styleUrls: ['./savedproperties.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,NgFor,NgIf,SavedpropertycardComponent,],
  providers:[ModalController],
})
export class SavedpropertiesComponent  implements OnInit {
  @Input() user:  any; ;
  savedProperties: any;
  constructor (/*private afs: AngularFirestore,*/ private modalController: ModalController) {
    addIcons({chevronBackOutline})
   }

  ngOnInit() {
    return;
    // this.afs.collection(`savedPropertiesList`,
    //   ref => ref.where('uid', '==', this.user.uid)).valueChanges().subscribe((data: any) => {
      
    //       this.savedProperties = data;
    // });
   
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

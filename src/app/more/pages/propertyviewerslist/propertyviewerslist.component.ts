import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonAvatar, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonSkeletonText, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-propertyviewerslist',
  templateUrl: './propertyviewerslist.component.html',
  styleUrls: ['./propertyviewerslist.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,IonItem,IonAvatar,IonLabel,IonSkeletonText,],
  providers:[ModalController],
})
export class PropertyviewerslistComponent implements OnInit {
  dismiss() {
    this.modalController.dismiss();
  }

  constructor(private modalController : ModalController) { 
    addIcons({chevronBackOutline})
  }

  ngOnInit() {
    return;
   }

}

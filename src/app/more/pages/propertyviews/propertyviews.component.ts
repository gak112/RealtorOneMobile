import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonAvatar, IonCard, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonSkeletonText, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { PropertieslistComponent } from 'src/app/home/pages/propertieslist/propertieslist.component';
import { PropertyviewerslistComponent } from '../propertyviewerslist/propertyviewerslist.component';
import { addIcons } from 'ionicons';
import { chevronBackOutline, eye } from 'ionicons/icons';

@Component({
  selector: 'app-propertyviews',
  templateUrl: './propertyviews.component.html',
  styleUrls: ['./propertyviews.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,IonCard,IonItem,IonSkeletonText,IonAvatar,IonLabel,IonImg],
  providers:[ModalController],
})
export class PropertyviewsComponent implements OnInit {

  async showViewersList() {
    const modal = await this.modalController.create({
      component: PropertyviewerslistComponent
    });

    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  constructor(private modalController: ModalController) {
    addIcons({ chevronBackOutline,eye })
  }

  ngOnInit() {
    return;
   }

}

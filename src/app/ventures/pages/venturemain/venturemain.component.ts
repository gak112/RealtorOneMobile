import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ProductfilterComponent } from 'src/app/search/pages/productfilter/productfilter.component';
import { HomeventurecardComponent } from '../../components/homeventurecard/homeventurecard.component';
import { IonButton, IonContent, IonHeader, IonSearchbar, IonTitle, IonToolbar,  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-venturemain',
  templateUrl: './venturemain.component.html',
  styleUrls: ['./venturemain.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonTitle,IonButton,IonSearchbar,IonContent,HomeventurecardComponent,],
  providers:[ModalController],
})
export class VenturemainComponent  implements OnInit {


  constructor(private modalController: ModalController, ) { }

  ngOnInit() {
    return;
  }

  async showFilters() {
    const modal = await this.modalController.create({
      component: ProductfilterComponent,
    });

    await modal.present();
  }

}

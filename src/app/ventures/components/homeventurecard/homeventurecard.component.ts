import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { register } from 'swiper/element';
import { VentureFullviewComponent } from '../../pages/venture-fullview/venture-fullview.component';
import { addIcons } from 'ionicons';
import { locationOutline } from 'ionicons/icons';
import { IonIcon, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
register();

@Component({
  selector: 'app-homeventurecard',
  templateUrl: './homeventurecard.component.html',
  styleUrls: ['./homeventurecard.component.scss'],
  standalone: true,
  imports: [IonImg,IonLabel,IonIcon,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[ModalController],
})
export class HomeventurecardComponent implements OnInit {
  @Input() venture: any;
  
  constructor(private modalController: ModalController) {
    addIcons({ locationOutline })
  }

  ngOnInit() { 
    return
  }

  async openVentureFullview(venture: any) {
    const modal = await this.modalController.create(
      {
        component: VentureFullviewComponent,
        componentProps: { venture }
      }
    );
    return await modal.present();
  }
}

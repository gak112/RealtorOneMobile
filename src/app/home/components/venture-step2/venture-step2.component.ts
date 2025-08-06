import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { VentureTowerComponent } from '../venture-tower/venture-tower.component';
import { VentureHousevillaComponent } from '../venture-housevilla/venture-housevilla.component';
import { IonButton, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-venture-step2',
  templateUrl: './venture-step2.component.html',
  styleUrls: ['./venture-step2.component.scss'],
  standalone: true,
  imports: [IonButton,IonLabel,NgIf,VentureTowerComponent,VentureHousevillaComponent],
  providers:[ModalController],
})
export class VentureStep2Component implements OnInit {
  clearClipboard() {
    throw new Error('Method not implemented.');
  }
  pasteAllData() {
    throw new Error('Method not implemented.');
  }
  pasteTowers: any;
  ventureTowers: any;
  user: any;
  copiedTowerList($event: Event) {
    throw new Error('Method not implemented.');
  }
  ventures: any;
  ventureID: any;

  constructor() { }

  ngOnInit() { 
    return
  }

}

import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonImg, IonItem, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  imports: [IonItem, IonImg, IonLabel, AsyncPipe],
  providers:[ModalController],
  selector: 'app-companybranches',
  templateUrl: './companybranches.component.html',
  styleUrls: ['./companybranches.component.scss'],
})
export class CompanybranchesComponent  implements OnInit {
branches$: any;

  constructor() { }

  ngOnInit() {
    return
  }

}

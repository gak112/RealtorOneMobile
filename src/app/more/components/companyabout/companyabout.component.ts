import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  imports: [IonLabel, IonImg, AsyncPipe],
  providers:[ModalController],
  selector: 'app-companyabout',
  templateUrl: './companyabout.component.html',
  styleUrls: ['./companyabout.component.scss'],
})
export class CompanyaboutComponent  implements OnInit {
aboutUs$: any;

  constructor() { }

  ngOnInit() {
    return
  }

}

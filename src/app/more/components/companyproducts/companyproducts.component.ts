import { Component, OnInit } from '@angular/core';
import { IonIcon, IonImg, IonLabel, IonSearchbar, ModalController } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  imports:[IonIcon,IonSearchbar,IonLabel,IonImg,],
  providers:[ModalController],
  selector: 'app-companyproducts',
  templateUrl: './companyproducts.component.html',
  styleUrls: ['./companyproducts.component.scss'],
})
export class CompanyproductsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    return
  }

}

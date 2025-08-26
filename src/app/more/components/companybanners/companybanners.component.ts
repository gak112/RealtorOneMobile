
import { Component, OnInit } from '@angular/core';
import { IonImg, IonLabel, IonicSlides, ModalController, } from '@ionic/angular/standalone';

@Component({
  standalone: true,
  imports: [IonImg, IonLabel],
  providers: [ModalController],
  selector: 'app-companybanners',
  templateUrl: './companybanners.component.html',
  styleUrls: ['./companybanners.component.scss'],
})
export class CompanybannersComponent implements OnInit {
  openImageModal: any;
banner: any;

  constructor() { }

  ngOnInit() {
    return
  }

}

import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonIcon, IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { Observable, Subscribable } from 'rxjs';

@Component({
  standalone:true,
  imports:[IonImg,NgFor,IonLabel,IonIcon,NgIf,AsyncPipe],
  providers:[ModalController],
  selector: 'app-companyteam',
  templateUrl: './companyteam.component.html',
  styleUrls: ['./companyteam.component.scss'],
})
export class CompanyteamComponent  implements OnInit {
openImageModal: any;
teams$: Observable<any>|Subscribable<any>|Promise<any>;

  constructor() { }

  ngOnInit() {
    return
  }

}

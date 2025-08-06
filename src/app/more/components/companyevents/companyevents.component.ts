import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { Observable, Subscribable } from 'rxjs';

@Component({
  standalone:true,
  imports:[NgIf,NgFor,IonLabel,AsyncPipe,IonImg,],
  providers:[ModalController],
  selector: 'app-companyevents',
  templateUrl: './companyevents.component.html',
  styleUrls: ['./companyevents.component.scss'],
})
export class CompanyeventsComponent  implements OnInit {
events$: Observable<any>|Subscribable<any>|Promise<any>;
openImageModal: any;

  constructor() { }

  ngOnInit() {
    return
  }

}

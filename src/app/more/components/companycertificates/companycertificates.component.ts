import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonImg, ModalController } from '@ionic/angular/standalone';
import { Observable, Subscribable } from 'rxjs';

@Component({
  standalone:true,
  imports: [IonImg, AsyncPipe],
  providers:[ModalController],
  selector: 'app-companycertificates',
  templateUrl: './companycertificates.component.html',
  styleUrls: ['./companycertificates.component.scss'],
})
export class CompanycertificatesComponent  implements OnInit {
openImageModal: any;
certificates$: Observable<any>|Subscribable<any>|Promise<any>;

  constructor() { }

  ngOnInit() {
    return
  }

}

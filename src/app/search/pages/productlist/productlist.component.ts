import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { HomeventurecardComponent } from 'src/app/ventures/components/homeventurecard/homeventurecard.component';

@Component({
  standalone:true,
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle, IonContent, AsyncPipe, HomeventurecardComponent],
  providers:[ModalController],
})

export class ProductlistComponent  implements OnInit {
dismiss: any;
properties$: Observable<any>;

  constructor() { }

  ngOnInit() {
    return;
  }

}

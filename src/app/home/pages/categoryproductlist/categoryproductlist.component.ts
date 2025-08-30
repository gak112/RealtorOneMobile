import { AsyncPipe, JsonPipe, UpperCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { Observable, Subscribable } from 'rxjs';
import { HomeventurecardComponent } from './../../../ventures/components/homeventurecard/homeventurecard.component';


@Component({
  standalone:true,
  selector: 'app-categoryproductlist',
  templateUrl: './categoryproductlist.component.html',
  styleUrls: ['./categoryproductlist.component.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle, IonContent, AsyncPipe, JsonPipe, UpperCasePipe, HomeventurecardComponent],
  providers:[ModalController],
})

export class CategoryproductlistComponent  implements OnInit {
dismiss() {
throw new Error('Method not implemented.');
}
actionType: any;
properties$: Observable<unknown>|Subscribable<unknown>|Promise<unknown>;

  constructor() { }

  ngOnInit() {
    return
  }

}

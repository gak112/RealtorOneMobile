import { NgIf, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonIcon, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-specview',
  templateUrl: './specview.component.html',
  styleUrls: ['./specview.component.scss'],
  standalone: true,
  imports: [IonLabel,NgIf,NgFor,IonIcon],
  providers:[ModalController],
})
export class SpecviewComponent implements OnInit {
  specifications: any;
  keyChanged($event: Event, _t7: number, _t14: number) {
    throw new Error('Method not implemented.');
  }
  valueChanged($event: Event, _t7: number, _t14: number) {
    throw new Error('Method not implemented.');
  }

  constructor() { }

  ngOnInit() {
    return
   }

}

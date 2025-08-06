import { Component, OnInit } from '@angular/core';
import { IonButton, IonContent, ModalController } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  selector: 'app-successpage',
  templateUrl: './successpage.component.html',
  styleUrls: ['./successpage.component.scss'],
  imports:[IonContent,IonButton,],
  providers:[ModalController],
})
export class SuccesspageComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    return
  }

}

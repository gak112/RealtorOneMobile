import { Component, OnInit, inject } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-flatviewers',
  templateUrl: './flatviewers.component.html',
  styleUrls: ['./flatviewers.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonTitle,IonIcon,IonContent,IonImg,IonLabel,],
  providers:[ModalController],
})
export class FlatviewersComponent  implements OnInit {
  private modalController = inject(ModalController);


  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

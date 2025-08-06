import { Component, Input, OnInit } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { LikeboxComponent } from 'src/app/home/components/likebox/likebox.component';

@Component({
  selector: 'app-propertiesviews',
  templateUrl: './propertiesviews.component.html',
  styleUrls: ['./propertiesviews.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,LikeboxComponent],
  providers:[ModalController],
})
export class PropertiesviewsComponent  implements OnInit {
  @Input() user: any;
  @Input() hit: any;
  constructor(private modalController: ModalController) { }

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

import { Component, OnInit, inject, input } from '@angular/core';
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
  private modalController = inject(ModalController);

  readonly user = input<any>(undefined);
  readonly hit = input<any>(undefined);

  ngOnInit() {
    return;
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

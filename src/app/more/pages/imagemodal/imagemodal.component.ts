
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonContent, ModalController, IonicSlides, IonButton, IonImg, IonLabel } from '@ionic/angular/standalone';
import { register } from 'swiper/element';
register();


@Component({
  selector: 'app-imagemodal',
  templateUrl: './imagemodal.component.html',
  styleUrls: ['./imagemodal.component.scss'],
  standalone:true,
  imports: [IonContent, IonButton, IonImg, IonLabel],
  providers:[ModalController],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ImagemodalComponent  implements OnInit {
  private modalController = inject(ModalController);
  private activatedRoute = inject(ActivatedRoute);


  readonly media = input([]);
  @Input() description: any;
m: any;

  ngOnInit(): void {

return;

      // this.activatedRoute.data.subscribe(
      //     (data: { media: IMedia[] } ) => {
      //      data.media.forEach(m => {

      //             // if (m.mediaType === 'image') {
      //             //   m.mediaPath += '-/preview/-/progressive/yes/';
      //             // }
      //             this.media.push(m);
      //             }
      //         );
      //     }
      // );
  }

  dismiss() {
      this.modalController.dismiss();
  }

}

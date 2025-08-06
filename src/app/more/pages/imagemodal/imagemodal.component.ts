import { CommonModule, NgIf } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
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
  imports:[IonContent,IonButton,IonImg,IonLabel,NgIf,],
  providers:[ModalController],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ImagemodalComponent  implements OnInit {

  @Input() media = [];
  @Input() description: any;
m: any;
  
  constructor(private modalController: ModalController, private activatedRoute: ActivatedRoute) { }

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

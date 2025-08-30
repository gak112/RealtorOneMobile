import { Component, OnInit, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonImg,
  IonLabel,
  ModalController,
} from '@ionic/angular/standalone';
import { register } from 'swiper/element';
register();

@Component({
  selector: 'app-imagemodal',
  templateUrl: './imagemodal.component.html',
  styleUrls: ['./imagemodal.component.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonImg, IonLabel],
  providers: [ModalController],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ImagemodalComponent implements OnInit {
  private modalController = inject(ModalController);
  private activatedRoute = inject(ActivatedRoute);

  readonly media = input([]);
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  readonly description = input<any>(undefined);
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

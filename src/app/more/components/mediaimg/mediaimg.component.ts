import { Component, OnInit, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { Observable, Subscribable } from 'rxjs';


@Component({
  selector: 'app-mediaimg',
  templateUrl: './mediaimg.component.html',
  styleUrls: ['./mediaimg.component.scss'],
  standalone: true,
  imports: [IonLabel, IonImg, AsyncPipe],
  providers:[ModalController],
})
export class MediaimgComponent  implements OnInit {
readonly media = input(undefined);
openImageModal: any;
imgFiles$: Observable<unknown>|Subscribable<unknown>|Promise<unknown>;
  constructor() { }

  ngOnInit() {
    return
  }

}

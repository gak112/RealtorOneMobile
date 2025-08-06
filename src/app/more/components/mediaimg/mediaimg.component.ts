import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { Observable, Subscribable } from 'rxjs';


@Component({
  selector: 'app-mediaimg',
  templateUrl: './mediaimg.component.html',
  styleUrls: ['./mediaimg.component.scss'],
  standalone: true,
  imports : [IonLabel,NgIf,IonImg,AsyncPipe,],
  providers:[ModalController],
})
export class MediaimgComponent  implements OnInit {
@Input() media;
openImageModal: any;
imgFiles$: Observable<unknown>|Subscribable<unknown>|Promise<unknown>;
  constructor() { }

  ngOnInit() {
    return
  }

}

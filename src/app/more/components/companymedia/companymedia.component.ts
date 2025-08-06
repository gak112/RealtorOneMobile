import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MediaimgComponent } from '../mediaimg/mediaimg.component';
import { Observable, Subscribable } from 'rxjs';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  standalone:true,
  imports:[NgIf,NgFor,AsyncPipe, MediaimgComponent],
  providers:[ModalController],
  selector: 'app-companymedia',
  templateUrl: './companymedia.component.html',
  styleUrls: ['./companymedia.component.scss'],
})
export class CompanymediaComponent  implements OnInit {
medias$:Observable<any>|Subscribable<any>|Promise<any>;
media$: any;
  constructor() { }

  ngOnInit() {
    return
  }

}

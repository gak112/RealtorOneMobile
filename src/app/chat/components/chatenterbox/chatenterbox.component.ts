import { Component, OnInit, input } from '@angular/core';
import {IonImg,IonLabel,IonSkeletonText } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { camera } from 'ionicons/icons';

@Component({
  selector: 'app-chatenterbox',
  templateUrl: './chatenterbox.component.html',
  styleUrls: ['./chatenterbox.component.scss'],
  standalone: true,
  imports: [IonImg,IonLabel,IonSkeletonText]
})
export class ChatenterboxComponent  implements OnInit {

  
  readonly conversation = input<any>(undefined);
  readonly type = input<any>(undefined);

constructor() { 
  addIcons({camera})
}
  ngOnInit(){
  }



}

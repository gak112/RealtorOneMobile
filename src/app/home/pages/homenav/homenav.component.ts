import { Component, OnInit } from '@angular/core';
import { IonNav } from '@ionic/angular/standalone';
import { HomemainComponent } from '../homemain/homemain.component';

@Component({
  selector: 'app-homenav',
  templateUrl: './homenav.component.html',
  styleUrls: ['./homenav.component.scss'],
  standalone:true,
  imports:[IonNav]
})
export class HomenavComponent  implements OnInit {

  component = HomemainComponent;

  constructor() { }

  ngOnInit() {}

}

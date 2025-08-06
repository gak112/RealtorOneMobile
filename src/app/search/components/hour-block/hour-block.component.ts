import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-hour-block',
  templateUrl: './hour-block.component.html',
  styleUrls: ['./hour-block.component.scss'],
  standalone:true,
  imports:[IonLabel,IonImg,DatePipe,],
  providers:[ModalController],
})
export class HourBlockComponent  implements OnInit {

  @Input() data: any;
  @Input() units: string;

  constructor() { }

  ngOnInit() {
    return;
  }

  getWeatherIcon(icon) {
  //  return this.weatherService.getWeatherIcon(icon);
  }

  getUnitsString() {
    return this.units === 'metric' ? '°C' : '°F';
  }

}

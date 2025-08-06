import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { RequestsubmenuComponent } from '../requestsubmenu/requestsubmenu.component';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonImg, IonNav, IonNavLink, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { HomemainComponent } from '../homemain/homemain.component';

@Component({
  selector: 'app-requestmenu',
  templateUrl: './requestmenu.component.html',
  styleUrls: ['./requestmenu.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonBackButton,IonTitle,IonContent,IonNavLink,IonImg,],
  providers:[ModalController],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RequestmenuComponent  implements OnInit {

  action = 'sale';
  propertyComponent = RequestsubmenuComponent;

  constructor() { }

  ngOnInit() {
    return
  }

  // goForward(type: any) {
  //   this.nav.push(this.propertyComponent, { action: type });
  // }
}

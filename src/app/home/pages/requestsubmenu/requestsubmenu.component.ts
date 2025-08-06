import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit } from '@angular/core';
import { PostentryComponent } from '../postentry/postentry.component';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonImg, IonLabel, IonNavLink, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-requestsubmenu',
  templateUrl: './requestsubmenu.component.html',
  styleUrls: ['./requestsubmenu.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonButtons,IonBackButton,IonTitle,IonContent,IonNavLink,IonImg,IonLabel,],
  providers:[ModalController],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RequestsubmenuComponent  implements OnInit {

  @Input() action: any;
  propertyComponent = PostentryComponent;

  constructor() { }

  ngOnInit() {
    return
  }

  // goForward(type: any) {
  //   this.nav.push(this.propertyComponent, { actionType: type, action: this.action });
  // }
}

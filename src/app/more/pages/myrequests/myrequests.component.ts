import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
// import { AuthService } from 'src/app/services/auth.service';
import { PropertyboxComponent } from '../../components/propertybox/propertybox.component';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-myrequests',
  templateUrl: './myrequests.component.html',
  styleUrls: ['./myrequests.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,PropertyboxComponent,],
  providers:[ModalController],
})
export class MyrequestsComponent implements OnInit {
  @Input() user: any;;
  properties: any;

  constructor(private modalController: ModalController, /*private auth: AuthService, private afs: AngularFirestore*/) { addIcons({ chevronBackOutline }) }

  ngOnInit(): void {
    return;
    // this.afs.collection(`requests`,
    // ref => ref.where('uid', '==', this.user.uid)).valueChanges({idField: 'id'}).subscribe((data: any) => {
    //   this.properties = data;
    // });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}

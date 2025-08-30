
import { Component, OnInit, inject } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { ModalController, IonList, IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonAccordion, IonAccordionGroup, IonItem, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { Observable } from 'rxjs';
import { chevronBackOutline } from 'ionicons/icons'
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss'],
  standalone: true,
  imports: [IonHeader, IonIcon, IonToolbar, IonTitle, IonContent, IonAccordion, IonAccordionGroup, IonItem, IonList, IonLabel],
providers:[ModalController],
})
export class FaqsComponent implements OnInit {
  private modalController = inject(ModalController);

  faq$!: Observable<any>;
  questionanswers: any[] = []; // Add the missing property

  constructor() {
    addIcons({ chevronBackOutline })
  }

  ngOnInit(): void {
    return;
    // this.faq$ = this.afs.collection(`faqs`).valueChanges({idField: 'id'});
  }


  dismiss() {
    this.modalController.dismiss();
  }
}

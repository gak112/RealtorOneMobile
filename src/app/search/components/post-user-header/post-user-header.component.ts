
import { Component, Input, OnInit, inject } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-user-header',
  templateUrl: './post-user-header.component.html',
  styleUrls: ['./post-user-header.component.scss'],
  standalone: true,
  imports: [IonImg, IonLabel],
  providers:[ModalController],
})
export class PostUserHeaderComponent implements OnInit {
  private modalController = inject(ModalController);


  // @Input()
  // hit!: any;
  // users$!: Observable<any>;

  user: any = {
    photoURL: "",
    fullName: "K. Ashok Kumar"
  }

  ngOnInit() {
    return;
    // this.users$ = this.afs.doc(`users/${this.hit.uid}`).valueChanges();
  }


}

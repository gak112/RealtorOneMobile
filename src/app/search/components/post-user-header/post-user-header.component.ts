import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { IonImg, IonLabel, ModalController } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-user-header',
  templateUrl: './post-user-header.component.html',
  styleUrls: ['./post-user-header.component.scss'],
  standalone: true,
  imports: [IonImg,IonLabel,NgIf,],
  providers:[ModalController],
})
export class PostUserHeaderComponent implements OnInit {

  // @Input()
  // hit!: any;
  // users$!: Observable<any>;

  user: any = {
    photoURL: "",
    fullName: "K. Ashok Kumar"
  }

  constructor(private modalController: ModalController, /*private afs: AngularFirestore*/) { }

  ngOnInit() {
    return;
    // this.users$ = this.afs.doc(`users/${this.hit.uid}`).valueChanges();
  }


}

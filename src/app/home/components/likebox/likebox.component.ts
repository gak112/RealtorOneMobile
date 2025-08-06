import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonDatetime, IonIcon, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-likebox',
  templateUrl: './likebox.component.html',
  styleUrls: ['./likebox.component.scss'],
  standalone: true,
  imports:[IonIcon,DatePipe],
  providers:[ModalController],

})
export class LikeboxComponent implements OnInit {

  //@Input() like;
  //user

  like:any = {
    hit:{
      createdAt:"2019-09-01T19:49:05.413Z"
    }
  }

  user:any = {
    photoURL:"assets/img/nouser.jpg",
    fullName : "K. Ashok Kumar"
  }


  constructor(/*private afs: AngularFirestore*/) { }

  ngOnInit() {
    return
    // this.afs.doc(`users/${this.like.uid}`).valueChanges().subscribe((data: any) => {
    //   this.user = data;

    // });
  }

}

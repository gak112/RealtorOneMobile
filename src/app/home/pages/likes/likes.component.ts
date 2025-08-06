import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule, ModalController } from '@ionic/angular';
import { LikeboxComponent } from '../../components/likebox/likebox.component';
import { NgFor, NgIf } from '@angular/common';
import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,LikeboxComponent,NgIf,NgFor],
  providers:[ModalController],
})
export class LikesComponent  implements OnInit {

  @Input() user: any;
  @Input() hit: any;
  likesList: any;
  constructor(private modalController: ModalController, /*private afs: AngularFirestore*/) { }

  ngOnInit(): void {
    return
      // this.afs.collection(`likesList`, ref => ref.where('id', '==', this.hit.id)).valueChanges().subscribe(c => {
      //     if(c) { 
      //         this.likesList = c;
      //     }
      // });
   }

  dismiss() {
      this.modalController.dismiss();
  }
}

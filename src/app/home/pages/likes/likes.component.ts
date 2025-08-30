import { Component, OnInit, inject, input } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule, ModalController } from '@ionic/angular';
import { LikeboxComponent } from '../../components/likebox/likebox.component';

import { IonContent, IonHeader, IonIcon, IonTitle, IonToolbar,  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss'],
  standalone:true,
  imports:[IonHeader,IonToolbar,IonIcon,IonTitle,IonContent,LikeboxComponent],
  providers:[ModalController],
})
export class LikesComponent  implements OnInit {
  private modalController = inject(ModalController);


  readonly user = input<any>(undefined);
  readonly hit = input<any>(undefined);
  likesList: any;

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

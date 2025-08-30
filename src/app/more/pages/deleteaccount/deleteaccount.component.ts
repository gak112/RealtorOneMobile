import { Component, OnInit, inject, input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
// import { collection } from 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  IonContent, IonLabel, ModalController,
  IonToolbar, IonTitle, IonHeader, IonButton
} from "@ionic/angular/standalone";

import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-deleteaccount',
  templateUrl: './deleteaccount.component.html',
  styleUrls: ['./deleteaccount.component.scss'],
  standalone: true,
  imports: [IonButton, IonHeader, IonToolbar, IonTitle, IonContent,
      IonLabel, FormsModule],
  providers: [ModalController]
})
export class DeleteaccountComponent {
  private toast = inject(ToastService);
  private afs = inject(AngularFirestore);
  private afAuth = inject(AngularFireAuth);
  private auth = inject(AuthService);
  private modalController = inject(ModalController);

  readonly user = input(undefined);
  password;
  showPassword = false;
  showConfirmPassword;
  deleteAccError;


  // submit(event) {
  //   console.log(this.password, this.user.secureData)
     
  //   // this.auth.deleteUser().
  //   then( val => {

  //     const batch = this.afs.firestore.batch();

  //     const usersRef = this.afs.firestore.collection('users').doc(this.user.uid);

  //     batch.update(usersRef, Object.assign({
  //       delete: true,
  //       status: 'rejected',
  //     }));

  //     batch.commit().then(()=> {
  //       this.modalController.dismiss();
  //       this.toast.showMessage('Account Permanently Deleted');
  //       // this.auth.logout();
  //     }).catch(err => {
  //       this.toast.showError(err.message);
  //     });

  //   }).catch(err => {
  //     if('Firebase: This operation is sensitive and requires recent authentication. Log in again before retrying this request. (auth/requires-recent-login).') {
  //         this.toast.showError("To ensure your account's security, please log in once more before proceeding with this action.");
  //     }
      
  //     console.log(err.message)
      
  //   });
  // }
  setPassword(val) {
    this.showPassword = val;
  }

}

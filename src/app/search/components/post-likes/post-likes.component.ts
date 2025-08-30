import { Component, OnInit, inject, input } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';

import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bookmark,
  bookmarkOutline,
  heart,
  heartOutline,
  shareOutline,
} from 'ionicons/icons';
import { LikesComponent } from 'src/app/home/pages/likes/likes.component';
import { ToastService } from 'src/app/services/toast.service';
import { ViewPersonsComponent } from '../view-persons/view-persons.component';

@Component({
  selector: 'app-post-likes',
  templateUrl: './post-likes.component.html',
  styleUrls: ['./post-likes.component.scss'],
  standalone: true,
  imports: [IonIcon, IonLabel],
  providers: [ModalController],
})
export class PostLikesComponent implements OnInit {
  private modalController = inject(ModalController);
  private toast = inject(ToastService);
  private router = inject(Router);

  readonly user = input<any>(undefined);
  readonly hit = input<any>(undefined);
  readonly id = input<any>(undefined);
  savedPost = true;
  savedPostObj: any;
  savedLike = true;
  savedLikeObj: any;
  constructor() {
    addIcons({ heartOutline, heart, shareOutline, bookmarkOutline, bookmark });
  }

  ngOnInit(): void {
    return;
    // this.afs.doc(`savedPropertiesList/${this.id + this.user?.uid}`).valueChanges().subscribe(c => {
    //   if (c) {
    //     this.savedPostObj = c;
    //     this.savedPost = true;
    //   }
    // });
    // this.afs.doc(`likesList/${this.id + this.user?.uid}`).valueChanges().subscribe(c => {
    //   if (c) {
    //     this.savedLikeObj = c;
    //     this.savedLike = true;
    //   }
    // });
  }

  async openLikes() {
    const modal = await this.modalController.create({
      component: LikesComponent,
      componentProps: { user: this.user(), hit: this.hit() },
    });

    return await modal.present();
  }

  async openChat() {}

  async viewedPersons() {
    const modal = await this.modalController.create({
      component: ViewPersonsComponent,
    });

    return await modal.present();
  }

  saveBookMark(hit: any) {
    if (!this.user()) {
      this.toast.showError('User Does not Exist., Please Login');
      this.router.navigateByUrl('/auth');
    } else {
      // this.afs.doc(`savedPropertiesList/${this.id + this.user.uid}`)
      //   .set({
      //     hit,
      //     uid: this.user.uid,
      //     createdAt: firebase.firestore.FieldValue.serverTimestamp()
      //   })
      //   .then(success => {
      //     this.toast.showMessage('Added to your Saved Properties');
      //   }).catch(err => this.toast.showError(err.message));
    }
  }

  removeBookMark() {
    // this.afs.doc(`savedPropertiesList/${this.id + this.user.uid}`)
    //   .delete()
    //   .then(success => {
    //     this.toast.showMessage('Removed from your Saved Properties');
    //     this.savedPost = false;
    //   }).catch(err => this.toast.showError(err.message));
  }

  saveLike(hit: any) {
    if (!this.user()) {
      this.toast.showError('User Does not Exist., Please Login');
      this.router.navigateByUrl('/auth');
    } else {
      // this.afs.doc(`likesList/${this.id + this.user.uid}`)
      //   .set({
      //     id: this.id,
      //     uid: this.user.uid,
      //     createdAt: firebase.firestore.FieldValue.serverTimestamp()
      //   })
      //   .then(success => {
      //     // this.toast.showMessage('Added to your Saved Properties');
      //   }).catch(err => this.toast.showError(err.message));
    }
  }

  removeLike() {
    // this.afs.doc(`likesList/${this.id + this.user.uid}`)
    //   .delete()
    //   .then(success => {
    //     this.savedLike = false;
    //   }).catch(err => this.toast.showError(err.message));
  }

  share(event: any) {
    if (navigator.share) {
      navigator
        .share({
          title: 'Realtor One',
          text: 'Search Homes for Sale, Rent',
          url: 'https://dearjob.org/#/',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      this.toast.showError('Your system does not support sharing files.');
    }
  }
}

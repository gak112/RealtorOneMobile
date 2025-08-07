import { Component, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonButtons, IonContent, IonHeader, IonIcon, IonSkeletonText, IonTitle, IonToolbar, ModalController, IonImg } from '@ionic/angular/standalone';
import { Observable } from 'rxjs';
import { BannersviewComponent } from '../bannersview/bannersview.component';
import {  NgFor } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-trendingimages',
  templateUrl: './trendingimages.component.html',
  styleUrls: ['./trendingimages.component.scss'],
  standalone: true,
  imports: [IonImg, IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonContent,NgFor,IonSkeletonText,],
  providers:[ModalController],
})
export class TrendingimagesComponent implements OnInit {

  banners$!: Observable<any>;
  constructor(private modalController: ModalController, /*private afs: AngularFirestore,*/) {
    addIcons({ chevronBackOutline })
  }

  dummyBanners: any = [
    { banner: "https://ucarecdn.com/882d06f0-0cb7-44b0-a4e7-eafb7d811699/" }, { banner: "https://ucarecdn.com/c8577194-63e6-433e-8190-63977c6ef4a3/" }, { banner: "https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/" }
  ]
  ngOnInit(): void {
    return
    // this.banners$ = this.afs.collection('banners').valueChanges({idField: 'id'});
  }


  dismiss() {
    this.modalController.dismiss();
  }
  async bannersview(banner: any) {
    const modal = await this.modalController.create({
      component: BannersviewComponent,
      componentProps: { banner }
    });
    return await modal.present();
  }


}

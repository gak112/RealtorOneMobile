import { Component, Input, OnInit } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonSearchbar, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { ProductfilterComponent } from 'src/app/search/pages/productfilter/productfilter.component';
// import { AuthService } from 'src/app/services/auth.service';
import { BannerProductComponent } from '../../components/banner-product/banner-product.component';
import {  NgFor } from '@angular/common';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-bannersview',
  templateUrl: './bannersview.component.html',
  styleUrls: ['./bannersview.component.scss'],
  standalone: true,
  imports: [IonHeader,IonToolbar,IonButtons,IonIcon,IonTitle,IonButton,IonSearchbar,IonContent,BannerProductComponent,NgFor],
  providers:[ModalController],
})
export class BannersviewComponent implements OnInit {

  @Input() banner: any;
  hit: any;
  // showFilter;

  // config = {
  //   indexName: 'requests',
  //   searchClient,
  // };
  // filterObj;
  user: any;
  constructor(private modalController: ModalController, /*private afs: AngularFirestore,
    private auth: AuthService*/) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return
    // this.auth.user$.subscribe(user => this.user = user);
    // this.afs.doc(`users/${sucess.user.uid}`).valueChanges().subscribe((data: any) => {

    // });
    // this.filterObj = null;  
    // this.banner.properties.forEach((id, index) => {
    //   if(index === 0) {
    //     this.filterObj = `objectID:${id}`;
    //   } else {
    //   this.filterObj += ' OR objectID:' + id;
    //   }
    // })
  }

  async showFilters() {
    const modal = await this.modalController.create({
      component: ProductfilterComponent,
    });

    await modal.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

}

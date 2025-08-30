import { Component, inject, OnInit, signal, input } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  ModalController
} from '@ionic/angular/standalone';
import { ProductfilterComponent } from 'src/app/search/pages/productfilter/productfilter.component';
// import { AuthService } from 'src/app/services/auth.service';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { BannerProductComponent, IProperty } from '../../components/banner-product/banner-product.component';

@Component({
  selector: 'app-bannersview',
  templateUrl: './bannersview.component.html',
  styleUrls: ['./bannersview.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonButton,
    IonSearchbar,
    IonContent,
    BannerProductComponent,
  ],
  providers: [ModalController],
})
export class BannersviewComponent implements OnInit {
  private modalController = inject(ModalController);

  readonly banner = input<any>(undefined);
  hit: any;
  // showFilter;

  // config = {
  //   indexName: 'requests',
  //   searchClient,
  // };
  // filterObj;
  user: any;
  constructor(/*private afs: AngularFirestore,
    private auth: AuthService*/) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return;
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


  properties = signal<IProperty[]>([
    {
      id: '1',
      price: 10000,
      locationCode: 'HYD',
      location: 'Hyderabad, Jubilee Hills',
      propertyType: 'Apartment',
      PlotArea: '3BHK',
      propertySqft: '1000',
      propertyImages: [
        {
          id: '1',
          image: 'https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/',
        },
        {
          id: '2',
          image: 'https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/',
        },
        {
          id: '3',
          image: 'https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/',
        },
      ],
      type: 'Under Construction',
      agentName: 'Ajay Kumar',
      propertyId: 'PROP-1023',
      listingType: 'For Sale',
      propertyStatus: 'Premium Location',
    },
    {
      id: '2',
      price: 15000,
      locationCode: 'HYD',
      location: 'Hyderabad, Banjara Hills',
      propertyType: 'Apartment',
      PlotArea: '4BHK',
      propertySqft: '3000',
      propertyImages: [
        {
          id: '1',
          image:
            'https://i.etsystatic.com/32740471/r/il/7ce17f/3608181963/il_fullxfull.3608181963_3xsy.jpg',
        },
        {
          id: '2',
          image:
            'https://i.etsystatic.com/32740471/r/il/7ce17f/3608181963/il_fullxfull.3608181963_3xsy.jpg',
        },
        {
          id: '3',
          image:
            'https://i.etsystatic.com/32740471/r/il/7ce17f/3608181963/il_fullxfull.3608181963_3xsy.jpg',
        },
      ],
      type: 'Ready to Move',
      agentName: 'Ashok Kumar',
      propertyId: 'PROP-1024',
      listingType: 'For Sale',
      propertyStatus: 'Premium Location',
    },
    {
      id: '3',
      price: 20000,
      locationCode: 'HYD',
      location: 'Hyderabad, Kukatpally',
      propertyType: 'Villa',
      PlotArea: '5BHK',
      propertySqft: '4000',
      propertyImages: [
        {
          id: '1',
          image:
            'https://i.pinimg.com/736x/c2/25/17/c2251742e11b9ba63a43169f08b3da9b.jpg',
        },
        {
          id: '2',
          image:
            'https://i.pinimg.com/736x/c2/25/17/c2251742e11b9ba63a43169f08b3da9b.jpg',
        },
        {
          id: '3',
          image:
            'https://i.pinimg.com/736x/c2/25/17/c2251742e11b9ba63a43169f08b3da9b.jpg',
        },
      ],
      type: 'Ready to Move',
      agentName: 'Rajesh Kumar',
      propertyId: 'PROP-1025',
      listingType: 'For Sale',
      propertyStatus: 'Premium Location',
    },
    {
      id: '4',
      price: 15000,
      locationCode: 'HYD',
      location: 'Hyderabad, Kukatpally',
      propertyType: 'Villa',
      PlotArea: '5BHK',
      propertySqft: '4000',
      propertyImages: [
        {
          id: '1',
          image:
            'https://www.favouritehomes.com/wp-content/uploads/2021/12/luxury-villa.jpg',
        },
        {
          id: '2',
          image:
            'https://www.favouritehomes.com/wp-content/uploads/2021/12/luxury-villa.jpg',
        },
        {
          id: '3',
          image:
            'https://www.favouritehomes.com/wp-content/uploads/2021/12/luxury-villa.jpg',
        },
      ],
      type: 'Ready to Move',
      agentName: 'Abhinav Gunda',
      propertyId: 'PROP-1026',
      listingType: 'For Sale',
      propertyStatus: 'Premium Location',
    },
  ]);
}

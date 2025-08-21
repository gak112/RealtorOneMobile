import { NgIf } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
  IonSearchbar,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ProductBoxComponent } from 'src/app/search/components/product-box/product-box.component';
import {
  IProperty,
  RealestateCardComponent,
} from '../../components/realestate-card/realestate-card.component';
import { ProductfilterComponent } from 'src/app/search/pages/productfilter/productfilter.component';
import {
  backwardEnterAnimation,
  forwardEnterAnimation,
} from 'src/app/services/animation';

@Component({
  selector: 'app-propertieslist',
  templateUrl: './propertieslist.component.html',
  styleUrls: ['./propertieslist.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonSearchbar,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonTitle,
    IonContent,
    NgIf,
    ProductBoxComponent,
    RealestateCardComponent,
  ],
  providers: [ModalController],
})
export class PropertieslistComponent implements OnInit {
  @Input() actionType: any;

  constructor(
    private modalController: ModalController /*private afs: AngularFirestore*/
  ) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return;
  }
  dismiss() {
    this.modalController.dismiss();
  }

  async showFilters() {
    const modal = await this.modalController.create({
      component: ProductfilterComponent,
      enterAnimation: forwardEnterAnimation,
      leaveAnimation: backwardEnterAnimation,
    });

    await modal.present();
  }

  properties = signal<IProperty[]>([
    // {
    //   id: '1',
    //   title: 'Property 1',
    //   price: 10000,
    //   locationCode: 'HYD',
    //   location: 'Hyderabad, Jubilee Hills',
    //   propertyType: 'Apartment',
    //   propertySize: '3BHK',
    //   propertySqft: '1000',
    //   propertyImages: [
    //     {
    //       id: '1',
    //       image: 'https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/',
    //     },
    //     {
    //       id: '2',
    //       image: 'https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/',
    //     },
    //     {
    //       id: '3',
    //       image: 'https://ucarecdn.com/6f53822c-c9eb-477f-865f-77a3d4bd5f37/',
    //     },
    //   ],
    //   category: 'Under Construction',
    //   agentName: 'Ajay Kumar',
    //   propertyId: 'PROP-1023',
    //   saleType: 'For Sale',
    //   propertyStatus: 'Premium Location',
    // },
    // {
    //   id: '2',
    //   title: 'Property 2',
    //   price: 15000,
    //   locationCode: 'HYD',
    //   location: 'Hyderabad, Banjara Hills',
    //   propertyType: 'Apartment',
    //   propertySize: '4BHK',
    //   propertySqft: '3000',
    //   propertyImages: [
    //     {
    //       id: '1',
    //       image:
    //         'https://i.etsystatic.com/32740471/r/il/7ce17f/3608181963/il_fullxfull.3608181963_3xsy.jpg',
    //     },
    //     {
    //       id: '2',
    //       image:
    //         'https://i.etsystatic.com/32740471/r/il/7ce17f/3608181963/il_fullxfull.3608181963_3xsy.jpg',
    //     },
    //     {
    //       id: '3',
    //       image:
    //         'https://i.etsystatic.com/32740471/r/il/7ce17f/3608181963/il_fullxfull.3608181963_3xsy.jpg',
    //     },
    //   ],
    //   category: 'Ready to Move',
    //   agentName: 'Ashok Kumar',
    //   propertyId: 'PROP-1024',
    //   saleType: 'For Sale',
    //   propertyStatus: 'Premium Location',
    // },
    // {
    //   id: '3',
    //   title: 'Property 3',
    //   price: 20000,
    //   locationCode: 'HYD',
    //   location: 'Hyderabad, Kukatpally',
    //   propertyType: 'Villa',
    //   propertySize: '5BHK',
    //   propertySqft: '4000',
    //   propertyImages: [
    //     {
    //       id: '1',
    //       image:
    //         'https://i.pinimg.com/736x/c2/25/17/c2251742e11b9ba63a43169f08b3da9b.jpg',
    //     },
    //     {
    //       id: '2',
    //       image:
    //         'https://i.pinimg.com/736x/c2/25/17/c2251742e11b9ba63a43169f08b3da9b.jpg',
    //     },
    //     {
    //       id: '3',
    //       image:
    //         'https://i.pinimg.com/736x/c2/25/17/c2251742e11b9ba63a43169f08b3da9b.jpg',
    //     },
    //   ],
    //   category: 'Ready to Move',
    //   agentName: 'Rajesh Kumar',
    //   propertyId: 'PROP-1025',
    //   saleType: 'For Sale',
    //   propertyStatus: 'Premium Location',
    // },
    // {
    //   id: '4',
    //   title: 'Property 4',
    //   price: 15000,
    //   location: 'Hyderabad, Kukatpally',
    //   propertyType: 'Villa',
    //   propertySize: '5BHK',
    //   propertySize: '4000',
    //   propertyImages: [
    //     {
    //       id: '1',
    //       image:
    //         'https://www.favouritehomes.com/wp-content/uploads/2021/12/luxury-villa.jpg',
    //     },
    //     {
    //       id: '2',
    //       image:
    //         'https://www.favouritehomes.com/wp-content/uploads/2021/12/luxury-villa.jpg',
    //     },
    //     {
    //       id: '3',
    //       image:
    //         'https://www.favouritehomes.com/wp-content/uploads/2021/12/luxury-villa.jpg',
    //     },
    //   ],
    //   category: 'Ready to Move',
    //   agentName: 'Abhinav Gunda',
    //   propertyId: 'PROP-1026',
    //   saleType: 'For Sale',
    //   propertyStatus: 'Premium Location',
    // },
  ]);
}

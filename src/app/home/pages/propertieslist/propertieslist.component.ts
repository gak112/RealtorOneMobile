import {  NgIf } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';
import { ProductBoxComponent } from 'src/app/search/components/product-box/product-box.component';
import { IProperty, RealestateCardComponent } from "../../components/realestate-card/realestate-card.component";

@Component({
  selector: 'app-propertieslist',
  templateUrl: './propertieslist.component.html',
  styleUrls: ['./propertieslist.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonIcon, IonTitle, IonContent, NgIf, ProductBoxComponent, RealestateCardComponent],
  providers:[ModalController],
})
export class PropertieslistComponent implements OnInit {

  @Input() actionType: any;


  constructor(private modalController: ModalController, /*private afs: AngularFirestore*/) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit(): void {
    return
    // this.afs.collection(`requests`,
    // ref => ref.where('actionType', '==', this.actionType)).valueChanges().subscribe((data: any) => {
    //   this.properties = data;
    // });
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
      propertySize: '3BHK',
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
      propertySize: '4BHK',
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
      propertySize: '5BHK',
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
      propertySize: '5BHK',
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

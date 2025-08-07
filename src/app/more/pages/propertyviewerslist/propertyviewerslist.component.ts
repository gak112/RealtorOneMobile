import { Component, OnInit } from '@angular/core';
import {
  IonAvatar,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-propertyviewerslist',
  templateUrl: './propertyviewerslist.component.html',
  styleUrls: ['./propertyviewerslist.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonContent,
    IonAvatar,
    IonLabel,
    IonImg,
  ],
  providers: [ModalController],
})
export class PropertyviewerslistComponent implements OnInit {
  dismiss() {
    this.modalController.dismiss();
  }

  constructor(private modalController: ModalController) {
    addIcons({ chevronBackOutline });
  }

  ngOnInit() {
    return;
  }

  viewerList(): IViewerList[] {
    return [
      {
        id: 1,
        name: 'Ajay Kumar Gunda',
        phone: '+91 9876543210',
        image:
          'https://cdn3.vectorstock.com/i/1000x1000/56/77/logo-kids-vector-13475677.jpg',
      },
      {
        id: 2,
        name: 'SVN AShok Kumar',
        phone: '+91 9876543210',
        image:
          'https://i.pinimg.com/originals/58/e0/24/58e024e098a7cb1afd885f62a9b7f8a5.jpg',
      },
      {
        id: 3,
        name: 'Abhinav Gunda',
        phone: '+91 9876543210',
        image:
          'https://www.fnp.com/images/pr/l/v20220906115825/cute-plush-sitting-panda-soft-toy-black-white_4.jpg',
      },
      {
        id: 4,
        name: 'Srikanth Batchu',
        phone: '+91 9876543210',
        image:
          'https://i.pinimg.com/originals/cf/ca/f2/cfcaf2237777b73e1276e1863e109234.jpg',
      },
      {
        id: 5,
        name: 'Sneha Nama',
        phone: '+91 9876543210',
        image:
          'https://wallup.net/wp-content/uploads/2015/07/Little-children-on-the-field.jpg',
      },
      {
        id: 6,
        name: 'Dharani Macha',
        phone: '+91 9876543210',
        image:
          'https://th.bing.com/th/id/OIP.nrqA6eTH26zbKzbbfzD_kgHaEK?w=1280&h=720&rs=1&pid=ImgDetMain',
      },
      {
        id: 7,
        name: 'Shiva Uppu',
        phone: '+91 9876543210',
        image:
          'https://cdn3.vectorstock.com/i/1000x1000/56/77/logo-kids-vector-13475677.jpg',
      },
      {
        id: 8,
        name: 'Faias',
        phone: '+91 9876543210',
        image:
          'https://cdn3.vectorstock.com/i/1000x1000/56/77/logo-kids-vector-13475677.jpg',
      },
      {
        id: 9,
        name: 'Harish Chinna',
        phone: '+91 9876543210',
        image:
          'https://cdn3.vectorstock.com/i/1000x1000/56/77/logo-kids-vector-13475677.jpg',
      },
      {
        id: 10,
        name: 'Sai Kumar',
        phone: '+91 9876543210',
        image:
          'https://cdn3.vectorstock.com/i/1000x1000/56/77/logo-kids-vector-13475677.jpg',
      },
      {
        id: 11,
        name: 'Bhavani Sankar',
        phone: '+91 9876543210',
        image:
          'https://cdn3.vectorstock.com/i/1000x1000/56/77/logo-kids-vector-13475677.jpg',
      },
    ];
  }
}

export interface IViewerList {
  id: number;
  name: string;
  phone: string;
  image: string;
}
